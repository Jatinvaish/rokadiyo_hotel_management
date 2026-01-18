import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { EncryptionService } from 'src/core/encryption/encryption.service';
import { LoggingService } from 'src/core/database/logging.service';
import { UserType } from 'src/common/constants/user-types.constant';

@Injectable()
export class AuthService {
  constructor(
    private sql: SqlServerService,
    private jwt: JwtService,
    private encryption: EncryptionService,
    private logging: LoggingService,
  ) {}

  // ==================== REGISTER ====================
  async register(data: { 
    email: string; 
    username: string; 
    password: string; 
    firstName?: string;
    lastName?: string;
  }) {
    const existing = await this.sql.query(
      'SELECT id FROM users WHERE email = @email OR username = @username',
      { email: data.email, username: data.username }
    );

    if (existing.length > 0) {
      throw new BadRequestException('Email or username already exists');
    }

    const passwordHash = await this.encryption.hashPassword(data.password);

    const result = await this.sql.execute('sp_CreateUser', {
      email: data.email,
      username: data.username,
      password_hash: passwordHash,
      user_type: UserType.TENANT_USER,
      first_name: data.firstName,
      last_name: data.lastName,
    });

    await this.logging.logActivity({
      userId: result[0].id,
      activityType: 'auth',
      action: 'register',
      description: 'User registered',
    });

    return { id: result[0].id, email: data.email, username: data.username };
  }

