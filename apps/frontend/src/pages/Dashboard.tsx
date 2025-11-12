import { Typography, Card, Row, Col, Statistic, Spin, Alert, List, Tag, Space } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  ReadOutlined,
  ShoppingOutlined,
  RiseOutlined,
  FallOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import statisticsService from '@/services/statistics.service';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

const { Title, Paragraph, Text } = Typography;

// Helper function to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN').format(value);
};

// Helper function to get status tag
const getStatusTag = (status: string) => {
  const statusConfig: Record<string, { color: string; text: string }> = {
    PENDING: { color: 'warning', text: 'Chờ xử lý' },
    APPROVED: { color: 'success', text: 'Đã duyệt' },
    REJECTED: { color: 'error', text: 'Từ chối' },
    COMPLETED: { color: 'success', text: 'Hoàn thành' },
    CANCELLED: { color: 'default', text: 'Đã hủy' },
    DRAFT: { color: 'default', text: 'Nháp' },
    PUBLISHED: { color: 'success', text: 'Đã xuất bản' },
  };

  const config = statusConfig[status] || { color: 'default', text: status };
  return <Tag color={config.color}>{config.text}</Tag>;
};

// Helper function to get activity type icon
const getActivityTypeIcon = (type: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    record: <FileTextOutlined style={{ color: '#52c41a' }} />,
    consultation: <CalendarOutlined style={{ color: '#faad14' }} />,
    article: <ReadOutlined style={{ color: '#1890ff' }} />,
  };
  return iconMap[type] || <FileTextOutlined />;
};

export default function Dashboard() {
  const { user } = useAuthStore();

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['dashboard-statistics'],
    queryFn: () => statisticsService.getDashboardStatistics(),
  });

  // Fetch recent activities
  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ['recent-activities'],
    queryFn: () => statisticsService.getRecentActivities(5),
  });

  // Fetch records in progress
  const { data: recordsInProgress, isLoading: recordsLoading } = useQuery({
    queryKey: ['records-in-progress'],
    queryFn: () => statisticsService.getRecordsInProgress(5),
  });

  // Fetch chart data
  const { data: recordsByTime } = useQuery({
    queryKey: ['records-by-time'],
    queryFn: () => statisticsService.getRecordsByTime({ period: 'month' }),
  });

  const { data: recordsByStatus } = useQuery({
    queryKey: ['records-by-status'],
    queryFn: () => statisticsService.getRecordsByStatus(),
  });

  // Show loading state
  if (statsLoading) {
    return (
      <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  // Show error state
  if (statsError) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description="Không thể tải thống kê tổng quan. Vui lòng thử lại sau."
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Welcome Section */}
      <div style={{ marginBottom: 32 }}>
        <Title level={2}>Tổng quan hệ thống</Title>
        <Paragraph type="secondary" style={{ fontSize: 16 }}>
          Chào mừng <strong>{user?.fullName}</strong> quay trở lại!
        </Paragraph>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats?.totalUsers || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Hồ sơ công chứng"
              value={stats?.totalRecords || 0}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Lịch tư vấn"
              value={stats?.totalConsultations || 0}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Doanh thu tháng này"
              value={formatCurrency(stats?.monthlyRevenue || 0)}
              prefix={<DollarOutlined />}
              suffix="VNĐ"
              valueStyle={{ color: '#13c2c2' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Bài viết"
              value={stats?.totalArticles || 0}
              prefix={<ReadOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: (stats?.articlesGrowth || 0) >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {(stats?.articlesGrowth || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}{' '}
                  {Math.abs(stats?.articlesGrowth || 0).toFixed(1)}%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Tin rao"
              value={stats?.totalListings || 0}
              prefix={<ShoppingOutlined />}
              suffix={
                <span style={{ fontSize: 14, color: (stats?.listingsGrowth || 0) >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  {(stats?.listingsGrowth || 0) >= 0 ? <RiseOutlined /> : <FallOutlined />}{' '}
                  {Math.abs(stats?.listingsGrowth || 0).toFixed(1)}%
                </span>
              }
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Nhân viên"
              value={stats?.totalEmployees || 0}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Dịch vụ"
              value={stats?.totalServices || 0}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Xu hướng hồ sơ theo tháng" bordered={false}>
            {recordsByTime && recordsByTime.length > 0 ? (
              <Column
                data={recordsByTime}
                xField="period"
                yField="count"
                columnStyle={{
                  radius: [8, 8, 0, 0],
                }}
                color="#1890ff"
                label={{
                  position: 'top',
                  style: {
                    fill: '#000000',
                    opacity: 0.6,
                  },
                }}
                xAxis={{
                  label: {
                    autoHide: true,
                    autoRotate: false,
                  },
                }}
                meta={{
                  period: {
                    alias: 'Tháng',
                  },
                  count: {
                    alias: 'Số lượng hồ sơ',
                  },
                }}
                height={300}
              />
            ) : (
              <Paragraph type="secondary" style={{ textAlign: 'center', padding: '100px 0' }}>
                Chưa có dữ liệu
              </Paragraph>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Phân bố hồ sơ theo trạng thái" bordered={false}>
            {recordsByStatus && recordsByStatus.length > 0 ? (
              <Pie
                data={recordsByStatus}
                angleField="count"
                colorField="status"
                radius={0.8}
                innerRadius={0.6}
                label={{
                  type: 'spider',
                  labelHeight: 28,
                  content: '{name}\n{percentage}',
                }}
                legend={{
                  position: 'bottom',
                }}
                statistic={{
                  title: {
                    content: 'Tổng',
                  },
                  content: {
                    style: {
                      fontSize: '24px',
                    },
                    formatter: () => {
                      const total = recordsByStatus.reduce((sum, item) => sum + item.count, 0);
                      return total.toString();
                    },
                  },
                }}
                height={300}
              />
            ) : (
              <Paragraph type="secondary" style={{ textAlign: 'center', padding: '100px 0' }}>
                Chưa có dữ liệu
              </Paragraph>
            )}
          </Card>
        </Col>
      </Row>

      {/* Activity Overview */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Hoạt động gần đây"
            bordered={false}
            loading={activitiesLoading}
          >
            {activities && activities.length > 0 ? (
              <List
                dataSource={activities}
                renderItem={(activity) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getActivityTypeIcon(activity.type)}
                      title={
                        <Space>
                          <Text strong>{activity.title}</Text>
                          {getStatusTag(activity.status)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">{activity.user}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> {dayjs(activity.createdAt).fromNow()}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph type="secondary" style={{ textAlign: 'center', padding: '40px 0' }}>
                Chưa có hoạt động nào
              </Paragraph>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card
            title="Hồ sơ đang xử lý"
            bordered={false}
            loading={recordsLoading}
          >
            {recordsInProgress && recordsInProgress.length > 0 ? (
              <List
                dataSource={recordsInProgress}
                renderItem={(record) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<FileTextOutlined style={{ color: '#faad14', fontSize: 20 }} />}
                      title={
                        <Space>
                          <Text strong>{record.title}</Text>
                          {getStatusTag(record.status)}
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={0}>
                          <Text type="secondary">Khách hàng: {record.customer?.fullName}</Text>
                          <Text type="secondary">Loại: {record.type?.name}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <ClockCircleOutlined /> {dayjs(record.createdAt).fromNow()}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Paragraph type="secondary" style={{ textAlign: 'center', padding: '40px 0' }}>
                Không có hồ sơ đang xử lý
              </Paragraph>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}
