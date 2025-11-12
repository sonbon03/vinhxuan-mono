import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus } from '../entities/record.entity';

export class QueryRecordsDto {
  @ApiProperty({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    default: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiProperty({
    description: 'Số lượng bản ghi mỗi trang',
    example: 20,
    default: 20,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @ApiProperty({
    description: 'Tìm kiếm theo tiêu đề hoặc mô tả hồ sơ',
    example: 'hợp đồng mua bán',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'Search phải là chuỗi ký tự' })
  search?: string;

  @ApiProperty({
    description: 'Lọc theo ID khách hàng (Customer)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID khách hàng không hợp lệ' })
  customerId?: string;

  @ApiProperty({
    description: 'Lọc theo ID loại hồ sơ (Category/Type)',
    example: '550e8400-e29b-41d4-a716-446655440001',
    required: false,
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID loại hồ sơ không hợp lệ' })
  typeId?: string;

  @ApiProperty({
    description: 'Lọc theo trạng thái hồ sơ',
    enum: RecordStatus,
    enumName: 'RecordStatus',
    example: RecordStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecordStatus, { message: 'Trạng thái không hợp lệ' })
  status?: RecordStatus;

  @ApiProperty({
    description: 'Sắp xếp theo trường (createdAt, updatedAt, title, status)',
    example: 'createdAt',
    default: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString({ message: 'SortBy phải là chuỗi ký tự' })
  sortBy?: string = 'createdAt';

  @ApiProperty({
    description: 'Thứ tự sắp xếp (ASC: tăng dần, DESC: giảm dần)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
    required: false,
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'SortOrder phải là ASC hoặc DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
