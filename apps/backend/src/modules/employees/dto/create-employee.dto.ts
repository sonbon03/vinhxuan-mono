import { IsString, IsEmail, IsInt, Min, IsOptional, IsEnum, IsDateString, IsUUID, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus } from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiPropertyOptional({
    description: 'ID tài khoản người dùng đã liên kết (nếu có). Dùng để liên kết nhân viên với tài khoản hệ thống.',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID('4', { message: 'User ID phải là UUID hợp lệ' })
  userId?: string;

  @ApiProperty({
    description: 'Họ và tên đầy đủ của nhân viên',
    example: 'Nguyễn Văn An',
    type: String,
    minLength: 2
  })
  @IsString({ message: 'Tên nhân viên phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Tên nhân viên phải có ít nhất 2 ký tự' })
  name: string;

  @ApiProperty({
    description: 'Chức vụ hoặc vị trí công việc của nhân viên',
    example: 'Công chứng viên',
    type: String,
    minLength: 2
  })
  @IsString({ message: 'Chức vụ phải là chuỗi ký tự' })
  @MinLength(2, { message: 'Chức vụ phải có ít nhất 2 ký tự' })
  position: string;

  @ApiProperty({
    description: 'Địa chỉ email công việc của nhân viên',
    example: 'nguyenvanan@vinhxuan.com',
    type: String,
    format: 'email'
  })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({
    description: 'Số điện thoại liên lạc của nhân viên (định dạng Việt Nam)',
    example: '0901234567',
    type: String,
    pattern: '^(0|\\+84)[0-9]{9}$'
  })
  @IsString({ message: 'Số điện thoại phải là chuỗi ký tự' })
  @Matches(/^(0|\+84)[0-9]{9}$/, { message: 'Số điện thoại không hợp lệ (phải là số Việt Nam 10 chữ số)' })
  phone: string;

  @ApiPropertyOptional({
    description: 'Số năm kinh nghiệm làm việc trong lĩnh vực',
    example: 5,
    type: Number,
    minimum: 0,
    default: 0
  })
  @IsOptional()
  @IsInt({ message: 'Số năm kinh nghiệm phải là số nguyên' })
  @Min(0, { message: 'Số năm kinh nghiệm không thể nhỏ hơn 0' })
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    description: 'Ngày sinh của nhân viên (định dạng ISO 8601: YYYY-MM-DD)',
    example: '1990-05-15',
    type: String,
    format: 'date'
  })
  @IsOptional()
  @IsDateString({}, { message: 'Ngày sinh phải có định dạng hợp lệ (YYYY-MM-DD)' })
  dateOfBirth?: string | Date;

  @ApiPropertyOptional({
    description: 'Trạng thái làm việc của nhân viên',
    enum: EmployeeStatus,
    example: EmployeeStatus.WORKING,
    default: EmployeeStatus.WORKING,
    enumName: 'EmployeeStatus'
  })
  @IsOptional()
  @IsEnum(EmployeeStatus, { message: 'Trạng thái nhân viên không hợp lệ' })
  status?: EmployeeStatus;
}
