import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { DocumentGroupsService } from './document-groups.service';
import { CreateDocumentGroupDto } from './dto/create-document-group.dto';
import { UpdateDocumentGroupDto } from './dto/update-document-group.dto';
import { QueryDocumentGroupsDto } from './dto/query-document-groups.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('document-groups')
@Controller('document-groups')
export class DocumentGroupsController {
  constructor(private readonly documentGroupsService: DocumentGroupsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo nhóm giấy tờ công chứng mới',
    description:
      'Tạo nhóm giấy tờ mới với cấu hình form động. Chỉ Admin và Staff có quyền tạo. Ví dụ: Hợp đồng mua bán nhà đất, Chuyển nhượng, Tặng cho, v.v.',
  })
  @ApiResponse({ status: 201, description: 'Nhóm giấy tờ đã được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Nhóm giấy tờ với slug này đã tồn tại' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  create(@Body() createDocumentGroupDto: CreateDocumentGroupDto) {
    return this.documentGroupsService.create(createDocumentGroupDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách nhóm giấy tờ công chứng',
    description:
      'Lấy danh sách tất cả nhóm giấy tờ với phân trang, tìm kiếm và lọc. Public endpoint - không yêu cầu đăng nhập.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách nhóm giấy tờ được trả về thành công' })
  findAll(@Query() queryDto: QueryDocumentGroupsDto) {
    return this.documentGroupsService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết nhóm giấy tờ theo ID',
    description:
      'Lấy thông tin chi tiết của một nhóm giấy tờ bao gồm cấu hình form fields. Public endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết nhóm giấy tờ' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentGroupsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật nhóm giấy tờ',
    description:
      'Cập nhật thông tin nhóm giấy tờ (tên, slug, mô tả, form fields, trạng thái). Chỉ Admin và Staff có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Nhóm giấy tờ đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDocumentGroupDto: UpdateDocumentGroupDto,
  ) {
    return this.documentGroupsService.update(id, updateDocumentGroupDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa nhóm giấy tờ',
    description: 'Xóa nhóm giấy tờ khỏi hệ thống. Chỉ Admin có quyền xóa.',
  })
  @ApiResponse({ status: 200, description: 'Nhóm giấy tờ đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.documentGroupsService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật trạng thái nhóm giấy tờ',
    description: 'Kích hoạt hoặc tạm ngưng nhóm giấy tờ. Chỉ Admin và Staff có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Trạng thái đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: boolean,
  ) {
    return this.documentGroupsService.updateStatus(id, status);
  }
}
