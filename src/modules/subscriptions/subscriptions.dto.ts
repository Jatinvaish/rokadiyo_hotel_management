import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class CreateSubscriptionPlanDto {
  @IsString()
  @IsNotEmpty()
  plan_name: string;

  @IsString()
  @IsNotEmpty()
  plan_slug: string;

  @IsString()
  @IsNotEmpty()
  plan_type: string;

  @IsNumber()
  @IsOptional()
  price_monthly?: number;

  @IsNumber()
  @IsOptional()
  price_yearly?: number;

  @IsString()
  @IsOptional()
  billing_cycle?: string;
}

export class CreateSubscriptionFeatureDto {
  @IsNumber()
  @IsNotEmpty()
  subscription_id: number; // Links to subscription_plans.id

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsOptional()
  feature_price?: number;
}

export class AssignFeaturePermissionsDto {
  @IsNumber()
  @IsNotEmpty()
  subscription_id: number;

  @IsNumber()
  @IsNotEmpty()
  feature_id: number;

  @IsArray()
  @IsNumber({}, { each: true })
  permission_ids: number[];
}
