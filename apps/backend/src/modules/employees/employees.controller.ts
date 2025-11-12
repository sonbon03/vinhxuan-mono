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
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@shared';
import { EmployeeStatus } from './entities/employee.entity';

@ApiTags('Employees')
@Controller('employees')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Tạo nhân viên mới',
    description: 'Tạo một nhân viên mới trong hệ thống. Chỉ Admin mới có quyền thực hiện thao tác này. Có thể liên kết nhân viên với tài khoản người dùng hoặc tạo độc lập.'
  })
  @ApiBody({
    type: CreateEmployeeDto,
    description: 'Thông tin nhân viên cần tạo bao gồm họ tên, chức vụ, email, số điện thoại và các thông tin khác'
  })
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy danh sách nhân viên',
    description: 'Lấy danh sách tất cả nhân viên với khả năng phân trang, tìm kiếm và lọc theo nhiều tiêu chí. Chỉ Admin mới có quyền xem danh sách này.'
  })
  findAll(@Query() queryDto: QueryEmployeesDto) {
    return this.employeesService.findAll(queryDto);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết nhân viên',
    description: 'Lấy thông tin chi tiết của một nhân viên theo ID. Chỉ Admin mới có quyền xem thông tin chi tiết.'
  })
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật thông tin nhân viên',
    description: 'Cập nhật thông tin của một nhân viên hiện có. Chỉ Admin mới có quyền cập nhật thông tin nhân viên.'
  })
  @ApiBody({
    type: UpdateEmployeeDto,
    description: 'Thông tin nhân viên cần cập nhật (chỉ cần truyền các trường muốn thay đổi)'
  })
  update(@Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Xóa nhân viên',
    description: 'Xóa một nhân viên khỏi hệ thống. Chỉ Admin mới có quyền xóa nhân viên. Nếu nhân viên có liên kết với tài khoản người dùng (userId), tài khoản người dùng đó cũng sẽ bị xóa tự động (cascading delete).'
  })
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Cập nhật trạng thái nhân viên',
    description: 'Cập nhật trạng thái làm việc của nhân viên (Đang làm việc, Nghỉ phép, Đã nghỉ việc). Chỉ Admin mới có quyền thay đổi trạng thái.'
  })
  updateStatus(
    @Param('id') id: string,
    @Param('status') status: EmployeeStatus,
  ) {
    return this.employeesService.updateStatus(id, status);
  }
}
