import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from 'src/common/enums';

@ApiTags('Chatbot')
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Gửi tin nhắn đến chatbot',
    description:
      'Gửi tin nhắn và nhận phản hồi tự động từ chatbot AI. Hỗ trợ cả khách (guest) và người dùng đã đăng nhập. Chatbot có thể trả lời câu hỏi về dịch vụ, phí, quy trình công chứng.',
  })
  @ApiResponse({
    status: 201,
    description: 'Tin nhắn đã được gửi và nhận phản hồi từ chatbot',
  })
  @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ' })
  sendMessage(@Body() sendMessageDto: SendMessageDto, @Req() req: any) {
    const userId = req.user?.userId;
    return this.chatbotService.sendMessage(sendMessageDto, userId);
  }

  @Post('escalate/:sessionId')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Chuyển tiếp đến nhân viên hỗ trợ thật',
    description:
      'Yêu cầu hỗ trợ từ nhân viên khi chatbot không thể giải quyết. Phiên chat sẽ được gán cho nhân viên hỗ trợ.',
  })
  @ApiResponse({ status: 200, description: 'Đã chuyển tiếp đến nhân viên thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phiên chat' })
  escalateToAgent(@Param('sessionId') sessionId: string) {
    return this.chatbotService.escalateToAgent(sessionId);
  }

  @Get('session/:id')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Lấy chi tiết phiên chat',
    description: 'Xem lịch sử hội thoại của một phiên chat bao gồm tất cả tin nhắn.',
  })
  @ApiResponse({ status: 200, description: 'Chi tiết phiên chat và lịch sử tin nhắn' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phiên chat' })
  getSession(@Param('id') id: string) {
    return this.chatbotService.getSession(id);
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.STAFF, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Lấy danh sách tất cả phiên chat (Staff/Admin)',
    description:
      'Lấy danh sách tất cả phiên chat trong hệ thống với phân trang. Chỉ Staff/Admin có quyền xem.',
  })
  @ApiResponse({ status: 200, description: 'Danh sách phiên chat' })
  @ApiResponse({ status: 401, description: 'Chưa đăng nhập' })
  @ApiResponse({ status: 403, description: 'Không có quyền truy cập' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  getAllSessions(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.chatbotService.getAllSessions(page, limit);
  }

  @Post('session/:id/close')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Đóng phiên chat',
    description: 'Kết thúc phiên chat hiện tại. Người dùng có thể tạo phiên mới sau.',
  })
  @ApiResponse({ status: 200, description: 'Phiên chat đã được đóng thành công' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy phiên chat' })
  closeSession(@Param('id') id: string) {
    return this.chatbotService.closeSession(id);
  }
}
