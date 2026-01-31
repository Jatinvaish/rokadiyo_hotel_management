import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SqlServerService } from 'src/core/database/sql-server.service';
import {
  CreateSubscriptionPlanDto,
  CreateSubscriptionFeatureDto,
  AssignFeaturePermissionsDto
} from './subscriptions.dto';

@Injectable()
export class SubscriptionsService {
  constructor(private sql: SqlServerService) { }

  // ==================== SUBSCRIPTION PLANS ====================
  async createPlan(dto: CreateSubscriptionPlanDto, createdBy?: number) {
    const existing = await this.sql.query('SELECT id FROM subscription_plans WHERE plan_slug = @slug', {
      slug: dto.plan_slug
    });
    if (existing.length > 0) throw new BadRequestException('Plan slug already exists');

    const result = await this.sql.query(`
      INSERT INTO subscription_plans (plan_name, plan_slug, plan_type, price_monthly, price_yearly, billing_cycle, is_active, created_at, created_by)
      OUTPUT INSERTED.*
      VALUES (@name, @slug, @type, @price_monthly, @price_yearly, @cycle, 1, GETUTCDATE(), @created_by)
    `, {
      name: dto.plan_name,
      slug: dto.plan_slug,
      type: dto.plan_type,
      price_monthly: dto.price_monthly || 0,
      price_yearly: dto.price_yearly || 0,
      cycle: dto.billing_cycle || 'monthly',
      created_by: createdBy || null
    });

    return result[0];
  }

  async getPlans() {
    return this.sql.query('SELECT * FROM subscription_plans WHERE is_active = 1 ORDER BY price_monthly');
  }

  // ==================== SUBSCRIPTION FEATURES ====================
  async createFeature(dto: CreateSubscriptionFeatureDto, createdBy?: number) {
    const result = await this.sql.query(`
      INSERT INTO subscription_features (subscription_id, name, feature_price, is_deleted, created_at, created_by)
      OUTPUT INSERTED.*
      VALUES (@sub_id, @name, @price, 0, GETUTCDATE(), @created_by)
    `, {
      sub_id: dto.subscription_id,
      name: dto.name,
      price: dto.feature_price || 0,
      created_by: createdBy || null
    });

    return result[0];
  }

  async getFeatures(planId: number) {
    return this.sql.query('SELECT * FROM subscription_features WHERE subscription_id = @planId AND is_deleted = 0', { planId });
  }

  // ==================== FEATURE PERMISSIONS ====================
  async assignFeaturePermissions(dto: AssignFeaturePermissionsDto, createdBy?: number) {
    return this.sql.transaction(async (tx) => {
      // Clear existing permissions for this feature
      const deleteRequest = tx.request();
      deleteRequest.input('feature_id', dto.feature_id);
      deleteRequest.input('sub_id', dto.subscription_id);
      await deleteRequest.query(`
        DELETE FROM subscription_feature_permissions 
        WHERE feature_id = @feature_id AND subscription_id = @sub_id
      `);

      // Add new
      if (dto.permission_ids.length > 0) {
        for (const permId of dto.permission_ids) {
          const insertRequest = tx.request();
          insertRequest.input('sub_id', dto.subscription_id);
          insertRequest.input('feature_id', dto.feature_id);
          insertRequest.input('permission_id', permId);
          insertRequest.input('created_by', createdBy || null);
          await insertRequest.query(`
            INSERT INTO subscription_feature_permissions (subscription_id, feature_id, permission_id, is_deleted, created_at, created_by)
            VALUES (@sub_id, @feature_id, @permission_id, 0, GETUTCDATE(), @created_by)
          `);
        }
      }
      return { message: 'Permissions assigned to feature successfully' };
    });
  }

  /**
   * Complex logic: Get effective permissions for a user
   * Intersection of User's Role Permissions and Tenant's Subscription allowed permissions.
   */
  async getTenantEffectivePermissions(tenantId: number, userId: number) {
    // 1. Get tenant's plan
    const tenantQueryResult = await this.sql.query('SELECT subscription_plan_id FROM tenants WHERE id = @tenantId', { tenantId });
    if (tenantQueryResult.length === 0) throw new NotFoundException('Tenant not found');
    const planId = tenantQueryResult[0].subscription_plan_id;

    if (!planId) return [];

    // 2. Get all permissions allowed by this plan (across all its features)
    const allowedBySubscription = await this.sql.query(`
      SELECT DISTINCT permission_id 
      FROM subscription_feature_permissions 
      WHERE subscription_id = @planId AND is_deleted = 0
    `, { planId });

    const subscriptionPermissionIds = allowedBySubscription.map(p => p.permission_id);

    // 3. Get permissions assigned to the user via roles
    const userPermissions = await this.sql.query(`
      SELECT DISTINCT p.id, p.permission_key, p.resource, p.action
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN user_roles ur ON rp.role_id = ur.role_id
      WHERE ur.user_id = @userId AND ur.is_active = 1
    `, { userId });

    // 4. Intersect
    return userPermissions.filter(p => subscriptionPermissionIds.includes(p.id));
  }

  /**
   * Get all permissions available in tenant's subscription
   */
  async getSubscriptionPermissions(tenantId: number) {
    const tenantQueryResult = await this.sql.query('SELECT subscription_plan_id FROM tenants WHERE id = @tenantId', { tenantId });
    if (tenantQueryResult.length === 0) return [];
    const planId = tenantQueryResult[0].subscription_plan_id;

    if (!planId) return [];

    const allowedBySubscription = await this.sql.query(`
      SELECT DISTINCT p.id, p.permission_key, p.resource, p.action, p.category, p.description
      FROM permissions p
      JOIN subscription_feature_permissions sfp ON p.id = sfp.permission_id
      WHERE sfp.subscription_id = @planId AND sfp.is_deleted = 0
      ORDER BY p.category, p.resource, p.action
    `, { planId });

    return allowedBySubscription;
  }
}
