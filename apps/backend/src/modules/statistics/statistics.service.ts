import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Record, RecordStatus } from '../records/entities/record.entity';
import { Consultation } from '../consultations/entities/consultation.entity';
import { FeeCalculation } from '../fee-calculations/entities/fee-calculation.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Service } from '../services/entities/service.entity';
import { Article } from '../articles/entities/article.entity';
import { Listing } from '../listings/entities/listing.entity';
import {
  OverviewStatisticsDto,
  RecordsByStatusDto,
  RecordsByTimeDto,
  RecordsByTypeDto,
  UsersByRoleDto,
  UserGrowthDto,
  UserActivityDto,
  RecordsByStaffDto,
  TaskSummaryDto,
  StaffPerformanceDto,
  RevenueByPeriodDto,
  RevenueByServiceDto,
  RevenueByStaffDto,
} from './dto/statistics-response.dto';
import { DateRangeDto, TimePeriod } from './dto/statistics-query.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Record)
    private recordRepository: Repository<Record>,
    @InjectRepository(Consultation)
    private consultationRepository: Repository<Consultation>,
    @InjectRepository(FeeCalculation)
    private feeCalculationRepository: Repository<FeeCalculation>,
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
    @InjectRepository(Service)
    private serviceRepository: Repository<Service>,
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
    @InjectRepository(Listing)
    private listingRepository: Repository<Listing>,
  ) {}

  // ============ OVERVIEW DASHBOARD ============
  async getOverview(dateRange?: DateRangeDto): Promise<OverviewStatisticsDto> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const [
      totalUsers,
      activeUsers,
      totalRecords,
      pendingRecords,
      completedRecords,
      totalConsultations,
      pendingConsultations,
      totalRevenue,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { status: true } }),
      this.recordRepository.count(whereClause ? { where: whereClause } : {}),
      this.recordRepository.count({
        where: { status: 'PENDING', ...whereClause },
      }),
      this.recordRepository.count({
        where: { status: 'APPROVED', ...whereClause },
      }),
      this.consultationRepository.count(
        whereClause ? { where: whereClause } : {},
      ),
      this.consultationRepository.count({
        where: { status: 'PENDING', ...whereClause },
      }),
      this.calculateTotalRevenue(dateRange),
    ]);

    return {
      totalUsers,
      activeUsers,
      totalRecords,
      pendingRecords,
      completedRecords,
      totalConsultations,
      pendingConsultations,
      totalRevenue,
    };
  }

  // ============ RECORD STATISTICS ============
  async getRecordsByStatus(
    dateRange?: DateRangeDto,
  ): Promise<RecordsByStatusDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .select('record.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where(whereClause || '1=1')
      .groupBy('record.status')
      .getRawMany();

    const total = records.reduce((sum, r) => sum + parseInt(r.count), 0);

    return records.map((r) => ({
      status: r.status,
      count: parseInt(r.count),
      percentage: total > 0 ? (parseInt(r.count) / total) * 100 : 0,
    }));
  }

  async getRecordsByTime(
    period: TimePeriod,
    dateRange?: DateRangeDto,
  ): Promise<RecordsByTimeDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);
    const periodFormat = this.getPeriodFormat(period);

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .select(`TO_CHAR(record.createdAt, '${periodFormat}')`, 'period')
      .addSelect('COUNT(*)', 'count')
      .where(whereClause || '1=1')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return records.map((r) => ({
      period: r.period,
      count: parseInt(r.count),
    }));
  }

  async getRecordsByType(
    dateRange?: DateRangeDto,
  ): Promise<RecordsByTypeDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .leftJoinAndSelect('record.type', 'category')
      .select('category.name', 'type')
      .addSelect('COUNT(*)', 'count')
      .where(whereClause || '1=1')
      .groupBy('category.id')
      .addGroupBy('category.name')
      .getRawMany();

    const total = records.reduce((sum, r) => sum + parseInt(r.count), 0);

    return records.map((r) => ({
      type: r.type,
      count: parseInt(r.count),
      percentage: total > 0 ? (parseInt(r.count) / total) * 100 : 0,
    }));
  }

  // ============ USER STATISTICS ============
  async getUsersByRole(): Promise<UsersByRoleDto[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    const total = users.reduce((sum, u) => sum + parseInt(u.count), 0);

    return users.map((u) => ({
      role: u.role,
      count: parseInt(u.count),
      percentage: total > 0 ? (parseInt(u.count) / total) * 100 : 0,
    }));
  }

  async getUserGrowth(period: TimePeriod): Promise<UserGrowthDto[]> {
    const periodFormat = this.getPeriodFormat(period);

    const growth = await this.userRepository
      .createQueryBuilder('user')
      .select(`TO_CHAR(user.createdAt, '${periodFormat}')`, 'period')
      .addSelect('COUNT(*)', 'newUsers')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    // Calculate cumulative total
    let cumulativeTotal = 0;
    return growth.map((g) => {
      cumulativeTotal += parseInt(g.newUsers);
      return {
        period: g.period,
        newUsers: parseInt(g.newUsers),
        totalUsers: cumulativeTotal,
      };
    });
  }

  async getUserActivity(): Promise<UserActivityDto> {
    const [active, inactive] = await Promise.all([
      this.userRepository.count({ where: { status: true } }),
      this.userRepository.count({ where: { status: false } }),
    ]);

    const total = active + inactive;

    return {
      active,
      inactive,
      activePercentage: total > 0 ? (active / total) * 100 : 0,
      inactivePercentage: total > 0 ? (inactive / total) * 100 : 0,
    };
  }

  // ============ PERFORMANCE STATISTICS ============
  async getRecordsByStaff(
    dateRange?: DateRangeDto,
  ): Promise<RecordsByStaffDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const records = await this.recordRepository
      .createQueryBuilder('record')
      .leftJoin('record.reviewer', 'reviewer')
      .select('reviewer.id', 'staffId')
      .addSelect('reviewer.fullName', 'staffName')
      .addSelect('COUNT(*)', 'recordCount')
      .addSelect(
        "SUM(CASE WHEN record.status = 'APPROVED' THEN 1 ELSE 0 END)",
        'completedCount',
      )
      .addSelect(
        "SUM(CASE WHEN record.status = 'PENDING' THEN 1 ELSE 0 END)",
        'pendingCount',
      )
      .addSelect(
        'AVG(EXTRACT(EPOCH FROM (record.updatedAt - record.createdAt))/86400)',
        'averageProcessingTime',
      )
      .where('reviewer.id IS NOT NULL')
      .andWhere(whereClause || '1=1')
      .groupBy('reviewer.id')
      .addGroupBy('reviewer.fullName')
      .getRawMany();

    return records.map((r) => ({
      staffId: r.staffId,
      staffName: r.staffName,
      recordCount: parseInt(r.recordCount),
      completedCount: parseInt(r.completedCount) || 0,
      pendingCount: parseInt(r.pendingCount) || 0,
      averageProcessingTime: parseFloat(r.averageProcessingTime) || 0,
    }));
  }

  async getTaskSummary(
    period: TimePeriod,
    dateRange?: DateRangeDto,
  ): Promise<TaskSummaryDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);
    const periodFormat = this.getPeriodFormat(period);

    const tasks = await this.recordRepository
      .createQueryBuilder('record')
      .select(`TO_CHAR(record.createdAt, '${periodFormat}')`, 'period')
      .addSelect('COUNT(*)', 'totalTasks')
      .addSelect(
        "SUM(CASE WHEN record.status = 'APPROVED' THEN 1 ELSE 0 END)",
        'completedTasks',
      )
      .addSelect(
        "SUM(CASE WHEN record.status = 'PENDING' THEN 1 ELSE 0 END)",
        'pendingTasks',
      )
      .where(whereClause || '1=1')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return tasks.map((t) => {
      const total = parseInt(t.totalTasks);
      const completed = parseInt(t.completedTasks) || 0;
      return {
        period: t.period,
        totalTasks: total,
        completedTasks: completed,
        pendingTasks: parseInt(t.pendingTasks) || 0,
        completionRate: total > 0 ? (completed / total) * 100 : 0,
      };
    });
  }

  async getStaffPerformance(
    dateRange?: DateRangeDto,
  ): Promise<StaffPerformanceDto[]> {
    const records = await this.getRecordsByStaff(dateRange);

    return records.map((r) => ({
      staffId: r.staffId,
      staffName: r.staffName,
      totalRecords: r.recordCount,
      completedRecords: r.completedCount,
      averageProcessingTime: r.averageProcessingTime,
      completionRate:
        r.recordCount > 0 ? (r.completedCount / r.recordCount) * 100 : 0,
    }));
  }

  // ============ REVENUE STATISTICS ============
  async getRevenueByPeriod(
    period: TimePeriod,
    dateRange?: DateRangeDto,
  ): Promise<RevenueByPeriodDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);
    const periodFormat = this.getPeriodFormat(period);

    const revenue = await this.feeCalculationRepository
      .createQueryBuilder('calc')
      .select(`TO_CHAR(calc.createdAt, '${periodFormat}')`, 'period')
      .addSelect('SUM(calc.totalFee)', 'revenue')
      .addSelect('COUNT(*)', 'transactionCount')
      .where(whereClause || '1=1')
      .groupBy('period')
      .orderBy('period', 'ASC')
      .getRawMany();

    return revenue.map((r) => ({
      period: r.period,
      revenue: parseFloat(r.revenue) || 0,
      transactionCount: parseInt(r.transactionCount),
    }));
  }

  async getRevenueByService(
    dateRange?: DateRangeDto,
  ): Promise<RevenueByServiceDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const revenue = await this.feeCalculationRepository
      .createQueryBuilder('calc')
      .leftJoin('calc.documentGroup', 'group')
      .select('group.id', 'serviceId')
      .addSelect('group.name', 'serviceName')
      .addSelect('SUM(calc.totalFee)', 'revenue')
      .addSelect('COUNT(*)', 'transactionCount')
      .where('group.id IS NOT NULL')
      .andWhere(whereClause || '1=1')
      .groupBy('group.id')
      .addGroupBy('group.name')
      .getRawMany();

    const total = revenue.reduce((sum, r) => sum + parseFloat(r.revenue), 0);

    return revenue.map((r) => ({
      serviceId: r.serviceId,
      serviceName: r.serviceName,
      revenue: parseFloat(r.revenue) || 0,
      transactionCount: parseInt(r.transactionCount),
      percentage: total > 0 ? (parseFloat(r.revenue) / total) * 100 : 0,
    }));
  }

  async getRevenueByStaff(
    dateRange?: DateRangeDto,
  ): Promise<RevenueByStaffDto[]> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const revenue = await this.feeCalculationRepository
      .createQueryBuilder('calc')
      .leftJoin('calc.user', 'user')
      .select('user.id', 'staffId')
      .addSelect('user.fullName', 'staffName')
      .addSelect('SUM(calc.totalFee)', 'revenue')
      .addSelect('COUNT(*)', 'transactionCount')
      .where('user.id IS NOT NULL')
      .andWhere(whereClause || '1=1')
      .groupBy('user.id')
      .addGroupBy('user.fullName')
      .getRawMany();

    return revenue.map((r) => ({
      staffId: r.staffId,
      staffName: r.staffName,
      revenue: parseFloat(r.revenue) || 0,
      transactionCount: parseInt(r.transactionCount),
    }));
  }

  // ============ DASHBOARD SPECIFIC METHODS ============
  async getDashboardStatistics() {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const [
      totalUsers,
      totalRecords,
      totalConsultations,
      monthlyRevenue,
      totalArticles,
      totalListings,
      totalEmployees,
      totalServices,
      articlesGrowth,
      listingsGrowth,
    ] = await Promise.all([
      this.userRepository.count(),
      this.recordRepository.count(),
      this.consultationRepository.count(),
      this.calculateTotalRevenue({
        startDate: firstDayOfMonth.toISOString(),
        endDate: lastDayOfMonth.toISOString(),
      }),
      this.articleRepository.count(),
      this.listingRepository.count(),
      this.employeeRepository.count(),
      this.serviceRepository.count(),
      this.calculateGrowthPercentage(
        this.articleRepository,
        firstDayOfMonth,
        lastDayOfMonth,
      ),
      this.calculateGrowthPercentage(
        this.listingRepository,
        firstDayOfMonth,
        lastDayOfMonth,
      ),
    ]);

    return {
      totalUsers,
      totalRecords,
      totalConsultations,
      monthlyRevenue,
      totalArticles,
      totalListings,
      totalEmployees,
      totalServices,
      articlesGrowth,
      listingsGrowth,
    };
  }

  async getRecentActivities(limit = 10) {
    const [recentRecords, recentConsultations, recentArticles] =
      await Promise.all([
        this.recordRepository.find({
          order: { createdAt: 'DESC' },
          take: limit,
          relations: ['customer', 'type'],
        }),
        this.consultationRepository.find({
          order: { createdAt: 'DESC' },
          take: limit,
          relations: ['customer'],
        }),
        this.articleRepository.find({
          order: { createdAt: 'DESC' },
          take: limit,
          relations: ['author'],
        }),
      ]);

    const activities = [
      ...recentRecords.map((record) => ({
        id: record.id,
        type: 'record',
        title: record.title,
        user: record.customer?.fullName || 'Unknown',
        createdAt: record.createdAt,
        status: record.status,
      })),
      ...recentConsultations.map((consultation) => ({
        id: consultation.id,
        type: 'consultation',
        title: consultation.content,
        user: consultation.customer?.fullName || 'Unknown',
        createdAt: consultation.createdAt,
        status: consultation.status,
      })),
      ...recentArticles.map((article) => ({
        id: article.id,
        type: 'article',
        title: article.title,
        user: article.author?.fullName || 'Unknown',
        createdAt: article.createdAt,
        status: article.status,
      })),
    ];

    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getRecordsInProgress(limit = 10) {
    return this.recordRepository.find({
      where: { status: RecordStatus.PENDING },
      order: { createdAt: 'DESC' },
      take: limit,
      relations: ['customer', 'type'],
    });
  }

  private async calculateGrowthPercentage(
    repository: Repository<any>,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const currentMonthCount = await repository.count({
      where: {
        createdAt: Between(startDate, endDate),
      },
    });

    const previousMonthStart = new Date(
      startDate.getFullYear(),
      startDate.getMonth() - 1,
      1,
    );
    const previousMonthEnd = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      0,
    );

    const previousMonthCount = await repository.count({
      where: {
        createdAt: Between(previousMonthStart, previousMonthEnd),
      },
    });

    if (previousMonthCount === 0) {
      return currentMonthCount > 0 ? 100 : 0;
    }

    return (
      ((currentMonthCount - previousMonthCount) / previousMonthCount) * 100
    );
  }

  // ============ HELPER METHODS ============
  private buildDateRangeWhere(dateRange?: DateRangeDto) {
    if (!dateRange || (!dateRange.startDate && !dateRange.endDate)) {
      return null;
    }

    const where: any = {};

    if (dateRange.startDate && dateRange.endDate) {
      where.createdAt = Between(
        new Date(dateRange.startDate),
        new Date(dateRange.endDate),
      );
    } else if (dateRange.startDate) {
      where.createdAt = Between(new Date(dateRange.startDate), new Date());
    } else if (dateRange.endDate) {
      where.createdAt = Between(
        new Date('1970-01-01'),
        new Date(dateRange.endDate),
      );
    }

    return where;
  }

  private getPeriodFormat(period: TimePeriod): string {
    switch (period) {
      case TimePeriod.DAY:
        return 'YYYY-MM-DD';
      case TimePeriod.MONTH:
        return 'YYYY-MM';
      case TimePeriod.QUARTER:
        return 'YYYY-Q';
      case TimePeriod.YEAR:
        return 'YYYY';
      default:
        return 'YYYY-MM';
    }
  }

  private async calculateTotalRevenue(dateRange?: DateRangeDto): Promise<number> {
    const whereClause = this.buildDateRangeWhere(dateRange);

    const result = await this.feeCalculationRepository
      .createQueryBuilder('calc')
      .select('SUM(calc.totalFee)', 'total')
      .where(whereClause || '1=1')
      .getRawOne();

    return parseFloat(result?.total) || 0;
  }
}
