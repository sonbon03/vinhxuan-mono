import React from 'react';
import { Card, Button, Space, Tag, Descriptions, Spin } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { categoryService, ModuleType } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';

const CategoryDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { can } = usePermissions();

  const { data: category, isLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id,
  });

  const getModuleTypeColor = (moduleType: ModuleType): string => {
    const colorMap: Record<ModuleType, string> = {
      [ModuleType.SERVICE]: 'blue',
      [ModuleType.ARTICLE]: 'green',
      [ModuleType.LISTING]: 'orange',
      [ModuleType.RECORD]: 'purple',
    };
    return colorMap[moduleType];
  };

  const getModuleTypeText = (moduleType: ModuleType): string => {
    const textMap: Record<ModuleType, string> = {
      [ModuleType.SERVICE]: 'Dịch vụ',
      [ModuleType.ARTICLE]: 'Bài viết',
      [ModuleType.LISTING]: 'Tin rao',
      [ModuleType.RECORD]: 'Hồ sơ',
    };
    return textMap[moduleType];
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>Không tìm thấy thể loại</p>
          <Button onClick={() => navigate('/categories')}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined
              onClick={() => navigate('/categories')}
              style={{ cursor: 'pointer' }}
            />
            <span>Chi tiết Thể loại</span>
          </Space>
        }
        extra={
          can('categories', 'update') && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/categories/edit/${category.id}`)}
            >
              Chỉnh sửa
            </Button>
          )
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tên thể loại" span={2}>
            <strong>{category.name}</strong>
          </Descriptions.Item>

          <Descriptions.Item label="Slug" span={2}>
            {category.slug}
          </Descriptions.Item>

          <Descriptions.Item label="Loại module">
            <Tag color={getModuleTypeColor(category.moduleType)}>
              {getModuleTypeText(category.moduleType)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={category.status ? 'success' : 'default'}>
              {category.status ? 'Hoạt động' : 'Tạm ngưng'}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {dayjs(category.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(category.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Mô tả" span={2}>
            {category.description || <span style={{ color: '#999' }}>Không có mô tả</span>}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default CategoryDetailPage;
