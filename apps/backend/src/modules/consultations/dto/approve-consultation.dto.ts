import { IsOptional, IsUUID, IsString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApproveConsultationDto {
  @ApiPropertyOptional({
    description: 'ID nhân viên được phân công xử lý lịch tư vấn này',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID nhân viên không hợp lệ' })
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú khi phê duyệt (xác nhận thông tin, thời gian, hoặc lưu ý đặc biệt)',
    example: 'Đã xác nhận lịch tư vấn với khách hàng. Nhân viên Nguyễn Văn A sẽ đảm nhận.',
    minLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Ghi chú phải có ít nhất 10 ký tự nếu được cung cấp' })
  notes?: string;
}
