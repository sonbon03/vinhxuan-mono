import { IsOptional, IsString, IsUUID, IsDateString, MinLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateConsultationDto {
  @ApiPropertyOptional({
    description: 'ID dịch vụ cần tư vấn',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID dịch vụ không hợp lệ' })
  serviceId?: string;

  @ApiPropertyOptional({
    description: 'ID nhân viên được giao xử lý lịch tư vấn này',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID nhân viên không hợp lệ' })
  staffId?: string;

  @ApiPropertyOptional({
    description: 'Thời gian tư vấn mới (ISO 8601 format)',
    example: '2025-11-16T14:00:00.000Z',
  })
  @IsOptional()
  @IsDateString({}, { message: 'Thời gian không đúng định dạng ISO 8601' })
  requestedDatetime?: string;

  @ApiPropertyOptional({
    description: 'Cập nhật nội dung cần tư vấn',
    example: 'Tôi muốn tư vấn thêm về chi phí công chứng và thời gian hoàn thành hồ sơ.',
    minLength: 20,
  })
  @IsOptional()
  @IsString({ message: 'Nội dung tư vấn phải là chuỗi ký tự' })
  @MinLength(20, { message: 'Nội dung tư vấn phải có ít nhất 20 ký tự' })
  content?: string;

  @ApiPropertyOptional({
    description: 'Ghi chú của nhân viên (thông tin bổ sung, kết quả tư vấn)',
    example: 'Đã tư vấn chi tiết cho khách hàng về quy trình và chi phí. Khách hàng đồng ý tiếp tục.',
    minLength: 10,
  })
  @IsOptional()
  @IsString({ message: 'Ghi chú phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Ghi chú phải có ít nhất 10 ký tự' })
  notes?: string;
}
