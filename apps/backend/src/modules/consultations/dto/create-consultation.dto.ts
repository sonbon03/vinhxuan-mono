import { IsNotEmpty, IsString, IsUUID, IsDateString, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateConsultationDto {
  @ApiPropertyOptional({
    description: 'ID dịch vụ cần tư vấn (tùy chọn)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID dịch vụ không hợp lệ' })
  serviceId?: string;

  @ApiProperty({
    description: 'Thời gian đề xuất tư vấn (ISO 8601 format)',
    example: '2025-11-15T10:00:00.000Z',
  })
  @IsNotEmpty({ message: 'Thời gian tư vấn không được để trống' })
  @IsDateString({}, { message: 'Thời gian không đúng định dạng ISO 8601' })
  requestedDatetime: string;

  @ApiProperty({
    description: 'Nội dung cần tư vấn',
    example: 'Tôi muốn tư vấn về thủ tục công chứng hợp đồng mua bán nhà đất. Hiện tại tôi đang có nhu cầu mua một căn nhà tại Quận 1 và cần biết các giấy tờ cần chuẩn bị.',
    minLength: 20,
  })
  @IsNotEmpty({ message: 'Nội dung tư vấn không được để trống' })
  @IsString({ message: 'Nội dung tư vấn phải là chuỗi ký tự' })
  @MinLength(20, { message: 'Nội dung tư vấn phải có ít nhất 20 ký tự' })
  content: string;
}
