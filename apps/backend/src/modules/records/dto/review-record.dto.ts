import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewRecordDto {
  @ApiProperty({
    description: 'Ghi chú của người duyệt (lý do duyệt hoặc từ chối)',
    example: 'Hồ sơ hợp lệ, đã duyệt và chuyển sang bước tiếp theo.',
    minLength: 10,
    required: false,
  })
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @IsOptional()
  @MinLength(10, { message: 'Ghi chú phải có ít nhất 10 ký tự nếu được cung cấp' })
  reviewNotes?: string;
}
