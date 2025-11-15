import { IsString, IsNotEmpty, IsOptional, IsEnum, IsBoolean, IsUrl, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ArticleType } from '../entities/article.entity';
import { IsSourceUrlRequired } from '../validators/is-source-url-required.validator';

export class CreateArticleDto {
  @ApiProperty({
    description: 'Tiêu đề bài viết',
    example: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
    minLength: 10,
    maxLength: 255,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Tiêu đề không được để trống' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  title: string;

  @ApiProperty({
    description: 'Slug (URL thân thiện, duy nhất)',
    example: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Slug không được để trống' })
  @MinLength(5, { message: 'Slug phải có ít nhất 5 ký tự' })
  @MaxLength(255, { message: 'Slug không được vượt quá 255 ký tự' })
  slug: string;

  @ApiProperty({
    description: 'Nội dung bài viết (HTML)',
    example: '<h2>Giới thiệu</h2><p>Trong bài viết này, chúng tôi sẽ hướng dẫn chi tiết cách làm hợp đồng mua bán nhà đất...</p>',
    minLength: 50,
  })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  @IsNotEmpty({ message: 'Nội dung không được để trống' })
  @MinLength(50, { message: 'Nội dung phải có ít nhất 50 ký tự' })
  content: string;

  @ApiProperty({
    description: 'ID danh mục bài viết',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
  })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  @IsOptional()
  categoryId?: string;

  @ApiProperty({
    description: 'Loại bài viết',
    enum: ArticleType,
    enumName: 'ArticleType',
    example: ArticleType.NEWS,
    default: ArticleType.NEWS,
    required: false,
  })
  @IsEnum(ArticleType, { message: 'Loại bài viết không hợp lệ' })
  @IsOptional()
  type?: ArticleType;

  @ApiProperty({
    description: 'Bài viết được crawl từ nguồn ngoài (tự động lấy tin)',
    example: false,
    default: false,
    required: false,
  })
  @IsBoolean({ message: 'Trường isCrawled phải là giá trị boolean' })
  @IsOptional()
  isCrawled?: boolean;

  @ApiProperty({
    description: 'URL nguồn (bắt buộc khi loại bài viết là NEWS)',
    example: 'https://example.com/bai-viet-goc',
    required: false,
  })
  @IsUrl({}, { message: 'URL nguồn không hợp lệ' })
  @IsSourceUrlRequired()
  @IsOptional()
  sourceUrl?: string;

  @ApiProperty({
    description: 'URL ảnh thumbnail cho bài viết',
    example: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    required: false,
  })
  @IsUrl({}, { message: 'URL thumbnail không hợp lệ' })
  @IsOptional()
  thumbnail?: string;
}
