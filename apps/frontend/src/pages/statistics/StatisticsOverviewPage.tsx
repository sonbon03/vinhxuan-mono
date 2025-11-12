import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, DatePicker, Space, Spin, Button, message } from 'antd';
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FilePdfOutlined,
  FileExcelOutlined,
} from '@ant-design/icons';
import { useReactToPrint } from 'react-to-print';
import { Dayjs } from 'dayjs';
import statisticsService, {
  OverviewStatistics,
  DateRange,
} from '../../services/statistics.service';
import { exportToExcel, formatCurrencyForExport } from '../../utils/exportUtils';
import { PageContainer } from '@/components/common/PageContainer';

const { RangePicker } = DatePicker;

const StatisticsOverviewPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [overview, setOverview] = useState<OverviewStatistics | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({});
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOverview();
  }, [dateRange]);

  const fetchOverview = async () => {
    try {
      setLoading(true);
      const data = await statisticsService.getOverview(dateRange);
      setOverview(data);
    } catch (error) {
      console.error('Failed to fetch overview statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setDateRange({
        startDate: dates[0].format('YYYY-MM-DD'),
        endDate: dates[1].format('YYYY-MM-DD'),
      });
    } else {
      setDateRange({});
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  const handleExportExcel = () => {
    if (!overview) {
      message.warning('Không có dữ liệu để xuất');
      return;
    }
    const data = [
      { 'Chỉ số': 'Tổng số Người dùng', 'Giá trị': overview.totalUsers },
      { 'Chỉ số': 'Người dùng Đang hoạt động', 'Giá trị': overview.activeUsers },
      { 'Chỉ số': 'Tổng số Hồ sơ', 'Giá trị': overview.totalRecords },
      { 'Chỉ số': 'Hồ sơ Hoàn thành', 'Giá trị': overview.completedRecords },
      { 'Chỉ số': 'Hồ sơ Chờ duyệt', 'Giá trị': overview.pendingRecords },
      { 'Chỉ số': 'Tổng Doanh thu', 'Giá trị': formatCurrencyForExport(overview.totalRevenue) },
      { 'Chỉ số': 'Tổng Lịch Tư vấn', 'Giá trị': overview.totalConsultations },
      { 'Chỉ số': 'Lịch Tư vấn Chờ xử lý', 'Giá trị': overview.pendingConsultations },
    ];
    const dateRangeText =
      dateRange.startDate && dateRange.endDate
        ? `_${dateRange.startDate}_${dateRange.endDate}`
        : '';
    exportToExcel(data, `thong-ke-tong-quan${dateRangeText}`, 'Tổng quan');
    message.success('Xuất file Excel thành công');
  };

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: 'Thống kê Tổng quan',
    pageStyle: `@page { size: A4; margin: 20mm; } @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none !important; } }`,
  });

  if (loading && !overview) {
    return (
      <PageContainer title="Tổng quan Thống kê">
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: 400,
          }}
        >
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title="Tổng quan Thống kê"
      extra={
        <Space className="no-print">
          <Button
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={handleExportExcel}
            disabled={!overview}
          >
            Xuất Excel
          </Button>
          <Button icon={<FilePdfOutlined />} onClick={handlePrint} disabled={!overview}>
            Xuất PDF
          </Button>
          <RangePicker
            onChange={handleDateRangeChange}
            format="DD/MM/YYYY"
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Space>
      }
    >
      <div ref={printRef}>
        <Spin spinning={loading}>
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số Người dùng"
                  value={overview?.totalUsers || 0}
                  prefix={<UserOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  Đang hoạt động: {overview?.activeUsers || 0}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng số Hồ sơ"
                  value={overview?.totalRecords || 0}
                  prefix={<FileTextOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} /> Hoàn thành:{' '}
                  {overview?.completedRecords || 0} |{' '}
                  <ClockCircleOutlined style={{ color: '#faad14' }} /> Chờ duyệt:{' '}
                  {overview?.pendingRecords || 0}
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Tổng Doanh thu"
                  value={overview?.totalRevenue || 0}
                  prefix={<DollarOutlined />}
                  valueStyle={{ color: '#cf1322' }}
                  formatter={(value) => formatCurrency(Number(value))}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="Lịch Tư vấn"
                  value={overview?.totalConsultations || 0}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                />
                <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
                  Chờ xử lý: {overview?.pendingConsultations || 0}
                </div>
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
            <Col xs={24} lg={12}>
              <Card title="Tỷ lệ Hoàn thành Hồ sơ" bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      {overview?.completedRecords || 0}
                    </div>
                    <div style={{ color: '#666' }}>Hoàn thành</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#faad14' }}>
                      {overview?.pendingRecords || 0}
                    </div>
                    <div style={{ color: '#666' }}>Đang xử lý</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                      {overview?.totalRecords || 0}
                    </div>
                    <div style={{ color: '#666' }}>Tổng số</div>
                  </div>
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card title="Tỷ lệ Người dùng Hoạt động" bordered={false}>
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '20px 0' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#52c41a' }}>
                      {overview?.activeUsers || 0}
                    </div>
                    <div style={{ color: '#666' }}>Đang hoạt động</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#ff4d4f' }}>
                      {(overview?.totalUsers || 0) - (overview?.activeUsers || 0)}
                    </div>
                    <div style={{ color: '#666' }}>Không hoạt động</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                      {overview?.totalUsers || 0}
                    </div>
                    <div style={{ color: '#666' }}>Tổng số</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>

          <Card title="Thông tin Chi tiết" style={{ marginTop: 24 }} bordered={false}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <strong>Tỷ lệ hoàn thành hồ sơ:</strong>{' '}
                  {overview?.totalRecords
                    ? (((overview.completedRecords || 0) / overview.totalRecords) * 100).toFixed(2)
                    : 0}
                  %
                </p>
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <strong>Tỷ lệ người dùng hoạt động:</strong>{' '}
                  {overview?.totalUsers
                    ? (((overview.activeUsers || 0) / overview.totalUsers) * 100).toFixed(2)
                    : 0}
                  %
                </p>
                <p style={{ fontSize: 14, marginBottom: 8 }}>
                  <strong>Lịch tư vấn chờ xử lý:</strong> {overview?.pendingConsultations || 0} /{' '}
                  {overview?.totalConsultations || 0} (
                  {overview?.totalConsultations
                    ? (
                        ((overview.pendingConsultations || 0) / overview.totalConsultations) *
                        100
                      ).toFixed(2)
                    : 0}
                  %)
                </p>
              </Col>
            </Row>
          </Card>
        </Spin>
      </div>
    </PageContainer>
  );
};

export default StatisticsOverviewPage;