  // ==================== LOGIN ====================
  async login(identifier: string, password: string) {
    const user = await this.sql.query(
      `SELECT u.*, 
        (SELECT STRING_AGG(r.name, ',') FROM user_roles ur 
         JOIN roles r ON ur.role_id = r.id 
         WHERE ur.user_id = u.id AND ur.is_active = 1) as roles
       FROM users u
       WHERE (u.email = @identifier OR u.username = @identifier) 
       AND u.status = 'active'`,
      { identifier }
    );

    if (!user || user.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.encryption.comparePassword(password, user[0].password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userData = user[0];

    // Create encrypted JWT payload
    const payload = this.encryption.encrypt(
      JSON.stringify({
        sub: userData.id,
        email: userData.email,
        username: userData.username,
        userType: userData.user_type,
        tenantId: userData.tenant_id,
        onboardingCompleted: userData.user_type === UserType.SUPER_ADMIN ? true : !!userData.onboarding_completed_at,
        roles: userData.roles?.split(',').filter(Boolean) || [],
      })
    );

    const accessToken = this.jwt.sign({ data: payload });

    await this.sql.query(
      `UPDATE users SET last_login_at = GETUTCDATE(), login_count = login_count + 1 WHERE id = @userId`,
      { userId: userData.id }
    );

    await this.logging.logActivity({
      tenantId: userData.tenant_id,
      userId: userData.id,
      activityType: 'auth',
      action: 'login',
      description: 'User logged in',
    });

    return {
      accessToken,
      user: {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        userType: userData.user_type,
        tenantId: userData.tenant_id,
        firstName: userData.first_name,
        lastName: userData.last_name,
        onboardingCompleted: userData.user_type === UserType.SUPER_ADMIN ? true : !!userData.onboarding_completed_at,
      },
    };
  }

  // ==================== CREATE TENANT (SUPER ADMIN ONLY) ====================
  async createTenantWithUser(currentUser: any, data: {
    companyName: string;
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) {
    // Check super admin permission
    if (currentUser.userType !== UserType.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can create tenants');
    }

    // Check if email/username exists
    const existing = await this.sql.query(
      'SELECT id FROM users WHERE email = @email OR username = @username',
      { email: data.email, username: data.username }
    );

    if (existing.length > 0) {
      throw new BadRequestException('Email or username already exists');
    }

    // Get basic plan ID
    const basicPlan = await this.sql.query(
      "SELECT id FROM subscription_plans WHERE plan_slug = 'basic' AND is_active = 1"
    );

    if (!basicPlan || basicPlan.length === 0) {
      throw new BadRequestException('Basic plan not found');
    }

    const basicPlanId = basicPlan[0].id;

    // Transaction: Create Tenant + User
    return this.sql.transaction(async (transaction) => {
      // 1. Create Tenant
      const tenantCode = `TNT-${Date.now()}`;
      const tenantRequest = transaction.request();
      
      tenantRequest.input('tenant_code', tenantCode);
      tenantRequest.input('company_name', data.companyName);
      tenantRequest.input('primary_email', data.email);
      tenantRequest.input('primary_phone', data.phone || '0000000000');
      tenantRequest.input('subscription_plan_id', basicPlanId);
      tenantRequest.input('subscription_status', 'active');
      tenantRequest.input('subscription_start', new Date());
      tenantRequest.input('created_by', currentUser.id);

      const tenantResult = await tenantRequest.query(`
        INSERT INTO tenants (
          tenant_code, company_name, primary_email, primary_phone,
          subscription_plan_id, subscription_status, subscription_start,
          is_active, created_at, created_by
        )
        OUTPUT INSERTED.id
        VALUES (
          @tenant_code, @company_name, @primary_email, @primary_phone,
          @subscription_plan_id, @subscription_status, @subscription_start,
          1, GETUTCDATE(), @created_by
        )
      `);

      const tenantId = tenantResult.recordset[0].id;

      // 2. Get tenant_administration role
      const roleRequest = transaction.request();
      const roleResult = await roleRequest.query(
        "SELECT id FROM roles WHERE name = 'tenant_administration'"
      );

      if (!roleResult.recordset || roleResult.recordset.length === 0) {
        throw new BadRequestException('Tenant administration role not found');
      }

      const tenantAdminRoleId = roleResult.recordset[0].id;

      // 3. Create User
      const passwordHash = await this.encryption.hashPassword(data.password);
      const userRequest = transaction.request();

      userRequest.input('tenant_id', tenantId);
      userRequest.input('email', data.email);
      userRequest.input('username', data.username);
      userRequest.input('password_hash', passwordHash);
      userRequest.input('user_type', UserType.TENANT_ADMIN);
      userRequest.input('first_name', data.firstName || '');
      userRequest.input('last_name', data.lastName || '');
      userRequest.input('created_by', currentUser.id);

      const userResult = await userRequest.query(`
        INSERT INTO users (
          tenant_id, email, username, password_hash, user_type,
          first_name, last_name, status, onboarding_completed_at,
          created_at, created_by
        )
        OUTPUT INSERTED.id
        VALUES (
          @tenant_id, @email, @username, @password_hash, @user_type,
          @first_name, @last_name, 'active', GETUTCDATE(),
          GETUTCDATE(), @created_by
        )
      `);

      const userId = userResult.recordset[0].id;

      // 4. Assign tenant_administration role
      const roleAssignRequest = transaction.request();
      roleAssignRequest.input('user_id', userId);
      roleAssignRequest.input('role_id', tenantAdminRoleId);
      roleAssignRequest.input('created_by', currentUser.id);

      await roleAssignRequest.query(`
        INSERT INTO user_roles (user_id, role_id, is_active, created_at, created_by)
        VALUES (@user_id, @role_id, 1, GETUTCDATE(), @created_by)
      `);

      // Log activity
      await this.logging.logActivity({
        tenantId,
        userId: currentUser.id,
        activityType: 'tenant',
        action: 'create',
        description: `Created tenant: ${data.companyName}`,
        metadata: { tenantId, userId },
      });

      return {
        tenant: {
          id: tenantId,
          tenantCode,
          companyName: data.companyName,
          subscriptionPlanId: basicPlanId,
        },
        user: {
          id: userId,
          email: data.email,
          username: data.username,
          userType: UserType.TENANT_ADMIN,
        },
      };
    });
  }

  // ==================== SEND INVITATION ====================
  async sendInvitation(currentUser: any, data: {
    email: string;
    roleId: number;
    inviteeType: string;
    expiryDays?: number;
  }) {
    // Check permission
    if (currentUser.userType !== UserType.SUPER_ADMIN && 
        currentUser.userType !== UserType.TENANT_ADMIN) {
      throw new ForbiddenException('Only admins can send invitations');
    }

    // Check if user already exists
    const existing = await this.sql.query(
      'SELECT id FROM users WHERE email = @email',
      { email: data.email }
    );

    if (existing.length > 0) {
      throw new BadRequestException('User already exists');
    }

    const tenantId = currentUser.tenantId;
    if (!tenantId && currentUser.userType !== UserType.SUPER_ADMIN) {
      throw new BadRequestException('Tenant context required');
    }

    const invitationToken = this.encryption.generateToken(32);
    const expiryDays = data.expiryDays || 7;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    const result = await this.sql.execute('sp_CreateInvitation', {
      tenant_id: tenantId,
      invited_by: currentUser.id,
      invitee_email: data.email,
      invitee_type: data.inviteeType,
      role_id: data.roleId,
      invitation_token: invitationToken,
      expires_at: expiresAt,
    });

    await this.logging.logActivity({
      tenantId,
      userId: currentUser.id,
      activityType: 'invitation',
      action: 'send',
      description: `Sent invitation to ${data.email}`,
    });

    return {
      invitationId: result[0].id,
      email: data.email,
      token: invitationToken,
      expiresAt,
    };
  }

  // ==================== ACCEPT INVITATION ====================
  async acceptInvitation(token: string, data: {
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    // Get invitation
    const invitation = await this.sql.query(
      `SELECT * FROM invitations 
       WHERE invitation_token = @token 
       AND status = 'pending' 
       AND expires_at > GETUTCDATE()`,
      { token }
    );

    if (!invitation || invitation.length === 0) {
      throw new NotFoundException('Invalid or expired invitation');
    }

    const inv = invitation[0];

    // Check if username exists
    const existingUser = await this.sql.query(
      'SELECT id FROM users WHERE username = @username',
      { username: data.username }
    );

    if (existingUser.length > 0) {
      throw new BadRequestException('Username already exists');
    }

    const passwordHash = await this.encryption.hashPassword(data.password);

    // Create user and update invitation in transaction
    return this.sql.transaction(async (transaction) => {
      // Create user
      const userRequest = transaction.request();
      userRequest.input('tenant_id', inv.tenant_id);
      userRequest.input('email', inv.invitee_email);
      userRequest.input('username', data.username);
      userRequest.input('password_hash', passwordHash);
      userRequest.input('user_type', inv.invitee_type);
      userRequest.input('first_name', data.firstName || '');
      userRequest.input('last_name', data.lastName || '');

      const userResult = await userRequest.query(`
        INSERT INTO users (
          tenant_id, email, username, password_hash, user_type,
          first_name, last_name, status, created_at
        )
        OUTPUT INSERTED.id
        VALUES (
          @tenant_id, @email, @username, @password_hash, @user_type,
          @first_name, @last_name, 'active', GETUTCDATE()
        )
      `);

      const userId = userResult.recordset[0].id;

      // Assign role
      if (inv.role_id) {
        const roleRequest = transaction.request();
        roleRequest.input('user_id', userId);
        roleRequest.input('role_id', inv.role_id);

        await roleRequest.query(`
          INSERT INTO user_roles (user_id, role_id, is_active, created_at)
          VALUES (@user_id, @role_id, 1, GETUTCDATE())
        `);
      }

      // Update invitation
      const invRequest = transaction.request();
      invRequest.input('invitation_id', inv.id);
      invRequest.input('user_id', userId);

      await invRequest.query(`
        UPDATE invitations 
        SET status = 'accepted', accepted_at = GETUTCDATE(), updated_at = GETUTCDATE()
        WHERE id = @invitation_id
      `);

      await this.logging.logActivity({
        tenantId: inv.tenant_id,
        userId,
        activityType: 'invitation',
        action: 'accept',
        description: 'Invitation accepted',
      });

      return {
        userId,
        email: inv.invitee_email,
        username: data.username,
      };
    });
  }

  // ==================== REJECT INVITATION ====================
  async rejectInvitation(token: string, reason?: string) {
    const invitation = await this.sql.query(
      `SELECT * FROM invitations 
       WHERE invitation_token = @token 
       AND status = 'pending'`,
      { token }
    );

    if (!invitation || invitation.length === 0) {
      throw new NotFoundException('Invalid invitation');
    }

    await this.sql.query(
      `UPDATE invitations 
       SET status = 'declined', 
           declined_at = GETUTCDATE(), 
           decline_reason = @reason,
           updated_at = GETUTCDATE()
       WHERE invitation_token = @token`,
      { token, reason: reason || 'User declined' }
    );

    return { message: 'Invitation rejected' };
  }
}