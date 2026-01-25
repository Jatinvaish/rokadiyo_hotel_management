import { IsNumber, IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateHourlyRuleDto {
  @IsNumber()
  room_type_id: number;

  @IsOptional()
  @IsNumber()
  hotel_id?: number;

  @IsOptional()
  @IsNumber()
  firm_id?: number;

  @IsOptional()
  @IsNumber()
  branch_id?: number;

  @IsString()
  start_time: string; // HH:mm format

  @IsString()
  end_time: string;

  @IsNumber()
  rate_multiplier: number; // 1.0 = base rate, 1.5 = 50% markup

  @IsOptional()
  @IsString()
  days_of_week?: string; // "1,2,3,4,5" for weekdays
}

export class CreateSeasonalRateDto {
  @IsNumber()
  room_type_id: number;

  @IsOptional()
  @IsNumber()
  hotel_id?: number;

  @IsOptional()
  @IsNumber()
  firm_id?: number;

  @IsOptional()
  @IsNumber()
  branch_id?: number;

  @IsDateString()
  start_date: string;

  @IsDateString()
  end_date: string;

  @IsNumber()
  rate_multiplier: number;

  @IsString()
  season_name: string;
}

export class CalculatePriceDto {
  @IsNumber()
  room_type_id: number;

  @IsOptional()
  @IsNumber()
  hotel_id?: number;

  @IsOptional()
  @IsNumber()
  firm_id?: number;

  @IsOptional()
  @IsNumber()
  branch_id?: number;

  @IsDateString()
  check_in: string;

  @IsDateString()
  check_out: string;

  @IsOptional()
  @IsString()
  booking_type?: 'hourly' | 'daily';
}