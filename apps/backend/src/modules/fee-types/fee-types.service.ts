import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeeType } from './entities/fee-type.entity';
import { CreateFeeTypeDto } from './dto/create-fee-type.dto';
import { UpdateFeeTypeDto } from './dto/update-fee-type.dto';
import { QueryFeeTypesDto } from './dto/query-fee-types.dto';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class FeeTypesService {
  constructor(
    @InjectRepository(FeeType)
    private feeTypesRepository: Repository<FeeType>,
  ) {}

  async create(createFeeTypeDto: CreateFeeTypeDto): Promise<FeeType> {
    const feeType = this.feeTypesRepository.create(createFeeTypeDto);
    return this.feeTypesRepository.save(feeType);
  }

  async findAll(queryDto: QueryFeeTypesDto): Promise<PaginatedResult<FeeType>> {
    const {
      page = 1,
      limit = 20,
      search,
      documentGroupId,
      calculationMethod,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    // Build query
    const queryBuilder = this.feeTypesRepository.createQueryBuilder('fee_type');

    // Eager load document group
    queryBuilder.leftJoinAndSelect('fee_type.documentGroup', 'documentGroup');

    // Apply document group filter
    if (documentGroupId) {
      queryBuilder.andWhere('fee_type.documentGroupId = :documentGroupId', { documentGroupId });
    }

    // Apply calculation method filter
    if (calculationMethod) {
      queryBuilder.andWhere('fee_type.calculationMethod = :calculationMethod', {
        calculationMethod,
      });
    }

    // Apply status filter
    if (status !== undefined) {
      queryBuilder.andWhere('fee_type.status = :status', { status });
    }

    // Apply search
    if (search) {
      queryBuilder.andWhere('fee_type.name ILIKE :search', { search: `%${search}%` });
    }

    // Apply sorting
    queryBuilder.orderBy(`fee_type.${sortBy}`, sortOrder);

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

  async findOne(id: string): Promise<FeeType> {
    const feeType = await this.feeTypesRepository.findOne({
      where: { id },
      relations: ['documentGroup'],
    });

    if (!feeType) {
      throw new NotFoundException(`Fee type with ID ${id} not found`);
    }

    return feeType;
  }

  async findByDocumentGroup(documentGroupId: string): Promise<FeeType[]> {
    return this.feeTypesRepository.find({
      where: { documentGroupId, status: true },
      relations: ['documentGroup'],
    });
  }

  async update(id: string, updateFeeTypeDto: UpdateFeeTypeDto): Promise<FeeType> {
    const feeType = await this.findOne(id);
    Object.assign(feeType, updateFeeTypeDto);
    return this.feeTypesRepository.save(feeType);
  }

  async remove(id: string): Promise<void> {
    const result = await this.feeTypesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Fee type with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: boolean): Promise<FeeType> {
    const feeType = await this.findOne(id);
    feeType.status = status;
    return this.feeTypesRepository.save(feeType);
  }
}
