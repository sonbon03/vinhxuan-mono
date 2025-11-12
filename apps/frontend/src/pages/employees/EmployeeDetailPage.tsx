import React from 'react';
import { Card, Button, Space, Tag, Descriptions, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { employeeService, EmployeeStatus } from '../../services/employee.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const EmployeeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  });

  const getStatusColor = (status: EmployeeStatus): string => {
    const colorMap: Record<EmployeeStatus, string> = {
      [EmployeeStatus.WORKING]: 'success',
      [EmployeeStatus.ON_LEAVE]: 'warning',
      [EmployeeStatus.RESIGNED]: 'default',
    };
    return colorMap[status];
  };

  const getStatusText = (status: EmployeeStatus): string => {
    const textMap: Record<EmployeeStatus, string> = {
      [EmployeeStatus.WORKING]: 'Đang làm việc',
      [EmployeeStatus.ON_LEAVE]: 'Tạm nghỉ',
      [EmployeeStatus.RESIGNED]: 'Đã nghỉ việc',
    };
    return textMap[status];
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/employees">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!employee) {
    return (
      <PageContainer title="Không tìm thấy nhân viên" backUrl="/employees">
        <Card>Không tìm thấy nhân viên</Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={employee.name}
      subtitle="Chi tiết nhân viên"
      backUrl="/employees"
      actions={
        <Space>
          {isAdmin() && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/employees/${employee.id}/edit`)}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <Card>
        <Descriptions bordered column={2} labelStyle={{ width: 200 }}>
          <Descriptions.Item label="Họ và tên" span={2}>
            <strong>{employee.name}</strong>
          </Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{employee.position}</Descriptions.Item>
          <Descriptions.Item label="Số năm kinh nghiệm">{employee.yearsOfExperience} năm</Descriptions.Item>
          <Descriptions.Item label="Email">{employee.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{employee.phone}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(employee.status)}>{getStatusText(employee.status)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày sinh">
            {employee.dateOfBirth ? dayjs(employee.dateOfBirth).format('DD/MM/YYYY') : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">{dayjs(employee.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">{dayjs(employee.updatedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default EmployeeDetailPage;
