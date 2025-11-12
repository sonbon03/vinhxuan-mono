import { IsString, IsUUID, IsNotEmpty, IsOptional, IsArray, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRecordDto {
  @ApiProperty({
    description: 'ID loại hồ sơ (Category ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID loại hồ sơ không hợp lệ' })
  @IsNotEmpty({ message: 'ID loại hồ sơ không được để trống' })
  typeId: string;

  @ApiProperty({
    description: 'Tiêu đề hồ sơ',
    example: 'Hồ sơ công chứng hợp đồng mua bán nhà đất tại Quận 1',
    minLength: 10,
    maxLength: 255,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title: string;

  @ApiProperty({
    description: 'Mô tả chi tiết nội dung hồ sơ',
    example: 'Hồ sơ gồm: hợp đồng mua bán, sổ đỏ, CMND/CCCD các bên, giấy tờ liên quan khác...',
    required: false,
    minLength: 20,
  })
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @IsOptional()
  @MinLength(20, { message: 'Mô tả phải có ít nhất 20 ký tự' })
  description?: string;

  @ApiProperty({
    description: 'Danh sách URL file đính kèm (hình ảnh, PDF, tài liệu)',
    example: [
      'https://storage.example.com/files/hop-dong-mua-ban.pdf',
      'https://storage.example.com/files/so-do-nha-dat.jpg',
    ],
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Attachments phải là mảng' })
  @IsOptional()
  attachments?: string[];
}
