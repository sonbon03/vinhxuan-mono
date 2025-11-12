import { IsNotEmpty, IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiPropertyOptional({
    description:
      'ID phiên chat (UUID). Nếu không cung cấp, hệ thống sẽ tự động tạo phiên mới. Sử dụng cùng sessionId để tiếp tục cuộc hội thoại.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  sessionId?: string;

  @ApiProperty({
    description: 'Nội dung tin nhắn của người dùng',
    example: 'Tôi muốn biết thêm thông tin về dịch vụ công chứng hợp đồng mua bán nhà đất',
  })
  @IsNotEmpty()
  @IsString()
  messageText: string;
}
