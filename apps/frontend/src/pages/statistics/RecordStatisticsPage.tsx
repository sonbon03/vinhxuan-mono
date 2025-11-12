import React, { useState, useEffect } from 'react';
import { Card, Row, Col, DatePicker, Select, Spin } from 'antd';
import { Pie, Column } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import statisticsService, { RecordsByStatus, RecordsByTime, RecordsByType, DateRange, StatisticsQuery } from '../../services/statistics.service';
import { PageContainer } from '@/components/common/PageContainer';

const { RangePicker } = DatePicker;
const { Option } = Select;

const RecordStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [byStatus, setByStatus] = useState<RecordsByStatus[]>([]);
  const [byTime, setByTime] = useState<RecordsByTime[]>([]);
  const [byType, setByType] = useState<RecordsByType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const [period, setPeriod] = useState<'day' | 'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    fetchStatistics();
  }, [dateRange, period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const query: StatisticsQuery = { ...dateRange, period };
      const [statusData, timeData, typeData] = await Promise.all([
        statisticsService.getRecordsByStatus(dateRange),
        statisticsService.getRecordsByTime(query),
        statisticsService.getRecordsByType(dateRange),
      ]);
      setByStatus(statusData);
      setByTime(timeData);
      setByType(typeData);
    } catch (error) {
      console.error('Failed to fetch record statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange({ startDate: dates[0].format('YYYY-MM-DD'), endDate: dates[1].format('YYYY-MM-DD') });
    } else {
      setDateRange({});
    }
  };

  const statusChartConfig = {
    data: byStatus.map((item) => ({ type: item.status, value: item.count })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
  };

  const timeChartConfig = {
    data: byTime,
    xField: 'period',
    yField: 'count',
    label: { position: 'top' as const, style: { fill: '#000000', opacity: 0.6 } },
    xAxis: { label: { autoHide: true, autoRotate: false } },
    meta: { period: { alias: 'Thời gian' }, count: { alias: 'Số lượng' } },
  };

  const typeChartConfig = {
    data: byType.map((item) => ({ type: item.type, value: item.count })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
    interactions: [{ type: 'element-active' }],
    legend: { position: 'bottom' as const },
  };

  return (
    <PageContainer
      title="Thống kê Hồ sơ"
      extra={
        <div style={{ display: 'flex', gap: 16 }}>
          <Select value={period} onChange={setPeriod} style={{ width: 120 }} placeholder="Chọn khoảng thời gian">
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
          <Col xs={24} lg={12}>
            <Card title="Thống kê theo Trạng thái" bordered={false}>
              {byStatus.length > 0 ? <Pie {...statusChartConfig} height={300} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
          <Col xs={24} lg={12}>
            <Card title="Thống kê theo Loại Hồ sơ" bordered={false}>
              {byType.length > 0 ? <Pie {...typeChartConfig} height={300} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="Thống kê theo Thời gian" bordered={false}>
              {byTime.length > 0 ? <Column {...timeChartConfig} height={400} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default RecordStatisticsPage;
