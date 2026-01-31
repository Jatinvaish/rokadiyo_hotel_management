import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AccessControlService } from '../../modules/access-control/access-control.service'
import { CurrentUser } from '../decorators/current-user.decorator'
import { UserType } from '../../common/constants/user-types.constant'

export const PERMISSIONS_KEY = 'permissions'
export const PERMISSION_KEY = 'permission'

export const Permissions = (...permissions: string[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSIONS_KEY, permissions, descriptor?.value || target)
  }
}

export const Permission = (permission: string) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata(PERMISSION_KEY, permission, descriptor?.value || target)
  }
}

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new ForbiddenException('User not authenticated')
    }

    // Super admin has access to everything
    if (user.userType === UserType.SUPER_ADMIN) {
      return true
    }

    // Get required permissions from metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || []

    const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    if (requiredPermission) {
      requiredPermissions.push(requiredPermission)
    }

    // If no permissions required, allow access
    if (requiredPermissions.length === 0) {
      return true
    }

    // Get user's effective permissions (intersection of role permissions and subscription)
    const effectivePermissions = await this.accessControlService.getEffectivePermissions(
      user.tenantId,
      user.id
    )

    const userPermissionKeys = effectivePermissions.map(p => p.permission_key)

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every(permission => 
      userPermissionKeys.includes(permission)
    )

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Insufficient permissions. Required: ${requiredPermissions.join(', ')}`)
    }

    return true
  }
}
