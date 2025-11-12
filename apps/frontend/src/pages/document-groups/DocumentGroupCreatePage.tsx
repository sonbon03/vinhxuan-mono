import React, { useState } from 'react';
import { Form, Input, Switch, message, Select, InputNumber, Checkbox } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { documentGroupService, FormField } from '../../services/document-group.service';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

const DocumentGroupCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [formFields, setFormFields] = useState<FormField[]>([]);

  const createMutation = useMutation({
    mutationFn: documentGroupService.createDocumentGroup,
    onSuccess: () => {
      message.success('Tạo nhóm giấy tờ thành công');
      navigate('/document-groups');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo nhóm giấy tờ thất bại');
    },
  });

  const handleSubmit = async (values: any) => {
    const payload = {
      ...values,
      formFields: formFields.length > 0 ? { fields: formFields } : undefined,
    };
    createMutation.mutate(payload);
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

  const addFormField = () => {
    setFormFields([
      ...formFields,
      {
        name: '',
        label: '',
        type: 'text',
        required: false,
      },
    ]);
  };

  const removeFormField = (index: number) => {
    setFormFields(formFields.filter((_, i) => i !== index));
  };

  const updateFormField = (index: number, field: Partial<FormField>) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...field };
    setFormFields(newFields);
  };

  return (
    <PageContainer
      title="Thêm nhóm giấy tờ công chứng"
      subtitle="Quản lý tập các giấy tờ thường dùng"
      backUrl="/document-groups"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          status: true,
        }}
        size="large"
      >
        <FormSection
          title="Thông tin nhóm"
          description="Cung cấp thông tin cơ bản của nhóm giấy tờ"
          icon={<span>📁</span>}
        >
          <Form.Item
            name="name"
            label="Tên nhóm giấy tờ"
            rules={[
              { required: true, message: 'Vui lòng nhập tên nhóm giấy tờ!' },
              { min: 3, message: 'Tên phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input placeholder="VD: Hợp đồng mua bán nhà đất" onChange={handleNameChange} />
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
            <Input placeholder="hop-dong-mua-ban-nha-dat" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={3} placeholder="Nhập mô tả về nhóm giấy tờ này" />
          </Form.Item>
        </FormSection>

        <FormSection title="Cấu hình Form nhập liệu" icon={<span>🧾</span>}>
          {formFields.map((field, index) => (
            <div
              key={index}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 16,
                background: '#fafafa',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <strong>Trường {index + 1}</strong>
                <a
                  onClick={() => removeFormField(index)}
                  style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}
                >
                  <DeleteOutlined /> Xóa
                </a>
              </div>
              <Form layout="vertical">
                <Form.Item label="Tên trường">
                  <Input
                    placeholder="VD: property_value"
                    value={field.name}
                    onChange={(e) => updateFormField(index, { name: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Nhãn hiển thị">
                  <Input
                    placeholder="VD: Giá trị tài sản"
                    value={field.label}
                    onChange={(e) => updateFormField(index, { label: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Loại trường">
                  <Select
                    placeholder="Chọn loại trường"
                    value={field.type}
                    onChange={(value) => updateFormField(index, { type: value })}
                  >
                    <Select.Option value="text">Văn bản</Select.Option>
                    <Select.Option value="number">Số</Select.Option>
                    <Select.Option value="select">Dropdown</Select.Option>
                    <Select.Option value="checkbox">Checkbox</Select.Option>
                    <Select.Option value="date">Ngày tháng</Select.Option>
                  </Select>
                </Form.Item>

                {field.type === 'select' && (
                  <Form.Item label="Tùy chọn">
                    <Select
                      mode="tags"
                      placeholder="Nhập các tùy chọn và nhấn Enter"
                      value={field.options || []}
                      onChange={(value) => updateFormField(index, { options: value })}
                    />
                  </Form.Item>
                )}

                {field.type === 'number' && (
                  <div style={{ display: 'flex', gap: 12 }}>
                    <InputNumber
                      placeholder="Giá trị nhỏ nhất"
                      value={field.min}
                      onChange={(value) => updateFormField(index, { min: value || undefined })}
                      style={{ width: '100%' }}
                    />
                    <InputNumber
                      placeholder="Giá trị lớn nhất"
                      value={field.max}
                      onChange={(value) => updateFormField(index, { max: value || undefined })}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}

                <Form.Item label="Placeholder (tùy chọn)">
                  <Input
                    placeholder="VD: Nhập giá trị..."
                    value={field.placeholder}
                    onChange={(e) => updateFormField(index, { placeholder: e.target.value })}
                  />
                </Form.Item>

                <Checkbox
                  checked={field.required}
                  onChange={(e) => updateFormField(index, { required: e.target.checked })}
                >
                  Bắt buộc nhập
                </Checkbox>
              </Form>
            </div>
          ))}

          <Form.Item>
            <a
              onClick={addFormField}
              style={{
                border: '1px dashed #c0c4f9',
                borderRadius: 12,
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                color: '#6366f1',
              }}
            >
              <PlusOutlined /> Thêm trường form
            </a>
          </Form.Item>
        </FormSection>

        <FormSection title="Thiết lập hiển thị" icon={<span>⚙️</span>}>
          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{
            label: 'Hủy',
            onClick: () => navigate('/document-groups'),
            size: 'large',
          }}
          primaryAction={{
            label: 'Tạo nhóm giấy tờ',
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

export default DocumentGroupCreatePage;
