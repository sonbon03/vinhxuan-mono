import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { User } from '../users/entities/user.entity';
import { Record } from '../records/entities/record.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { FeeCalculation } from '../fee-calculations/entities/fee-calculation.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Service } from '../services/entities/service.entity';
import { Article } from '../articles/entities/article.entity';
import { Listing } from '../listings/entities/listing.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Record,
      Consultation,
      FeeCalculation,
      Employee,
      Service,
      Article,
      Listing,
    ]),
    AuthModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
