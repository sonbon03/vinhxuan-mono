import {
  IsEmail,
  IsString,
  MinLength,
  IsDateString,
  IsOptional,
  IsEnum,
  Matches,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '@shared';

export class CreateUserDto {
  @ApiProperty({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    minLength: 2,
    type: String,
  })
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the user',
    example: 'user@example.com',
    type: String,
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'SecurePassword123',
    minLength: 8,
    type: String,
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;

  @ApiProperty({
    description: 'Phone number of the user',
    example: '0901234567',
    pattern: '^(0|\\+84)[0-9]{9,10}$',
    type: String,
  })
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Please provide a valid Vietnamese phone number',
  })
  phone: string;

  @ApiPropertyOptional({
    description: 'Date of birth (ISO 8601 format)',
    example: '1990-01-01',
    type: String,
    format: 'date',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Please provide a valid date in ISO 8601 format' })
  dateOfBirth?: Date;

  @ApiPropertyOptional({
    description: 'User role (defaults to CUSTOMER)',
    enum: UserRole,
    example: UserRole.CUSTOMER,
    default: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Please provide a valid user role' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Job position (required for ADMIN/STAFF roles)',
    example: 'Công chứng viên',
    type: String,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Years of experience (required for ADMIN/STAFF roles)',
    example: 5,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Years of experience must be an integer' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  yearsOfExperience?: number;
}
