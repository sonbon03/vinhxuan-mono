import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Consultation, ConsultationStatus } from './entities/consultation.entity';
import { CreateConsultationDto } from './dto/create-consultation.dto';
import { UpdateConsultationDto } from './dto/update-consultation.dto';
import { QueryConsultationsDto } from './dto/query-consultations.dto';
import { ApproveConsultationDto } from './dto/approve-consultation.dto';
import { CancelConsultationDto } from './dto/cancel-consultation.dto';
import { UserRole } from '@shared';
import { ResponseUtil } from '../common/utils/response.util';

@Injectable()
export class ConsultationsService {
  constructor(
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
  ) {}

  async create(
    createConsultationDto: CreateConsultationDto,
    customerId: string,
  ): Promise<Consultation> {
    const consultation = this.consultationRepository.create({
      ...createConsultationDto,
      customerId,
      requestedDatetime: new Date(createConsultationDto.requestedDatetime),
      status: ConsultationStatus.PENDING,
    });

    return await this.consultationRepository.save(consultation);
  }

  async findAll(
    queryDto: QueryConsultationsDto,
    userId?: string,
    userRole?: UserRole,
  ): Promise<{ items: Consultation[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, search, customerId, staffId, serviceId, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect('consultation.staff', 'staff')
      .leftJoinAndSelect('consultation.service', 'service');

    // If user is a CUSTOMER, only show their own consultations
    if (userRole === UserRole.CUSTOMER && userId) {
      query.where('consultation.customerId = :userId', { userId });
    }

    // If user is a STAFF, show all consultations (they can manage all)
    // Admin sees all by default

    // Search filter
    if (search) {
      query.andWhere(
        '(customer.fullName ILIKE :search OR consultation.content ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Specific filters
    if (customerId) {
      query.andWhere('consultation.customerId = :customerId', { customerId });
    }

    if (staffId) {
      query.andWhere('consultation.staffId = :staffId', { staffId });
    }

    if (serviceId) {
      query.andWhere('consultation.serviceId = :serviceId', { serviceId });
    }

    if (status) {
      query.andWhere('consultation.status = :status', { status });
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'requestedDatetime', 'updatedAt', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`consultation.${sortField}`, sortOrder);

    // Pagination
    const total = await query.getCount();
    const items = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      items,
      total,
      page,
      limit,
    };
  }

  async getMyConsultations(
    queryDto: QueryConsultationsDto,
    userId: string,
    userRole: UserRole,
  ) {
    const {
      page = 1,
      limit = 20,
      search,
      serviceId,
      status,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const query = this.consultationRepository
      .createQueryBuilder('consultation')
      .leftJoinAndSelect('consultation.customer', 'customer')
      .leftJoinAndSelect('consultation.staff', 'staff')
      .leftJoinAndSelect('consultation.service', 'service');

    // Filter based on user role
    if (userRole === UserRole.CUSTOMER) {
      // Customers see only their own consultations
      query.where('consultation.customerId = :userId', { userId });
    } else if (userRole === UserRole.STAFF) {
      // Staff see consultations assigned to them
      query.where('consultation.staffId = :userId', { userId });
    }
    // Admin sees all consultations (no filter needed)

    // Search filter
    if (search) {
      query.andWhere('consultation.content ILIKE :search', { search: `%${search}%` });
    }

    // Service filter
    if (serviceId) {
      query.andWhere('consultation.serviceId = :serviceId', { serviceId });
    }

    // Status filter
    if (status) {
      query.andWhere('consultation.status = :status', { status });
    }

    // Sorting
    const allowedSortFields = ['createdAt', 'requestedDatetime', 'updatedAt', 'status'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    query.orderBy(`consultation.${sortField}`, sortOrder);

    // Pagination
    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [items, total] = await query.getManyAndCount();

    return ResponseUtil.paginated(
      items,
      total,
      page,
      limit,
      'Lấy danh sách lịch tư vấn của bạn thành công',
    );
  }

  async findOne(id: string, userId?: string, userRole?: UserRole): Promise<Consultation> {
    const consultation = await this.consultationRepository.findOne({
      where: { id },
      relations: ['customer', 'staff', 'service'],
    });

    if (!consultation) {
      throw new NotFoundException('Consultation not found');
    }

    // Customers can only view their own consultations
    if (userRole === UserRole.CUSTOMER && consultation.customerId !== userId) {
      throw new ForbiddenException('You can only view your own consultations');
    }

    return consultation;
  }

  async update(
    id: string,
    updateConsultationDto: UpdateConsultationDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Consultation> {
    const consultation = await this.findOne(id, userId, userRole);

    // Only Staff/Admin can update consultations
    if (userRole !== UserRole.STAFF && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only staff and admin can update consultations');
    }

    // Update fields
    if (updateConsultationDto.serviceId !== undefined) {
      consultation.serviceId = updateConsultationDto.serviceId;
    }

    if (updateConsultationDto.staffId !== undefined) {
      consultation.staffId = updateConsultationDto.staffId;
    }

    if (updateConsultationDto.requestedDatetime) {
      consultation.requestedDatetime = new Date(updateConsultationDto.requestedDatetime);
    }

    if (updateConsultationDto.content) {
      consultation.content = updateConsultationDto.content;
    }

    if (updateConsultationDto.notes !== undefined) {
      consultation.notes = updateConsultationDto.notes;
    }

    return await this.consultationRepository.save(consultation);
  }

  async approve(
    id: string,
    approveDto: ApproveConsultationDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Consultation> {
    const consultation = await this.findOne(id, userId, userRole);

    // Only Staff/Admin can approve
    if (userRole !== UserRole.STAFF && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only staff and admin can approve consultations');
    }

    if (consultation.status !== ConsultationStatus.PENDING) {
      throw new BadRequestException('Can only approve pending consultations');
    }

    consultation.status = ConsultationStatus.APPROVED;

    if (approveDto.staffId) {
      consultation.staffId = approveDto.staffId;
    }

    if (approveDto.notes) {
      consultation.notes = approveDto.notes;
    }

    return await this.consultationRepository.save(consultation);
  }

  async complete(id: string, userId: string, userRole: UserRole): Promise<Consultation> {
    const consultation = await this.findOne(id, userId, userRole);

    // Only Staff/Admin can mark as completed
    if (userRole !== UserRole.STAFF && userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only staff and admin can complete consultations');
    }

    if (consultation.status !== ConsultationStatus.APPROVED) {
      throw new BadRequestException('Can only complete approved consultations');
    }

    consultation.status = ConsultationStatus.COMPLETED;

    return await this.consultationRepository.save(consultation);
  }

  async cancel(
    id: string,
    cancelDto: CancelConsultationDto,
    userId: string,
    userRole: UserRole,
  ): Promise<Consultation> {
    const consultation = await this.findOne(id, userId, userRole);

    // Customers can cancel their own, Staff/Admin can cancel any
    if (userRole === UserRole.CUSTOMER && consultation.customerId !== userId) {
      throw new ForbiddenException('You can only cancel your own consultations');
    }

    if (consultation.status === ConsultationStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel completed consultations');
    }

    if (consultation.status === ConsultationStatus.CANCELLED) {
      throw new BadRequestException('Consultation is already cancelled');
    }

    consultation.status = ConsultationStatus.CANCELLED;
    consultation.cancelReason = cancelDto.cancelReason;

    return await this.consultationRepository.save(consultation);
  }

  async remove(id: string, userId: string, userRole: UserRole): Promise<void> {
    const consultation = await this.findOne(id, userId, userRole);

    // Only Admin can delete
    if (userRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can delete consultations');
    }

    await this.consultationRepository.remove(consultation);
  }
}
