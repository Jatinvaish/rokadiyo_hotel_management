import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { EncryptionService } from 'src/core/encryption/encryption.service';
import { LoggingService } from 'src/core/database/logging.service';
import { UserType } from 'src/common/constants/user-types.constant';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    private sql: SqlServerService,
    private jwt: JwtService,
    private encryption: EncryptionService,
    private logging: LoggingService,
  ) { }

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

    // Fetch default firm and branch
    const defaultContext = await this.sql.query(
      `SELECT TOP 1 f.id as firm_id, b.id as branch_id 
       FROM firms f
       LEFT JOIN branches b ON b.firm_id = f.id AND b.is_active = 1
       WHERE f.tenant_id = @tenantId AND f.is_active = 1
       ORDER BY f.created_at ASC, b.created_at ASC`,
      { tenantId: userData.tenant_id }
    );

    const firmId = defaultContext[0]?.firm_id;
    const branchId = defaultContext[0]?.branch_id;

    // Create encrypted JWT payload
    const payload = this.encryption.encrypt(
      JSON.stringify({
        sub: userData.id,
        email: userData.email,
        username: userData.username,
        userType: userData.user_type,
        tenantId: userData.tenant_id,
        firmId,
        branchId,
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
        firmId,
        branchId,
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
    const logger = new (require('@nestjs/common')).Logger('AuthService');
    logger.log('========== CREATE TENANT WITH USER START ==========');
    logger.log(`Current User: ${JSON.stringify(currentUser)}`);
    logger.log(`Data: ${JSON.stringify(data)}`);

    // Check super admin permission
    logger.log(`Checking if user type is SUPER_ADMIN...`);
    logger.log(`User Type: ${currentUser.userType}, Expected: ${UserType.SUPER_ADMIN}`);

    if (currentUser.userType !== UserType.SUPER_ADMIN) {
      logger.error(`❌ User is not SUPER_ADMIN. User type: ${currentUser.userType}`);
      throw new ForbiddenException('Only super admin can create tenants');
    }

    logger.log('✅ User is SUPER_ADMIN');

    // Check if email/username exists
    logger.log('Checking if email/username already exists...');
    const existing = await this.sql.query(
      'SELECT id FROM users WHERE email = @email OR username = @username',
      { email: data.email, username: data.username }
    );

    logger.log(`Existing user query result: ${JSON.stringify(existing)}`);

    if (existing.length > 0) {
      logger.error(`Email or username already exists`);
      throw new BadRequestException('Email or username already exists');
    }

    // Get basic plan ID
    logger.log('Getting basic subscription plan...');
    const basicPlan = await this.sql.query(
      "SELECT id FROM subscription_plans WHERE plan_slug = 'basic' AND is_active = 1"
    );

    logger.log(`Basic plan query result: ${JSON.stringify(basicPlan)}`);

    if (!basicPlan || basicPlan.length === 0) {
      logger.error('❌ Basic plan not found in database');
      throw new BadRequestException('Basic plan not found');
    }

    const basicPlanId = basicPlan[0].id;
    logger.log(`✅ Basic plan found with ID: ${basicPlanId}`);

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

      // 5. Create Default Firm
      const firmCode = `FRM-${Date.now()}`;
      const firmRequest = transaction.request();

      firmRequest.input('tenant_id', tenantId);
      firmRequest.input('firm_code', firmCode);
      firmRequest.input('firm_name', data.companyName);
      firmRequest.input('created_by', currentUser.id);

      const firmResult = await firmRequest.query(`
        INSERT INTO firms (
          tenant_id, firm_code, firm_name, is_active, created_at, created_by
        )
        OUTPUT INSERTED.id
        VALUES (
          @tenant_id, @firm_code, @firm_name, 1, GETUTCDATE(), @created_by
        )
      `);

      const firmId = firmResult.recordset[0].id;

      // 6. Create Default Branch
      const branchCode = `BRN-${Date.now()}`;
      const branchRequest = transaction.request();

      branchRequest.input('firm_id', firmId);
      branchRequest.input('branch_code', branchCode);
      branchRequest.input('branch_name', `${data.companyName} - Main`);
      branchRequest.input('address', data.phone ? `Main Branch` : null);
      branchRequest.input('city', '');
      branchRequest.input('state', '');
      branchRequest.input('created_by', currentUser.id);

      await branchRequest.query(`
        INSERT INTO branches (
          firm_id, branch_code, branch_name, address, city, state, is_active, created_at, created_by
        )
        VALUES (
          @firm_id, @branch_code, @branch_name, @address, @city, @state, 1, GETUTCDATE(), @created_by
        )
      `);

      // Log activity
      await this.logging.logActivity({
        tenantId,
        userId: currentUser.id,
        activityType: 'tenant',
        action: 'create',
        description: `Created tenant: ${data.companyName}`,
        metadata: { tenantId, userId, firmId },
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
        firm: {
          id: firmId,
          firmCode,
          firmName: data.companyName,
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

  async forgotPassword(email: string) {
    const user = await this.sql.query(
      'SELECT id, email, username FROM users WHERE email = @email AND status = @status',
      { email, status: 'active' }
    );

    if (!user || user.length === 0) {
      // Don't reveal if email exists (security best practice)
      return { message: 'If email exists, reset link sent' };
    }

    const userData = user[0];
    const resetToken = this.encryption.generateToken(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry
    await this.sql.execute('sp_CreatePasswordReset', {
      user_id: userData.id,
      reset_token: resetToken,
      expires_at: expiresAt,
    });

    // Send email
    await this.sendResetEmail(email, resetToken);

    await this.logging.logActivity({
      userId: userData.id,
      activityType: 'auth',
      action: 'forgot_password',
      description: 'Password reset requested',
    });

    return { message: 'If email exists, reset link sent' };
  }

  async resetPassword(token: string, newPassword: string) {
    const reset = await this.sql.query(
      `SELECT pr.*, u.email 
     FROM password_resets pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.reset_token = @token 
     AND pr.used = 0
     AND pr.expires_at > GETUTCDATE()`,
      { token }
    );

    if (!reset || reset.length === 0) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const resetData = reset[0];
    const passwordHash = await this.encryption.hashPassword(newPassword);
    await this.sql.transaction(async (transaction) => {
      // Update password
      const updateRequest = transaction.request();
      updateRequest.input('user_id', resetData.user_id);
      updateRequest.input('password_hash', passwordHash);

      await updateRequest.query(`
      UPDATE users 
      SET password_hash = @password_hash, updated_at = GETUTCDATE()
      WHERE id = @user_id
    `);

      // Mark token as used
      const markRequest = transaction.request();
      markRequest.input('token', token);

      await markRequest.query(`
      UPDATE password_resets 
      SET used = 1, used_at = GETUTCDATE()
      WHERE reset_token = @token
    `);
    });

    await this.logging.logActivity({
      userId: resetData.user_id,
      activityType: 'auth',
      action: 'reset_password',
      description: 'Password reset successful',
    });

    return { message: 'Password reset successful' };
  }

  private async sendResetEmail(email: string, token: string) {
    const config = this.sql['config'] as ConfigService; // Access via injection

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Reset Your Password - Rokadio',
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Reset Your Password</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetUrl}" 
           style="display: inline-block; padding: 12px 24px; background: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Reset Password
        </a>
        <p>Or copy this link: <br/><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #666; font-size: 12px;">If you didn't request this, ignore this email.</p>
      </div>
    `,
    });
  }

  // ==================== TENANT MANAGEMENT (SUPER ADMIN ONLY) ====================

  async getTenantsList(
    page: number = 1,
    limit: number = 10,
    search?: string,
    is_active?: boolean
  ) {
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    const params: any = {};

    if (search) {
      whereClause += " AND (t.company_name LIKE @search OR t.primary_email LIKE @search)";
      params.search = `%${search}%`;
    }

    if (is_active !== undefined) {
      whereClause += " AND t.is_active = @is_active";
      params.is_active = is_active ? 1 : 0;
    }

    const tenants = await this.sql.query(`
    WITH RankedTenants AS (
      SELECT 
        t.id,
        t.tenant_code,
        t.company_name,
        t.primary_email,
        t.primary_phone,
        t.is_active,
        t.created_at,
        t.updated_at,
        t.subscription_plan_id,
        t.subscription_status,
        ROW_NUMBER() OVER (ORDER BY t.created_at DESC) as RowNum
      FROM tenants t
      WHERE ${whereClause}
    )
    SELECT 
      t.id,
      t.tenant_code,
      t.company_name as name,
      t.primary_email as email,
      t.primary_phone as phone,
      t.is_active,
      t.created_at,
      t.updated_at,
      sp.plan_name as [plan],
      t.subscription_status
    FROM RankedTenants t
    LEFT JOIN subscription_plans sp ON t.subscription_plan_id = sp.id
    WHERE RowNum > ${offset} AND RowNum <= ${offset + limit}
    ORDER BY RowNum
  `, params);

    const countResult = await this.sql.query(`
    SELECT COUNT(*) as total FROM tenants t WHERE ${whereClause}
  `, params);

    return {
      data: tenants || [],
      total: countResult[0]?.total || 0,
      page,
      limit,
    };
  }

  async getTenantById(id: number) {
    const result = await this.sql.query(`
      SELECT 
        t.id,
        t.tenant_code,
        t.company_name as name,
        t.primary_email as email,
        t.primary_phone as phone,
        t.is_active,
        t.created_at,
        t.updated_at,
        sp.plan_name as plan,
        t.subscription_status,
        u.email as admin_email,
        u.username as admin_name
      FROM tenants t
      LEFT JOIN subscription_plans sp ON t.subscription_plan_id = sp.id
      LEFT JOIN users u ON t.id = u.tenant_id AND u.user_type = 'tenant_admin'
      WHERE t.id = @id
    `, { id });

    if (!result || result.length === 0) {
      throw new NotFoundException('Tenant not found');
    }

    return result[0];
  }

  async updateTenant(id: number, data: Partial<any>) {
    const existing = await this.getTenantById(id);
    if (!existing) {
      throw new NotFoundException('Tenant not found');
    }

    const updateFields: string[] = [];
    const params: any = { id };

    if (data.name) {
      updateFields.push('company_name = @name');
      params.name = data.name;
    }
    if (data.email) {
      updateFields.push('primary_email = @email');
      params.email = data.email;
    }
    if (data.phone) {
      updateFields.push('primary_phone = @phone');
      params.phone = data.phone;
    }

    if (updateFields.length === 0) {
      return existing;
    }

    updateFields.push('updated_at = GETUTCDATE()');

    await this.sql.query(`
      UPDATE tenants
      SET ${updateFields.join(', ')}
      WHERE id = @id
    `, params);

    return this.getTenantById(id);
  }

  async activateTenant(id: number) {
    const tenant = await this.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.sql.query(`
      UPDATE tenants
      SET is_active = 1, updated_at = GETUTCDATE()
      WHERE id = @id
    `, { id });

    return this.getTenantById(id);
  }

  async deactivateTenant(id: number) {
    const tenant = await this.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    await this.sql.query(`
      UPDATE tenants
      SET is_active = 0, updated_at = GETUTCDATE()
      WHERE id = @id
    `, { id });

    return this.getTenantById(id);
  }

  async deleteTenant(id: number) {
    const tenant = await this.getTenantById(id);
    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Soft delete: mark as inactive and move related data
    await this.sql.query(`
      UPDATE tenants
      SET is_active = 0, updated_at = GETUTCDATE()
      WHERE id = @id
    `, { id });

    return { message: 'Tenant deleted successfully' };
  }

}
