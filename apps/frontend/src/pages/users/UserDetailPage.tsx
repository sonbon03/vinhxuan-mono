import React from 'react';
import { Button, Space, Tag, Descriptions, Spin, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { userService } from '../../services/user.service';
import { usePermissions } from '../../hooks/usePermissions';
import { UserRole } from '@shared';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = usePermissions();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  const getRoleColor = (role: UserRole): string => {
    const colorMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'red',
      [UserRole.STAFF]: 'blue',
      [UserRole.CUSTOMER]: 'green',
    };
    return colorMap[role];
  };

  const getRoleText = (role: UserRole): string => {
    const textMap: Record<UserRole, string> = {
      [UserRole.ADMIN]: 'Quản trị viên',
      [UserRole.STAFF]: 'Nhân viên',
      [UserRole.CUSTOMER]: 'Khách hàng',
    };
    return textMap[role];
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/users">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="Không tìm thấy người dùng" backUrl="/users">
        <Card>Không tìm thấy người dùng</Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={user.fullName}
      subtitle="Chi tiết người dùng"
      backUrl="/users"
      extra={
        <Space>
          {isAdmin() && (
            <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/users/${user.id}/edit`)}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions bordered column={2} labelStyle={{ width: 220 }}>
        <Descriptions.Item label="Họ và tên" span={2}>
          <strong>{user.fullName}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{user.phone}</Descriptions.Item>
        <Descriptions.Item label="Vai trò">
          <Tag color={getRoleColor(user.role)}>{getRoleText(user.role)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={user.status ? 'success' : 'default'}>{user.status ? 'Hoạt động' : 'Tạm ngưng'}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày sinh">{user.dateOfBirth ? dayjs(user.dateOfBirth).format('DD/MM/YYYY') : '-'}</Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{dayjs(user.createdAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật" span={2}>{dayjs(user.updatedAt).format('DD/MM/YYYY HH:mm')}</Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default UserDetailPage;
