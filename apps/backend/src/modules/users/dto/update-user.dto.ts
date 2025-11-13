import {
  IsEmail,
  IsString,
  IsDateString,
  IsOptional,
  IsEnum,
  IsBoolean,
  Matches,
  MinLength,
  IsInt,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from 'src/common/enums';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Full name of the user',
    example: 'Nguyễn Văn A',
    minLength: 2,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(2, { message: 'Full name must be at least 2 characters long' })
  fullName?: string;

  @ApiPropertyOptional({
    description: 'Email address of the user',
    example: 'user@example.com',
    type: String,
  })
  @IsOptional()
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email?: string;

  @ApiPropertyOptional({
    description: 'User password (minimum 8 characters)',
    example: 'NewSecurePassword123',
    minLength: 8,
    type: String,
  })
  @IsOptional()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password?: string;

  @ApiPropertyOptional({
    description: 'Phone number of the user',
    example: '0901234567',
    pattern: '^(0|\\+84)[0-9]{9,10}$',
    type: String,
  })
  @IsOptional()
  @IsString()
  @Matches(/^(0|\+84)[0-9]{9,10}$/, {
    message: 'Please provide a valid Vietnamese phone number',
  })
  phone?: string;

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
    description: 'User role (Admin only)',
    enum: UserRole,
    example: UserRole.CUSTOMER,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Please provide a valid user role' })
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Account status: true=Active, false=Inactive (Admin only)',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @IsBoolean({ message: 'Status must be a boolean value' })
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Job position (for ADMIN/STAFF roles)',
    example: 'Công chứng viên',
    type: String,
  })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiPropertyOptional({
    description: 'Years of experience (for ADMIN/STAFF roles)',
    example: 5,
    minimum: 0,
    type: Number,
  })
  @IsOptional()
  @IsInt({ message: 'Years of experience must be an integer' })
  @Min(0, { message: 'Years of experience cannot be negative' })
  yearsOfExperience?: number;
}
