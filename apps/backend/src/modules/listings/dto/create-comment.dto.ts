import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Nội dung bình luận',
    example: 'Căn hộ đẹp quá, có thể xem trực tiếp được không ạ?',
    minLength: 3,
    maxLength: 1000,
  })
  @IsString({ message: 'Nội dung bình luận phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  @MinLength(3, { message: 'Nội dung bình luận phải có ít nhất 3 ký tự' })
  @MaxLength(1000, { message: 'Nội dung bình luận không được vượt quá 1000 ký tự' })
  commentText: string;
}
