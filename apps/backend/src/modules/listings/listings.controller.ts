import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { UpdateListingDto } from './dto/update-listing.dto';
import { QueryListingsDto } from './dto/query-listings.dto';
import { ReviewListingDto } from './dto/review-listing.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Listings - Quản lý Tin rao')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo tin rao mới',
    description: 'Khách hàng đăng tin rao bất động sản. Tin rao mới sẽ có trạng thái PENDING và cần được Staff/Admin duyệt trước khi hiển thị công khai.',
  })
  @ApiBody({
    type: CreateListingDto,
    description: 'Thông tin tin rao mới',
    examples: {
      example1: {
        summary: 'Tin rao căn hộ',
        value: {
          title: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1, TP.HCM',
          content: 'Căn hộ mới, đầy đủ nội thất, view đẹp, gần trường học và siêu thị. Diện tích 85m2, 3 phòng ngủ, 2 phòng tắm.',
          price: 5000000000,
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          images: [
            'https://storage.example.com/listings/living-room.jpg',
            'https://storage.example.com/listings/bedroom.jpg',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Tin rao đã được tạo thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo tin rao thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1, TP.HCM',
          status: 'PENDING',
          price: 5000000000,
          authorId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2025-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  create(@Body() createListingDto: CreateListingDto, @Req() req: any) {
    return this.listingsService.create(createListingDto, req.user.userId);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách tin rao',
    description: 'Lấy danh sách tin rao có phân trang và bộ lọc. Public chỉ xem được tin APPROVED và không bị ẩn. Staff/Admin xem được tất cả.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin rao',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách tin rao thành công',
        data: {
          items: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              title: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1',
              content: 'Căn hộ mới, đầy đủ nội thất...',
              price: 5000000000,
              status: 'APPROVED',
              author: { id: '...', fullName: 'Nguyễn Văn A' },
              likeCount: 15,
              commentCount: 8,
              createdAt: '2025-01-15T10:30:00.000Z',
            },
          ],
          total: 50,
          page: 1,
          limit: 20,
        },
      },
    },
  })
  findAll(@Query() queryDto: QueryListingsDto, @Req() req: any) {
    const userRole = req.user?.role;
    return this.listingsService.findAll(queryDto, userRole);
  }

  @Get('my-listings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tin rao của tôi',
    description: 'Lấy tất cả tin rao do người dùng hiện tại đăng, bao gồm cả tin PENDING, APPROVED, REJECTED.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách tin rao của người dùng hiện tại',
  })
  getMyListings(@Query() queryDto: QueryListingsDto, @Req() req: any) {
    return this.listingsService.getMyListings(queryDto, req.user.userId);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết tin rao',
    description: 'Xem chi tiết một tin rao. Public chỉ xem được tin APPROVED và không bị ẩn.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết tin rao',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin tin rao thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Cần bán căn hộ 3 phòng ngủ tại Quận 1, TP.HCM',
          content: 'Căn hộ mới, đầy đủ nội thất, view đẹp...',
          price: 5000000000,
          status: 'APPROVED',
          author: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0901234567',
          },
          category: { id: '...', name: 'Căn hộ' },
          images: ['https://storage.example.com/listings/image1.jpg'],
          likeCount: 15,
          commentCount: 8,
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T14:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userRole = req.user?.role;
    return this.listingsService.findOne(id, userRole);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật tin rao',
    description: 'Cập nhật thông tin tin rao. Khách hàng chỉ sửa được tin của mình, Staff/Admin sửa được tất cả.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao cần cập nhật',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateListingDto,
    description: 'Thông tin cập nhật',
    examples: {
      example1: {
        summary: 'Cập nhật giá và tiêu đề',
        value: {
          title: 'Cần bán gấp căn hộ 3 phòng ngủ tại Quận 1 (Giảm giá)',
          price: 4500000000,
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tin rao đã được cập nhật' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật tin rao này' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  update(
    @Param('id') id: string,
    @Body() updateListingDto: UpdateListingDto,
    @Req() req: any,
  ) {
    return this.listingsService.update(id, updateListingDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa tin rao',
    description: 'Xóa tin rao (soft delete). Khách hàng chỉ xóa được tin của mình, Admin xóa được tất cả.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao cần xóa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({ status: 204, description: 'Tin rao đã được xóa' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa tin rao này' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Phê duyệt tin rao',
    description: 'Staff/Admin duyệt tin rao, chuyển trạng thái từ PENDING sang APPROVED. Tin rao sẽ hiển thị công khai sau khi duyệt.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao cần phê duyệt',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: ReviewListingDto,
    description: 'Ghi chú phê duyệt',
    examples: {
      example1: {
        summary: 'Duyệt tin rao',
        value: {
          approvalNotes: 'Tin rao đã được duyệt, nội dung và hình ảnh hợp lệ',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tin rao đã được phê duyệt',
    schema: {
      example: {
        statusCode: 200,
        message: 'Phê duyệt tin rao thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'APPROVED',
          approverId: '550e8400-e29b-41d4-a716-446655440002',
          approvalNotes: 'Tin rao đã được duyệt',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Chỉ Staff/Admin mới có quyền duyệt' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  approve(
    @Param('id') id: string,
    @Body() reviewDto: ReviewListingDto,
    @Req() req: any,
  ) {
    return this.listingsService.approve(id, reviewDto, req.user.userId);
  }

  @Post(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Từ chối tin rao',
    description: 'Staff/Admin từ chối tin rao, chuyển trạng thái sang REJECTED với lý do cụ thể. Tin rao sẽ không hiển thị công khai.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao cần từ chối',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: ReviewListingDto,
    description: 'Lý do từ chối',
    examples: {
      example1: {
        summary: 'Từ chối tin rao',
        value: {
          approvalNotes: 'Hình ảnh không rõ ràng, vui lòng cập nhật hình ảnh chất lượng tốt hơn',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Tin rao đã bị từ chối',
    schema: {
      example: {
        statusCode: 200,
        message: 'Từ chối tin rao thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'REJECTED',
          approverId: '550e8400-e29b-41d4-a716-446655440002',
          approvalNotes: 'Hình ảnh không rõ ràng',
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Chỉ Staff/Admin mới có quyền từ chối' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  reject(
    @Param('id') id: string,
    @Body() reviewDto: ReviewListingDto,
    @Req() req: any,
  ) {
    return this.listingsService.reject(id, reviewDto, req.user.userId);
  }

  @Post(':id/toggle-hidden')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ẩn/Hiện tin rao',
    description: 'Admin ẩn hoặc hiện tin rao mà không thay đổi trạng thái phê duyệt. Tin rao bị ẩn sẽ không hiển thị công khai.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao cần ẩn/hiện',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái đã được cập nhật',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật trạng thái tin rao thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          isHidden: true,
        },
      },
    },
  })
  @ApiResponse({ status: 403, description: 'Chỉ Admin mới có quyền ẩn/hiện' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  toggleHidden(@Param('id') id: string) {
    return this.listingsService.toggleHidden(id);
  }

  // Comments
  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Thêm bình luận cho tin rao',
    description: 'Người dùng đã đăng nhập có thể bình luận vào tin rao đã được duyệt (APPROVED).',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: CreateCommentDto,
    description: 'Nội dung bình luận',
    examples: {
      example1: {
        summary: 'Bình luận',
        value: {
          commentText: 'Căn hộ đẹp quá, có thể xem trực tiếp được không ạ?',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Bình luận đã được thêm',
    schema: {
      example: {
        statusCode: 201,
        message: 'Thêm bình luận thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440003',
          listingId: '550e8400-e29b-41d4-a716-446655440000',
          userId: '550e8400-e29b-41d4-a716-446655440001',
          commentText: 'Căn hộ đẹp quá...',
          createdAt: '2025-01-15T15:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  addComment(
    @Param('id') id: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ) {
    return this.listingsService.addComment(id, createCommentDto, req.user.userId);
  }

  @Get(':id/comments')
  @ApiOperation({
    summary: 'Lấy danh sách bình luận',
    description: 'Lấy tất cả bình luận của một tin rao.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bình luận',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách bình luận thành công',
        data: [
          {
            id: '550e8400-e29b-41d4-a716-446655440003',
            commentText: 'Căn hộ đẹp quá...',
            user: {
              id: '550e8400-e29b-41d4-a716-446655440001',
              fullName: 'Nguyễn Văn A',
            },
            createdAt: '2025-01-15T15:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  getComments(@Param('id') id: string) {
    return this.listingsService.getComments(id);
  }

  @Delete('comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa bình luận',
    description: 'Người dùng xóa bình luận của mình, hoặc Admin xóa bất kỳ bình luận nào.',
  })
  @ApiParam({
    name: 'commentId',
    description: 'ID của bình luận cần xóa',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @ApiResponse({ status: 204, description: 'Bình luận đã được xóa' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa bình luận này' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy bình luận' })
  deleteComment(@Param('commentId') commentId: string, @Req() req: any) {
    return this.listingsService.deleteComment(commentId, req.user.userId, req.user.role);
  }

  // Likes
  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Like/Unlike tin rao',
    description: 'Người dùng like hoặc unlike tin rao. Mỗi người chỉ có thể like 1 lần, nếu đã like thì sẽ unlike.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái like đã được cập nhật',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật like thành công',
        data: {
          liked: true,
          likeCount: 16,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  toggleLike(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.toggleLike(id, req.user.userId);
  }

  @Get(':id/liked')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Kiểm tra người dùng đã like tin rao chưa',
    description: 'Kiểm tra xem người dùng hiện tại đã like tin rao này chưa.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của tin rao',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái like',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy trạng thái like thành công',
        data: {
          liked: true,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy tin rao' })
  checkUserLiked(@Param('id') id: string, @Req() req: any) {
    return this.listingsService.checkUserLiked(id, req.user.userId);
  }
}
