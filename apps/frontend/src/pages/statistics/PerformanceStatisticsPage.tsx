import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, DatePicker, Spin } from 'antd';
import { Column } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import statisticsService, { RecordsByStaff, StaffPerformance, DateRange } from '../../services/statistics.service';
import { PageContainer } from '@/components/common/PageContainer';

const { RangePicker } = DatePicker;

const PerformanceStatisticsPage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [recordsByStaff, setRecordsByStaff] = useState<RecordsByStaff[]>([]);
  const [staffPerformance, setStaffPerformance] = useState<StaffPerformance[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({});

  useEffect(() => {
    fetchStatistics();
  }, [dateRange]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const [recordsData, performanceData] = await Promise.all([
        statisticsService.getRecordsByStaff(dateRange),
        statisticsService.getStaffPerformance(dateRange),
      ]);
      setRecordsByStaff(recordsData);
      setStaffPerformance(performanceData);
    } catch (error) {
      console.error('Failed to fetch performance statistics:', error);
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

  const chartConfig = {
    data: recordsByStaff
      .map((item) => ({ staffName: item.staffName, value: item.recordCount, type: 'Tổng số' }))
      .concat(recordsByStaff.map((item) => ({ staffName: item.staffName, value: item.completedCount, type: 'Hoàn thành' }))),
    xField: 'staffName',
    yField: 'value',
    seriesField: 'type',
    isGroup: true,
    columnStyle: { radius: [20, 20, 0, 0] },
  };

  const performanceColumns = [
    { title: 'Nhân viên', dataIndex: 'staffName', key: 'staffName' },
    { title: 'Tổng số hồ sơ', dataIndex: 'totalRecords', key: 'totalRecords', sorter: (a: StaffPerformance, b: StaffPerformance) => a.totalRecords - b.totalRecords },
    { title: 'Hoàn thành', dataIndex: 'completedRecords', key: 'completedRecords', sorter: (a: StaffPerformance, b: StaffPerformance) => a.completedRecords - b.completedRecords },
    { title: 'Thời gian xử lý TB (ngày)', dataIndex: 'averageProcessingTime', key: 'averageProcessingTime', render: (value: number) => value.toFixed(2), sorter: (a: StaffPerformance, b: StaffPerformance) => a.averageProcessingTime - b.averageProcessingTime },
    { title: 'Tỷ lệ hoàn thành (%)', dataIndex: 'completionRate', key: 'completionRate', render: (value: number) => `${value.toFixed(2)}%`, sorter: (a: StaffPerformance, b: StaffPerformance) => a.completionRate - b.completionRate },
  ];

  return (
    <PageContainer
      title="Thống kê Hiệu suất"
      extra={<RangePicker onChange={handleDateRangeChange} format="DD/MM/YYYY" placeholder={["Từ ngày", "Đến ngày"]} />}
    >
      <Spin spinning={loading}>
        <Row gutter={[16, 16]}>
          <Col xs={24}>
            <Card title="Hồ sơ theo Nhân viên" bordered={false}>
              {recordsByStaff.length > 0 ? <Column {...chartConfig} height={400} /> : <div style={{ textAlign: 'center', padding: 50, color: '#999' }}>Không có dữ liệu</div>}
            </Card>
          </Col>
          <Col xs={24}>
            <Card title="Hiệu suất Chi tiết" bordered={false}>
              <Table columns={performanceColumns} dataSource={staffPerformance} rowKey="staffId" pagination={{ pageSize: 10 }} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </PageContainer>
  );
};

export default PerformanceStatisticsPage;
