import { IsString, IsOptional, IsNumber, IsArray, IsEnum, IsBoolean, IsUUID, MinLength, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ListingStatus } from '../entities/listing.entity';

export class UpdateListingDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề tin rao',
    example: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1, TP.HCM (Cập nhật giá)',
    minLength: 10,
    maxLength: 255,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Nội dung mô tả chi tiết tin rao',
    example: 'Căn hộ mới, đầy đủ nội thất cao cấp, view sông tuyệt đẹp. Đã giảm giá còn 4.5 tỷ.',
    minLength: 20,
  })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  @MinLength(20, { message: 'Nội dung phải có ít nhất 20 ký tự' })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'Giá đề xuất (VNĐ)',
    example: 4500000000,
    minimum: 0,
  })
  @IsNumber({}, { message: 'Giá phải là số' })
  @Min(0, { message: 'Giá phải lớn hơn hoặc bằng 0' })
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'ID danh mục tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Danh sách URL hình ảnh tin rao',
    example: [
      'https://storage.example.com/listings/image1.jpg',
      'https://storage.example.com/listings/image2.jpg',
      'https://storage.example.com/listings/image3.jpg',
    ],
    type: [String],
    isArray: true,
  })
  @IsArray({ message: 'Danh sách hình ảnh phải là mảng' })
  @IsString({ each: true, message: 'Mỗi URL hình ảnh phải là chuỗi ký tự' })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({
    description: 'Trạng thái tin rao (PENDING: chờ duyệt, APPROVED: đã duyệt, REJECTED: từ chối)',
    enum: ListingStatus,
    enumName: 'ListingStatus',
    example: ListingStatus.APPROVED,
  })
  @IsEnum(ListingStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: ListingStatus;

  @ApiPropertyOptional({
    description: 'Ẩn/hiện tin rao (true: ẩn, false: hiện)',
    example: false,
  })
  @IsBoolean({ message: 'Trường isHidden phải là giá trị boolean' })
  @IsOptional()
  isHidden?: boolean;

  @ApiPropertyOptional({
    description: 'Ghi chú phê duyệt (lý do từ chối hoặc ghi chú khi duyệt)',
    example: 'Tin rao đã được duyệt, nội dung hợp lệ',
  })
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  approvalNotes?: string;
}
