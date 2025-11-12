import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing, ListingStatus } from './entities/listing.entity';
import { ListingComment } from './entities/listing-comment.entity';
import { ListingLike } from './entities/listing-like.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { ReviewListingDto } from './dto/review-listing.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserRole } from '@shared';
import { ResponseUtil } from '../common/utils/response.util';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    @InjectRepository(ListingComment)
    private readonly commentRepository: Repository<ListingComment>,
    @InjectRepository(ListingLike)
    private readonly likeRepository: Repository<ListingLike>,
  ) {}

  async create(createListingDto: CreateListingDto, authorId: string): Promise<Listing> {
    const listing = this.listingRepository.create({
      ...createListingDto,
      authorId,
      status: ListingStatus.PENDING,
    });

    return await this.listingRepository.save(listing);
  }

  async findAll(queryDto: QueryListingsDto, userRole?: UserRole) {
    const {
      page = 1,
      limit = 20,
      search,
      authorId,
      categoryId,
      status,
      isHidden,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.author', 'author')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.approver', 'approver');

    // Public users can only see APPROVED and not hidden listings
    if (!userRole || userRole === UserRole.CUSTOMER) {
      query.andWhere('listing.status = :status', { status: ListingStatus.APPROVED });
      query.andWhere('listing.isHidden = :isHidden', { isHidden: false });
    }

    // Apply filters
    if (search) {
      query.andWhere('listing.title ILIKE :search', { search: `%${search}%` });
    }

    if (authorId) {
      query.andWhere('listing.authorId = :authorId', { authorId });
    }

    if (categoryId) {
      query.andWhere('listing.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      query.andWhere('listing.status = :status', { status });
    }

    if (isHidden !== undefined) {
      query.andWhere('listing.isHidden = :isHidden', { isHidden });
    }

    if (minPrice !== undefined) {
      query.andWhere('listing.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice });
    }

    // Sorting
    query.orderBy(`listing.${sortBy}`, sortOrder);

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

  async getMyListings(queryDto: QueryListingsDto, userId: string) {
    const {
      page = 1,
      limit = 20,
      search,
      categoryId,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.listingRepository
      .createQueryBuilder('listing')
      .leftJoinAndSelect('listing.category', 'category')
      .leftJoinAndSelect('listing.approver', 'approver')
      .where('listing.authorId = :userId', { userId });

    // Apply filters
    if (search) {
      query.andWhere('listing.title ILIKE :search', { search: `%${search}%` });
    }

    if (categoryId) {
      query.andWhere('listing.categoryId = :categoryId', { categoryId });
    }

    if (status) {
      query.andWhere('listing.status = :status', { status });
    }

    if (minPrice !== undefined) {
      query.andWhere('listing.price >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('listing.price <= :maxPrice', { maxPrice });
    }

    // Sorting
    query.orderBy(`listing.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return ResponseUtil.paginated(
      items,
      total,
      page,
      limit,
      'Lấy danh sách tin rao của bạn thành công',
    );
  }

  async findOne(id: string, userRole?: UserRole): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
      relations: ['author', 'category', 'approver'],
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    // Public users can only see APPROVED and not hidden listings
    if (!userRole || userRole === UserRole.CUSTOMER) {
      if (listing.status !== ListingStatus.APPROVED || listing.isHidden) {
        throw new ForbiddenException('Bạn không có quyền xem tin rao này');
      }
    }

    return listing;
  }

  async update(
    id: string,
    updateListingDto: UpdateListingDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    // Customers can only edit their own listings
    if (userRole === UserRole.CUSTOMER && listing.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền chỉnh sửa tin rao này');
    }

    // Customers cannot change status, isHidden, or approvalNotes
    if (userRole === UserRole.CUSTOMER) {
      delete updateListingDto.status;
      delete updateListingDto.isHidden;
      delete updateListingDto.approvalNotes;
    }

    Object.assign(listing, updateListingDto);
    return await this.listingRepository.save(listing);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const listing = await this.listingRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    // Customers can only delete their own listings
    if (userRole === UserRole.CUSTOMER && listing.authorId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa tin rao này');
    }

    await this.listingRepository.remove(listing);
  }

  async approve(id: string, reviewDto: ReviewListingDto, approverId: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    listing.status = ListingStatus.APPROVED;
    listing.approverId = approverId;
    if (reviewDto.approvalNotes) {
      listing.approvalNotes = reviewDto.approvalNotes;
    }

    return await this.listingRepository.save(listing);
  }

  async reject(id: string, reviewDto: ReviewListingDto, approverId: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    listing.status = ListingStatus.REJECTED;
    listing.approverId = approverId;
    if (reviewDto.approvalNotes) {
      listing.approvalNotes = reviewDto.approvalNotes;
    }

    return await this.listingRepository.save(listing);
  }

  async toggleHidden(id: string): Promise<Listing> {
    const listing = await this.listingRepository.findOne({
      where: { id },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao');
    }

    listing.isHidden = !listing.isHidden;
    return await this.listingRepository.save(listing);
  }

  // Comments
  async addComment(listingId: string, createCommentDto: CreateCommentDto, userId: string): Promise<ListingComment> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, status: ListingStatus.APPROVED },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao hoặc tin rao chưa được duyệt');
    }

    const comment = this.commentRepository.create({
      listingId,
      userId,
      commentText: createCommentDto.commentText,
    });

    const savedComment = await this.commentRepository.save(comment);

    // Update comment count
    listing.commentCount += 1;
    await this.listingRepository.save(listing);

    return savedComment;
  }

  async getComments(listingId: string) {
    return await this.commentRepository.find({
      where: { listingId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async deleteComment(commentId: string, userId: string, userRole: UserRole): Promise<void> {
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
      relations: ['listing'],
    });

    if (!comment) {
      throw new NotFoundException('Không tìm thấy bình luận');
    }

    // Users can only delete their own comments, Admin can delete any
    if (userRole !== UserRole.ADMIN && comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    await this.commentRepository.remove(comment);

    // Update comment count
    const listing = await this.listingRepository.findOne({
      where: { id: comment.listingId },
    });
    if (listing && listing.commentCount > 0) {
      listing.commentCount -= 1;
      await this.listingRepository.save(listing);
    }
  }

  // Likes
  async toggleLike(listingId: string, userId: string): Promise<{ liked: boolean; likeCount: number }> {
    const listing = await this.listingRepository.findOne({
      where: { id: listingId, status: ListingStatus.APPROVED },
    });

    if (!listing) {
      throw new NotFoundException('Không tìm thấy tin rao hoặc tin rao chưa được duyệt');
    }

    const existingLike = await this.likeRepository.findOne({
      where: { listingId, userId },
    });

    if (existingLike) {
      // Unlike
      await this.likeRepository.remove(existingLike);
      listing.likeCount = Math.max(0, listing.likeCount - 1);
      await this.listingRepository.save(listing);
      return { liked: false, likeCount: listing.likeCount };
    } else {
      // Like
      const like = this.likeRepository.create({
        listingId,
        userId,
      });
      await this.likeRepository.save(like);
      listing.likeCount += 1;
      await this.listingRepository.save(listing);
      return { liked: true, likeCount: listing.likeCount };
    }
  }

  async checkUserLiked(listingId: string, userId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { listingId, userId },
    });
    return !!like;
  }
}
