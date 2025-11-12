import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateStatusDto {
  @ApiProperty({
    description: 'User account status',
    example: true,
    type: Boolean,
    enum: [true, false],
    enumName: 'UserStatus',
  })
  @IsBoolean({ message: 'Status must be a boolean value' })
  status: boolean;
}
