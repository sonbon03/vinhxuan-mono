import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, message, Spin, Card } from 'antd';
import {
  SaveOutlined,
  ShopOutlined,
  DollarOutlined,
  FolderOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { serviceService } from '../../services/service.service';
import { categoryService, ModuleType } from '../../services/category.service';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

type ServiceFormValues = {
  name: string;
  slug: string;
  description: string;
  price: number;
  categoryId?: string;
  status: boolean;
};

const ServiceEditPage: React.FC = () => {
  const [form] = Form.useForm<ServiceFormValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);

  const { data: service, isLoading: serviceLoading } = useQuery({
    queryKey: ['service', id],
    queryFn: () => serviceService.getServiceById(id!),
    enabled: !!id,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories', 'SERVICE'],
    queryFn: () => categoryService.getCategories({ moduleType: ModuleType.SERVICE, limit: 1000 }),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ServiceFormValues) =>
      serviceService.updateService(id!, {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        categoryId: data.categoryId,
        status: data.status,
      }),
    onSuccess: () => {
      message.success('Cập nhật dịch vụ thành công');
      navigate('/services');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Cập nhật dịch vụ thất bại');
      setLoading(false);
    },
  });

  useEffect(() => {
    if (service) {
      form.setFieldsValue({
        name: service.name,
        slug: service.slug,
        description: service.description,
        price: service.price,
        categoryId: service.categoryId || undefined,
        status: service.status,
      });
    }
  }, [service, form]);

  const handleSubmit = async (values: ServiceFormValues) => {
    setLoading(true);
    updateMutation.mutate(values);
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = generateSlug(name);
    form.setFieldsValue({ slug });
  };

  if (serviceLoading) {
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
    <PageContainer title="Chỉnh sửa dịch vụ" subtitle={service.name} backUrl="/services">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin cơ bản" icon={<span>🧩</span>}>
          <Form.Item
            name="name"
            label="Tên dịch vụ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên dịch vụ!' },
              { min: 3, message: 'Tên dịch vụ phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<ShopOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Nhập tên dịch vụ"
              onChange={handleNameChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            rules={[
              { required: true, message: 'Vui lòng nhập slug!' },
              { min: 3, message: 'Slug phải có ít nhất 3 ký tự!' },
              { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa chữ thường, số và gạch ngang!' },
            ]}
          >
            <Input placeholder="slug-tu-dong-tao" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả!' }]}
          >
            <TextArea rows={4} placeholder="Nhập mô tả chi tiết về dịch vụ" />
          </Form.Item>
        </FormSection>

        <FormSection title="Giá và danh mục" icon={<span>💰</span>}>
          <Form.Item
            name="price"
            label="Giá dịch vụ (VNĐ)"
            rules={[
              { required: true, message: 'Vui lòng nhập giá dịch vụ!' },
              { type: 'number', min: 0, message: 'Giá phải ≥ 0!' },
            ]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Nhập giá dịch vụ"
              addonBefore={<DollarOutlined style={{ color: '#9ca3af' }} />}
              controls={false}
            />
          </Form.Item>

          <Form.Item name="categoryId" label="Danh mục">
            <Select
              placeholder="Chọn danh mục"
              loading={categoriesLoading}
              allowClear
              showSearch
              suffixIcon={<FolderOutlined style={{ color: '#9ca3af' }} />}
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={categoriesData?.items.map((cat) => ({ label: cat.name, value: cat.id }))}
            />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch
              checkedChildren={<CheckCircleOutlined />}
              unCheckedChildren="Tạm ngưng"
              style={{ minWidth: 100 }}
            />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/services'), size: 'large' }}
          primaryAction={{
            label: 'Cập nhật dịch vụ',
            htmlType: 'submit',
            icon: <SaveOutlined />,
            loading: loading || updateMutation.isPending,
            size: 'large',
          }}
        />
      </Form>
    </PageContainer>
  );
};

export default ServiceEditPage;
