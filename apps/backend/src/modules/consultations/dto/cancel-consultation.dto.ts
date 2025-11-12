import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CancelConsultationDto {
  @ApiProperty({
    description: 'Lý do hủy lịch tư vấn (bắt buộc)',
    example: 'Khách hàng yêu cầu hủy lịch do bận công việc đột xuất. Sẽ đặt lại lịch sau.',
    minLength: 15,
  })
  @IsNotEmpty({ message: 'Lý do hủy không được để trống' })
  @IsString({ message: 'Lý do hủy phải là chuỗi ký tự' })
  @MinLength(15, { message: 'Lý do hủy phải có ít nhất 15 ký tự' })
  cancelReason: string;
}
