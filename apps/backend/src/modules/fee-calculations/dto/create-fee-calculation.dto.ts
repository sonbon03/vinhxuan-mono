import { IsUUID, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFeeCalculationDto {
  @ApiProperty({
    description: 'ID nhóm giấy tờ công chứng',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  documentGroupId: string;

  @ApiProperty({
    description: 'ID loại phí áp dụng',
    example: '660e8400-e29b-41d4-a716-446655440111',
  })
  @IsUUID()
  feeTypeId: string;

  @ApiProperty({
    description:
      'Dữ liệu đầu vào từ form (JSON). Các trường tùy thuộc vào cấu hình form của nhóm giấy tờ. Ví dụ: giá trị tài sản, loại tài sản, số bản sao, số bên tham gia.',
    example: {
      property_value: 150000000,
      property_type: 'Nhà và đất',
      area: 80,
      num_copies: 2,
      num_parties: 2,
    },
  })
  @IsObject()
  inputData: Record<string, any>;
}
