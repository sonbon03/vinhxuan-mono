import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Record, RecordStatus } from './entities/record.entity';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { QueryRecordsDto } from './dto/query-records.dto';
import { ReviewRecordDto } from './dto/review-record.dto';
import { UserRole } from 'src/common/enums';

@Injectable()
export class RecordsService {
  constructor(
    @InjectRepository(Record)
    private readonly recordRepository: Repository<Record>,
  ) {}

  async create(createRecordDto: CreateRecordDto, userId: string): Promise<Record> {
    const record = this.recordRepository.create({
      ...createRecordDto,
      customerId: userId,
      status: RecordStatus.PENDING,
    });

    return await this.recordRepository.save(record);
  }

  async findAll(queryDto: QueryRecordsDto, userId?: string, userRole?: UserRole) {
    const { page = 1, limit = 20, search, customerId, typeId, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    const query = this.recordRepository.createQueryBuilder('record')
      .leftJoinAndSelect('record.customer', 'customer')
      .leftJoinAndSelect('record.type', 'type')
      .leftJoinAndSelect('record.reviewer', 'reviewer');

    // If user is a CUSTOMER, only show their own records
    if (userRole === UserRole.CUSTOMER && userId) {
      query.where('record.customerId = :userId', { userId });
    }

    // Apply filters
    if (search) {
      query.andWhere('record.title ILIKE :search', { search: `%${search}%` });
    }

    if (customerId) {
      query.andWhere('record.customerId = :customerId', { customerId });
    }

    if (typeId) {
      query.andWhere('record.typeId = :typeId', { typeId });
    }

    if (status) {
      query.andWhere('record.status = :status', { status });
    }

    // Sorting
    query.orderBy(`record.${sortBy}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, userId?: string, userRole?: UserRole): Promise<Record> {
    const record = await this.recordRepository.findOne({
      where: { id },
      relations: ['customer', 'type', 'reviewer'],
    });

    if (!record) {
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }

    // If user is a CUSTOMER, only allow access to their own records
    if (userRole === UserRole.CUSTOMER && record.customerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền truy cập hồ sơ này');
    }

    return record;
  }

  async update(id: string, updateRecordDto: UpdateRecordDto, userId: string, userRole: UserRole): Promise<Record> {
    const record = await this.findOne(id, userId, userRole);

    // Customers can only update their own PENDING records
    if (userRole === UserRole.CUSTOMER) {
      if (record.customerId !== userId) {
        throw new ForbiddenException('Bạn không có quyền chỉnh sửa hồ sơ này');
      }
      if (record.status !== RecordStatus.PENDING) {
        throw new ForbiddenException('Chỉ có thể chỉnh sửa hồ sơ đang chờ duyệt');
      }
      // Customers cannot change status or reviewNotes
      delete updateRecordDto.status;
      delete updateRecordDto.reviewNotes;
    }

    Object.assign(record, updateRecordDto);
    return await this.recordRepository.save(record);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const record = await this.findOne(id, userId, userRole);

    // Customers can only delete their own records
    if (userRole === UserRole.CUSTOMER && record.customerId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa hồ sơ này');
    }

    await this.recordRepository.remove(record);
  }

  async approve(id: string, reviewDto: ReviewRecordDto, reviewerId: string): Promise<Record> {
    const record = await this.recordRepository.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }

    record.status = RecordStatus.APPROVED;
    record.reviewerId = reviewerId;
    if (reviewDto.reviewNotes) {
      record.reviewNotes = reviewDto.reviewNotes;
    }

    return await this.recordRepository.save(record);
  }

  async reject(id: string, reviewDto: ReviewRecordDto, reviewerId: string): Promise<Record> {
    const record = await this.recordRepository.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException('Không tìm thấy hồ sơ');
    }

    record.status = RecordStatus.REJECTED;
    record.reviewerId = reviewerId;
    if (reviewDto.reviewNotes) {
      record.reviewNotes = reviewDto.reviewNotes;
    }

    return await this.recordRepository.save(record);
  }
}
