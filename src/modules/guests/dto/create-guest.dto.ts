import { IsString, IsEmail, IsOptional, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class CreateGuestDto {
  @IsString()
  first_name: string;

  @IsOptional()
  @IsString()
  last_name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  phone_secondary?: string;

  @IsOptional()
  @IsString()
  id_type?: string;

  @IsOptional()
  @IsString()
  id_number?: string;

  @IsOptional()
  @IsString()
  id_document_url?: string;

  @IsOptional()
  id_document_urls?: string[];

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  nationality?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  company_name?: string;

  @IsOptional()
  @IsString()
  gst_number?: string;

  @IsOptional()
  @IsString()
  vip_status?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  blacklisted?: boolean;

  @IsOptional()
  @IsString()
  blacklist_reason?: string;
}