import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { EncryptionService } from 'src/core/encryption/encryption.service';

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
    try {
      // Decrypt JWT payload
      const decrypted = JSON.parse(this.encryption.decrypt(payload.data));

      const user = await this.sql.query(
        `SELECT 
          u.id, u.email, u.username, u.user_type, u.tenant_id, u.status,
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

      if (!user || user.length === 0) {
        throw new UnauthorizedException('User not found');
      }

      const userData = user[0];

      return {
        id: userData.id,
        email: userData.email,
        username: userData.username,
        userType: userData.user_type,
        tenantId: userData.tenant_id,
        roles: userData.roles?.split(',').filter(Boolean) || [],
        permissions: userData.permissions?.split(',').filter(Boolean) || [],
      };
    } catch (error) {
      this.logger.error('JWT validation failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}