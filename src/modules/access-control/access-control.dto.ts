import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsArray, IsNumber } from 'class-validator';

// ==================== ROLES ====================
export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  tenant_id?: number;

  @IsBoolean()
  @IsOptional()
  is_system_role?: boolean;

  @IsBoolean()
  @IsOptional()
  is_default?: boolean;
}

export class UpdateRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  display_name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class DeleteRoleDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class CloneRoleDto {
  @IsNumber()
  @IsNotEmpty()
  source_role_id: number;

  @IsString()
  @IsNotEmpty()
  new_name: string;

  @IsString()
  @IsOptional()
  new_display_name?: string;

  @IsString()
  @IsOptional()
  new_description?: string;
}

export class GetRolesDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  include_system_roles?: boolean;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

// ==================== PERMISSIONS ====================
export class CreatePermissionDto {
  @IsString()
  @IsNotEmpty()
  permission_key: string;

  @IsString()
  @IsNotEmpty()
  resource: string;

  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsNumber()
  @IsOptional()
  resource_id?: number;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  fields?: string;
}

export class UpdatePermissionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  permission_key?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsString()
  @IsOptional()
  action?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  is_system_permission?: boolean;

  @IsString()
  @IsOptional()
  scope?: string;

  @IsString()
  @IsOptional()
  fields?: string;
}

export class DeletePermissionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class GetPermissionsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  resource?: string;

  @IsBoolean()
  @IsOptional()
  include_system_permissions?: boolean;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

// ==================== ROLE PERMISSIONS ====================
export class AssignRolePermissionsDto {
  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}

export class GetRolePermissionsDto {
  @IsNumber()
  @IsNotEmpty()
  role_id: number;

  @IsBoolean()
  @IsOptional()
  include_subscription_permissions?: boolean;
}

// ==================== USER ROLES ====================
export class AssignUserRolesDto {
  @IsNumber()
  @IsNotEmpty()
  user_id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  role_ids: number[];
}

// ==================== MENU PERMISSIONS ====================
export class CreateMenuPermissionDto {
  @IsString()
  @IsNotEmpty()
  menu_key: string;

  @IsString()
  @IsNotEmpty()
  menu_name: string;

  @IsString()
  @IsOptional()
  parent_menu_key?: string;

  @IsString()
  @IsOptional()
  permission_ids?: string;

  @IsString()
  @IsOptional()
  match_type?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  route?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class UpdateMenuPermissionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsOptional()
  menu_key?: string;

  @IsString()
  @IsOptional()
  menu_name?: string;

  @IsString()
  @IsOptional()
  parent_menu_key?: string;

  @IsString()
  @IsOptional()
  permission_ids?: string;

  @IsString()
  @IsOptional()
  match_type?: string;

  @IsNumber()
  @IsOptional()
  display_order?: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsString()
  @IsOptional()
  route?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}

export class DeleteMenuPermissionDto {
  @IsNumber()
  @IsNotEmpty()
  id: number;
}

export class GetMenuPermissionsDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsBoolean()
  @IsOptional()
  include_inactive?: boolean;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}
