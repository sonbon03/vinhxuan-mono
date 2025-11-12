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
import { FeeTypesService } from './fee-types.service';
import { CreateFeeTypeDto } from './dto/create-fee-type.dto';
import { UpdateFeeTypeDto } from './dto/update-fee-type.dto';
import { QueryFeeTypesDto } from './dto/query-fee-types.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared';

@ApiTags('fee-types')
@Controller('fee-types')
export class FeeTypesController {
  constructor(private readonly feeTypesService: FeeTypesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo loại phí công chứng mới',
    description:
      'Tạo loại phí mới với công thức tính phí. Hỗ trợ nhiều phương thức: cố định, theo %, bậc thang, công thức tùy chỉnh. Chỉ Admin và Staff có quyền.',
  })
  @ApiResponse({ status: 201, description: 'Loại phí đã được tạo thành công' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  create(@Body() createFeeTypeDto: CreateFeeTypeDto) {
    return this.feeTypesService.create(createFeeTypeDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách loại phí',
    description:
      'Lấy danh sách tất cả loại phí với phân trang, tìm kiếm và lọc theo nhóm giấy tờ, phương thức tính phí. Public endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách loại phí được trả về thành công' })
  findAll(@Query() queryDto: QueryFeeTypesDto) {
    return this.feeTypesService.findAll(queryDto);
  }

  @Get('document-group/:documentGroupId')
  @ApiOperation({
    summary: 'Lấy danh sách loại phí theo nhóm giấy tờ',
    description: 'Lấy tất cả loại phí áp dụng cho một nhóm giấy tờ cụ thể. Public endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách loại phí' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ' })
  findByDocumentGroup(@Param('documentGroupId', ParseUUIDPipe) documentGroupId: string) {
    return this.feeTypesService.findByDocumentGroup(documentGroupId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy chi tiết loại phí theo ID',
    description:
      'Lấy thông tin chi tiết của loại phí bao gồm công thức tính, phí tối thiểu/tối đa. Public endpoint.',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết loại phí' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phí' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feeTypesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật loại phí',
    description: 'Cập nhật thông tin loại phí (tên, công thức, phí min/max, trạng thái). Chỉ Admin và Staff có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Loại phí đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phí' })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateFeeTypeDto: UpdateFeeTypeDto) {
    return this.feeTypesService.update(id, updateFeeTypeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa loại phí',
    description: 'Xóa loại phí khỏi hệ thống. Chỉ Admin có quyền xóa.',
  })
  @ApiResponse({ status: 200, description: 'Loại phí đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phí' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập (chỉ Admin)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.feeTypesService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật trạng thái loại phí',
    description: 'Kích hoạt hoặc tạm ngưng loại phí. Chỉ Admin và Staff có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Trạng thái đã được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy loại phí' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body('status') status: boolean) {
    return this.feeTypesService.updateStatus(id, status);
  }
}
