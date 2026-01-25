import { IsNumber, IsDateString, IsString, IsOptional, IsArray } from 'class-validator';

export class CheckAvailabilityDto {
  @IsDateString()
  check_in: string;

  @IsDateString()
  check_out: string;

  @IsNumber()
  room_type_id: number;

  @IsOptional()
  @IsArray()
  hotel_ids?: number[]; // Check across multiple branches

  @IsOptional()
  @IsString()
  booking_type?: 'hourly' | 'daily';
}

export class CreateBookingDto {
  @IsOptional()
  @IsNumber()
  guest_id?: number;

  @IsOptional()
  guest?: any;

  @IsNumber()
  hotel_id: number;

  @IsNumber()
  room_id: number;

  @IsOptional()
  @IsDateString()
  check_in_date?: string;

  @IsOptional()
  @IsDateString()
  check_out_date?: string;

  @IsOptional()
  @IsString() // Accepting ISO string for flexibility
  check_in?: string;

  @IsOptional()
  @IsString()
  check_out?: string;

  @IsNumber()
  total_amount: number;

  @IsOptional()
  @IsString()
  booking_type?: 'hourly' | 'daily' | 'advance';

  @IsOptional()
  @IsNumber()
  total_hours?: number;

  @IsOptional()
  @IsNumber()
  total_nights?: number;

  @IsOptional()
  @IsNumber()
  adults?: number;

  @IsOptional()
  @IsNumber()
  children?: number;

  @IsOptional()
  @IsString()
  special_requests?: string;

  @IsOptional()
  @IsString()
  booking_source?: 'walk_in' | 'online' | 'phone';
}

export class RecordPaymentDto {
  @IsNumber()
  booking_id: number;

  @IsNumber()
  amount: number;

  @IsString()
  payment_method: string; // cash, card, transfer

  @IsOptional()
  @IsString()
  reference_number?: string;
}