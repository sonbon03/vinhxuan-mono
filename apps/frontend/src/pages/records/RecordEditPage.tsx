import React, { useState, useEffect } from 'react';
import { Form, Input, message, Select, Upload, Spin, Card, Button } from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { recordService, RecordStatus } from '../../services/record.service';
import { categoryService, ModuleType } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

type EditRecordValues = {
  typeId: string;
  title: string;
  description?: string;
  reviewNotes?: string;
};

type UploadSuccessResponse = { url: string };

type CategoriesResponse = { items: { id: string; name: string }[] };

const RecordEditPage: React.FC = () => {
  const [form] = Form.useForm<EditRecordValues>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAdminOrStaff } = usePermissions();

  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: record, isLoading } = useQuery({
    queryKey: ['record', id],
    queryFn: () => recordService.getRecordById(id!),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories', 'record'],
    queryFn: () => categoryService.getCategories({ moduleType: ModuleType.RECORD, limit: 1000 }),
  });

  useEffect(() => {
    if (record) {
      form.setFieldsValue({
        typeId: record.typeId,
        title: record.title,
        description: record.description,
        reviewNotes: record.reviewNotes,
      });

      if (record.attachments && record.attachments.length > 0) {
        const existingFiles: UploadFile[] = record.attachments.map((url, index) => ({
          uid: `-${index}`,
          name: url.split('/').pop() || `file-${index}`,
          status: 'done',
          url,
          response: { url },
        }));
        setFileList(existingFiles);
      }
    }
  }, [record, form]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<EditRecordValues> & { attachments?: string[] }) =>
      recordService.updateRecord(id!, data as any),
    onSuccess: () => {
      message.success('Cập nhật hồ sơ thành công!');
      navigate('/records');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Cập nhật hồ sơ thất bại');
    },
  });

  const handleSubmit = async (values: EditRecordValues) => {
    const attachments = fileList
      .filter((file) => file.status === 'done')
      .map(
        (file) =>
          (file as UploadFile & { response?: UploadSuccessResponse }).response?.url ||
          (file.url as string),
      )
      .filter((url): url is string => Boolean(url));

    const data: Partial<EditRecordValues> & { attachments?: string[] } = {
      typeId: values.typeId,
      title: values.title,
      description: values.description,
      reviewNotes: values.reviewNotes,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    updateMutation.mutate(data);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const customRequest: UploadProps['customRequest'] = ({ file, onSuccess }) => {
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/records/${Date.now()}-${(file as File).name}`;
      (onSuccess as any)?.({ url: mockUrl } as UploadSuccessResponse, file as any);
      message.success(`${(file as File).name} uploaded successfully`);
    }, 1000);
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/records">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!record) {
    return (
      <PageContainer title="Không tìm thấy hồ sơ" backUrl="/records">
        <Card>Không tìm thấy hồ sơ</Card>
      </PageContainer>
    );
  }

  const isEditable = record.status === RecordStatus.PENDING || isAdminOrStaff();

  return (
    <PageContainer title="Chỉnh sửa hồ sơ" subtitle={record.title} backUrl="/records">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin hồ sơ" icon={<span>📁</span>}>
          <Form.Item
            name="typeId"
            label="Loại hồ sơ"
            rules={[{ required: true, message: 'Vui lòng chọn loại hồ sơ!' }]}
          >
            <Select
              placeholder="Chọn loại hồ sơ"
              disabled={!isEditable}
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={categoriesData?.items.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="title"
            label="Tiêu đề hồ sơ"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề hồ sơ!' }]}
          >
            <Input placeholder="VD: Hồ sơ công chứng hợp đồng mua bán nhà" disabled={!isEditable} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả chi tiết">
            <TextArea rows={6} placeholder="Nhập mô tả chi tiết về hồ sơ" disabled={!isEditable} />
          </Form.Item>
        </FormSection>

        {isEditable && (
          <FormSection title="Tài liệu đính kèm" icon={<span>📎</span>}>
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              customRequest={customRequest}
              multiple
              listType="picture"
              maxCount={10}
            >
              <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
            </Upload>
            <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
              Hỗ trợ: PDF, DOC, DOCX, JPG, PNG. Tối đa 10 file.
            </div>
          </FormSection>
        )}

        {isAdminOrStaff() && (
          <FormSection title="Ghi chú duyệt" icon={<span>📝</span>}>
            <Form.Item name="reviewNotes" label="Ghi chú của người duyệt">
              <TextArea rows={4} placeholder="Nhập ghi chú duyệt hồ sơ (chỉ Staff/Admin)" />
            </Form.Item>
          </FormSection>
        )}

        {isEditable && (
          <FormActionBar
            secondaryAction={{ label: 'Hủy', onClick: () => navigate('/records'), size: 'large' }}
            primaryAction={{
              label: 'Lưu thay đổi',
              htmlType: 'submit',
              icon: <SaveOutlined />,
              loading: updateMutation.isPending,
              size: 'large',
            }}
          />
        )}
      </Form>
    </PageContainer>
  );
};

export default RecordEditPage;
