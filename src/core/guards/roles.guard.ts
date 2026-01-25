import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/decorators/roles.decorator';
import { UserType } from 'src/common/constants/user-types.constant';

@Injectable()
export class RolesGuard implements CanActivate {
  private logger = new Logger(RolesGuard.name);

  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    this.logger.log(`========== ROLES GUARD CHECK ==========`);
    this.logger.log(`Required Roles: ${JSON.stringify(requiredRoles)}`);

    if (!requiredRoles) {
      this.logger.log('No role requirement - allowing access');
      return true; // No role requirement
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    this.logger.log(`User Info: ${JSON.stringify(user)}`);
    this.logger.log(`User Type: ${user?.userType}`);

    if (!user) {
      this.logger.error('User not authenticated');
      throw new ForbiddenException('User not authenticated');
    }

    const hasRole = requiredRoles.some((role) => user.userType === role);

    this.logger.log(`Has Required Role: ${hasRole}`);
    this.logger.log(`Checking if ${user.userType} is in ${requiredRoles}`);

    if (!hasRole) {
      this.logger.error(`Insufficient permissions - user type ${user.userType} not in required roles`);
      throw new ForbiddenException('Insufficient permissions');
    }

    this.logger.log('Authorization passed');
    return true;
  }
}