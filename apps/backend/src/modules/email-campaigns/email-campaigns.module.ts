import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailCampaignsService } from './email-campaigns.service';
import { EmailCampaignsController } from './email-campaigns.controller';
import { EmailCampaign } from './entities/email-campaign.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([EmailCampaign]), AuthModule],
  controllers: [EmailCampaignsController],
  providers: [EmailCampaignsService],
  exports: [EmailCampaignsService],
})
export class EmailCampaignsModule {}
