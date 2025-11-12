import { ApiProperty } from '@nestjs/swagger';

// Overview Dashboard Response
export class OverviewStatisticsDto {
  @ApiProperty({ description: 'Tổng số người dùng', example: 1250 })
  totalUsers: number;

  @ApiProperty({ description: 'Tổng số hồ sơ', example: 856 })
  totalRecords: number;

  @ApiProperty({ description: 'Tổng doanh thu (VNĐ)', example: 125000000 })
  totalRevenue: number;

  @ApiProperty({ description: 'Tổng số lịch tư vấn', example: 324 })
  totalConsultations: number;

  @ApiProperty({ description: 'Số người dùng đang hoạt động', example: 1100 })
  activeUsers: number;

  @ApiProperty({ description: 'Số hồ sơ đang chờ xử lý', example: 45 })
  pendingRecords: number;

  @ApiProperty({ description: 'Số hồ sơ đã hoàn thành', example: 780 })
  completedRecords: number;

  @ApiProperty({ description: 'Số lịch tư vấn đang chờ', example: 12 })
  pendingConsultations: number;
}

// Record Statistics
export interface RecordsByStatusDto {
  status: string;
  count: number;
  percentage: number;
}

export interface RecordsByTimeDto {
  period: string; // e.g., "2024-01", "Q1 2024", "2024"
  count: number;
}

export interface RecordsByTypeDto {
  type: string;
  count: number;
  percentage: number;
}

// User Statistics
export interface UsersByRoleDto {
  role: string;
  count: number;
  percentage: number;
}

export interface UserGrowthDto {
  period: string; // e.g., "2024-01", "Q1 2024", "2024"
  newUsers: number;
  totalUsers: number;
}

export interface UserActivityDto {
  active: number;
  inactive: number;
  activePercentage: number;
  inactivePercentage: number;
}

// Performance Statistics
export interface RecordsByStaffDto {
  staffId: string;
  staffName: string;
  recordCount: number;
  completedCount: number;
  pendingCount: number;
  averageProcessingTime: number; // in days
}

export interface TaskSummaryDto {
  period: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

export interface StaffPerformanceDto {
  staffId: string;
  staffName: string;
  totalRecords: number;
  completedRecords: number;
  averageProcessingTime: number; // in days
  completionRate: number;
}

// Revenue Statistics
export interface RevenueByPeriodDto {
  period: string;
  revenue: number;
  transactionCount: number;
}

export interface RevenueByServiceDto {
  serviceId: string;
  serviceName: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface RevenueByStaffDto {
  staffId: string;
  staffName: string;
  revenue: number;
  transactionCount: number;
}
