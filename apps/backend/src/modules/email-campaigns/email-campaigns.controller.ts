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
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { EmailCampaignsService } from './email-campaigns.service';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';
import { UpdateEmailCampaignDto } from './dto/update-email-campaign.dto';
import { QueryEmailCampaignsDto } from './dto/query-email-campaigns.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Email Campaigns')
@Controller('email-campaigns')
export class EmailCampaignsController {
  constructor(private readonly emailCampaignsService: EmailCampaignsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo chiến dịch email marketing mới',
    description:
      'Tạo chiến dịch email tự động với cấu hình lịch gửi và tiêu chí người nhận. Hỗ trợ template với biến động. Chỉ Admin/Staff có quyền.',
  })
  @ApiBody({ type: CreateEmailCampaignDto })
  @ApiResponse({ status: 201, description: 'Chiến dịch đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  create(@Body() createEmailCampaignDto: CreateEmailCampaignDto) {
    return this.emailCampaignsService.create(createEmailCampaignDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách chiến dịch email',
    description:
      'Lấy danh sách tất cả chiến dịch với phân trang và lọc theo sự kiện, trạng thái. Chỉ Admin/Staff có quyền xem.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findAll(@Query() queryDto: QueryEmailCampaignsDto) {
    return this.emailCampaignsService.findAll(queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy chi tiết chiến dịch email',
    description: 'Xem chi tiết chiến dịch bao gồm: template, lịch gửi, tiêu chí người nhận, lịch sử gửi.',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết chiến dịch' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findOne(@Param('id') id: string) {
    return this.emailCampaignsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật chiến dịch email',
    description: 'Cập nhật thông tin chiến dịch (template, lịch gửi, người nhận, trạng thái).',
  })
  @ApiBody({ type: UpdateEmailCampaignDto })
  @ApiResponse({ status: 200, description: 'Chiến dịch đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  update(@Param('id') id: string, @Body() updateEmailCampaignDto: UpdateEmailCampaignDto) {
    return this.emailCampaignsService.update(id, updateEmailCampaignDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa chiến dịch email',
    description: 'Xóa chiến dịch khỏi hệ thống. Chỉ Admin/Staff có quyền xóa.',
  })
  @ApiResponse({ status: 204, description: 'Chiến dịch đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  remove(@Param('id') id: string) {
    return this.emailCampaignsService.remove(id);
  }

  @Post(':id/toggle-status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Bật/tắt chiến dịch',
    description: 'Toggle trạng thái chiến dịch (Đang chạy <-> Tạm dừng).',
  })
  @ApiResponse({ status: 200, description: 'Trạng thái đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  toggleStatus(@Param('id') id: string) {
    return this.emailCampaignsService.toggleStatus(id);
  }

  @Post(':id/send')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Gửi chiến dịch email ngay lập tức (Admin only)',
    description: 'Gửi email cho tất cả người nhận phù hợp tiêu chí ngay lập tức, không đợi lịch. Chỉ Admin có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Email đã được gửi thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy chiến dịch' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ Admin)' })
  sendCampaign(@Param('id') id: string) {
    return this.emailCampaignsService.sendCampaign(id);
  }
}
