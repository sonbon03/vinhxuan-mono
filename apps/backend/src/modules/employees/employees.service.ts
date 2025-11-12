import { Injectable, NotFoundException, ConflictException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee, EmployeeStatus } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { QueryEmployeesDto } from './dto/query-employees.dto';
import { UsersService } from '../users/users.service';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    // Check if email already exists
    const existingEmployee = await this.employeesRepository.findOne({
      where: { email: createEmployeeDto.email },
    });

    if (existingEmployee) {
      throw new ConflictException('Employee with this email already exists');
    }

    const employee = this.employeesRepository.create(createEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async findAll(queryDto: QueryEmployeesDto): Promise<PaginatedResult<Employee>> {
    const { page = 1, limit = 20, search, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    // Build query
    const queryBuilder = this.employeesRepository.createQueryBuilder('employee');

    // Apply status filter
    if (status) {
      queryBuilder.andWhere('employee.status = :status', { status });
    }

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(employee.name ILIKE :search OR employee.email ILIKE :search OR employee.phone ILIKE :search OR employee.position ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`employee.${sortBy}`, sortOrder);

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

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeesRepository.findOne({ where: { id } });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  async findByUserId(userId: string): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { userId } });
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    // Check email uniqueness if email is being updated
    if (updateEmployeeDto.email && updateEmployeeDto.email !== employee.email) {
      const existingEmployee = await this.employeesRepository.findOne({
        where: { email: updateEmployeeDto.email },
      });

      if (existingEmployee) {
        throw new ConflictException('Employee with this email already exists');
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async remove(id: string): Promise<void> {
    const employee = await this.findOne(id);

    // If employee has a linked user account, delete the user first
    if (employee.userId) {
      try {
        await this.usersService.removeWithoutEmployeeCascade(employee.userId);
      } catch (error) {
        console.error('Failed to delete user account:', error);
        // Continue with employee deletion even if user deletion fails
      }
    }

    const result = await this.employeesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }

  /**
   * Delete employee without cascading to User
   * Used internally to prevent circular deletion
   */
  async removeWithoutUserCascade(id: string): Promise<void> {
    const result = await this.employeesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: EmployeeStatus): Promise<Employee> {
    const employee = await this.findOne(id);
    employee.status = status;
    return this.employeesRepository.save(employee);
  }
}
