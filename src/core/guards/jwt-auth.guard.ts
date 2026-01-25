// ============================================
// jwt-auth.guard.ts
// ============================================
import { ExecutionContext, Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  private logger = new Logger(JwtAuthGuard.name);

  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log(`========== JWT AUTH GUARD CHECK ==========`);
    this.logger.log(`Is Public Route: ${isPublic}`);

    if (isPublic) {
      this.logger.log('Public route - skipping JWT validation');
      return true;
    }

    this.logger.log('Protected route - validating JWT...');
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any, context?: ExecutionContext) {
    this.logger.log(`========== JWT AUTH HANDLE REQUEST ==========`);
    this.logger.log(`Error: ${JSON.stringify(err)}`);
    this.logger.log(`User: ${JSON.stringify(user)}`);
    this.logger.log(`Info: ${JSON.stringify(info)}`);

    if (err) {
      this.logger.error(`JWT Error: ${err.message}`);
      throw err;
    }

    if (!user) {
      this.logger.error('No user in JWT auth guard');
      throw new UnauthorizedException('Invalid token');
    }

    this.logger.log(`User authenticated: ${JSON.stringify(user)}`);
    return user;
  }
}