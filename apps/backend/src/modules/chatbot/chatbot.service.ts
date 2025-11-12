import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatSession, ChatSessionStatus } from './entities/chat-session.entity';
import { ChatMessage, MessageSender } from './entities/chat-message.entity';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(ChatSession)
    private chatSessionRepository: Repository<ChatSession>,
    @InjectRepository(ChatMessage)
    private chatMessageRepository: Repository<ChatMessage>,
  ) {}

  async sendMessage(
    sendMessageDto: SendMessageDto,
    userId?: string,
  ): Promise<{ session: ChatSession; userMessage: ChatMessage; botResponse: ChatMessage }> {
    let session: ChatSession;

    // Get or create session
    if (sendMessageDto.sessionId) {
      session = await this.chatSessionRepository.findOne({
        where: { id: sendMessageDto.sessionId },
      });
      if (!session) {
        throw new NotFoundException('Chat session not found');
      }
    } else {
      // Create new session
      session = this.chatSessionRepository.create({
        userId,
        status: ChatSessionStatus.ACTIVE,
      });
      session = await this.chatSessionRepository.save(session);
    }

    // Save user message
    const userMessage = this.chatMessageRepository.create({
      sessionId: session.id,
      sender: MessageSender.USER,
      messageText: sendMessageDto.messageText,
    });
    await this.chatMessageRepository.save(userMessage);

    // Generate bot response
    const botResponseText = this.generateBotResponse(sendMessageDto.messageText);

    const botResponse = this.chatMessageRepository.create({
      sessionId: session.id,
      sender: MessageSender.BOT,
      messageText: botResponseText,
    });
    await this.chatMessageRepository.save(botResponse);

    return {
      session,
      userMessage,
      botResponse,
    };
  }

  async escalateToAgent(sessionId: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    session.status = ChatSessionStatus.ESCALATED;
    session.escalatedAt = new Date();

    // Send escalation message
    const escalationMessage = this.chatMessageRepository.create({
      sessionId: session.id,
      sender: MessageSender.BOT,
      messageText:
        'Bạn đã được chuyển tiếp đến nhân viên hỗ trợ. Vui lòng chờ trong giây lát, nhân viên sẽ liên hệ với bạn sớm nhất có thể.',
    });
    await this.chatMessageRepository.save(escalationMessage);

    return await this.chatSessionRepository.save(session);
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId },
      relations: ['messages', 'user'],
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    return session;
  }

  async getAllSessions(
    page: number = 1,
    limit: number = 20,
  ): Promise<{ items: ChatSession[]; total: number; page: number; limit: number }> {
    const query = this.chatSessionRepository
      .createQueryBuilder('session')
      .leftJoinAndSelect('session.user', 'user')
      .orderBy('session.updatedAt', 'DESC');

    const total = await query.getCount();
    const items = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async closeSession(sessionId: string): Promise<ChatSession> {
    const session = await this.chatSessionRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException('Chat session not found');
    }

    session.status = ChatSessionStatus.CLOSED;
    session.endedAt = new Date();

    return await this.chatSessionRepository.save(session);
  }

  // Simple mock AI response generator
  private generateBotResponse(userMessage: string): string {
    const lowerMessage = userMessage.toLowerCase();

    // Keywords and responses
    const responses: { keywords: string[]; reply: string }[] = [
      {
        keywords: ['xin chào', 'chào', 'hello', 'hi'],
        reply:
          'Xin chào! Tôi là trợ lý ảo của Vinh Xuân. Tôi có thể giúp gì cho bạn hôm nay? Bạn có thể hỏi về dịch vụ công chứng, phí, hoặc đặt lịch tư vấn.',
      },
      {
        keywords: ['dịch vụ', 'service', 'công chứng'],
        reply:
          'Chúng tôi cung cấp các dịch vụ công chứng: Hợp đồng mua bán, Chuyển nhượng, Tặng cho, Góp vốn, Thế chấp, Di sản thừa kế. Bạn muốn biết thêm về dịch vụ nào?',
      },
      {
        keywords: ['phí', 'giá', 'price', 'cost', 'chi phí'],
        reply:
          'Phí công chứng phụ thuộc vào loại giấy tờ và giá trị tài sản. Bạn có thể sử dụng công cụ "Tính Phí" trên trang web để tính phí chính xác, hoặc tôi có thể chuyển bạn đến nhân viên tư vấn.',
      },
      {
        keywords: ['đặt lịch', 'tư vấn', 'appointment', 'book', 'hẹn'],
        reply:
          'Bạn có thể đặt lịch tư vấn trực tiếp trên trang "Lịch tư vấn". Vui lòng chọn thời gian và nội dung cần tư vấn. Nhân viên sẽ liên hệ xác nhận với bạn.',
      },
      {
        keywords: ['hồ sơ', 'nộp hồ sơ', 'documents', 'submit'],
        reply:
          'Bạn có thể tạo và nộp hồ sơ công chứng online qua trang "Hồ sơ". Vui lòng cung cấp đầy đủ thông tin và tài liệu đính kèm. Hồ sơ sẽ được xử lý trong vòng 24h.',
      },
      {
        keywords: ['liên hệ', 'contact', 'số điện thoại', 'phone', 'email'],
        reply:
          'Bạn có thể liên hệ chúng tôi qua:\n- Email: support@vinhxuan.com\n- Hotline: 1900-xxxx\n- Hoặc để lại thông tin, chúng tôi sẽ gọi lại cho bạn.',
      },
      {
        keywords: ['giờ làm việc', 'working hours', 'thời gian'],
        reply:
          'Chúng tôi làm việc:\n- Thứ 2 - Thứ 6: 8:00 - 17:30\n- Thứ 7: 8:00 - 12:00\n- Chủ nhật: Nghỉ\nBạn có thể đặt lịch tư vấn online bất cứ lúc nào!',
      },
      {
        keywords: ['nhân viên', 'agent', 'người thật', 'human'],
        reply:
          'Tôi sẽ chuyển bạn đến nhân viên tư vấn. Vui lòng nhấn nút "Chuyển đến nhân viên" hoặc tiếp tục trò chuyện, tôi sẽ thông báo cho nhân viên.',
      },
      {
        keywords: ['cảm ơn', 'thank', 'thanks'],
        reply: 'Rất vui được hỗ trợ bạn! Nếu còn thắc mắc gì, đừng ngại hỏi nhé. Chúc bạn một ngày tốt lành!',
      },
    ];

    // Find matching response
    for (const item of responses) {
      if (item.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return item.reply;
      }
    }

    // Default response
    return 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Bạn có thể hỏi về: dịch vụ công chứng, phí, đặt lịch tư vấn, nộp hồ sơ. Hoặc bạn muốn tôi chuyển đến nhân viên hỗ trợ?';
  }
}
