import { IsString, IsOptional, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ReviewListingDto {
  @ApiPropertyOptional({
    description: 'Ghi chú phê duyệt (lý do từ chối hoặc ghi chú khi duyệt)',
    example: 'Tin rao đã được duyệt, nội dung và hình ảnh hợp lệ',
    minLength: 5,
  })
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MinLength(5, { message: 'Ghi chú phải có ít nhất 5 ký tự' })
  @IsOptional()
  approvalNotes?: string;
}
