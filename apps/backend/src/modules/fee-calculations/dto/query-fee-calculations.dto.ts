import { IsOptional, IsInt, Min, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryFeeCalculationsDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    minimum: 1,
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
    minimum: 1,
    default: 20,
    example: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Lọc theo ID người dùng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID nhóm giấy tờ',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  documentGroupId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID loại phí',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsOptional()
  @IsUUID()
  feeTypeId?: string;

  @ApiPropertyOptional({
    description: 'Trường sắp xếp',
    enum: ['createdAt', 'totalFee'],
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
