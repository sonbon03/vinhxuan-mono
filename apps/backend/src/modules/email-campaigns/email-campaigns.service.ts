import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailCampaign } from './entities/email-campaign.entity';
import { CreateEmailCampaignDto } from './dto/create-email-campaign.dto';
import { UpdateEmailCampaignDto } from './dto/update-email-campaign.dto';
import { QueryEmailCampaignsDto } from './dto/query-email-campaigns.dto';

@Injectable()
export class EmailCampaignsService {
  constructor(
    @InjectRepository(EmailCampaign)
    private emailCampaignRepository: Repository<EmailCampaign>,
  ) {}

  async create(createEmailCampaignDto: CreateEmailCampaignDto): Promise<EmailCampaign> {
    const campaign = this.emailCampaignRepository.create({
      ...createEmailCampaignDto,
      status: createEmailCampaignDto.status !== undefined ? createEmailCampaignDto.status : true,
    });

    return await this.emailCampaignRepository.save(campaign);
  }

  async findAll(
    queryDto: QueryEmailCampaignsDto,
  ): Promise<{ items: EmailCampaign[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, search, eventType, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    const query = this.emailCampaignRepository.createQueryBuilder('campaign');

    // Search filter
    if (search) {
      query.where('campaign.title ILIKE :search', { search: `%${search}%` });
    }

    // Event type filter
    if (eventType) {
      query.andWhere('campaign.eventType = :eventType', { eventType });
    }

    // Status filter
    if (status !== undefined) {
      query.andWhere('campaign.status = :status', { status });
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'updatedAt', 'title', 'eventType', 'sentCount', 'lastSentAt'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`campaign.${sortField}`, sortOrder);

    // Pagination
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

  async findOne(id: string): Promise<EmailCampaign> {
    const campaign = await this.emailCampaignRepository.findOne({
      where: { id },
    });

    if (!campaign) {
      throw new NotFoundException('Email campaign not found');
    }

    return campaign;
  }

  async update(id: string, updateEmailCampaignDto: UpdateEmailCampaignDto): Promise<EmailCampaign> {
    const campaign = await this.findOne(id);

    Object.assign(campaign, updateEmailCampaignDto);

    return await this.emailCampaignRepository.save(campaign);
  }

  async remove(id: string): Promise<void> {
    const campaign = await this.findOne(id);
    await this.emailCampaignRepository.remove(campaign);
  }

  async toggleStatus(id: string): Promise<EmailCampaign> {
    const campaign = await this.findOne(id);
    campaign.status = !campaign.status;
    return await this.emailCampaignRepository.save(campaign);
  }

  // Method to send emails (placeholder - would integrate with actual email service)
  async sendCampaign(id: string): Promise<{ success: boolean; sentCount: number }> {
    const campaign = await this.findOne(id);

    // TODO: Implement actual email sending logic
    // This would:
    // 1. Get recipients based on recipientCriteria
    // 2. Replace template variables ({{name}}, {{date}})
    // 3. Send emails via SMTP/SendGrid
    // 4. Update sentCount and lastSentAt

    campaign.sentCount += 1;
    campaign.lastSentAt = new Date();
    await this.emailCampaignRepository.save(campaign);

    return {
      success: true,
      sentCount: 1, // Mock count
    };
  }
}
