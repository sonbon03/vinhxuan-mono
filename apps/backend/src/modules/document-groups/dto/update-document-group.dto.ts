import { PartialType } from '@nestjs/swagger';
import { CreateDocumentGroupDto } from './create-document-group.dto';

export class UpdateDocumentGroupDto extends PartialType(CreateDocumentGroupDto) {}
