import { IsString, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsNumber()
  parent_hotel_id?: number;

  @IsOptional()
  @IsBoolean()
  is_headquarters?: boolean;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  zip_code?: string;

  @IsOptional()
  @IsString()
  website?: string;
}