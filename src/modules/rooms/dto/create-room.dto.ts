import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateRoomTypeDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  base_rate_hourly: number;

  @IsNumber()
  base_rate_daily: number;

  @IsNumber()
  max_occupancy: number;

  @IsOptional()
  @IsArray()
  amenities?: string[];
}

export class BulkCreateRoomsDto {
  @IsNumber()
  hotel_id: number;

  @IsNumber()
  room_type_id: number;

  @IsString()
  room_number_prefix: string;

  @IsNumber()
  start_number: number;

  @IsNumber()
  end_number: number;

  @IsOptional()
  @IsString()
  floor?: string;
}