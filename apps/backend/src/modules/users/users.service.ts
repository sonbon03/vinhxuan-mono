import { Injectable, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindOptionsWhere } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserRole } from '@shared';
import { QueryUsersDto } from './dto/query-users.dto';
import * as bcrypt from 'bcrypt';
import { EmployeesService } from '../employees/employees.service';
import { EmployeeStatus } from '../employees/entities/employee.entity';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(user);

    // If user is ADMIN or STAFF, create an employee record
    if (savedUser.role === UserRole.ADMIN || savedUser.role === UserRole.STAFF) {
      try {
        await this.employeesService.create({
          name: savedUser.fullName,
          position: createUserDto.position || 'Staff',
          email: savedUser.email,
          phone: savedUser.phone,
          yearsOfExperience: createUserDto.yearsOfExperience || 0,
          dateOfBirth: savedUser.dateOfBirth,
          userId: savedUser.id,
          status: EmployeeStatus.WORKING,
        });
      } catch (error) {
        // If employee creation fails, rollback user creation
        await this.usersRepository.delete(savedUser.id);
        throw error;
      }
    }

    return savedUser;
  }

  async findAll(queryDto: QueryUsersDto): Promise<PaginatedResult<User>> {
    const { page = 1, limit = 20, search, role, status, sortBy = 'createdAt', sortOrder = 'DESC' } = queryDto;

    const where: FindOptionsWhere<User> | FindOptionsWhere<User>[] = {};

    // Apply filters
    if (role) {
      where.role = role;
    }

    if (status !== undefined) {
      where.status = status;
    }

    // Build query
    const queryBuilder = this.usersRepository.createQueryBuilder('user');

    // Apply role and status filters
    if (role) {
      queryBuilder.andWhere('user.role = :role', { role });
    }

    if (status !== undefined) {
      queryBuilder.andWhere('user.status = :status', { status });
    }

    // Apply search
    if (search) {
      queryBuilder.andWhere(
        '(user.fullName ILIKE :search OR user.email ILIKE :search OR user.phone ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    // Apply sorting
    queryBuilder.orderBy(`user.${sortBy}`, sortOrder);

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [items, total] = await queryBuilder.getManyAndCount();

    // Remove password from results
    const sanitizedItems = items.map(user => {
      const { password, ...result } = user;
      return result as User;
    });

    return {
      items: sanitizedItems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    const oldRole = user.role;
    const newRole = updateUserDto.role || oldRole;

    // If password is being updated, hash it
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    const savedUser = await this.usersRepository.save(user);

    // Handle employee record based on role change
    const isBecomingStaff =
      (oldRole === UserRole.CUSTOMER) &&
      (newRole === UserRole.ADMIN || newRole === UserRole.STAFF);

    const isLeavingStaff =
      (oldRole === UserRole.ADMIN || oldRole === UserRole.STAFF) &&
      (newRole === UserRole.CUSTOMER);

    if (isBecomingStaff) {
      // Create employee record if user is becoming ADMIN or STAFF
      try {
        // Check if employee record already exists
        const existingEmployee = await this.employeesService.findByUserId(savedUser.id);
        if (!existingEmployee) {
          await this.employeesService.create({
            userId: savedUser.id,
            name: savedUser.fullName,
            position: updateUserDto.position || 'Staff',
            email: savedUser.email,
            phone: savedUser.phone,
            yearsOfExperience: updateUserDto.yearsOfExperience || 0,
            dateOfBirth: savedUser.dateOfBirth,
            status: EmployeeStatus.WORKING,
          });
        }
      } catch (error) {
        console.error('Failed to create employee record:', error);
        // Don't fail the user update if employee creation fails
      }
    } else if (isLeavingStaff) {
      // Mark employee as resigned if user is leaving ADMIN/STAFF role
      try {
        const existingEmployee = await this.employeesService.findByUserId(savedUser.id);
        if (existingEmployee) {
          await this.employeesService.updateStatus(existingEmployee.id, EmployeeStatus.RESIGNED);
        }
      } catch (error) {
        console.error('Failed to update employee status:', error);
        // Don't fail the user update if employee update fails
      }
    } else if (newRole === UserRole.ADMIN || newRole === UserRole.STAFF) {
      // Update or create employee record for ADMIN/STAFF users
      try {
        const existingEmployee = await this.employeesService.findByUserId(savedUser.id);

        if (existingEmployee) {
          // Update existing employee record
          const updateData: any = {};
          if (updateUserDto.fullName) updateData.name = updateUserDto.fullName;
          if (updateUserDto.email) updateData.email = updateUserDto.email;
          if (updateUserDto.phone) updateData.phone = updateUserDto.phone;
          if (updateUserDto.position) updateData.position = updateUserDto.position;
          if (updateUserDto.yearsOfExperience !== undefined) updateData.yearsOfExperience = updateUserDto.yearsOfExperience;

          if (Object.keys(updateData).length > 0) {
            await this.employeesService.update(existingEmployee.id, updateData);
          }
        } else {
          // Create employee record if it doesn't exist
          await this.employeesService.create({
            userId: savedUser.id,
            name: savedUser.fullName,
            position: updateUserDto.position || 'Staff',
            email: savedUser.email,
            phone: savedUser.phone,
            yearsOfExperience: updateUserDto.yearsOfExperience || 0,
            dateOfBirth: savedUser.dateOfBirth,
            status: EmployeeStatus.WORKING,
          });
        }
      } catch (error) {
        console.error('[UserService] Failed to sync employee record:', error instanceof Error ? error.message : error);
        // Don't fail the user update if employee sync fails
      }
    }

    // Remove password from response
    const { password, ...result } = savedUser;
    return result as User;
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);

    // If user is ADMIN or STAFF, delete the corresponding employee record first
    if (user.role === UserRole.ADMIN || user.role === UserRole.STAFF) {
      try {
        const employee = await this.employeesService.findByUserId(id);
        if (employee) {
          // Directly delete employee using service (which now has cascade protection)
          await this.employeesService.removeWithoutUserCascade(employee.id);
        }
      } catch (error) {
        console.error('Failed to delete employee record:', error);
        // Continue with user deletion even if employee deletion fails
      }
    }

    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  /**
   * Delete user without cascading to Employee
   * Used internally to prevent circular deletion
   */
  async removeWithoutEmployeeCascade(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async updateStatus(id: string, status: boolean): Promise<User> {
    const user = await this.findOne(id);
    user.status = status;
    return this.usersRepository.save(user);
  }

  async activate(id: string): Promise<User> {
    return this.updateStatus(id, true);
  }

  async deactivate(id: string): Promise<User> {
    return this.updateStatus(id, false);
  }
}
