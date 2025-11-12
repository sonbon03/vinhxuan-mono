import { IsOptional, IsDateString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum TimePeriod {
  DAY = 'day',
  MONTH = 'month',
  QUARTER = 'quarter',
  YEAR = 'year',
}

export class StatisticsQueryDto {
  @ApiPropertyOptional({
    description: 'Ngày bắt đầu (định dạng ISO: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc (định dạng ISO: YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({
    description:
      'Khoảng thời gian thống kê: DAY (Theo ngày), MONTH (Theo tháng), QUARTER (Theo quý), YEAR (Theo năm)',
    enum: TimePeriod,
    example: TimePeriod.MONTH,
  })
  @IsOptional()
  @IsEnum(TimePeriod)
  period?: TimePeriod;
}

export class DateRangeDto {
  @ApiPropertyOptional({
    description: 'Ngày bắt đầu (định dạng ISO: YYYY-MM-DD)',
    example: '2025-01-01',
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({
    description: 'Ngày kết thúc (định dạng ISO: YYYY-MM-DD)',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
