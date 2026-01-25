import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  id_type: string; // passport, license, national_id

  @IsString()
  id_number: string;

  @IsOptional()
  @IsString()
  id_document_url?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  address?: string;
}