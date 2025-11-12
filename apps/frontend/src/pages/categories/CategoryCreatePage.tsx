import React from 'react';
import { Form, Input, Select, Switch, message } from 'antd';
import {
  SaveOutlined,
  FolderOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';
import { categoryService, ModuleType } from '../../services/category.service';

const { TextArea } = Input;

const CategoryCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const createMutation = useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      message.success('Tạo danh mục thành công');
      navigate('/categories');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo danh mục thất bại');
    },
  });

  const handleSubmit = (values: any) => {
    createMutation.mutate(values);
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
    form.setFieldsValue({ slug: generateSlug(name) });
  };

  const moduleTypeOptions = [
    {
      label: 'Dịch vụ',
      value: ModuleType.SERVICE,
      description: 'Danh mục cho các dịch vụ công chứng',
    },
    { label: 'Bài viết', value: ModuleType.ARTICLE, description: 'Danh mục cho bài viết, tin tức' },
    {
      label: 'Tin rao',
      value: ModuleType.LISTING,
      description: 'Danh mục cho tin rao bất động sản',
    },
    { label: 'Hồ sơ', value: ModuleType.RECORD, description: 'Danh mục cho hồ sơ công chứng' },
  ];

  return (
    <PageContainer
      title="Thêm danh mục mới"
      subtitle="Tạo danh mục mới để tổ chức nội dung của bạn"
      backUrl="/categories"
      icon={<FolderOutlined />}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          moduleType: ModuleType.SERVICE,
          status: true,
        }}
        size="large"
      >
        <FormSection
          title="Thông tin cơ bản"
          description="Nhập thông tin chính xác để người dùng dễ dàng nhận diện danh mục."
          icon={<FileTextOutlined />}
        >
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
              style={{ borderRadius: 12, height: 48, fontSize: 15 }}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug"
            tooltip="Slug sẽ được tự động tạo từ tên danh mục, bạn có thể chỉnh sửa nếu cần."
            rules={[
              { required: true, message: 'Vui lòng nhập slug!' },
              { min: 3, message: 'Slug phải có ít nhất 3 ký tự!' },
              {
                pattern: /^[a-z0-9-]+$/,
                message: 'Slug chỉ chứa chữ thường, số và dấu gạch ngang!',
              },
            ]}
          >
            <Input
              placeholder="slug-tu-dong-tao"
              style={{ borderRadius: 12, height: 48, fontSize: 15, fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea
              rows={4}
              placeholder="Nhập mô tả chi tiết về danh mục (tùy chọn)"
              style={{ borderRadius: 12, fontSize: 15 }}
              showCount
              maxLength={500}
            />
          </Form.Item>
        </FormSection>

        <FormSection
          title="Cài đặt hiển thị"
          description="Chọn module áp dụng và trạng thái hiển thị cho danh mục."
          icon={<AppstoreOutlined />}
        >
          <Form.Item
            name="moduleType"
            label="Loại module"
            tooltip="Chọn module mà danh mục này sẽ được áp dụng."
            rules={[{ required: true, message: 'Vui lòng chọn loại module!' }]}
          >
            <Select
              size="large"
              placeholder="Chọn loại module"
              suffixIcon={<AppstoreOutlined style={{ color: '#9ca3af' }} />}
              optionLabelProp="data-label"
            >
              {moduleTypeOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} data-label={opt.label}>
                  <div
                    style={{ padding: '4px 0', display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    <span style={{ fontWeight: 600, color: '#1f2937' }}>{opt.label}</span>
                    <span style={{ fontSize: 13, color: '#6b7280' }}>{opt.description}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            valuePropName="checked"
            tooltip='Danh mục sẽ được hiển thị khi trạng thái ở "Hoạt động".'
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Switch
                checkedChildren={<CheckCircleOutlined />}
                unCheckedChildren="Tạm ngưng"
                style={{ minWidth: 100 }}
              />
              <span style={{ color: '#6b7280', fontSize: 14 }}>
                Bật để cho phép người dùng nhìn thấy danh mục này.
              </span>
            </div>
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{
            label: 'Hủy',
            onClick: () => navigate('/categories'),
            size: 'large',
          }}
          primaryAction={{
            label: 'Tạo danh mục',
            htmlType: 'submit',
            icon: <SaveOutlined />,
            loading: createMutation.isPending,
            size: 'large',
          }}
        />
      </Form>
    </PageContainer>
  );
};

export default CategoryCreatePage;
