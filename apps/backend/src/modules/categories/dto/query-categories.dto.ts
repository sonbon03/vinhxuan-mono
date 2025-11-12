import { IsOptional, IsString, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ModuleType } from '../entities/category.entity';

export class QueryCategoriesDto {
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
    description: 'Tìm kiếm theo tên thể loại hoặc slug',
    example: 'công chứng',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo loại module mà thể loại áp dụng',
    enum: ModuleType,
    example: ModuleType.SERVICE,
    enumName: 'ModuleType'
  })
  @IsOptional()
  @IsEnum(ModuleType, { message: 'Loại module không hợp lệ' })
  moduleType?: ModuleType;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái hoạt động của thể loại',
    example: true,
    type: Boolean
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: 'Trạng thái phải là giá trị boolean' })
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Trường để sắp xếp kết quả',
    enum: ['createdAt', 'name', 'slug'],
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
