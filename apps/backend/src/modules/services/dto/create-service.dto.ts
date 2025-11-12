import { IsString, IsNumber, IsUUID, IsOptional, IsBoolean, MinLength, Min, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({
    description: 'Tên dịch vụ công chứng',
    example: 'Công chứng hợp đồng mua bán nhà đất',
    type: String,
    minLength: 3
  })
  @IsString({ message: 'Tên dịch vụ phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Tên dịch vụ phải có ít nhất 3 ký tự' })
  name: string;

  @ApiProperty({
    description: 'Đường dẫn URL thân thiện (slug) cho dịch vụ, chỉ chứa chữ cái thường, số và dấu gạch ngang',
    example: 'cong-chung-hop-dong-mua-ban-nha-dat',
    type: String,
    minLength: 3,
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  })
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @MinLength(3, { message: 'Slug phải có ít nhất 3 ký tự' })
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: 'Slug chỉ được chứa chữ cái thường, số và dấu gạch ngang' })
  slug: string;

  @ApiProperty({
    description: 'Mô tả chi tiết về dịch vụ công chứng, bao gồm thông tin về quy trình, yêu cầu hồ sơ và thời gian xử lý',
    example: 'Dịch vụ công chứng hợp đồng mua bán nhà đất bao gồm kiểm tra hồ sơ pháp lý, soạn thảo hợp đồng và thực hiện công chứng theo quy định của pháp luật.',
    type: String
  })
  @IsString({ message: 'Mô tả dịch vụ phải là chuỗi ký tự' })
  description: string;

  @ApiProperty({
    description: 'Giá cơ bản của dịch vụ tính bằng VNĐ (không bao gồm các phí phụ thu)',
    example: 500000,
    type: Number,
    minimum: 0
  })
  @IsNumber({}, { message: 'Giá dịch vụ phải là số' })
  @Min(0, { message: 'Giá dịch vụ không thể nhỏ hơn 0' })
  price: number;

  @ApiPropertyOptional({
    description: 'ID của thể loại dịch vụ (nếu có phân loại)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    format: 'uuid'
  })
  @IsOptional()
  @IsUUID('4', { message: 'Category ID phải là UUID hợp lệ' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của dịch vụ (true = đang hoạt động, false = tạm ngưng)',
    example: true,
    type: Boolean,
    default: true
  })
  @IsOptional()
  @IsBoolean({ message: 'Trạng thái phải là giá trị boolean' })
  status?: boolean;
}
