import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/email-campaign.entity';

export class CreateEmailCampaignDto {
  @ApiProperty({
    description: 'Tiêu đề chiến dịch email marketing',
    example: 'Chiến dịch chúc mừng sinh nhật khách hàng 2025',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description:
      'Loại sự kiện: BIRTHDAY (Sinh nhật), HOLIDAY (Ngày lễ), ANNIVERSARY (Kỷ niệm), OTHER (Khác)',
    enum: EventType,
    example: EventType.BIRTHDAY,
  })
  @IsNotEmpty()
  @IsEnum(EventType)
  eventType: EventType;

  @ApiProperty({
    description: 'Tiêu đề email',
    example: 'Chúc mừng sinh nhật! Vinh Xuân gửi tặng bạn ưu đãi đặc biệt',
  })
  @IsNotEmpty()
  @IsString()
  subject: string;

  @ApiProperty({
    description:
      'Nội dung email template. Hỗ trợ biến: {{name}} (tên khách hàng), {{date}} (ngày sinh nhật), {{email}}, {{phone}}',
    example:
      'Kính gửi {{name}},\n\nNhân dịp sinh nhật {{date}}, Vinh Xuân xin gửi lời chúc mừng nồng nhiệt nhất!\n\nChúng tôi xin tặng bạn mã giảm giá 10% cho dịch vụ công chứng.\n\nTrân trọng,\nVinh Xuân Legal Services',
  })
  @IsNotEmpty()
  @IsString()
  template: string;

  @ApiPropertyOptional({
    description:
      'Cấu hình lịch gửi email (JSON). Bao gồm: type (daily/weekly/monthly/once), date (ngày cụ thể), time (giờ gửi)',
    example: {
      type: 'monthly',
      dayOfMonth: 1,
      time: '09:00',
      timezone: 'Asia/Ho_Chi_Minh',
    },
  })
  @IsOptional()
  @IsObject()
  schedule?: any;

  @ApiPropertyOptional({
    description:
      'Tiêu chí người nhận (JSON). Lọc theo: roles (vai trò), dateOfBirth (sinh nhật), customerType (loại khách hàng)',
    example: {
      roles: ['CUSTOMER'],
      hasBirthday: true,
      isActive: true,
    },
  })
  @IsOptional()
  @IsObject()
  recipientCriteria?: any;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động (true = Đang chạy, false = Tạm dừng)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
