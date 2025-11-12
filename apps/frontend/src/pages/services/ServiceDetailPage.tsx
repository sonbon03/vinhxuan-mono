import React from 'react';
import { Button, Space, Tag, Descriptions, Spin, Card } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services/service.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const ServiceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const { data: service, isLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getServiceById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/services">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!service) {
    return (
      <PageContainer title="Không tìm thấy dịch vụ" backUrl="/services">
        <Card>Không tìm thấy dịch vụ</Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={service.name}
      subtitle="Chi tiết dịch vụ"
      backUrl="/services"
      extra={
        <Space>
          {can('services', 'update') && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/services/edit/${service.id}`)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions bordered column={2} labelStyle={{ width: 220 }}>
        <Descriptions.Item label="Tên dịch vụ" span={2}>
          <strong>{service.name}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Slug" span={2}>
          {service.slug}
        </Descriptions.Item>
        <Descriptions.Item label="Giá">
          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
            service.price,
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={service.status ? 'success' : 'default'}>
            {service.status ? 'Hoạt động' : 'Tạm ngưng'}
          </Tag>
        </Descriptions.Item>
        {service.category && (
          <Descriptions.Item label="Danh mục" span={2}>
            {service.category.name}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Ngày tạo">
          {dayjs(service.createdAt).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày cập nhật">
          {dayjs(service.updatedAt).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
        <Descriptions.Item label="Mô tả" span={2}>
          {service.description || <span style={{ color: '#999' }}>Không có mô tả</span>}
        </Descriptions.Item>
      </Descriptions>
    </PageContainer>
  );
};

export default ServiceDetailPage;
