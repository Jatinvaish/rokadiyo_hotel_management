import { Controller, Post, Body, Ip } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/core/decorators/public.decorator';
import { Unencrypted } from 'src/core/decorators/unencrypted.decorator';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Public()
  @Unencrypted()
  @Post('register')
  async register(@Body() body: {
    email: string;
    username: string;
    password: string;
    userType?: string;
    firstName?: string;
    lastName?: string;
  }) {
    const user = await this.auth.register(body);
    return { message: 'Registration successful', data: user };
  }

  @Public()
  @Post('login')
  async login(
    @Body() body: { identifier: string; password: string },
    @Ip() ip: string,
  ) {
    const result = await this.auth.login(body.identifier, body.password, ip);
    return { message: 'Login successful', data: result };
  }

  @Post('logout')
  async logout() {
    return { message: 'Logout successful' };
  }

  @Post('me')
  async me(@Body() body: any) {
    // Get current user from request.user (added by JWT strategy)
    return { message: 'User profile', data: body.user };
  }
}