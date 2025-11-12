import { IsString, IsEnum, IsOptional, IsBoolean, MinLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ModuleType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Tên thể loại/danh mục',
    example: 'Dịch vụ công chứng',
    type: String,
    minLength: 3
  })
  @IsString({ message: 'Tên thể loại phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên thể loại phải có ít nhất 3 ký tự' })
  name: string;

  @ApiProperty({
    description: 'Đường dẫn URL thân thiện (slug), chỉ chứa chữ cái thường, số và dấu gạch ngang',
    example: 'dich-vu-cong-chung',
    type: String,
    minLength: 3,
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  })
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Slug phải có ít nhất 3 ký tự' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang' })
  slug: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết về thể loại',
    example: 'Thể loại dành cho các dịch vụ công chứng như hợp đồng mua bán, chuyển nhượng, tặng cho...',
    type: String
  })
  @IsOptional()
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  description?: string;

  @ApiProperty({
    description: 'Loại module áp dụng thể loại này (SERVICE: dịch vụ, ARTICLE: bài viết, LISTING: tin rao, RECORD: hồ sơ)',
    enum: ModuleType,
    example: ModuleType.SERVICE,
    default: ModuleType.SERVICE,
    enumName: 'ModuleType'
  })
  @IsEnum(ModuleType, { message: 'Loại module không hợp lệ' })
  moduleType: ModuleType;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của thể loại (true = đang hoạt động, false = tạm ngưng)',
    example: true,
    type: Boolean,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là giá trị boolean' })
  status?: boolean;
}
