import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CompleteCheckInDto {
  @IsNumber()
  booking_id: number;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class CalculateBillDto {
  @IsNumber()
  booking_id: number;

  @IsOptional()
  @IsNumber()
  additional_charges?: number;

  @IsOptional()
  @IsString()
  charge_description?: string;
}

export class CompleteCheckOutDto {
  @IsNumber()
  booking_id: number;

  @IsNumber()
  final_amount: number;

  @IsOptional()
  @IsNumber()
  additional_charges?: number;

  @IsOptional()
  @IsString()
  checkout_notes?: string;
}

export class QuickCheckInDto {
  @IsOptional()
  @IsNumber()
  guest_id?: number;

  @IsOptional()
  @IsString()
  first_name?: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsNumber()
  room_id: number;

  @IsString()
  check_out_date: string;

  @IsOptional()
  @IsNumber()
  total_amount?: number;

  @IsOptional()
  @IsNumber()
  paid_amount?: number;

  @IsOptional()
  @IsString()
  notes?: string;
}