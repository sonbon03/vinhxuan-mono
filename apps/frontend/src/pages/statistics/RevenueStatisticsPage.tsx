import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Select, Spin, Typography, Table } from 'antd';
import { Line, Pie, Column } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import statisticsService, {
  RevenueByPeriod,
  RevenueByService,
  RevenueByStaff,
  DateRange,
  StatisticsQuery,
} from '../../services/statistics.service';
import { PageContainer } from '@/components/common/PageContainer';

const { RangePicker } = DatePicker;
const { Title } = Typography;
const { Option } = Select;

const RevenueStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [byPeriod, setByPeriod] = useState<RevenueByPeriod[]>([]);
  const [byService, setByService] = useState<RevenueByService[]>([]);
  const [byStaff, setByStaff] = useState<RevenueByStaff[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchStatistics();
  }, [dateRange, period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const query: StatisticsQuery = { ...dateRange, period };

      const [periodData, serviceData, staffData] = await Promise.all([
        statisticsService.getRevenueByPeriod(query),
        statisticsService.getRevenueByService(dateRange),
        statisticsService.getRevenueByStaff(dateRange),
      ]);

      setByPeriod(periodData);
      setByService(serviceData);
      setByStaff(staffData);
    } catch (error) {
      console.error('Failed to fetch revenue statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (
    dates: [Dayjs | null, Dayjs | null] | null
  ) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange({
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setDateRange({});
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const periodChartConfig = {
    data: byPeriod,
    xField: 'period',
    yField: 'revenue',
    smooth: true,
    meta: {
      period: {
        alias: 'Thời gian',
      },
      revenue: {
        alias: 'Doanh thu',
        formatter: (value: number) => formatCurrency(value),
      },
    },
  };

  const serviceChartConfig = {
    data: byService.map((item) => ({
      type: item.serviceName,
      value: item.revenue,
    })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    tooltip: {
      formatter: (datum: any) => {
        return { name: datum.type, value: formatCurrency(datum.value) };
      },
    },
  };

  const staffColumns = [
    {
      title: 'Nhân viên',
      dataIndex: 'staffName',
      key: 'staffName',
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (value: number) => formatCurrency(value),
      sorter: (a: RevenueByStaff, b: RevenueByStaff) => a.revenue - b.revenue,
    },
    {
      title: 'Số giao dịch',
      dataIndex: 'transactionCount',
      key: 'transactionCount',
      sorter: (a: RevenueByStaff, b: RevenueByStaff) =>
        a.transactionCount - b.transactionCount,
    },
  ];

  return (
    <PageContainer
      title="Thống kê Doanh thu"
      extra={
        <div style={{ display: 'flex', gap: 16 }}>
          <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
            <Option value="day">Ngày</Option>
            <Option value="month">Tháng</Option>
            <Option value="quarter">Quý</Option>
            <Option value="year">Năm</Option>
          </Select>
          <RangePicker onChange={handleDateRangeChange} format="DD/MM/YYYY" placeholder={["Từ ngày", "Đến ngày"]} />
        </div>
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Doanh thu theo Thời gian" bordered={false}>
              {byPeriod.length > 0 ? (
                <Line {...periodChartConfig} height={400} />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '50px',
                    color: '#999',
                  }}
                >
                  Không có dữ liệu
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo Dịch vụ" bordered={false}>
              {byService.length > 0 ? (
                <Pie {...serviceChartConfig} height={400} />
              ) : (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '50px',
                    color: '#999',
                  }}
                >
                  Không có dữ liệu
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="Doanh thu theo Nhân viên" bordered={false}>
              <Table
                columns={staffColumns}
                dataSource={byStaff}
                rowKey="staffId"
                pagination={{ pageSize: 10 }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default RevenueStatisticsPage;
