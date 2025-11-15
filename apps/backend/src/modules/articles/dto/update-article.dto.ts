import { IsString, IsOptional, IsEnum, IsBoolean, IsUrl, IsUUID, MinLength, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleType, ArticleStatus } from '../entities/article.entity';

export class UpdateArticleDto {
  @ApiPropertyOptional({
    description: 'Tiêu đề bài viết',
    example: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025 (Cập nhật)',
    minLength: 10,
    maxLength: 255,
  })
  @IsString({ message: 'Tiêu đề phải là chuỗi ký tự' })
  @MinLength(10, { message: 'Tiêu đề phải có ít nhất 10 ký tự' })
  @MaxLength(255, { message: 'Tiêu đề không được vượt quá 255 ký tự' })
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({
    description: 'Slug (URL thân thiện, duy nhất)',
    example: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025-cap-nhat',
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: 'Slug phải là chuỗi ký tự' })
  @MinLength(5, { message: 'Slug phải có ít nhất 5 ký tự' })
  @MaxLength(255, { message: 'Slug không được vượt quá 255 ký tự' })
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Nội dung bài viết (HTML)',
    example: '<h2>Cập nhật mới</h2><p>Thông tin đã được cập nhật với các quy định mới nhất...</p>',
    minLength: 50,
  })
  @IsString({ message: 'Nội dung phải là chuỗi ký tự' })
  @MinLength(50, { message: 'Nội dung phải có ít nhất 50 ký tự' })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({
    description: 'ID danh mục bài viết',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Loại bài viết',
    enum: ArticleType,
    enumName: 'ArticleType',
    example: ArticleType.NEWS,
  })
  @IsEnum(ArticleType, { message: 'Loại bài viết không hợp lệ' })
  @IsOptional()
  type?: ArticleType;

  @ApiPropertyOptional({
    description: 'Trạng thái bài viết (DRAFT: nháp, PUBLISHED: đã xuất bản, ARCHIVED: lưu trữ, HIDDEN: ẩn)',
    enum: ArticleStatus,
    enumName: 'ArticleStatus',
    example: ArticleStatus.PUBLISHED,
  })
  @IsEnum(ArticleStatus, { message: 'Trạng thái bài viết không hợp lệ' })
  @IsOptional()
  status?: ArticleStatus;

  @ApiPropertyOptional({
    description: 'URL nguồn (nếu bài viết được crawl từ nguồn ngoài)',
    example: 'https://example.com/bai-viet-goc-da-cap-nhat',
  })
  @IsUrl({}, { message: 'URL nguồn không hợp lệ' })
  @IsOptional()
  sourceUrl?: string;

  @ApiPropertyOptional({
    description: 'URL ảnh thumbnail cho bài viết',
    example: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
  })
  @IsUrl({}, { message: 'URL thumbnail không hợp lệ' })
  @IsOptional()
  thumbnail?: string;
}
