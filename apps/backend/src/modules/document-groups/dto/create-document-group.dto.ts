import { IsString, IsOptional, IsBoolean, MinLength, IsObject } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FormFieldsSchema } from '../entities/document-group.entity';

export class CreateDocumentGroupDto {
  @ApiProperty({
    description: 'Tên nhóm giấy tờ công chứng',
    example: 'Hợp đồng mua bán nhà đất',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    description: 'Đường dẫn thân thiện URL (không dấu, chữ thường, gạch nối)',
    example: 'hop-dong-mua-ban-nha-dat',
  })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiPropertyOptional({
    description: 'Mô tả chi tiết về nhóm giấy tờ công chứng này',
    example: 'Các giấy tờ liên quan đến mua bán, chuyển nhượng bất động sản',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    description:
      'Cấu hình form nhập liệu động (JSON). Định nghĩa các trường cần thiết để tính phí cho nhóm giấy tờ này.',
    example: {
      fields: [
        {
          name: 'property_value',
          label: 'Giá trị tài sản (VNĐ)',
          type: 'number',
          required: true,
          min: 0,
          placeholder: 'Nhập giá trị tài sản',
        },
        {
          name: 'property_type',
          label: 'Loại tài sản',
          type: 'select',
          required: true,
          options: ['Nhà', 'Đất', 'Nhà và đất', 'Chung cư'],
          placeholder: 'Chọn loại tài sản',
        },
        {
          name: 'area',
          label: 'Diện tích (m²)',
          type: 'number',
          required: false,
          min: 0,
        },
        {
          name: 'num_parties',
          label: 'Số bên tham gia',
          type: 'number',
          required: true,
          min: 1,
          default: 2,
        },
        {
          name: 'num_copies',
          label: 'Số bản sao công chứng',
          type: 'number',
          required: true,
          min: 1,
          default: 1,
        },
      ],
    },
  })
  @IsOptional()
  @IsObject()
  formFields?: FormFieldsSchema;

  @ApiPropertyOptional({
    description: 'Trạng thái hoạt động của nhóm giấy tờ (true = Hoạt động, false = Tạm ngưng)',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
