import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsUUID, MinLength, MaxLength, Min, ArrayMinSize } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateListingDto {
  @ApiProperty({
    description: 'Tiêu đề tin rao',
    example: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1, TP.HCM',
    minLength: 10,
    maxLength: 255,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title: string;

  @ApiProperty({
    description: 'Nội dung mô tả chi tiết tin rao',
    example: 'Căn hộ mới, đầy đủ nội thất, view đẹp, gần trường học và siêu thị. Diện tích 85m2, 3 phòng ngủ, 2 phòng tắm. Giá: 5 tỷ đồng.',
    minLength: 20,
  })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @MinLength(20, { message: 'Nội dung phải có ít nhất 20 ký tự' })
  content: string;

  @ApiProperty({
    description: 'Giá đề xuất (VNĐ)',
    example: 5000000000,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  @IsOptional()
  price?: number;

  @ApiProperty({
    description: 'ID danh mục tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Danh sách URL hình ảnh tin rao',
    example: [
      'https://storage.example.com/listings/image1.jpg',
      'https://storage.example.com/listings/image2.jpg',
    ],
    type: [String],
    required: false,
    isArray: true,
  })
  @IsArray({ message: 'Danh sách hình ảnh phải là mảng' })
  @IsString({ each: true, message: 'Mỗi URL hình ảnh phải là chuỗi ký tự' })
  @IsOptional()
  images?: string[];
}
