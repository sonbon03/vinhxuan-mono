import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeCalculationsService } from './fee-calculations.service';
import { FeeCalculationsController } from './fee-calculations.controller';
import { FeeCalculation } from './entities/fee-calculation.entity';
import { FeeTypesModule } from '../fee-types/fee-types.module';
import { DocumentGroupsModule } from '../document-groups/document-groups.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeeCalculation]),
    FeeTypesModule,
    DocumentGroupsModule,
    AuthModule,
  ],
  controllers: [FeeCalculationsController],
  providers: [FeeCalculationsService],
  exports: [FeeCalculationsService],
})
export class FeeCalculationsModule {}
