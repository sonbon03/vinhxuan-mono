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
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { QueryCategoriesDto } from './dto/query-categories.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Tạo thể loại mới',
    description: 'Tạo một thể loại/danh mục mới cho các module khác nhau (dịch vụ, bài viết, tin rao, hồ sơ). Admin và Staff có thể thực hiện thao tác này.'
  })
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Thông tin thể loại cần tạo bao gồm tên, slug, module type và trạng thái'
  })
  @ApiResponse({ status: 201, description: 'Thể loại được tạo thành công' })
  @ApiResponse({ status: 409, description: 'Thể loại với slug này đã tồn tại' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách thể loại',
    description: 'Lấy danh sách tất cả thể loại với khả năng phân trang, tìm kiếm và lọc theo module type. Endpoint công khai.'
  })
  @ApiResponse({ status: 200, description: 'Danh sách thể loại được trả về thành công' })
  findAll(@Query() queryDto: QueryCategoriesDto) {
    return this.categoriesService.findAll(queryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Lấy thông tin chi tiết thể loại',
    description: 'Lấy thông tin chi tiết của một thể loại theo ID. Endpoint công khai.'
  })
  @ApiResponse({ status: 200, description: 'Thông tin thể loại được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật thông tin thể loại',
    description: 'Cập nhật thông tin của một thể loại hiện có. Admin và Staff có thể thực hiện thao tác này.'
  })
  @ApiBody({
    type: UpdateCategoryDto,
    description: 'Thông tin thể loại cần cập nhật (chỉ cần truyền các trường muốn thay đổi)'
  })
  @ApiResponse({ status: 200, description: 'Thể loại được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  @ApiResponse({ status: 409, description: 'Slug đã tồn tại cho thể loại khác' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Xóa thể loại',
    description: 'Xóa một thể loại khỏi hệ thống. Chỉ Admin mới có quyền xóa thể loại.'
  })
  @ApiResponse({ status: 200, description: 'Thể loại được xóa thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.remove(id);
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cập nhật trạng thái thể loại',
    description: 'Kích hoạt hoặc tạm ngưng một thể loại. Admin và Staff có thể thực hiện thao tác này.'
  })
  @ApiResponse({ status: 200, description: 'Trạng thái thể loại được cập nhật thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy thể loại' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: boolean,
  ) {
    return this.categoriesService.updateStatus(id, status);
  }
}
