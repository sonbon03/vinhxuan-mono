import api from './api';

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface StatisticsQuery extends DateRange {
  period?: 'day' | 'month' | 'quarter' | 'year';
}

// Overview Dashboard
export interface OverviewStatistics {
  totalUsers: number;
  totalRecords: number;
  totalRevenue: number;
  totalConsultations: number;
  activeUsers: number;
  pendingRecords: number;
  completedRecords: number;
  pendingConsultations: number;
}

// Record Statistics
export interface RecordsByStatus {
  status: string;
  count: number;
  percentage: number;
}

export interface RecordsByTime {
  period: string;
  count: number;
}

export interface RecordsByType {
  type: string;
  count: number;
  percentage: number;
}

// User Statistics
export interface UsersByRole {
  role: string;
  count: number;
  percentage: number;
}

export interface UserGrowth {
  period: string;
  newUsers: number;
  totalUsers: number;
}

export interface UserActivity {
  active: number;
  inactive: number;
  activePercentage: number;
  inactivePercentage: number;
}

// Performance Statistics
export interface RecordsByStaff {
  staffId: string;
  staffName: string;
  recordCount: number;
  completedCount: number;
  pendingCount: number;
  averageProcessingTime: number;
}

export interface TaskSummary {
  period: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  completionRate: number;
}

export interface StaffPerformance {
  staffId: string;
  staffName: string;
  totalRecords: number;
  completedRecords: number;
  averageProcessingTime: number;
  completionRate: number;
}

// Revenue Statistics
export interface RevenueByPeriod {
  period: string;
  revenue: number;
  transactionCount: number;
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface RevenueByStaff {
  staffId: string;
  staffName: string;
  revenue: number;
  transactionCount: number;
}

// Dashboard Specific
export interface DashboardStatistics {
  totalUsers: number;
  totalRecords: number;
  totalConsultations: number;
  monthlyRevenue: number;
  totalArticles: number;
  totalListings: number;
  totalEmployees: number;
  totalServices: number;
  articlesGrowth: number;
  listingsGrowth: number;
}

export interface RecentActivity {
  id: string;
  type: 'record' | 'consultation' | 'article';
  title: string;
  user: string;
  createdAt: Date;
  status: string;
}

export interface RecordInProgress {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date;
  customer: {
    fullName: string;
  };
  type: {
    name: string;
  };
}

class StatisticsService {
  // ============ OVERVIEW DASHBOARD ============
  async getOverview(dateRange?: DateRange): Promise<OverviewStatistics> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/overview?${params.toString()}`);
    return response.data;
  }

  // ============ RECORD STATISTICS ============
  async getRecordsByStatus(dateRange?: DateRange): Promise<RecordsByStatus[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/records/by-status?${params.toString()}`);
    return response.data;
  }

  async getRecordsByTime(query: StatisticsQuery): Promise<RecordsByTime[]> {
    const params = new URLSearchParams();
    if (query.period) params.append('period', query.period);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`/statistics/records/by-time?${params.toString()}`);
    return response.data;
  }

  async getRecordsByType(dateRange?: DateRange): Promise<RecordsByType[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/records/by-type?${params.toString()}`);
    return response.data;
  }

  // ============ USER STATISTICS ============
  async getUsersByRole(): Promise<UsersByRole[]> {
    const response = await api.get('/statistics/users/by-role');
    return response.data;
  }

  async getUserGrowth(period: string = 'month'): Promise<UserGrowth[]> {
    const response = await api.get(`/statistics/users/growth?period=${period}`);
    return response.data;
  }

  async getUserActivity(): Promise<UserActivity> {
    const response = await api.get('/statistics/users/activity');
    return response.data;
  }

  // ============ PERFORMANCE STATISTICS ============
  async getRecordsByStaff(dateRange?: DateRange): Promise<RecordsByStaff[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/performance/records-by-staff?${params.toString()}`);
    return response.data;
  }

  async getTaskSummary(query: StatisticsQuery): Promise<TaskSummary[]> {
    const params = new URLSearchParams();
    if (query.period) params.append('period', query.period);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`/statistics/performance/task-summary?${params.toString()}`);
    return response.data;
  }

  async getStaffPerformance(dateRange?: DateRange): Promise<StaffPerformance[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/performance/staff-performance?${params.toString()}`);
    return response.data;
  }

  // ============ REVENUE STATISTICS ============
  async getRevenueByPeriod(query: StatisticsQuery): Promise<RevenueByPeriod[]> {
    const params = new URLSearchParams();
    if (query.period) params.append('period', query.period);
    if (query.startDate) params.append('startDate', query.startDate);
    if (query.endDate) params.append('endDate', query.endDate);

    const response = await api.get(`/statistics/revenue/by-period?${params.toString()}`);
    return response.data;
  }

  async getRevenueByService(dateRange?: DateRange): Promise<RevenueByService[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/revenue/by-service?${params.toString()}`);
    return response.data;
  }

  async getRevenueByStaff(dateRange?: DateRange): Promise<RevenueByStaff[]> {
    const params = new URLSearchParams();
    if (dateRange?.startDate) params.append('startDate', dateRange.startDate);
    if (dateRange?.endDate) params.append('endDate', dateRange.endDate);

    const response = await api.get(`/statistics/revenue/by-staff?${params.toString()}`);
    return response.data;
  }

  // ============ DASHBOARD SPECIFIC ============
  async getDashboardStatistics(): Promise<DashboardStatistics> {
    const response = await api.get('/statistics/dashboard');
    return response.data;
  }

  async getRecentActivities(limit: number = 10): Promise<RecentActivity[]> {
    const response = await api.get(`/statistics/dashboard/recent-activities?limit=${limit}`);
    return response.data;
  }

  async getRecordsInProgress(limit: number = 10): Promise<RecordInProgress[]> {
    const response = await api.get(`/statistics/dashboard/records-in-progress?limit=${limit}`);
    return response.data;
  }
}

export const statisticsService = new StatisticsService();
export default statisticsService;
