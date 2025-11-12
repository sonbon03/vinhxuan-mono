import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article, ArticleStatus, ArticleType } from './entities/article.entity';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { UserRole } from '@shared';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private readonly articleRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto, authorId: string): Promise<Article> {
    // Check slug uniqueness
    const existingArticle = await this.articleRepository.findOne({
      where: { slug: createArticleDto.slug },
    });

    if (existingArticle) {
      throw new ConflictException('Slug đã tồn tại');
    }

    const article = this.articleRepository.create({
      ...createArticleDto,
      authorId,
      status: ArticleStatus.DRAFT, // Always create as DRAFT
    });

    return await this.articleRepository.save(article);
  }

  async findAll(queryDto: QueryArticlesDto, userRole?: UserRole) {
    const {
      page = 1,
      limit = 20,
      search,
      authorId,
      categoryId,
      status,
      type,
      isCrawled,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.articleRepository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.author', 'author')
      .leftJoinAndSelect('article.category', 'category')
      .leftJoinAndSelect('article.approver', 'approver');

    // Public users can only see PUBLISHED articles (not HIDDEN or INTERNAL)
    if (!userRole || userRole === UserRole.CUSTOMER) {
      query.andWhere('article.status = :status', { status: ArticleStatus.PUBLISHED });
      query.andWhere('article.type != :internalType', { internalType: ArticleType.INTERNAL });
    }

    // Apply filters
    if (search) {
      query.andWhere('article.title ILIKE :search', { search: `%${search}%` });
    }

    if (authorId) {
      query.andWhere('article.authorId = :authorId', { authorId });
    }

    if (categoryId) {
      query.andWhere('article.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      query.andWhere('article.status = :status', { status });
    }

    if (type) {
      query.andWhere('article.type = :type', { type });
    }

    if (isCrawled !== undefined) {
      query.andWhere('article.isCrawled = :isCrawled', { isCrawled });
    }

    // Sorting
    query.orderBy(`article.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userRole?: UserRole): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'approver'],
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Public users can only see PUBLISHED articles
    if (!userRole || userRole === UserRole.CUSTOMER) {
      if (article.status !== ArticleStatus.PUBLISHED || article.type === ArticleType.INTERNAL) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
    }

    return article;
  }

  async findBySlug(slug: string, userRole?: UserRole): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { slug },
      relations: ['author', 'category', 'approver'],
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Public users can only see PUBLISHED articles
    if (!userRole || userRole === UserRole.CUSTOMER) {
      if (article.status !== ArticleStatus.PUBLISHED || article.type === ArticleType.INTERNAL) {
        throw new ForbiddenException('Bạn không có quyền xem bài viết này');
      }
    }

    return article;
  }

  async update(
    id: string,
    updateArticleDto: UpdateArticleDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Staff can only edit their own DRAFT articles
    if (userRole === UserRole.STAFF) {
      if (article.authorId !== userId) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa bài viết này');
      }
      if (article.status !== ArticleStatus.DRAFT) {
        throw new ForbiddenException('Chỉ có thể chỉnh sửa bài viết ở trạng thái DRAFT');
      }
      // Staff cannot change status
      delete updateArticleDto.status;
    }

    // Check slug uniqueness if changing slug
    if (updateArticleDto.slug && updateArticleDto.slug !== article.slug) {
      const existingArticle = await this.articleRepository.findOne({
        where: { slug: updateArticleDto.slug },
      });

      if (existingArticle) {
        throw new ConflictException('Slug đã tồn tại');
      }
    }

    Object.assign(article, updateArticleDto);
    return await this.articleRepository.save(article);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    // Staff can only delete their own DRAFT articles
    if (userRole === UserRole.STAFF) {
      if (article.authorId !== userId) {
        throw new ForbiddenException('Bạn không có quyền xóa bài viết này');
      }
      if (article.status !== ArticleStatus.DRAFT) {
        throw new ForbiddenException('Chỉ có thể xóa bài viết ở trạng thái DRAFT');
      }
    }

    await this.articleRepository.remove(article);
  }

  async publish(id: string, approverId: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    article.status = ArticleStatus.PUBLISHED;
    article.approverId = approverId;
    article.publishedAt = new Date();

    return await this.articleRepository.save(article);
  }

  async archive(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    article.status = ArticleStatus.ARCHIVED;
    return await this.articleRepository.save(article);
  }

  async toggleHidden(id: string): Promise<Article> {
    const article = await this.articleRepository.findOne({
      where: { id },
    });

    if (!article) {
      throw new NotFoundException('Không tìm thấy bài viết');
    }

    if (article.status === ArticleStatus.HIDDEN) {
      article.status = ArticleStatus.PUBLISHED;
    } else if (article.status === ArticleStatus.PUBLISHED) {
      article.status = ArticleStatus.HIDDEN;
    } else {
      throw new ForbiddenException('Chỉ có thể ẩn/hiện bài viết ở trạng thái PUBLISHED');
    }

    return await this.articleRepository.save(article);
  }
}
