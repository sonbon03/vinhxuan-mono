import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeeTypesService } from './fee-types.service';
import { FeeTypesController } from './fee-types.controller';
import { FeeType } from './entities/fee-type.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FeeType]), AuthModule],
  controllers: [FeeTypesController],
  providers: [FeeTypesService],
  exports: [FeeTypesService],
})
export class FeeTypesModule {}
