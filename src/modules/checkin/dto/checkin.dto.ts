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