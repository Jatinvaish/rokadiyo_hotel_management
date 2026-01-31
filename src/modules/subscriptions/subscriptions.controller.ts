import { Controller, Get, Post, Body, Param, ForbiddenException } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import {
  CreateSubscriptionPlanDto,
  CreateSubscriptionFeatureDto,
  AssignFeaturePermissionsDto
} from './subscriptions.dto';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { UserType } from 'src/common/constants/user-types.constant';

@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private readonly service: SubscriptionsService) { }

  private checkSuperAdmin(user: any) {
    if (user.userType !== UserType.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admin can manage subscriptions');
    }
  }

  @Post('plans')
  createPlan(@CurrentUser() user: any, @Body() dto: CreateSubscriptionPlanDto) {
    this.checkSuperAdmin(user);
    return this.service.createPlan(dto, user.id);
  }

  @Get('plans')
  getPlans() {
    return this.service.getPlans();
  }

  @Post('features')
  createFeature(@CurrentUser() user: any, @Body() dto: CreateSubscriptionFeatureDto) {
    this.checkSuperAdmin(user);
    return this.service.createFeature(dto, user.id);
  }

  @Get('features/:planId')
  getFeatures(@Param('planId') planId: number) {
    return this.service.getFeatures(planId);
  }

  @Post('feature-permissions')
  assignFeaturePermissions(@CurrentUser() user: any, @Body() dto: AssignFeaturePermissionsDto) {
    this.checkSuperAdmin(user);
    return this.service.assignFeaturePermissions(dto, user.id);
  }

  @Post('effective-permissions')
  getEffectivePermissions(@CurrentUser() user: any) {
    return this.service.getTenantEffectivePermissions(user.tenantId, user.id);
  }

  @Post('subscription-permissions')
  getSubscriptionPermissions(@CurrentUser() user: any) {
    return this.service.getSubscriptionPermissions(user.tenantId);
  }
}
