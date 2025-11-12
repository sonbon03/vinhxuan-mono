import { IsOptional, IsString, IsEnum, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EmployeeStatus } from '../entities/employee.entity';

export class QueryEmployeesDto {
  @ApiPropertyOptional({
    description: 'Số trang hiện tại (bắt đầu từ 1)',
    example: 1,
    type: Number,
    minimum: 1,
    default: 1
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên mỗi trang',
    example: 20,
    type: Number,
    minimum: 1,
    default: 20
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên, email, số điện thoại hoặc chức vụ nhân viên',
    example: 'Nguyễn Văn',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái làm việc của nhân viên',
    enum: EmployeeStatus,
    example: EmployeeStatus.WORKING,
    enumName: 'EmployeeStatus'
  })
  @IsOptional()
  @IsEnum(EmployeeStatus, { message: 'Trạng thái nhân viên không hợp lệ' })
  status?: EmployeeStatus;

  @ApiPropertyOptional({
    description: 'Trường để sắp xếp kết quả',
    enum: ['createdAt', 'name', 'position', 'yearsOfExperience', 'dateOfBirth'],
    example: 'createdAt',
    default: 'createdAt'
  })
  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi ký tự' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (tăng dần hoặc giảm dần)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC'
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Thứ tự sắp xếp phải là ASC hoặc DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
