import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DocumentGroup } from './entities/document-group.entity';
import { CreateDocumentGroupDto } from './dto/create-document-group.dto';
import { UpdateDocumentGroupDto } from './dto/update-document-group.dto';
import { QueryDocumentGroupsDto } from './dto/query-document-groups.dto';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class DocumentGroupsService {
  constructor(
    @InjectRepository(DocumentGroup)
    private documentGroupsRepository: Repository<DocumentGroup>,
  ) {}

  async create(createDocumentGroupDto: CreateDocumentGroupDto): Promise<DocumentGroup> {
    // Check if slug already exists
    const existingGroup = await this.documentGroupsRepository.findOne({
      where: { slug: createDocumentGroupDto.slug },
    });

    if (existingGroup) {
      throw new ConflictException('Document group with this slug already exists');
    }

    const documentGroup = this.documentGroupsRepository.create(createDocumentGroupDto);
    return this.documentGroupsRepository.save(documentGroup);
  }

  async findAll(queryDto: QueryDocumentGroupsDto): Promise<PaginatedResult<DocumentGroup>> {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    // Build query
    const queryBuilder = this.documentGroupsRepository.createQueryBuilder('document_group');

    // Apply status filter
    if (status !== undefined) {
      queryBuilder.andWhere('document_group.status = :status', { status });
    }

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(document_group.name ILIKE :search OR document_group.slug ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`document_group.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<DocumentGroup> {
    const documentGroup = await this.documentGroupsRepository.findOne({ where: { id } });
    if (!documentGroup) {
      throw new NotFoundException(`Document group with ID ${id} not found`);
    }
    return documentGroup;
  }

  async update(id: string, updateDocumentGroupDto: UpdateDocumentGroupDto): Promise<DocumentGroup> {
    const documentGroup = await this.findOne(id);

    // Check slug uniqueness if slug is being updated
    if (updateDocumentGroupDto.slug && updateDocumentGroupDto.slug !== documentGroup.slug) {
      const existingGroup = await this.documentGroupsRepository.findOne({
        where: { slug: updateDocumentGroupDto.slug },
      });

      if (existingGroup) {
        throw new ConflictException('Document group with this slug already exists');
      }
    }

    Object.assign(documentGroup, updateDocumentGroupDto);
    return this.documentGroupsRepository.save(documentGroup);
  }

  async remove(id: string): Promise<void> {
    const result = await this.documentGroupsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Document group with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: boolean): Promise<DocumentGroup> {
    const documentGroup = await this.findOne(id);
    documentGroup.status = status;
    return this.documentGroupsRepository.save(documentGroup);
  }
}
