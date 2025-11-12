import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { FeeCalculationsService } from './fee-calculations.service';
import { CreateFeeCalculationDto } from './dto/create-fee-calculation.dto';
import { QueryFeeCalculationsDto } from './dto/query-fee-calculations.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';

@ApiTags('fee-calculations')
@Controller('fee-calculations')
export class FeeCalculationsController {
  constructor(private readonly feeCalculationsService: FeeCalculationsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Tính phí công chứng',
    description:
      'Tính phí công chứng dựa trên loại giấy tờ và dữ liệu đầu vào. Hỗ trợ cả khách (guest) và người dùng đã đăng nhập. Kết quả bao gồm: phí cơ bản, phí phụ thu, tổng phí. Lưu lại lịch sử tính phí.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tính phí thành công. Trả về kết quả chi tiết và lưu lịch sử.',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ hoặc loại phí không hoạt động' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy nhóm giấy tờ hoặc loại phí' })
  create(@Body() createFeeCalculationDto: CreateFeeCalculationDto, @Req() req: any) {
    const userId = req.user?.userId;
    return this.feeCalculationsService.create(createFeeCalculationDto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy tất cả lịch sử tính phí (Admin/Staff)',
    description:
      'Lấy danh sách tất cả lịch sử tính phí trong hệ thống với phân trang và lọc. Chỉ Admin/Staff có quyền xem.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách lịch sử tính phí' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  findAll(@Query() queryDto: QueryFeeCalculationsDto) {
    return this.feeCalculationsService.findAll(queryDto);
  }

  @Get('my-calculations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy lịch sử tính phí của tôi',
    description:
      'Lấy danh sách lịch sử tính phí của người dùng hiện tại. Bao gồm: dữ liệu đầu vào, kết quả tính phí, thời gian tính.',
  })
  @ApiResponse({ status: 200, description: 'Lịch sử tính phí của người dùng' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findMyCalculations(@Query() queryDto: QueryFeeCalculationsDto, @Req() req: any) {
    const userId = req.user.userId;
    return this.feeCalculationsService.findMyCalculations(userId, queryDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy chi tiết lịch sử tính phí theo ID',
    description: 'Xem chi tiết một lần tính phí bao gồm: input data, calculation result, total fee.',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết lịch sử tính phí' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy lịch sử tính phí' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.feeCalculationsService.findOne(id);
  }
}
