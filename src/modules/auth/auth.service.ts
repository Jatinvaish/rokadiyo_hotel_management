import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SqlServerService } from 'src/core/database/sql-server.service';
import { EncryptionService } from 'src/core/encryption/encryption.service';
import { LoggingService } from 'src/core/database/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private sql: SqlServerService,
    private jwt: JwtService,
    private encryption: EncryptionService,
    private logging: LoggingService,
  ) {}

  async register(data: { 
    email: string; 
    username: string; 
    password: string; 
    userType?: string;
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
      user_type: data.userType || 'user',
      first_name: data.firstName,
      last_name: data.lastName,
    });

    await this.logging.logActivity({
      userId: result[0].id,
      activityType: 'auth',
      action: 'register',
      description: 'User registered',
    });

    return { id: result[0].id, email: data.email };
  }

  async login(identifier: string, password: string, ipAddress?: string) {
    const user = await this.sql.query(
      `SELECT * FROM users 
       WHERE (email = @identifier OR username = @identifier) 
       AND status = 'active'`,
      { identifier }
    );

    if (!user || user.length === 0) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await this.encryption.comparePassword(password, user[0].password_hash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Create encrypted JWT payload
    const payload = this.encryption.encrypt(
      JSON.stringify({
        sub: user[0].id,
        email: user[0].email,
        userType: user[0].user_type,
        tenantId: user[0].tenant_id,
      })
    );

    const accessToken = this.jwt.sign({ data: payload });

    await this.logging.logActivity({
      tenantId: user[0].tenant_id,
      userId: user[0].id,
      activityType: 'auth',
      action: 'login',
      description: 'User logged in',
      metadata: { ipAddress },
    });

    return {
      accessToken,
      user: {
        id: user[0].id,
        email: user[0].email,
        username: user[0].username,
        userType: user[0].user_type,
      },
    };
  }
}