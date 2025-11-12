import React, { useState, useEffect } from 'react';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  message,
  Spin,
  Typography,
  Divider,
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  FolderOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { categoryService, ModuleType } from '../../services/category.service';

const { TextArea } = Input;
const { Title } = Typography;

const CategoryEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  // Fetch category data
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategoryById(id!),
    enabled: !!id,
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => categoryService.updateCategory(id!, data),
    onSuccess: () => {
      message.success('Cập nhật danh mục thành công');
      navigate('/categories');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật danh mục thất bại');
      setLoading(false);
    },
  });

  // Set form values when category data is loaded
  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        slug: category.slug,
        description: category.description,
        moduleType: category.moduleType,
        status: category.status,
      });
    }
  }, [category, form]);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    updateMutation.mutate(values);
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-') // Replace multiple - with single -
      .trim();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    form.setFieldsValue({ slug });
  };

  const moduleTypeOptions = [
    {
      label: 'Dịch vụ',
      value: ModuleType.SERVICE,
      description: 'Danh mục cho các dịch vụ công chứng',
    },
    {
      label: 'Bài viết',
      value: ModuleType.ARTICLE,
      description: 'Danh mục cho bài viết, tin tức',
    },
    {
      label: 'Tin rao',
      value: ModuleType.LISTING,
      description: 'Danh mục cho tin rao bất động sản',
    },
    {
      label: 'Hồ sơ',
      value: ModuleType.RECORD,
      description: 'Danh mục cho hồ sơ công chứng',
    },
  ];

  if (categoryLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  if (!category) {
    return (
      <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto' }}>
        <Card>
          <p>Không tìm thấy danh mục</p>
          <Button onClick={() => navigate('/categories')}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      <Card
        className="modern-form-card"
        style={{
          borderRadius: '16px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e5e7eb',
        }}
      >
        {/* Header Section */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <Title level={3} style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <EditOutlined style={{ color: '#6366f1' }} />
              <span
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 700,
                }}
              >
                Chỉnh sửa danh mục
              </span>
            </Title>
            <Button
              onClick={() => navigate('/categories')}
              size="large"
              icon={<ArrowLeftOutlined />}
              style={{ borderRadius: '8px' }}
            >
              Quay lại
            </Button>
          </div>
          <Divider style={{ margin: '16px 0' }} />
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
          {/* Basic Information Section */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px',
                }}
              />
              Thông tin cơ bản
            </div>

            <Form.Item
              name="name"
              label="Tên danh mục"
              rules={[
                { required: true, message: 'Vui lòng nhập tên danh mục!' },
                { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự!' },
              ]}
            >
              <Input
                prefix={<FolderOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Nhập tên danh mục"
                onChange={handleNameChange}
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>

            <Form.Item
              name="slug"
              label="Slug"
              rules={[
                { required: true, message: 'Vui lòng nhập slug!' },
                { min: 3, message: 'Slug phải có ít nhất 3 ký tự!' },
                {
                  pattern: /^[a-z0-9-]+$/,
                  message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang!',
                },
              ]}
            >
              <Input placeholder="slug-tu-dong-tao" style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item name="description" label="Mô tả">
              <TextArea
                rows={4}
                placeholder="Nhập mô tả chi tiết về danh mục (tùy chọn)"
                style={{ borderRadius: '8px' }}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          {/* Settings Section */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#1f2937',
                marginBottom: '20px',
                paddingBottom: '12px',
                borderBottom: '2px solid #e5e7eb',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <div
                style={{
                  width: '4px',
                  height: '20px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '2px',
                }}
              />
              Cài đặt
            </div>

            <Form.Item
              name="moduleType"
              label="Loại module"
              rules={[{ required: true, message: 'Vui lòng chọn loại module!' }]}
              tooltip="Chọn module mà danh mục này sẽ được áp dụng"
            >
              <Select
                size="large"
                placeholder="Chọn loại module"
                suffixIcon={<AppstoreOutlined style={{ color: '#9ca3af' }} />}
                style={{ width: '100%' }}
                optionLabelProp="data-label"
              >
                {moduleTypeOptions.map(opt => (
                  <Select.Option key={opt.value} value={opt.value} data-label={opt.label}>
                    <div
                      style={{
                        padding: '4px 0',
                        minHeight: '44px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <div style={{ fontWeight: 500, fontSize: '15px', color: '#1f2937', lineHeight: '1.5' }}>
                        {opt.label}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px', lineHeight: '1.4' }}>
                        {opt.description}
                      </div>
                    </div>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="status" label="Trạng thái" valuePropName="checked">
              <Switch
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren="Tạm ngưng"
                style={{ minWidth: '100px' }}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: '24px 0' }} />

          <Form.Item style={{ marginTop: '32px', marginBottom: 0 }}>
            <Space size="large" style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button
                onClick={() => navigate('/categories')}
                size="large"
                style={{ minWidth: 120, borderRadius: '8px', height: '48px' }}
              >
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
                size="large"
                style={{
                  minWidth: 150,
                  height: '48px',
                  fontSize: '16px',
                  fontWeight: 600,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                }}
              >
                Cập nhật danh mục
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CategoryEditPage;
