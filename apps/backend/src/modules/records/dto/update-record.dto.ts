import { IsString, IsUUID, IsOptional, IsArray, IsEnum, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { RecordStatus } from '../entities/record.entity';

export class UpdateRecordDto {
  @ApiProperty({
    description: 'ID loại hồ sơ (Category ID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID('4', { message: 'ID loại hồ sơ không hợp lệ' })
  @IsOptional()
  typeId?: string;

  @ApiProperty({
    description: 'Tiêu đề hồ sơ',
    example: 'Hồ sơ công chứng hợp đồng mua bán căn hộ chung cư tại Quận 7',
    minLength: 10,
    maxLength: 255,
    required: false,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsOptional()
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title?: string;

  @ApiProperty({
    description: 'Mô tả chi tiết nội dung hồ sơ',
    example: 'Cập nhật hồ sơ: bổ sung thêm giấy tờ chứng nhận quyền sở hữu và hợp đồng góp vốn...',
    minLength: 20,
    required: false,
  })
  @IsString({ message: 'Mô tả phải là chuỗi ký tự' })
  @IsOptional()
  @MinLength(20, { message: 'Mô tả phải có ít nhất 20 ký tự' })
  description?: string;

  @ApiProperty({
    description: 'Danh sách URL file đính kèm (hình ảnh, PDF, tài liệu)',
    example: [
      'https://storage.example.com/files/hop-dong-cap-nhat.pdf',
      'https://storage.example.com/files/chung-thu-quyen-so-huu.jpg',
    ],
    required: false,
    type: [String],
  })
  @IsArray({ message: 'Attachments phải là mảng' })
  @IsOptional()
  attachments?: string[];

  @ApiProperty({
    description: 'Trạng thái hồ sơ (chỉ Staff/Admin được phép thay đổi)',
    enum: RecordStatus,
    enumName: 'RecordStatus',
    example: RecordStatus.APPROVED,
    required: false,
  })
  @IsEnum(RecordStatus, { message: 'Trạng thái không hợp lệ' })
  @IsOptional()
  status?: RecordStatus;

  @ApiProperty({
    description: 'Ghi chú của người duyệt (Staff/Admin)',
    example: 'Hồ sơ hợp lệ, đã kiểm tra đầy đủ giấy tờ. Chấp thuận duyệt.',
    minLength: 10,
    required: false,
  })
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  @MinLength(10, { message: 'Ghi chú phải có ít nhất 10 ký tự' })
  reviewNotes?: string;
}
