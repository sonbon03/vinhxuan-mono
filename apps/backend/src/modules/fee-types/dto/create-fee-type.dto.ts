import { IsString, IsUUID, IsOptional, IsEnum, IsNumber, IsBoolean, IsObject, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CalculationMethod, FormulaSchema } from '../entities/fee-type.entity';

export class CreateFeeTypeDto {
  @ApiProperty({
    description: 'ID của nhóm giấy tờ áp dụng loại phí này',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  documentGroupId: string;

  @ApiProperty({
    description: 'Tên loại phí công chứng',
    example: 'Phí công chứng hợp đồng mua bán nhà đất dưới 100 triệu',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description:
      'Phương thức tính phí: FIXED (Cố định), PERCENT (Theo %), VALUE_BASED (Theo khoảng giá trị), TIERED (Bậc thang), FORMULA (Công thức tùy chỉnh)',
    enum: CalculationMethod,
    example: CalculationMethod.TIERED,
  })
  @IsEnum(CalculationMethod)
  calculationMethod: CalculationMethod;

  @ApiPropertyOptional({
    description:
      'Cấu hình công thức tính phí phức tạp (JSON). Dùng cho phương thức TIERED (bậc thang) hoặc FORMULA (tùy chỉnh). Bao gồm: tiers (các bậc giá), additionalFees (phí phụ thu), customFormula (công thức JS).',
    example: {
      method: 'TIERED',
      tiers: [
        {
          from: 0,
          to: 100000000,
          rate: 0.015,
          description: '0.15% cho giá trị từ 0 đến 100 triệu VNĐ',
        },
        {
          from: 100000000,
          to: 500000000,
          rate: 0.01,
          description: '0.1% cho giá trị từ 100 đến 500 triệu VNĐ',
        },
        {
          from: 500000000,
          to: null,
          rate: 0.005,
          description: '0.05% cho giá trị trên 500 triệu VNĐ',
        },
      ],
      additionalFees: [
        {
          name: 'copy_fee',
          amount: 50000,
          perUnit: true,
          description: '50.000 VNĐ cho mỗi bản sao công chứng',
        },
        {
          name: 'notarization_fee',
          amount: 20000,
          perUnit: false,
          description: 'Phí công chứng cố định 20.000 VNĐ',
        },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  formula?: FormulaSchema;

  @ApiPropertyOptional({
    description: 'Phí cơ bản cố định (VNĐ). Áp dụng cho phương thức FIXED.',
    example: 500000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseFee?: number;

  @ApiPropertyOptional({
    description: 'Tỷ lệ phần trăm (dạng thập phân: 0.015 = 1.5%). Áp dụng cho phương thức PERCENT.',
    example: 0.015,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  percentage?: number;

  @ApiPropertyOptional({
    description: 'Phí tối thiểu (VNĐ). Đảm bảo phí tính ra không thấp hơn giá trị này.',
    example: 100000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minFee?: number;

  @ApiPropertyOptional({
    description: 'Phí tối đa (VNĐ). Giới hạn phí tính ra không cao hơn giá trị này.',
    example: 10000000,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxFee?: number;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của loại phí (true = Hoạt động, false = Tạm ngưng)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
