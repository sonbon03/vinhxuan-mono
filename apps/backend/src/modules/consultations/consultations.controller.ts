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
import { ConsultationsService } from './consultations.service';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationsDto } from './dto/query-consultations.dto';
import { ApproveConsultationDto } from './dto/approve-consultation.dto';
import { CancelConsultationDto } from './dto/cancel-consultation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Consultations - Quản lý Lịch Tư vấn')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.CUSTOMER, UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đặt lịch tư vấn mới',
    description:
      'Khách hàng, Nhân viên hoặc Admin có thể tạo lịch tư vấn mới. ' +
      'Lịch tư vấn sẽ có trạng thái PENDING và cần được phê duyệt bởi Staff/Admin.',
  })
  @ApiBody({ type: CreateConsultationDto })
  @ApiResponse({
    status: 201,
    description: 'Lịch tư vấn đã được tạo thành công với trạng thái PENDING',
    schema: {
      example: {
        statusCode: 201,
        message: 'Tạo lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          customerId: '550e8400-e29b-41d4-a716-446655440001',
          serviceId: '550e8400-e29b-41d4-a716-446655440002',
          requestedDatetime: '2025-11-15T10:00:00.000Z',
          content: 'Tôi muốn tư vấn về thủ tục công chứng hợp đồng mua bán nhà đất.',
          status: 'PENDING',
          createdAt: '2025-11-12T10:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu đầu vào không hợp lệ' })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  create(@Body() createConsultationDto: CreateConsultationDto, @Req() req: any) {
    return this.consultationsService.create(createConsultationDto, req.user.userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách lịch tư vấn',
    description:
      'Lấy danh sách lịch tư vấn với phân trang và bộ lọc. ' +
      'Khách hàng chỉ thấy lịch của mình, Staff thấy lịch được giao và tất cả lịch, Admin thấy tất cả.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lịch tư vấn',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy danh sách lịch tư vấn thành công',
        data: {
          items: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              requestedDatetime: '2025-11-15T10:00:00.000Z',
              content: 'Tư vấn về công chứng hợp đồng mua bán',
              status: 'PENDING',
              customer: {
                id: '550e8400-e29b-41d4-a716-446655440001',
                fullName: 'Nguyễn Văn A',
              },
              staff: null,
              service: {
                id: '550e8400-e29b-41d4-a716-446655440002',
                name: 'Tư vấn công chứng',
              },
              createdAt: '2025-11-12T10:00:00.000Z',
            },
          ],
          total: 30,
          page: 1,
          limit: 20,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  findAll(@Query() queryDto: QueryConsultationsDto, @Req() req: any) {
    const { userId, role } = req.user;
    return this.consultationsService.findAll(queryDto, userId, role);
  }

  @Get('my-consultations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách lịch tư vấn của tôi',
    description:
      'Lấy danh sách lịch tư vấn của người dùng hiện tại. ' +
      'Khách hàng xem lịch mình đặt, Staff xem lịch được giao.',
  })
  @ApiResponse({
    status: 200,
    description: 'Danh sách lịch tư vấn của người dùng hiện tại',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy lịch tư vấn của tôi thành công',
        data: {
          items: [
            {
              id: '550e8400-e29b-41d4-a716-446655440000',
              requestedDatetime: '2025-11-15T10:00:00.000Z',
              content: 'Tư vấn về công chứng hợp đồng mua bán',
              status: 'APPROVED',
              createdAt: '2025-11-12T10:00:00.000Z',
            },
          ],
          total: 5,
          page: 1,
          limit: 20,
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Chưa xác thực' })
  getMyConsultations(@Query() queryDto: QueryConsultationsDto, @Req() req: any) {
    return this.consultationsService.getMyConsultations(queryDto, req.user.userId, req.user.role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy chi tiết lịch tư vấn',
    description:
      'Xem thông tin chi tiết một lịch tư vấn. ' +
      'Khách hàng chỉ xem được lịch của mình, Staff/Admin xem được tất cả.',
  })
  @ApiResponse({
    status: 200,
    description: 'Chi tiết lịch tư vấn',
    schema: {
      example: {
        statusCode: 200,
        message: 'Lấy chi tiết lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          customerId: '550e8400-e29b-41d4-a716-446655440001',
          staffId: '550e8400-e29b-41d4-a716-446655440003',
          serviceId: '550e8400-e29b-41d4-a716-446655440002',
          requestedDatetime: '2025-11-15T10:00:00.000Z',
          content: 'Tư vấn về thủ tục công chứng hợp đồng mua bán nhà đất',
          status: 'APPROVED',
          notes: 'Đã xác nhận lịch tư vấn với khách hàng',
          createdAt: '2025-11-12T10:00:00.000Z',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập lịch tư vấn này' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const { userId, role } = req.user;
    return this.consultationsService.findOne(id, userId, role);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật lịch tư vấn',
    description:
      'Staff/Admin cập nhật thông tin lịch tư vấn: thời gian, nhân viên phụ trách, nội dung, ghi chú.',
  })
  @ApiBody({ type: UpdateConsultationDto })
  @ApiResponse({
    status: 200,
    description: 'Lịch tư vấn đã được cập nhật thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Cập nhật lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          staffId: '550e8400-e29b-41d4-a716-446655440003',
          requestedDatetime: '2025-11-16T14:00:00.000Z',
          notes: 'Đã tư vấn chi tiết cho khách hàng về quy trình và chi phí',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 403, description: 'Không có quyền cập nhật lịch tư vấn này' })
  update(
    @Param('id') id: string,
    @Body() updateConsultationDto: UpdateConsultationDto,
    @Req() req: any,
  ) {
    return this.consultationsService.update(id, updateConsultationDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Xóa lịch tư vấn',
    description: 'Chỉ Admin có quyền xóa lịch tư vấn khỏi hệ thống.',
  })
  @ApiResponse({ status: 204, description: 'Lịch tư vấn đã được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 403, description: 'Không có quyền xóa lịch tư vấn này' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.consultationsService.remove(id, req.user.userId, req.user.role);
  }

  @Post(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Phê duyệt lịch tư vấn',
    description:
      'Staff/Admin phê duyệt lịch tư vấn, chuyển trạng thái từ PENDING sang APPROVED. ' +
      'Có thể gán nhân viên phụ trách và thêm ghi chú. Gửi email xác nhận cho khách hàng.',
  })
  @ApiBody({ type: ApproveConsultationDto })
  @ApiResponse({
    status: 200,
    description: 'Lịch tư vấn đã được phê duyệt thành công',
    schema: {
      example: {
        statusCode: 200,
        message: 'Phê duyệt lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'APPROVED',
          staffId: '550e8400-e29b-41d4-a716-446655440003',
          notes: 'Đã xác nhận lịch tư vấn với khách hàng. Nhân viên Nguyễn Văn A sẽ đảm nhận.',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 400, description: 'Lịch tư vấn không ở trạng thái PENDING' })
  approve(
    @Param('id') id: string,
    @Body() approveDto: ApproveConsultationDto,
    @Req() req: any,
  ) {
    return this.consultationsService.approve(id, approveDto, req.user.userId, req.user.role);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hoàn thành lịch tư vấn',
    description:
      'Staff/Admin đánh dấu lịch tư vấn đã hoàn thành, chuyển trạng thái từ APPROVED sang COMPLETED. ' +
      'Gọi endpoint này sau khi buổi tư vấn kết thúc.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lịch tư vấn đã được đánh dấu hoàn thành',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hoàn thành lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'COMPLETED',
          updatedAt: '2025-11-15T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 400, description: 'Lịch tư vấn không ở trạng thái APPROVED' })
  complete(@Param('id') id: string, @Req() req: any) {
    return this.consultationsService.complete(id, req.user.userId, req.user.role);
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Hủy lịch tư vấn',
    description:
      'Khách hàng, Staff hoặc Admin có thể hủy lịch tư vấn. ' +
      'Chuyển trạng thái sang CANCELLED. Bắt buộc phải ghi rõ lý do hủy. ' +
      'Gửi thông báo email cho các bên liên quan.',
  })
  @ApiBody({ type: CancelConsultationDto })
  @ApiResponse({
    status: 200,
    description: 'Lịch tư vấn đã được hủy',
    schema: {
      example: {
        statusCode: 200,
        message: 'Hủy lịch tư vấn thành công',
        data: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: 'CANCELLED',
          cancelReason: 'Khách hàng yêu cầu hủy lịch do bận công việc đột xuất. Sẽ đặt lại lịch sau.',
          updatedAt: '2025-11-12T11:00:00.000Z',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch tư vấn' })
  @ApiResponse({ status: 400, description: 'Lịch tư vấn đã hoàn thành hoặc đã bị hủy, không thể hủy' })
  cancel(
    @Param('id') id: string,
    @Body() cancelDto: CancelConsultationDto,
    @Req() req: any,
  ) {
    return this.consultationsService.cancel(id, cancelDto, req.user.userId, req.user.role);
  }
}
