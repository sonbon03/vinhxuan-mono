import { IsOptional, IsString, IsEnum, IsObject, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/email-campaign.entity';

export class UpdateEmailCampaignDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề chiến dịch',
    example: 'Chiến dịch chúc mừng Tết Nguyên Đán 2025',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Loại sự kiện: BIRTHDAY, HOLIDAY, ANNIVERSARY, OTHER',
    enum: EventType,
    example: EventType.HOLIDAY,
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiPropertyOptional({
    description: 'Tiêu đề email',
    example: 'Chúc mừng năm mới! Ưu đãi đặc biệt từ Vinh Xuân',
  })
  @IsOptional()
  @IsString()
  subject?: string;

  @ApiPropertyOptional({
    description: 'Nội dung email template (hỗ trợ biến {{name}}, {{date}})',
    example: 'Kính gửi {{name}},\n\nChúc mừng năm mới! Vinh Xuân xin gửi lời chúc sức khỏe và thành công.',
  })
  @IsOptional()
  @IsString()
  template?: string;

  @ApiPropertyOptional({
    description: 'Cấu hình lịch gửi email (JSON)',
    example: {
      type: 'once',
      date: '2025-01-01',
      time: '08:00',
    },
  })
  @IsOptional()
  @IsObject()
  schedule?: any;

  @ApiPropertyOptional({
    description: 'Tiêu chí người nhận (JSON)',
    example: {
      roles: ['CUSTOMER', 'STAFF'],
      isActive: true,
    },
  })
  @IsOptional()
  @IsObject()
  recipientCriteria?: any;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
