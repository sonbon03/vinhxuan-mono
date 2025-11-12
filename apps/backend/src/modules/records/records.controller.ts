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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RecordsService } from './records.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { QueryRecordsDto } from './dto/query-records.dto';
import { ReviewRecordDto } from './dto/review-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared';

@ApiTags('Records - Quản lý Hồ sơ Công chứng')
@Controller('records')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RecordsController {
  constructor(private readonly recordsService: RecordsService) {}

  @Post()
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Tạo hồ sơ công chứng mới',
    description:
      'Khách hàng, Nhân viên hoặc Admin có thể tạo hồ sơ công chứng mới. ' +
      'Hồ sơ sẽ có trạng thái PENDING và cần được duyệt bởi Staff/Admin.',
  })
  @ApiBody({ type: CreateRecordDto })
  @ApiResponse({
    status: 201,
    description: 'Hồ sơ đã được tạo thành công với trạng thái PENDING',
    schema: {
      example: {
        statusCode: 201,
        message: 'Hồ sơ đã được tạo thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          typeId: '550e8400-e29b-41d4-a716-446655440001',
          customerId: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Hồ sơ công chứng hợp đồng mua bán nhà đất tại Quận 1',
          description: 'Hồ sơ gồm: hợp đồng mua bán, sổ đỏ, CMND/CCCD các bên...',
          attachments: ['https://storage.example.com/files/hop-dong.pdf'],
          status: 'PENDING',
          createdAt: '2025-11-12T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  create(@Body() createRecordDto: CreateRecordDto, @Req() req: any) {
    return this.recordsService.create(createRecordDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách hồ sơ công chứng',
    description:
      'Lấy danh sách hồ sơ với phân trang và bộ lọc. ' +
      'Khách hàng chỉ thấy hồ sơ của mình, Staff/Admin thấy tất cả hồ sơ.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách hồ sơ công chứng',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách hồ sơ thành công',
        data: {
          items: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              title: 'Hồ sơ công chứng hợp đồng mua bán nhà đất',
              status: 'PENDING',
              customer: {
                id: '550e8400-e29b-41d4-a716-446655440002',
                fullName: 'Nguyễn Văn A',
              },
              type: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                name: 'Hợp đồng mua bán',
              },
              createdAt: '2025-11-12T10:00:00.000Z',
            },
          ],
          total: 50,
          page: 1,
          limit: 20,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  findAll(@Query() queryDto: QueryRecordsDto, @Req() req: any) {
    return this.recordsService.findAll(queryDto, req.user.userId, req.user.role);
  }

  @Get(':id')
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy chi tiết hồ sơ công chứng',
    description:
      'Xem thông tin chi tiết một hồ sơ công chứng. ' +
      'Khách hàng chỉ xem được hồ sơ của mình, Staff/Admin xem được tất cả.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết hồ sơ công chứng',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy chi tiết hồ sơ thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          typeId: '550e8400-e29b-41d4-a716-446655440001',
          customerId: '550e8400-e29b-41d4-a716-446655440002',
          title: 'Hồ sơ công chứng hợp đồng mua bán nhà đất tại Quận 1',
          description: 'Hồ sơ gồm: hợp đồng mua bán, sổ đỏ, CMND/CCCD các bên...',
          attachments: ['https://storage.example.com/files/hop-dong.pdf'],
          status: 'APPROVED',
          reviewNotes: 'Hồ sơ hợp lệ, đã duyệt',
          reviewerId: '550e8400-e29b-41d4-a716-446655440003',
          createdAt: '2025-11-12T10:00:00.000Z',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập hồ sơ này' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.recordsService.findOne(id, req.user.userId, req.user.role);
  }

  @Put(':id')
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật hồ sơ công chứng',
    description:
      'Cập nhật thông tin hồ sơ. Khách hàng chỉ sửa được khi hồ sơ ở trạng thái PENDING. ' +
      'Staff/Admin có thể cập nhật trạng thái và ghi chú duyệt.',
  })
  @ApiBody({ type: UpdateRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Hồ sơ đã được cập nhật thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật hồ sơ thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          title: 'Hồ sơ công chứng hợp đồng mua bán căn hộ chung cư tại Quận 7',
          status: 'APPROVED',
          reviewNotes: 'Hồ sơ hợp lệ, đã kiểm tra đầy đủ giấy tờ.',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật hồ sơ này' })
  update(
    @Param('id') id: string,
    @Body() updateRecordDto: UpdateRecordDto,
    @Req() req: any,
  ) {
    return this.recordsService.update(id, updateRecordDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @Roles(UserRole.CUSTOMER, UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa hồ sơ công chứng',
    description:
      'Xóa hồ sơ công chứng. Khách hàng chỉ xóa được hồ sơ của mình. Admin xóa được tất cả.',
  })
  @ApiResponse({ status: 204, description: 'Hồ sơ đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa hồ sơ này' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.recordsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/approve')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Phê duyệt hồ sơ công chứng',
    description:
      'Staff/Admin phê duyệt hồ sơ, chuyển trạng thái từ PENDING sang APPROVED. ' +
      'Gửi email thông báo cho khách hàng sau khi duyệt.',
  })
  @ApiBody({ type: ReviewRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Hồ sơ đã được phê duyệt thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Phê duyệt hồ sơ thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'APPROVED',
          reviewNotes: 'Hồ sơ hợp lệ, đã duyệt và chuyển sang bước tiếp theo.',
          reviewerId: '550e8400-e29b-41d4-a716-446655440003',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  @ApiResponse({ status: 400, description: 'Hồ sơ không ở trạng thái PENDING' })
  approve(
    @Param('id') id: string,
    @Body() reviewDto: ReviewRecordDto,
    @Req() req: any,
  ) {
    return this.recordsService.approve(id, reviewDto, req.user.userId);
  }

  @Post(':id/reject')
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiOperation({
    summary: 'Từ chối hồ sơ công chứng',
    description:
      'Staff/Admin từ chối hồ sơ, chuyển trạng thái từ PENDING sang REJECTED. ' +
      'Cần ghi rõ lý do từ chối trong reviewNotes. Gửi email thông báo cho khách hàng.',
  })
  @ApiBody({ type: ReviewRecordDto })
  @ApiResponse({
    status: 200,
    description: 'Hồ sơ đã bị từ chối',
    schema: {
      example: {
        statusCode: 200,
        message: 'Từ chối hồ sơ thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'REJECTED',
          reviewNotes: 'Hồ sơ thiếu giấy tờ chứng minh quyền sở hữu. Vui lòng bổ sung.',
          reviewerId: '550e8400-e29b-41d4-a716-446655440003',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy hồ sơ' })
  @ApiResponse({ status: 400, description: 'Hồ sơ không ở trạng thái PENDING' })
  reject(
    @Param('id') id: string,
    @Body() reviewDto: ReviewRecordDto,
    @Req() req: any,
  ) {
    return this.recordsService.reject(id, reviewDto, req.user.userId);
  }
}
