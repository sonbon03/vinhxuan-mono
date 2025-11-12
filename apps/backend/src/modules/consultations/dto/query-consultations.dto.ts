import { IsOptional, IsEnum, IsUUID, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ConsultationStatus } from '../entities/consultation.entity';

export class QueryConsultationsDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi mỗi trang',
    example: 20,
    default: 20,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit phải là số nguyên' })
  @Min(1, { message: 'Limit phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tên khách hàng hoặc nội dung tư vấn',
    example: 'công chứng hợp đồng',
  })
  @IsOptional()
  @IsString({ message: 'Search phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID khách hàng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID khách hàng không hợp lệ' })
  customerId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID nhân viên phụ trách',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID nhân viên không hợp lệ' })
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID dịch vụ',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID dịch vụ không hợp lệ' })
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái lịch tư vấn',
    enum: ConsultationStatus,
    enumName: 'ConsultationStatus',
    example: ConsultationStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(ConsultationStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ConsultationStatus;

  @ApiPropertyOptional({
    description: 'Sắp xếp theo trường (createdAt, requestedDatetime, status)',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'SortBy phải là chuỗi ký tự' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (ASC: tăng dần, DESC: giảm dần)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'SortOrder phải là ASC hoặc DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
