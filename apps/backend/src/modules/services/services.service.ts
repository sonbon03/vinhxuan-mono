import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { QueryServicesDto } from './dto/query-services.dto';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private servicesRepository: Repository<Service>,
  ) {}

  async create(createServiceDto: CreateServiceDto): Promise<Service> {
    // Check if slug already exists
    const existingService = await this.servicesRepository.findOne({
      where: { slug: createServiceDto.slug },
    });

    if (existingService) {
      throw new ConflictException('Service with this slug already exists');
    }

    const service = this.servicesRepository.create(createServiceDto);
    return this.servicesRepository.save(service);
  }

  async findAll(queryDto: QueryServicesDto): Promise<PaginatedResult<Service>> {
    const { page = 1, limit = 20, search, categoryId, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    // Build query
    const queryBuilder = this.servicesRepository.createQueryBuilder('service');

    // Eager load category
    queryBuilder.leftJoinAndSelect('service.category', 'category');

    // Apply category filter
    if (categoryId) {
      queryBuilder.andWhere('service.categoryId = :categoryId', { categoryId });
    }

    // Apply status filter
    if (status !== undefined) {
      queryBuilder.andWhere('service.status = :status', { status });
    }

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(service.name ILIKE :search OR service.slug ILIKE :search OR service.description ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`service.${sortBy}`, sortOrder);

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

  async findOne(id: string): Promise<Service> {
    const service = await this.servicesRepository.findOne({
      where: { id },
      relations: ['category'],
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto): Promise<Service> {
    const service = await this.findOne(id);

    // Check slug uniqueness if slug is being updated
    if (updateServiceDto.slug && updateServiceDto.slug !== service.slug) {
      const existingService = await this.servicesRepository.findOne({
        where: { slug: updateServiceDto.slug },
      });

      if (existingService) {
        throw new ConflictException('Service with this slug already exists');
      }
    }

    Object.assign(service, updateServiceDto);
    return this.servicesRepository.save(service);
  }

  async remove(id: string): Promise<void> {
    const result = await this.servicesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: boolean): Promise<Service> {
    const service = await this.findOne(id);
    service.status = status;
    return this.servicesRepository.save(service);
  }
}
