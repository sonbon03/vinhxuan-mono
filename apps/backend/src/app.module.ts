import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ServicesModule } from './modules/services/services.module';
import { DocumentGroupsModule } from './modules/document-groups/document-groups.module';
import { FeeTypesModule } from './modules/fee-types/fee-types.module';
import { FeeCalculationsModule } from './modules/fee-calculations/fee-calculations.module';
import { RecordsModule } from './modules/records/records.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { ListingsModule } from './modules/listings/listings.module';
import { ConsultationsModule } from './modules/consultations/consultations.module';
import { EmailCampaignsModule } from './modules/email-campaigns/email-campaigns.module';
import { ChatbotModule } from './modules/chatbot/chatbot.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { RedisModule } from './modules/redis/redis.module';
import { dataSourceOptions } from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['apps/backend/.env', '.env'],
    }),
    TypeOrmModule.forRoot(dataSourceOptions as TypeOrmModuleOptions),
    RedisModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    CategoriesModule,
    ServicesModule,
    DocumentGroupsModule,
    FeeTypesModule,
    FeeCalculationsModule,
    RecordsModule,
    ArticlesModule,
    ListingsModule,
    ConsultationsModule,
    EmailCampaignsModule,
    ChatbotModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
