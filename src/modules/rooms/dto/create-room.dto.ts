import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  max_adults?: number;

  @IsNumber()
  @IsOptional()
  max_children?: number;

  @IsNumber()
  max_occupancy: number;

  @IsNumber()
  @IsOptional()
  max_extra_beds?: number;

  @IsNumber()
  @IsOptional()
  base_rate_hourly?: number;

  @IsNumber()
  base_rate_daily: number;

  @IsNumber()
  @IsOptional()
  base_rate_weekly?: number;

  @IsNumber()
  @IsOptional()
  base_rate_monthly?: number;

  @IsNumber()
  @IsOptional()
  extra_bed_rate?: number;

  @IsNumber()
  @IsOptional()
  extra_person_rate?: number;

  @IsNumber()
  @IsOptional()
  child_rate?: number;

  @IsNumber()
  @IsOptional()
  size_sqft?: number;

  @IsString()
  @IsOptional()
  bed_type?: string;

  @IsNumber()
  @IsOptional()
  bed_count?: number;

  @IsString()
  @IsOptional()
  view_type?: string;
}

export class CreateRoomDto {
  @IsNumber()
  room_type_id: number;

  @IsString()
  room_number: string;

  @IsNumber()
  @IsOptional()
  floor_number?: number;

  @IsString()
  @IsOptional()
  block_name?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  condition?: string;

  @IsOptional()
  is_accessible?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsNumber()
  firm_id: number;

  @IsNumber()
  branch_id: number;
}

export class BulkCreateRoomsDto {
  @IsNumber()
  firm_id: number;

  @IsNumber()
  branch_id: number;

  @IsNumber()
  room_type_id: number;

  @IsString()
  room_number_prefix: string;

  @IsNumber()
  start_number: number;

  @IsNumber()
  end_number: number;

  @IsOptional()
  @IsNumber()
  floor?: number;
}