import { IsOptional, IsEnum, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { EventType } from '../entities/email-campaign.entity';

export class QueryEmailCampaignsDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    default: 1,
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi trên mỗi trang',
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tiêu đề chiến dịch',
    example: 'sinh nhật',
  })
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo loại sự kiện: BIRTHDAY, HOLIDAY, ANNIVERSARY, OTHER',
    enum: EventType,
    example: EventType.BIRTHDAY,
  })
  @IsOptional()
  @IsEnum(EventType)
  eventType?: EventType;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái (true = Đang chạy, false = Tạm dừng)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Trường sắp xếp',
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (ASC = Tăng dần, DESC = Giảm dần)',
    enum: ['ASC', 'DESC'],
    default: 'DESC',
    example: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
