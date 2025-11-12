import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared';
import { DateRangeDto, StatisticsQueryDto, TimePeriod } from './dto/statistics-query.dto';

@ApiTags('Statistics')
@Controller('statistics')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  // ============ OVERVIEW DASHBOARD ============
  @Get('overview')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Thống kê tổng quan Dashboard',
    description:
      'Lấy thống kê tổng quan: tổng số người dùng, hồ sơ, doanh thu, lịch tư vấn. Có thể lọc theo khoảng thời gian. Chỉ Admin/Staff có quyền.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu thống kê tổng quan' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  async getOverview(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getOverview(dateRange);
    return {
      statusCode: 200,
      message: 'Overview statistics retrieved successfully',
      data,
    };
  }

  // ============ RECORD STATISTICS ============
  @Get('records/by-status')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Thống kê hồ sơ theo trạng thái',
    description:
      'Thống kê số lượng hồ sơ theo trạng thái: Đã hoàn thành, Đang xử lý, Chưa hoàn thành. Hiển thị biểu đồ tròn (pie chart).',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu thống kê hồ sơ theo trạng thái' })
  async getRecordsByStatus(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getRecordsByStatus(dateRange);
    return {
      statusCode: 200,
      message: 'Records by status retrieved successfully',
      data,
    };
  }

  @Get('records/by-time')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Thống kê hồ sơ theo thời gian',
    description:
      'Thống kê số lượng hồ sơ theo: Ngày, Tháng, Quý, Năm. Hiển thị biểu đồ đường (line chart) hoặc cột (bar chart).',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu thống kê hồ sơ theo thời gian' })
  async getRecordsByTime(@Query() query: StatisticsQueryDto) {
    const period = query.period || TimePeriod.MONTH;
    const dateRange: DateRangeDto = {
      startDate: query.startDate,
      endDate: query.endDate,
    };
    const data = await this.statisticsService.getRecordsByTime(
      period,
      dateRange,
    );
    return {
      statusCode: 200,
      message: 'Records by time retrieved successfully',
      data,
    };
  }

  @Get('records/by-type')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Thống kê hồ sơ theo loại',
    description: 'Thống kê số lượng hồ sơ theo từng loại/thể loại hồ sơ.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu thống kê hồ sơ theo loại' })
  async getRecordsByType(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getRecordsByType(dateRange);
    return {
      statusCode: 200,
      message: 'Records by type retrieved successfully',
      data,
    };
  }

  // ============ USER STATISTICS ============
  @Get('users/by-role')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Thống kê người dùng theo vai trò',
    description: 'Số lượng người dùng theo vai trò: Khách hàng, Nhân viên, Quản trị viên. Biểu đồ tròn.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu thống kê người dùng theo vai trò' })
  async getUsersByRole() {
    const data = await this.statisticsService.getUsersByRole();
    return {
      statusCode: 200,
      message: 'Users by role retrieved successfully',
      data,
    };
  }

  @Get('users/growth')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Biểu đồ tăng trưởng người dùng',
    description: 'Tăng trưởng số lượng người dùng mới theo: Tháng, Quý, Năm. Biểu đồ đường hoặc cột.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu tăng trưởng người dùng' })
  async getUserGrowth(@Query('period') periodParam?: string) {
    const period = (periodParam as TimePeriod) || TimePeriod.MONTH;
    const data = await this.statisticsService.getUserGrowth(period);
    return {
      statusCode: 200,
      message: 'User growth statistics retrieved successfully',
      data,
    };
  }

  @Get('users/activity')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Thống kê người dùng hoạt động',
    description: 'Số lượng người dùng đang hoạt động (Active) và không hoạt động (Inactive).',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu hoạt động người dùng' })
  async getUserActivity() {
    const data = await this.statisticsService.getUserActivity();
    return {
      statusCode: 200,
      message: 'User activity statistics retrieved successfully',
      data,
    };
  }

  // ============ PERFORMANCE STATISTICS ============
  @Get('performance/records-by-staff')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Thống kê hồ sơ theo nhân viên',
    description: 'Số lượng hồ sơ được xử lý theo từng nhân viên. Bảng và biểu đồ cột.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu hồ sơ theo nhân viên' })
  async getRecordsByStaff(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getRecordsByStaff(dateRange);
    return {
      statusCode: 200,
      message: 'Records by staff retrieved successfully',
      data,
    };
  }

  @Get('performance/task-summary')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Tổng hợp nhiệm vụ theo thời gian',
    description: 'Số lượng nhiệm vụ/hồ sơ đã xử lý theo: Tháng, Quý, Năm.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu tổng hợp nhiệm vụ' })
  async getTaskSummary(@Query() query: StatisticsQueryDto) {
    const period = query.period || TimePeriod.MONTH;
    const dateRange: DateRangeDto = {
      startDate: query.startDate,
      endDate: query.endDate,
    };
    const data = await this.statisticsService.getTaskSummary(period, dateRange);
    return {
      statusCode: 200,
      message: 'Task summary retrieved successfully',
      data,
    };
  }

  @Get('performance/staff-performance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Hiệu suất làm việc nhân viên',
    description: 'Chi tiết hiệu suất: Số hồ sơ xử lý, Thời gian xử lý trung bình, Tỷ lệ hoàn thành.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu hiệu suất nhân viên' })
  async getStaffPerformance(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getStaffPerformance(dateRange);
    return {
      statusCode: 200,
      message: 'Staff performance statistics retrieved successfully',
      data,
    };
  }

  // ============ REVENUE STATISTICS ============
  @Get('revenue/by-period')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Thống kê doanh thu tổng quan',
    description: 'Tổng doanh thu theo thời gian (ngày, tháng, quý, năm). Biểu đồ đường hoặc cột.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu doanh thu theo thời gian' })
  async getRevenueByPeriod(@Query() query: StatisticsQueryDto) {
    const period = query.period || TimePeriod.MONTH;
    const dateRange: DateRangeDto = {
      startDate: query.startDate,
      endDate: query.endDate,
    };
    const data = await this.statisticsService.getRevenueByPeriod(
      period,
      dateRange,
    );
    return {
      statusCode: 200,
      message: 'Revenue by period retrieved successfully',
      data,
    };
  }

  @Get('revenue/by-service')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Doanh thu theo dịch vụ',
    description: 'Doanh thu chi tiết theo từng loại dịch vụ công chứng.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu doanh thu theo dịch vụ' })
  async getRevenueByService(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getRevenueByService(dateRange);
    return {
      statusCode: 200,
      message: 'Revenue by service retrieved successfully',
      data,
    };
  }

  @Get('revenue/by-staff')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Doanh thu theo nhân viên',
    description: 'Doanh thu phát sinh do từng nhân viên xử lý.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu doanh thu theo nhân viên' })
  async getRevenueByStaff(@Query() dateRange: DateRangeDto) {
    const data = await this.statisticsService.getRevenueByStaff(dateRange);
    return {
      statusCode: 200,
      message: 'Revenue by staff retrieved successfully',
      data,
    };
  }

  // ============ DASHBOARD SPECIFIC ENDPOINTS ============
  @Get('dashboard')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Dashboard thống kê tổng hợp',
    description: 'Tổng hợp tất cả thống kê quan trọng cho dashboard: người dùng, hồ sơ, doanh thu, lịch.',
  })
  @ApiResponse({ status: 200, description: 'Dữ liệu dashboard tổng hợp' })
  async getDashboardStatistics() {
    const data = await this.statisticsService.getDashboardStatistics();
    return {
      statusCode: 200,
      message: 'Dashboard statistics retrieved successfully',
      data,
    };
  }

  @Get('dashboard/recent-activities')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Hoạt động gần đây',
    description: 'Danh sách các hoạt động gần đây trên hệ thống (tạo hồ sơ, đặt lịch, v.v.).',
  })
  @ApiResponse({ status: 200, description: 'Danh sách hoạt động gần đây' })
  async getRecentActivities(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const data = await this.statisticsService.getRecentActivities(limitNumber);
    return {
      statusCode: 200,
      message: 'Recent activities retrieved successfully',
      data,
    };
  }

  @Get('dashboard/records-in-progress')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiOperation({
    summary: 'Hồ sơ đang xử lý',
    description: 'Danh sách các hồ sơ đang được xử lý, chưa hoàn thành.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách hồ sơ đang xử lý' })
  async getRecordsInProgress(@Query('limit') limit?: string) {
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const data = await this.statisticsService.getRecordsInProgress(limitNumber);
    return {
      statusCode: 200,
      message: 'Records in progress retrieved successfully',
      data,
    };
  }
}
