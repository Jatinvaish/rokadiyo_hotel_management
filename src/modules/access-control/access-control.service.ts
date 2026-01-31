import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
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

@Injectable()
export class AccessControlService {
  constructor(private sql: SqlServerService) { }

  // ==================== ROLES ====================
  async createRole(dto: CreateRoleDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT id FROM roles WHERE name = @name AND (tenant_id = @tenant_id OR tenant_id IS NULL)', {
      name: dto.name,
      tenant_id: dto.tenant_id || null
    });
    if (existing.length > 0) throw new BadRequestException('Role already exists');

    const result = await this.sql.query(`
      INSERT INTO roles (tenant_id, name, display_name, description, is_system_role, is_default, created_at, created_by)
      OUTPUT INSERTED.*
      VALUES (@tenant_id, @name, @display_name, @description, @is_system_role, @is_default, GETUTCDATE(), @created_by)
    `, {
      tenant_id: dto.tenant_id || null,
      name: dto.name,
      display_name: dto.display_name || dto.name,
      description: dto.description || null,
      is_system_role: dto.is_system_role ?? false,
      is_default: dto.is_default ?? false,
      created_by: createdBy || null
    });

    return result[0];
  }

  async getRoles(tenantId?: number, dto?: GetRolesDto) {
    let query = 'SELECT * FROM roles WHERE is_visible_to_all = 1';
    const params: any = {};
    
    if (tenantId) {
      query += ' OR tenant_id = @tenantId';
      params.tenantId = tenantId;
    }
    
    if (dto?.search) {
      query += ' AND (name LIKE @search OR display_name LIKE @search)';
      params.search = `%${dto.search}%`;
    }
    
    if (!dto?.include_system_roles) {
      query += ' AND is_system_role = 0';
    }
    
    query += ' ORDER BY display_name';
    
    if (dto?.page && dto?.limit) {
      const offset = (dto.page - 1) * dto.limit;
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = offset;
      params.limit = dto.limit;
    }
    
    return this.sql.query(query, params);
  }

  async updateRole(dto: UpdateRoleDto, createdBy?: number, tenantId?: number) {
    // Check if role exists and belongs to tenant
    const roleCheck = await this.sql.query('SELECT * FROM roles WHERE id = @id', { id: dto.id });
    if (roleCheck.length === 0) throw new NotFoundException('Role not found');
    
    const role = roleCheck[0];
    if (tenantId && role.tenant_id !== tenantId && role.tenant_id !== null) {
      throw new ForbiddenException('Cannot update role from another tenant');
    }
    
    if (role.is_system_role) {
      throw new ForbiddenException('Cannot update system role');
    }

    const updateFields: string[] = [];
    const params: any = { id: dto.id, updated_by: createdBy };
    
    if (dto.name !== undefined) {
      updateFields.push('name = @name');
      params.name = dto.name;
    }
    if (dto.display_name !== undefined) {
      updateFields.push('display_name = @display_name');
      params.display_name = dto.display_name;
    }
    if (dto.description !== undefined) {
      updateFields.push('description = @description');
      params.description = dto.description;
    }
    if (dto.is_active !== undefined) {
      updateFields.push('is_visible_to_all = @is_active');
      params.is_active = dto.is_active;
    }
    
    if (updateFields.length === 0) {
      throw new BadRequestException('No fields to update');
    }
    
    updateFields.push('updated_at = GETUTCDATE()', 'updated_by = @updated_by');
    
    const result = await this.sql.query(`
      UPDATE roles 
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `, params);
    
    return result[0];
  }

  async deleteRole(dto: DeleteRoleDto, createdBy?: number, tenantId?: number) {
    // Check if role exists and belongs to tenant
    const roleCheck = await this.sql.query('SELECT * FROM roles WHERE id = @id', { id: dto.id });
    if (roleCheck.length === 0) throw new NotFoundException('Role not found');
    
    const role = roleCheck[0];
    if (tenantId && role.tenant_id !== tenantId && role.tenant_id !== null) {
      throw new ForbiddenException('Cannot delete role from another tenant');
    }
    
    if (role.is_system_role) {
      throw new ForbiddenException('Cannot delete system role');
    }
    
    // Check if role is assigned to any users
    const userRoleCheck = await this.sql.query('SELECT COUNT(*) as count FROM user_roles WHERE role_id = @id', { id: dto.id });
    if (userRoleCheck[0].count > 0) {
      throw new BadRequestException('Cannot delete role that is assigned to users');
    }
    
    await this.sql.query('DELETE FROM role_permissions WHERE role_id = @id', { id: dto.id });
    await this.sql.query('DELETE FROM roles WHERE id = @id', { id: dto.id });
    
    return { message: 'Role deleted successfully' };
  }

  async cloneRole(dto: CloneRoleDto, createdBy?: number, tenantId?: number) {
    // Get source role
    const sourceRole = await this.sql.query('SELECT * FROM roles WHERE id = @source_role_id', { source_role_id: dto.source_role_id });
    if (sourceRole.length === 0) throw new NotFoundException('Source role not found');
    
    const source = sourceRole[0];
    if (tenantId && source.tenant_id !== tenantId && source.tenant_id !== null) {
      throw new ForbiddenException('Cannot clone role from another tenant');
    }
    
    // Create new role
    const newRole = await this.createRole({
      name: dto.new_name,
      display_name: dto.new_display_name || dto.new_name,
      description: dto.new_description || `Cloned from ${source.display_name}`,
      tenant_id: source.tenant_id,
      is_system_role: false,
      is_default: false
    }, createdBy);
    
    // Clone permissions
    const sourcePermissions = await this.sql.query('SELECT permission_id FROM role_permissions WHERE role_id = @source_role_id', { source_role_id: dto.source_role_id });
    
    if (sourcePermissions.length > 0) {
      await this.assignRolePermissions({
        role_id: newRole.id,
        permission_ids: sourcePermissions.map(p => p.permission_id)
      }, createdBy);
    }
    
    return newRole;
  }

  // ==================== PERMISSIONS ====================
  async createPermission(dto: CreatePermissionDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT id FROM permissions WHERE permission_key = @key', { key: dto.permission_key });
    if (existing.length > 0) throw new BadRequestException('Permission key already exists');

    const result = await this.sql.query(`
      INSERT INTO permissions (permission_key, resource, action, description, category, resource_id, scope, fields, created_at, created_by)
      OUTPUT INSERTED.*
      VALUES (@key, @resource, @action, @description, @category, @resource_id, @scope, @fields, GETUTCDATE(), @created_by)
    `, {
      key: dto.permission_key,
      resource: dto.resource,
      action: dto.action,
      description: dto.description || null,
      category: dto.category || null,
      resource_id: dto.resource_id || null,
      scope: dto.scope || null,
      fields: dto.fields || null,
      created_by: createdBy || null
    });

    return result[0];
  }

  async getPermissions(tenantId?: number, dto?: GetPermissionsDto) {
    let query = 'SELECT * FROM permissions WHERE 1=1';
    const params: any = {};
    
    if (dto?.search) {
      query += ' AND (permission_key LIKE @search OR resource LIKE @search OR action LIKE @search OR description LIKE @search)';
      params.search = `%${dto.search}%`;
    }
    
    if (dto?.category) {
      query += ' AND category = @category';
      params.category = dto.category;
    }
    
    if (dto?.resource) {
      query += ' AND resource = @resource';
      params.resource = dto.resource;
    }
    
    if (!dto?.include_system_permissions) {
      query += ' AND is_system_permission = 0';
    }
    
    query += ' ORDER BY category, resource, action';
    
    if (dto?.page && dto?.limit) {
      const offset = (dto.page - 1) * dto.limit;
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = offset;
      params.limit = dto.limit;
    }
    
    return this.sql.query(query, params);
  }

  async updatePermission(dto: UpdatePermissionDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT * FROM permissions WHERE id = @id', { id: dto.id });
    if (existing.length === 0) throw new NotFoundException('Permission not found');
    
    const permission = existing[0];
    if (permission.is_system_permission) {
      throw new ForbiddenException('Cannot update system permission');
    }
    
    const updateFields: string[] = [];
    const params: any = { id: dto.id, updated_by: createdBy };
    
    if (dto.permission_key !== undefined) {
      // Check if new key already exists
      const keyCheck = await this.sql.query('SELECT id FROM permissions WHERE permission_key = @permission_key AND id != @id', { permission_key: dto.permission_key, id: dto.id });
      if (keyCheck.length > 0) throw new BadRequestException('Permission key already exists');
      updateFields.push('permission_key = @permission_key');
      params.permission_key = dto.permission_key;
    }
    if (dto.resource !== undefined) {
      updateFields.push('resource = @resource');
      params.resource = dto.resource;
    }
    if (dto.action !== undefined) {
      updateFields.push('action = @action');
      params.action = dto.action;
    }
    if (dto.description !== undefined) {
      updateFields.push('description = @description');
      params.description = dto.description;
    }
    if (dto.category !== undefined) {
      updateFields.push('category = @category');
      params.category = dto.category;
    }
    if (dto.scope !== undefined) {
      updateFields.push('scope = @scope');
      params.scope = dto.scope;
    }
    if (dto.fields !== undefined) {
      updateFields.push('fields = @fields');
      params.fields = dto.fields;
    }
    
    if (updateFields.length === 0) {
      throw new BadRequestException('No fields to update');
    }
    
    updateFields.push('updated_at = GETUTCDATE()', 'updated_by = @updated_by');
    
    const result = await this.sql.query(`
      UPDATE permissions 
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `, params);
    
    return result[0];
  }

  async deletePermission(dto: DeletePermissionDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT * FROM permissions WHERE id = @id', { id: dto.id });
    if (existing.length === 0) throw new NotFoundException('Permission not found');
    
    const permission = existing[0];
    if (permission.is_system_permission) {
      throw new ForbiddenException('Cannot delete system permission');
    }
    
    // Check if permission is assigned to any roles
    const roleCheck = await this.sql.query('SELECT COUNT(*) as count FROM role_permissions WHERE permission_id = @id', { id: dto.id });
    if (roleCheck[0].count > 0) {
      throw new BadRequestException('Cannot delete permission that is assigned to roles');
    }
    
    await this.sql.query('DELETE FROM permissions WHERE id = @id', { id: dto.id });
    return { message: 'Permission deleted successfully' };
  }

  // ==================== ROLE PERMISSIONS ====================
  async assignRolePermissions(dto: AssignRolePermissionsDto, createdBy?: number, tenantId?: number) {
    // Check if role belongs to tenant
    const roleCheck = await this.sql.query('SELECT * FROM roles WHERE id = @role_id', { role_id: dto.role_id });
    if (roleCheck.length === 0) throw new NotFoundException('Role not found');
    
    const role = roleCheck[0];
    if (tenantId && role.tenant_id !== tenantId && role.tenant_id !== null) {
      throw new ForbiddenException('Cannot manage permissions for role from another tenant');
    }
    
    // If tenant is provided, filter permissions based on subscription
    let availablePermissions = dto.permission_ids;
    if (tenantId) {
      const subscriptionPermissions = await this.getSubscriptionPermissions(tenantId);
      availablePermissions = dto.permission_ids.filter(pid => subscriptionPermissions.includes(pid));
    }
    
    return this.sql.transaction(async (tx) => {
      // Clear existing
      const deleteRequest = tx.request();
      deleteRequest.input('role_id', dto.role_id);
      await deleteRequest.query('DELETE FROM role_permissions WHERE role_id = @role_id');

      // Add new
      if (availablePermissions.length > 0) {
        for (const permId of availablePermissions) {
          const insertRequest = tx.request();
          insertRequest.input('role_id', dto.role_id);
          insertRequest.input('permission_id', permId);
          insertRequest.input('created_by', createdBy || null);
          await insertRequest.query(`
            INSERT INTO role_permissions (role_id, permission_id, created_at, created_by, granted, status)
            VALUES (@role_id, @permission_id, GETUTCDATE(), @created_by, 1, 'active')
          `);
        }
      }
      return { message: 'Permissions assigned successfully', assigned_count: availablePermissions.length };
    });
  }

  async getRolePermissions(roleId: number, tenantId?: number, dto?: GetRolePermissionsDto) {
    let query = `
      SELECT p.*, rp.granted, rp.status
      FROM permissions p
      LEFT JOIN role_permissions rp ON p.id = rp.permission_id AND rp.role_id = @roleId
      WHERE 1=1
    `;
    const params: any = { roleId };
    
    // If tenant is specified and subscription filtering is requested, filter by subscription permissions
    if (tenantId && dto?.include_subscription_permissions) {
      const subscriptionPermissions = await this.getSubscriptionPermissions(tenantId);
      if (subscriptionPermissions.length > 0) {
        query += ` AND p.id IN (${subscriptionPermissions.join(',')})`;
      } else {
        query += ' AND 1=0'; // No permissions available
      }
    }
    
    query += ' ORDER BY p.category, p.resource, p.action';
    
    return this.sql.query(query, params);
  }

  private async getSubscriptionPermissions(tenantId: number): Promise<number[]> {
    const tenantQueryResult = await this.sql.query('SELECT subscription_plan_id FROM tenants WHERE id = @tenantId', { tenantId });
    if (tenantQueryResult.length === 0) return [];
    const planId = tenantQueryResult[0].subscription_plan_id;

    if (!planId) return [];

    const allowedBySubscription = await this.sql.query(`
      SELECT DISTINCT permission_id 
      FROM subscription_feature_permissions 
      WHERE subscription_id = @planId AND is_deleted = 0
    `, { planId });

    return allowedBySubscription.map(p => p.permission_id);
  }

  // ==================== USER ROLES ====================
  async assignUserRoles(dto: AssignUserRolesDto, createdBy?: number) {
    return this.sql.transaction(async (tx) => {
      // Clear existing active roles
      const deleteRequest = tx.request();
      deleteRequest.input('user_id', dto.user_id);
      await deleteRequest.query('DELETE FROM user_roles WHERE user_id = @user_id');

      // Add new
      if (dto.role_ids.length > 0) {
        for (const roleId of dto.role_ids) {
          const insertRequest = tx.request();
          insertRequest.input('user_id', dto.user_id);
          insertRequest.input('role_id', roleId);
          insertRequest.input('created_by', createdBy || null);
          await insertRequest.query(`
            INSERT INTO user_roles (user_id, role_id, is_active, created_at, created_by, assigned_at)
            VALUES (@user_id, @role_id, 1, GETUTCDATE(), @created_by, GETUTCDATE())
          `);
        }
      }
      return { message: 'Roles assigned successfully' };
    });
  }

  // ==================== MENU PERMISSIONS ====================
  async createMenuPermission(dto: CreateMenuPermissionDto, createdBy?: number) {
    const result = await this.sql.query(`
      INSERT INTO menu_permissions (menu_key, menu_name, parent_menu_key, permission_ids, match_type, display_order, icon, route, status, is_active, created_at, created_by)
      OUTPUT INSERTED.*
      VALUES (@menu_key, @menu_name, @parent_menu_key, @permission_ids, @match_type, @display_order, @icon, @route, @status, @is_active, GETUTCDATE(), @created_by)
    `, {
      menu_key: dto.menu_key,
      menu_name: dto.menu_name,
      parent_menu_key: dto.parent_menu_key || null,
      permission_ids: dto.permission_ids || null,
      match_type: dto.match_type || 'any',
      display_order: dto.display_order || 0,
      icon: dto.icon || null,
      route: dto.route || null,
      status: dto.status || 'active',
      is_active: dto.is_active ?? true,
      created_by: createdBy || null
    });

    return result[0];
  }

  async getMenuPermissions(tenantId?: number, dto?: GetMenuPermissionsDto) {
    let query = 'SELECT * FROM menu_permissions WHERE 1=1';
    const params: any = {};
    
    if (dto?.search) {
      query += ' AND (menu_key LIKE @search OR menu_name LIKE @search)';
      params.search = `%${dto.search}%`;
    }
    
    if (!dto?.include_inactive) {
      query += ' AND is_active = 1';
    }
    
    query += ' ORDER BY display_order, menu_name';
    
    if (dto?.page && dto?.limit) {
      const offset = (dto.page - 1) * dto.limit;
      query += ' OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY';
      params.offset = offset;
      params.limit = dto.limit;
    }
    
    return this.sql.query(query, params);
  }

  async updateMenuPermission(dto: UpdateMenuPermissionDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT * FROM menu_permissions WHERE id = @id', { id: dto.id });
    if (existing.length === 0) throw new NotFoundException('Menu permission not found');
    
    const updateFields: string[] = [];
    const params: any = { id: dto.id, updated_by: createdBy };
    
    if (dto.menu_key !== undefined) {
      updateFields.push('menu_key = @menu_key');
      params.menu_key = dto.menu_key;
    }
    if (dto.menu_name !== undefined) {
      updateFields.push('menu_name = @menu_name');
      params.menu_name = dto.menu_name;
    }
    if (dto.parent_menu_key !== undefined) {
      updateFields.push('parent_menu_key = @parent_menu_key');
      params.parent_menu_key = dto.parent_menu_key;
    }
    if (dto.permission_ids !== undefined) {
      updateFields.push('permission_ids = @permission_ids');
      params.permission_ids = dto.permission_ids;
    }
    if (dto.match_type !== undefined) {
      updateFields.push('match_type = @match_type');
      params.match_type = dto.match_type;
    }
    if (dto.display_order !== undefined) {
      updateFields.push('display_order = @display_order');
      params.display_order = dto.display_order;
    }
    if (dto.icon !== undefined) {
      updateFields.push('icon = @icon');
      params.icon = dto.icon;
    }
    if (dto.route !== undefined) {
      updateFields.push('route = @route');
      params.route = dto.route;
    }
    if (dto.status !== undefined) {
      updateFields.push('status = @status');
      params.status = dto.status;
    }
    if (dto.is_active !== undefined) {
      updateFields.push('is_active = @is_active');
      params.is_active = dto.is_active;
    }
    
    if (updateFields.length === 0) {
      throw new BadRequestException('No fields to update');
    }
    
    updateFields.push('updated_at = GETUTCDATE()', 'updated_by = @updated_by');
    
    const result = await this.sql.query(`
      UPDATE menu_permissions 
      SET ${updateFields.join(', ')}
      OUTPUT INSERTED.*
      WHERE id = @id
    `, params);
    
    return result[0];
  }

  async deleteMenuPermission(dto: DeleteMenuPermissionDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT * FROM menu_permissions WHERE id = @id', { id: dto.id });
    if (existing.length === 0) throw new NotFoundException('Menu permission not found');
    
    await this.sql.query('DELETE FROM menu_permissions WHERE id = @id', { id: dto.id });
    return { message: 'Menu permission deleted successfully' };
  }

  async getEffectivePermissions(tenantId: number, userId: number) {
    // Get tenant's subscription permissions
    const subscriptionPermissions = await this.getSubscriptionPermissions(tenantId);
    
    // Get user's role permissions
    const userPermissions = await this.sql.query(`
      SELECT DISTINCT p.id, p.permission_key, p.resource, p.action, p.category
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = @userId AND ur.is_active = 1 AND rp.granted = 1 AND rp.status = 'active'
    `, { userId });
    
    // Filter by subscription permissions
    return userPermissions.filter(p => subscriptionPermissions.includes(p.id));
  }

  // ==================== USER MENUS ====================
  async getUserMenus(userId: number) {
    try {
      return await this.sql.query('EXEC sp_api_get_user_menus @user_id = @userId', { userId });
    } catch (error) {
      // Fallback to direct query if stored procedure doesn't exist
      return this.sql.query(`
        SELECT 
          menu_key,
          menu_name,
          parent_menu_key,
          display_order,
          icon,
          route
        FROM menu_permissions
        WHERE is_active = 1 
        AND status = 'active'
        AND menu_key NOT LIKE 'tenant_%'
        ORDER BY display_order, menu_key
      `);
    }
  }

  async checkMenuAccess(userId: number, menuKey: string) {
    try {
      const result = await this.sql.query('EXEC sp_api_check_menu_access @user_id = @userId, @menu_key = @menuKey', { 
        userId, 
        menuKey 
      });
      return result[0] || { has_access: false };
    } catch (error) {
      // Fallback: grant access to non-tenant menus
      const hasAccess = !menuKey.startsWith('tenant_');
      return { has_access: hasAccess };
    }
  }
}
