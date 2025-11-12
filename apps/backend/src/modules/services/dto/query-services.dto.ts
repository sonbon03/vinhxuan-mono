import { IsOptional, IsString, IsBoolean, IsInt, Min, IsUUID, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryServicesDto {
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
    description: 'Tìm kiếm theo tên dịch vụ, slug hoặc mô tả',
    example: 'công chứng hợp đồng',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID thể loại dịch vụ',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID('4', { message: 'Category ID phải là UUID hợp lệ' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái hoạt động của dịch vụ',
    example: true,
    type: Boolean
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Trạng thái phải là giá trị boolean' })
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Trường để sắp xếp kết quả',
    enum: ['createdAt', 'name', 'price'],
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
