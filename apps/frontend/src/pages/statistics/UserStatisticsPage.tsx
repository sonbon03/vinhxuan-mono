import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Spin } from 'antd';
import { Pie, Line } from '@ant-design/charts';
import statisticsService, { UsersByRole, UserGrowth, UserActivity } from '../../services/statistics.service';
import { PageContainer } from '@/components/common/PageContainer';

const { Option } = Select;

const UserStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [byRole, setByRole] = useState<UsersByRole[]>([]);
  const [growth, setGrowth] = useState<UserGrowth[]>([]);
  const [activity, setActivity] = useState<UserActivity | null>(null);
  const [period, setPeriod] = useState<string>('month');

  useEffect(() => {
    fetchStatistics();
  }, [period]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [roleData, growthData, activityData] = await Promise.all([
        statisticsService.getUsersByRole(),
        statisticsService.getUserGrowth(period),
        statisticsService.getUserActivity(),
      ]);
      setByRole(roleData);
      setGrowth(growthData);
      setActivity(activityData);
    } catch (error) {
      console.error('Failed to fetch user statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const roleChartConfig = {
    data: byRole.map((item) => ({ type: item.role, value: item.count })),
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
    interactions: [{ type: 'element-active' }],
  };

  const growthChartConfig = {
    data: growth,
    xField: 'period',
    yField: 'totalUsers',
    seriesField: 'type',
    smooth: true,
    animation: { appear: { animation: 'path-in', duration: 1000 } },
  };

  const activityChartConfig = {
    data: activity ? [ { type: 'Hoạt động', value: activity.active }, { type: 'Không hoạt động', value: activity.inactive } ] : [],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: { type: 'outer', content: '{name} {percentage}' },
    color: ['#52c41a', '#ff4d4f'],
  };

  return (
    <PageContainer
      title="Thống kê Người dùng"
      extra={
        <Select value={period} onChange={setPeriod} style={{ width: 120 }}>
          <Option value="month">Tháng</Option>
          <Option value="quarter">Quý</Option>
          <Option value="year">Năm</Option>
        </Select>
      }
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={8}>
            <Card title="Theo Vai trò" bordered={false}>
              {byRole.length > 0 ? <Pie {...roleChartConfig} height={300} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Trạng thái Hoạt động" bordered={false}>
              {activity ? <Pie {...activityChartConfig} height={300} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Thông tin Chi tiết" bordered={false}>
              <div style={{ padding: 20 }}>
                <p><strong>Tổng số người dùng:</strong> {activity ? activity.active + activity.inactive : 0}</p>
                <p><strong>Đang hoạt động:</strong> <span style={{ color: '#52c41a' }}>{activity?.active || 0}</span></p>
                <p><strong>Không hoạt động:</strong> <span style={{ color: '#ff4d4f' }}>{activity?.inactive || 0}</span></p>
                <p><strong>Tỷ lệ hoạt động:</strong> {activity?.activePercentage.toFixed(2)}%</p>
              </div>
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="Biểu đồ Tăng trưởng" bordered={false}>
              {growth.length > 0 ? <Line {...growthChartConfig} height={400} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default UserStatisticsPage;
