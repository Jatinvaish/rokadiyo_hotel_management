import { Controller, Post, Body, Param, ForbiddenException } from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import {
  CreateRoleDto,
  UpdateRoleDto,
  DeleteRoleDto,
  CloneRoleDto,
  CreatePermissionDto,
  UpdatePermissionDto,
  DeletePermissionDto,
  AssignRolePermissionsDto,
  AssignUserRolesDto,
  CreateMenuPermissionDto,
  UpdateMenuPermissionDto,
  DeleteMenuPermissionDto,
  GetRolesDto,
  GetPermissionsDto,
  GetRolePermissionsDto,
  GetMenuPermissionsDto
} from './access-control.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { UserType } from 'src/common/constants/user-types.constant';

@Controller('access-control')
export class AccessControlController {
  constructor(private readonly service: AccessControlService) { }

  private checkSuperAdmin(user: any) {
    if (user.userType !== UserType.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can manage global access control');
    }
  }

  @Post('roles/create')
  createRole(@CurrentUser() user: any, @Body() dto: CreateRoleDto) {
    // If tenant_id is provided, check if it's super admin or if it matches user's tenant
    if (dto.tenant_id && user.userType !== UserType.SUPER_ADMIN && user.tenantId !== dto.tenant_id) {
      throw new ForbiddenException();
    }
    return this.service.createRole(dto, user.id);
  }

  @Post('roles/list')
  getRoles(@CurrentUser() user: any, @Body() dto: GetRolesDto) {
    return this.service.getRoles(user.userType === UserType.SUPER_ADMIN ? undefined : user.tenantId, dto);
  }

  @Post('roles/update')
  updateRole(@CurrentUser() user: any, @Body() dto: UpdateRoleDto) {
    // Tenants can only update their own roles
    if (user.userType !== UserType.SUPER_ADMIN) {
      return this.service.updateRole(dto, user.id, user.tenantId);
    }
    return this.service.updateRole(dto, user.id);
  }

  @Post('roles/delete')
  deleteRole(@CurrentUser() user: any, @Body() dto: DeleteRoleDto) {
    // Tenants can only delete their own roles
    if (user.userType !== UserType.SUPER_ADMIN) {
      return this.service.deleteRole(dto, user.id, user.tenantId);
    }
    return this.service.deleteRole(dto, user.id);
  }

  @Post('roles/clone')
  cloneRole(@CurrentUser() user: any, @Body() dto: CloneRoleDto) {
    // Tenants can only clone their own roles
    if (user.userType !== UserType.SUPER_ADMIN) {
      return this.service.cloneRole(dto, user.id, user.tenantId);
    }
    return this.service.cloneRole(dto, user.id);
  }

  @Post('permissions/create')
  createPermission(@CurrentUser() user: any, @Body() dto: CreatePermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.createPermission(dto, user.id);
  }

  @Post('permissions/list')
  getPermissions(@CurrentUser() user: any, @Body() dto: GetPermissionsDto) {
    return this.service.getPermissions(user.userType === UserType.SUPER_ADMIN ? undefined : user.tenantId, dto);
  }

  @Post('permissions/update')
  updatePermission(@CurrentUser() user: any, @Body() dto: UpdatePermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.updatePermission(dto, user.id);
  }

  @Post('permissions/delete')
  deletePermission(@CurrentUser() user: any, @Body() dto: DeletePermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.deletePermission(dto, user.id);
  }

  @Post('role-permissions/assign')
  assignRolePermissions(@CurrentUser() user: any, @Body() dto: AssignRolePermissionsDto) {
    // Check if user can manage this role
    if (user.userType !== UserType.SUPER_ADMIN) {
      return this.service.assignRolePermissions(dto, user.id, user.tenantId);
    }
    return this.service.assignRolePermissions(dto, user.id);
  }

  @Post('role-permissions/list')
  getRolePermissions(@CurrentUser() user: any, @Body() dto: GetRolePermissionsDto) {
    return this.service.getRolePermissions(dto.role_id, user.userType === UserType.SUPER_ADMIN ? undefined : user.tenantId);
  }

  @Post('user-roles')
  assignUserRoles(@CurrentUser() user: any, @Body() dto: AssignUserRolesDto) {
    // Basic check: must be admin
    if (user.userType !== UserType.SUPER_ADMIN && user.userType !== UserType.TENANT_ADMIN) {
      throw new ForbiddenException();
    }
    return this.service.assignUserRoles(dto, user.id);
  }

  @Post('menu-permissions/create')
  createMenuPermission(@CurrentUser() user: any, @Body() dto: CreateMenuPermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.createMenuPermission(dto, user.id);
  }

  @Post('menu-permissions/list')
  getMenuPermissions(@CurrentUser() user: any, @Body() dto: GetMenuPermissionsDto) {
    return this.service.getMenuPermissions(user.userType === UserType.SUPER_ADMIN ? undefined : user.tenantId, dto);
  }

  @Post('menu-permissions/update')
  updateMenuPermission(@CurrentUser() user: any, @Body() dto: UpdateMenuPermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.updateMenuPermission(dto, user.id);
  }

  @Post('menu-permissions/delete')
  deleteMenuPermission(@CurrentUser() user: any, @Body() dto: DeleteMenuPermissionDto) {
    this.checkSuperAdmin(user);
    return this.service.deleteMenuPermission(dto, user.id);
  }

  @Post('effective-permissions')
  getEffectivePermissions(@CurrentUser() user: any) {
    return this.service.getEffectivePermissions(user.tenantId, user.id);
  }

  @Post('get-user-menus')
  getUserMenus(@CurrentUser() user: any, @Body() dto: { user_id?: number }) {
    // Use current user's ID if not provided
    const targetUserId = dto.user_id || user.id;
    return this.service.getUserMenus(targetUserId);
  }

  @Post('check-menu-access')
  checkMenuAccess(@CurrentUser() user: any, @Body() dto: { user_id?: number; menu_key: string }) {
    // Use current user's ID if not provided
    const targetUserId = dto.user_id || user.id;
    return this.service.checkMenuAccess(targetUserId, dto.menu_key);
  }
}
