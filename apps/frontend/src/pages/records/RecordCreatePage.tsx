import React, { useState } from 'react';
import { Form, Input, message, Select, Upload, Button } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { recordService } from '../../services/record.service';
import { categoryService, ModuleType } from '../../services/category.service';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

type CreateRecordValues = {
  typeId: string;
  title: string;
  description?: string;
};

type UploadSuccessResponse = { url: string };

type CategoriesResponse = { items: { id: string; name: string }[] };

const RecordCreatePage: React.FC = () => {
  const [form] = Form.useForm<CreateRecordValues>();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories', 'record'],
    queryFn: () => categoryService.getCategories({ moduleType: ModuleType.RECORD, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRecordValues & { attachments?: string[] }) => recordService.createRecord(data as any),
    onSuccess: () => {
      message.success('Tạo hồ sơ thành công!');
      navigate('/records');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Tạo hồ sơ thất bại');
    },
  });

  const handleSubmit = async (values: CreateRecordValues) => {
    const attachments = fileList
      .filter((file) => file.status === 'done' && (file as UploadFile & { response?: UploadSuccessResponse }).response?.url)
      .map((file) => (file as UploadFile & { response?: UploadSuccessResponse }).response!.url);

    const data: CreateRecordValues & { attachments?: string[] } = {
      typeId: values.typeId,
      title: values.title,
      description: values.description,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    createMutation.mutate(data);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

  const customRequest: UploadProps['customRequest'] = ({ file, onSuccess }) => {
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/records/${Date.now()}-${(file as File).name}`;
      (onSuccess as any)?.({ url: mockUrl } as UploadSuccessResponse, file as any);
      message.success(`${(file as File).name} uploaded successfully`);
    }, 1000);
  };

  return (
    <PageContainer title="Tạo hồ sơ mới" backUrl="/records">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin hồ sơ" icon={<span>📁</span>}>
          <Form.Item name="typeId" label="Loại hồ sơ" rules={[{ required: true, message: 'Vui lòng chọn loại hồ sơ!' }]}>
            <Select
              placeholder="Chọn loại hồ sơ"
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={categoriesData?.items.map((category) => ({ label: category.name, value: category.id }))}
            />
          </Form.Item>

          <Form.Item name="title" label="Tiêu đề hồ sơ" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề hồ sơ!' }]}>
            <Input placeholder="VD: Hồ sơ công chứng hợp đồng mua bán nhà" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <TextArea rows={6} placeholder="Nhập mô tả chi tiết về hồ sơ" />
          </Form.Item>
        </FormSection>

        <FormSection title="Tài liệu đính kèm" icon={<span>📎</span>}>
          <Upload fileList={fileList} onChange={handleUploadChange} customRequest={customRequest} multiple listType="picture" maxCount={10}>
            <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
          </Upload>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>Hỗ trợ: PDF, DOC, DOCX, JPG, PNG. Tối đa 10 file.</div>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/records'), size: 'large' }}
          primaryAction={{ label: 'Tạo hồ sơ', htmlType: 'submit', icon: <SaveOutlined />, loading: createMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
};

export default RecordCreatePage;
