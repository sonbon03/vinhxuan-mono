import { IsOptional, IsString, IsBoolean, IsInt, Min, IsEnum, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CalculationMethod } from '../entities/fee-type.entity';

export class QueryFeeTypesDto {
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
    description: 'Tìm kiếm theo tên loại phí',
    example: 'phí công chứng',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID nhóm giấy tờ',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  documentGroupId?: string;

  @ApiPropertyOptional({
    description:
      'Lọc theo phương thức tính phí: FIXED, PERCENT, VALUE_BASED, TIERED, FORMULA',
    enum: CalculationMethod,
    example: CalculationMethod.TIERED,
  })
  @IsOptional()
  @IsEnum(CalculationMethod)
  calculationMethod?: CalculationMethod;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái (true = Hoạt động, false = Tạm ngưng)',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({
    description: 'Trường sắp xếp',
    enum: ['createdAt', 'name'],
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
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
