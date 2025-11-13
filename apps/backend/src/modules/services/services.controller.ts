import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  // Put,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo dịch vụ công chứng mới',
    description: 'Tạo một dịch vụ công chứng mới trong hệ thống. Admin và Staff có thể thực hiện thao tác này. Slug phải là duy nhất trong hệ thống.'
  })
  @ApiBody({
    type: CreateServiceDto,
    description: 'Thông tin dịch vụ cần tạo bao gồm tên, slug, mô tả, giá và trạng thái'
  })
  @ApiResponse({ status: 201, description: 'Dịch vụ được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Dịch vụ với slug này đã tồn tại' })
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách dịch vụ',
    description: 'Lấy danh sách tất cả dịch vụ công chứng với khả năng phân trang, tìm kiếm và lọc. Endpoint công khai, không yêu cầu xác thực.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách dịch vụ được trả về thành công' })
  findAll(@Query() queryDto: QueryServicesDto) {
    return this.servicesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết dịch vụ',
    description: 'Lấy thông tin chi tiết của một dịch vụ công chứng theo ID. Endpoint công khai.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin dịch vụ được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.findOne(id);
  }

  // @Put(':id')
  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin dịch vụ',
    description: 'Cập nhật thông tin của một dịch vụ hiện có. Admin và Staff có thể thực hiện thao tác này.'
  })
  @ApiBody({
    type: UpdateServiceDto,
    description: 'Thông tin dịch vụ cần cập nhật (chỉ cần truyền các trường muốn thay đổi)'
  })
  @ApiResponse({ status: 200, description: 'Dịch vụ được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại cho dịch vụ khác' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa dịch vụ',
    description: 'Xóa một dịch vụ khỏi hệ thống. Chỉ Admin mới có quyền xóa dịch vụ.'
  })
  @ApiResponse({ status: 200, description: 'Dịch vụ được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.servicesService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật trạng thái dịch vụ',
    description: 'Kích hoạt hoặc tạm ngưng một dịch vụ. Admin và Staff có thể thực hiện thao tác này.'
  })
  @ApiResponse({ status: 200, description: 'Trạng thái dịch vụ được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy dịch vụ' })
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body('status') status: boolean) {
    return this.servicesService.updateStatus(id, status);
  }
}
