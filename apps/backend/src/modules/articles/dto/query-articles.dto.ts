import { IsOptional, IsString, IsEnum, IsUUID, IsInt, Min, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArticleStatus, ArticleType } from '../entities/article.entity';

export class QueryArticlesDto {
  @ApiPropertyOptional({
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số trang phải là số nguyên' })
  @Min(1, { message: 'Số trang phải lớn hơn hoặc bằng 1' })
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Số lượng bản ghi mỗi trang',
    example: 20,
    default: 20,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Số lượng mỗi trang phải là số nguyên' })
  @Min(1, { message: 'Số lượng mỗi trang phải lớn hơn hoặc bằng 1' })
  limit?: number = 20;

  @ApiPropertyOptional({
    description: 'Tìm kiếm theo tiêu đề bài viết',
    example: 'hợp đồng mua bán',
  })
  @IsOptional()
  @IsString({ message: 'Từ khóa tìm kiếm phải là chuỗi ký tự' })
  search?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID tác giả',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID tác giả không hợp lệ' })
  authorId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo ID danh mục',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID('4', { message: 'ID danh mục không hợp lệ' })
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Lọc theo trạng thái bài viết',
    enum: ArticleStatus,
    enumName: 'ArticleStatus',
    example: ArticleStatus.PUBLISHED,
  })
  @IsOptional()
  @IsEnum(ArticleStatus, { message: 'Trạng thái không hợp lệ' })
  status?: ArticleStatus;

  @ApiPropertyOptional({
    description: 'Lọc theo loại bài viết',
    enum: ArticleType,
    enumName: 'ArticleType',
    example: ArticleType.NEWS,
  })
  @IsOptional()
  @IsEnum(ArticleType, { message: 'Loại bài viết không hợp lệ' })
  type?: ArticleType;

  @ApiPropertyOptional({
    description: 'Lọc bài viết được crawl từ nguồn ngoài',
    example: true,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean({ message: 'Trường isCrawled phải là giá trị boolean' })
  isCrawled?: boolean;

  @ApiPropertyOptional({
    description: 'Sắp xếp theo trường (createdAt, updatedAt, title, publishedAt)',
    example: 'createdAt',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: 'Trường sắp xếp phải là chuỗi ký tự' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    description: 'Thứ tự sắp xếp (ASC: tăng dần, DESC: giảm dần)',
    enum: ['ASC', 'DESC'],
    example: 'DESC',
    default: 'DESC',
  })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'], { message: 'Thứ tự sắp xếp phải là ASC hoặc DESC' })
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
