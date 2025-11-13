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
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { QueryArticlesDto } from './dto/query-articles.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Articles - Quản lý Bài viết')
@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo bài viết mới',
    description: 'Tạo bài viết mới với trạng thái DRAFT. Chỉ Staff và Admin mới có quyền tạo bài viết. Admin có thể publish ngay, Staff tạo bài ở trạng thái DRAFT chờ Admin duyệt.',
  })
  @ApiBody({
    type: CreateArticleDto,
    description: 'Thông tin bài viết mới',
    examples: {
      example1: {
        summary: 'Bài viết tin tức',
        value: {
          title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
          slug: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
          content: '<h2>Giới thiệu</h2><p>Trong bài viết này, chúng tôi sẽ hướng dẫn chi tiết cách làm hợp đồng mua bán nhà đất theo quy định mới nhất...</p>',
          categoryId: '550e8400-e29b-41d4-a716-446655440000',
          type: 'NEWS',
          isCrawled: false,
        },
      },
      example2: {
        summary: 'Bài viết từ nguồn ngoài',
        value: {
          title: 'Thông tin mới nhất về thị trường bất động sản',
          slug: 'thong-tin-moi-nhat-ve-thi-truong-bat-dong-san',
          content: '<p>Nội dung bài viết được lấy từ nguồn tin...</p>',
          type: 'NEWS',
          isCrawled: true,
          sourceUrl: 'https://example.com/bai-viet-goc',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Bài viết đã được tạo thành công',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
          slug: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
          content: '<h2>Giới thiệu</h2><p>Trong bài viết này...</p>',
          status: 'DRAFT',
          type: 'NEWS',
          authorId: '550e8400-e29b-41d4-a716-446655440001',
          createdAt: '2025-01-15T10:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Dữ liệu không hợp lệ',
    schema: {
      example: {
        statusCode: 400,
        message: ['Tiêu đề phải có ít nhất 10 ký tự', 'Slug không được để trống'],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Chưa xác thực',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền truy cập',
  })
  create(@Body() createArticleDto: CreateArticleDto, @Req() req: any) {
    return this.articlesService.create(createArticleDto, req.user.userId);
  }

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy danh sách bài viết',
    description: 'Lấy danh sách bài viết có phân trang và bộ lọc. Public chỉ xem được bài PUBLISHED, Staff/Admin xem được tất cả trạng thái.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách bài viết',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách bài viết thành công',
        data: {
          items: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
              slug: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
              content: '<h2>Giới thiệu</h2><p>Trong bài viết này...</p>',
              status: 'PUBLISHED',
              type: 'NEWS',
              authorId: '550e8400-e29b-41d4-a716-446655440001',
              author: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                fullName: 'Nguyễn Văn A',
              },
              categoryId: '550e8400-e29b-41d4-a716-446655440002',
              category: {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Hợp đồng',
              },
              publishedAt: '2025-01-15T14:30:00.000Z',
              createdAt: '2025-01-15T10:30:00.000Z',
            },
          ],
          total: 25,
          page: 1,
          limit: 20,
        },
      },
    },
  })
  findAll(@Query() queryDto: QueryArticlesDto, @Req() req: any) {
    const userRole = req.user?.role;
    return this.articlesService.findAll(queryDto, userRole);
  }

  @Get('slug/:slug')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy bài viết theo slug',
    description: 'Lấy chi tiết bài viết theo slug (URL thân thiện). Public chỉ xem được bài PUBLISHED.',
  })
  @ApiParam({
    name: 'slug',
    description: 'Slug của bài viết',
    example: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài viết',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy thông tin bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025',
          slug: 'huong-dan-lam-hop-dong-mua-ban-nha-dat-2025',
          content: '<h2>Giới thiệu</h2><p>Trong bài viết này, chúng tôi sẽ hướng dẫn chi tiết...</p>',
          status: 'PUBLISHED',
          type: 'NEWS',
          author: {
            id: '550e8400-e29b-41d4-a716-446655440001',
            fullName: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
          },
          category: {
            id: '550e8400-e29b-41d4-a716-446655440002',
            name: 'Hợp đồng',
            slug: 'hop-dong',
          },
          isCrawled: false,
          publishedAt: '2025-01-15T14:30:00.000Z',
          createdAt: '2025-01-15T10:30:00.000Z',
          updatedAt: '2025-01-15T14:30:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  findBySlug(@Param('slug') slug: string, @Req() req: any) {
    const userRole = req.user?.role;
    return this.articlesService.findBySlug(slug, userRole);
  }

  @Get(':id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết bài viết theo ID',
    description: 'Lấy chi tiết bài viết theo ID. Public chỉ xem được bài PUBLISHED.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết bài viết',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  findOne(@Param('id') id: string, @Req() req: any) {
    const userRole = req.user?.role;
    return this.articlesService.findOne(id, userRole);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật bài viết',
    description: 'Cập nhật thông tin bài viết. Staff chỉ sửa được bài viết của mình, Admin sửa được tất cả.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết cần cập nhật',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({
    type: UpdateArticleDto,
    description: 'Thông tin cập nhật',
    examples: {
      example1: {
        summary: 'Cập nhật tiêu đề và nội dung',
        value: {
          title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025 (Cập nhật mới)',
          content: '<h2>Cập nhật</h2><p>Thông tin đã được cập nhật với các quy định mới nhất...</p>',
        },
      },
      example2: {
        summary: 'Thay đổi trạng thái',
        value: {
          status: 'PUBLISHED',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Bài viết đã được cập nhật',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Hướng dẫn làm hợp đồng mua bán nhà đất năm 2025 (Cập nhật mới)',
          updatedAt: '2025-01-15T15:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền cập nhật bài viết này',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  update(
    @Param('id') id: string,
    @Body() updateArticleDto: UpdateArticleDto,
    @Req() req: any,
  ) {
    return this.articlesService.update(id, updateArticleDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa bài viết',
    description: 'Xóa bài viết (soft delete). Staff chỉ xóa được bài viết DRAFT của mình, Admin xóa được tất cả.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết cần xóa',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Bài viết đã được xóa',
  })
  @ApiResponse({
    status: 403,
    description: 'Không có quyền xóa bài viết này',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.articlesService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Publish bài viết',
    description: 'Admin duyệt và publish bài viết, chuyển trạng thái từ DRAFT sang PUBLISHED. Bài viết sẽ hiển thị công khai sau khi publish.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết cần publish',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bài viết đã được publish',
    schema: {
      example: {
        statusCode: 200,
        message: 'Publish bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'PUBLISHED',
          approverId: '550e8400-e29b-41d4-a716-446655440002',
          publishedAt: '2025-01-15T15:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Chỉ Admin mới có quyền publish',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  publish(@Param('id') id: string, @Req() req: any) {
    return this.articlesService.publish(id, req.user.userId);
  }

  @Post(':id/archive')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lưu trữ bài viết',
    description: 'Admin lưu trữ bài viết, chuyển trạng thái sang ARCHIVED. Bài viết sẽ không hiển thị công khai nhưng vẫn được lưu trong hệ thống.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết cần lưu trữ',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Bài viết đã được lưu trữ',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lưu trữ bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'ARCHIVED',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Chỉ Admin mới có quyền lưu trữ',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  archive(@Param('id') id: string) {
    return this.articlesService.archive(id);
  }

  @Post(':id/toggle-hidden')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ẩn/Hiện bài viết',
    description: 'Admin ẩn hoặc hiện bài viết. Chuyển đổi giữa trạng thái HIDDEN và PUBLISHED. Bài viết HIDDEN sẽ không hiển thị công khai.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của bài viết cần ẩn/hiện',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Trạng thái đã được cập nhật',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật trạng thái bài viết thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'HIDDEN',
        },
      },
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Chỉ Admin mới có quyền ẩn/hiện',
  })
  @ApiResponse({
    status: 404,
    description: 'Không tìm thấy bài viết',
  })
  toggleHidden(@Param('id') id: string) {
    return this.articlesService.toggleHidden(id);
  }
}
