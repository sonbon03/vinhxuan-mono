import React, { useState, useEffect } from 'react';
import { Form, Input, message, Select, Checkbox, InputNumber, Switch, Spin } from 'antd';
import { PlusOutlined, DeleteOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { documentGroupService, FormField } from '../../services/document-group.service';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

const DocumentGroupEditPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formFields, setFormFields] = useState<FormField[]>([]);

  const { data: documentGroup, isLoading } = useQuery({
    queryKey: ['document-group', id],
    queryFn: () => documentGroupService.getDocumentGroupById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (documentGroup) {
      form.setFieldsValue({
        name: documentGroup.name,
        slug: documentGroup.slug,
        description: documentGroup.description,
        status: documentGroup.status,
      });
      if (documentGroup.formFields?.fields) {
        setFormFields(documentGroup.formFields.fields);
      }
    }
  }, [documentGroup, form]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => documentGroupService.updateDocumentGroup(id!, data),
    onSuccess: () => {
      message.success('Cập nhật nhóm giấy tờ thành công!');
      navigate('/document-groups');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật nhóm giấy tờ thất bại');
    },
  });

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

  const updateFormField = (index: number, updates: Partial<FormField>) => {
    const newFields = [...formFields];
    newFields[index] = { ...newFields[index], ...updates };
    setFormFields(newFields);
  };

  const handleSubmit = async (values: any) => {
    const invalidFields = formFields.filter((field) => !field.name || !field.label);
    if (invalidFields.length > 0) {
      message.error('Vui lòng điền đầy đủ tên và nhãn cho tất cả các trường!');
      return;
    }

    const data = {
      name: values.name,
      slug: values.slug,
      description: values.description,
      status: values.status,
      formFields: {
        fields: formFields,
      },
    };

    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/document-groups">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!documentGroup) {
    return (
      <PageContainer title="Không tìm thấy nhóm" backUrl="/document-groups">
        <p>Không tìm thấy nhóm giấy tờ</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Chỉnh sửa nhóm giấy tờ" subtitle={documentGroup.name} backUrl="/document-groups">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin nhóm" description="Cập nhật thông tin cơ bản của nhóm giấy tờ" icon={<span>📁</span>}>
          <Form.Item name="name" label="Tên nhóm giấy tờ" rules={[{ required: true, message: 'Vui lòng nhập tên nhóm giấy tờ!' }]}>
            <Input placeholder="VD: Hợp đồng mua bán nhà đất" />
          </Form.Item>

          <Form.Item name="slug" label="Slug (URL thân thiện)" rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}>
            <Input placeholder="VD: hop-dong-mua-ban-nha-dat" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <TextArea rows={4} placeholder="Mô tả chi tiết về nhóm giấy tờ này" />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái" valuePropName="checked">
            <Switch checkedChildren="Kích hoạt" unCheckedChildren="Tạm ngưng" />
          </Form.Item>
        </FormSection>

        <FormSection title="Cấu hình Form nhập liệu" description="Thêm hoặc chỉnh sửa các trường cần thu thập" icon={<span>🧾</span>}>
          {formFields.length === 0 && (
            <div style={{
              border: '1px dashed #c0c4f9',
              borderRadius: 12,
              padding: '32px',
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: 16,
            }}>
              Chưa có trường nào. Nhấn "Thêm trường" để bắt đầu.
            </div>
          )}

          {formFields.map((field, index) => (
            <div key={index} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, marginBottom: 16, background: '#fafafa' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <strong>Trường {index + 1}</strong>
                <a onClick={() => removeFormField(index)} style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
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

          <a
            onClick={addFormField}
            style={{
              border: '1px dashed #c0c4f9',
              borderRadius: 12,
              padding: '14px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              color: '#6366f1',
              width: '100%',
            }}
          >
            <PlusOutlined /> Thêm trường form
          </a>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/document-groups'), size: 'large' }}
          primaryAction={{ label: 'Lưu thay đổi', htmlType: 'submit', icon: <SaveOutlined />, loading: updateMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
};

export default DocumentGroupEditPage;
