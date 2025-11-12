import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min, IsBoolean, IsNumber } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingStatus } from '../entities/listing.entity';

export class QueryListingsDto {
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
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tiêu đề tin rao',
    example: 'căn hộ quận 1',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID người đăng tin',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID người đăng không hợp lệ' })
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID danh mục',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái tin rao',
    enum: ListingStatus,
    enumName: 'ListingStatus',
    example: ListingStatus.APPROVED,
  })
  @IsOptional()
  @IsEnum(ListingStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ListingStatus;

  @ApiPropertyOptional({
    description: 'Lọc tin rao bị ẩn',
    example: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Trường isHidden phải là giá trị boolean' })
  isHidden?: boolean;

  @ApiPropertyOptional({
    description: 'Giá tối thiểu (VNĐ)',
    example: 1000000000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá tối thiểu phải là số' })
  @Min(0, { message: 'Giá tối thiểu phải lớn hơn hoặc bằng 0' })
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Giá tối đa (VNĐ)',
    example: 10000000000,
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'Giá tối đa phải là số' })
  @Min(0, { message: 'Giá tối đa phải lớn hơn hoặc bằng 0' })
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Sắp xếp theo trường (createdAt, updatedAt, title, price, likeCount)',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi ký tự' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (ASC: tăng dần, DESC: giảm dần)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Thứ tự sắp xếp phải là ASC hoặc DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
