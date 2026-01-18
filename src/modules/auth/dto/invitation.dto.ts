import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Min, Max, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendInvitationDto {
  @ApiProperty({ example: 'newuser@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 3, description: 'Role ID to assign' })
  @IsNumber()
  @IsNotEmpty()
  roleId: number;

  @ApiProperty({ example: 'tenant_user' })
  @IsString()
  @IsNotEmpty()
  inviteeType: string;

  @ApiProperty({ example: 7, required: false, description: 'Days until expiry (default 7)' })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(30)
  expiryDays?: number;
}

export class AcceptInvitationDto {
  @ApiProperty({ example: 'newuser' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'John', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ example: 'Doe', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;
}

export class RejectInvitationDto {
  @ApiProperty({ example: 'Not interested at this time', required: false })
  @IsString()
  @IsOptional()
  reason?: string;
}