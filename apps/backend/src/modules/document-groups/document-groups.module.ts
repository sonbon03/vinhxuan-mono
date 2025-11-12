import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentGroupsService } from './document-groups.service';
import { DocumentGroupsController } from './document-groups.controller';
import { DocumentGroup } from './entities/document-group.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([DocumentGroup]), AuthModule],
  controllers: [DocumentGroupsController],
  providers: [DocumentGroupsService],
  exports: [DocumentGroupsService],
})
export class DocumentGroupsModule {}
