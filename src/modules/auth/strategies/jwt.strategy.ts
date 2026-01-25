import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { EncryptionService } from 'src/core/encryption/encryption.service';
import { UserType } from 'src/common/constants/user-types.constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private config: ConfigService,
    private sql: SqlServerService,
    private encryption: EncryptionService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('jwt.secret'),
      issuer: config.get('jwt.issuer'),
      audience: config.get('jwt.audience'),
    });
  }

  async validate(payload: any) {
    this.logger.log('========== JWT VALIDATION START ==========');
    this.logger.log(`Payload: ${JSON.stringify(payload)}`);

    try {
      // Decrypt JWT payload
      this.logger.log('Decrypting JWT payload...');
      const decrypted = JSON.parse(this.encryption.decrypt(payload.data));
      this.logger.log(`Decrypted payload: ${JSON.stringify(decrypted)}`);

      this.logger.log(`Querying user with ID: ${decrypted.sub}`);
      const user = await this.sql.query(
        `SELECT 
          u.id, u.email, u.username, u.user_type, u.tenant_id, u.status,
          u.first_name, u.last_name, u.onboarding_completed_at,
          (SELECT STRING_AGG(r.name, ',') FROM user_roles ur 
           JOIN roles r ON ur.role_id = r.id 
           WHERE ur.user_id = u.id AND ur.is_active = 1) as roles,
          (SELECT STRING_AGG(p.permission_key, ',') 
           FROM user_roles ur 
           JOIN role_permissions rp ON ur.role_id = rp.role_id
           JOIN permissions p ON rp.permission_id = p.id
           WHERE ur.user_id = u.id AND ur.is_active = 1) as permissions
         FROM users u
         WHERE u.id = @userId AND u.status = 'active'`,
        { userId: decrypted.sub }
      );

      this.logger.log(`User query result: ${JSON.stringify(user)}`);

      if (!user || user.length === 0) {
        this.logger.error('User not found in database');
        throw new UnauthorizedException('User not found');
      }

      const userData = user[0];
      this.logger.log(`User type: ${userData.user_type}`);

      const returnUser = {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        userType: userData.user_type,
        tenantId: userData.tenant_id,
        firmId: decrypted.firmId,
        branchId: decrypted.branchId,
        firstName: userData.first_name,
        lastName: userData.last_name,
        onboardingCompleted: userData.user_type === UserType.SUPER_ADMIN ? true : !!userData.onboarding_completed_at,
        roles: userData.roles?.split(',').filter(Boolean) || [],
        permissions: userData.permissions?.split(',').filter(Boolean) || [],
      };

      this.logger.log(`JWT validation successful - returning user: ${JSON.stringify(returnUser)}`);
      return returnUser;
    } catch (error) {
      this.logger.error(`JWT validation failed: ${error.message}`, error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }
}