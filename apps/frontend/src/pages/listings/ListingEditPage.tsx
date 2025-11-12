import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Upload, Spin, Card } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { listingService } from '../../services/listing.service';
import { categoryService } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

const ListingEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = usePermissions();
  const { user } = useAuth();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', id],
    queryFn: () => listingService.getListingById(id!),
    enabled: !!id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'listing'],
    queryFn: () => categoryService.getCategories({ moduleType: 'LISTING' as any, limit: 1000 }),
  });

  useEffect(() => {
    if (listing) {
      form.setFieldsValue({
        title: listing.title,
        content: listing.content,
        price: listing.price,
        categoryId: listing.categoryId,
      });

      if (listing.images && listing.images.length > 0) {
        const existingFiles: UploadFile[] = listing.images.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}`,
          status: 'done',
          url,
          response: { url },
        }));
        setFileList(existingFiles);
      }
    }
  }, [listing, form]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => listingService.updateListing(id!, data),
    onSuccess: () => {
      message.success('Cập nhật tin rao thành công!');
      queryClient.invalidateQueries({ queryKey: ['listing', id] });
      navigate('/listings');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật tin rao thất bại');
    },
  });

  const handleSubmit = async (values: any) => {
    const images = fileList
      .filter((file) => file.status === 'done' && ((file as any).response?.url || file.url))
      .map((file) => (file as any).response?.url || (file.url as string));

    const data = {
      title: values.title,
      content: values.content,
      price: values.price,
      categoryId: values.categoryId,
      images: images.length > 0 ? images : undefined,
    };

    updateMutation.mutate(data);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess }) => {
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/listings/${Date.now()}-${(file as File).name}`;
      onSuccess && onSuccess({ url: mockUrl } as any, file as any);
      message.success(`${(file as File).name} uploaded successfully`);
    }, 1000);
  };

  const canEdit = listing && (user?.id === listing.authorId || isAdmin());

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/listings">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!canEdit) {
    return (
      <PageContainer title="Không có quyền chỉnh sửa" backUrl="/listings">
        <Card>Bạn không có quyền chỉnh sửa tin rao này.</Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Chỉnh sửa tin rao" subtitle={listing?.title} backUrl="/listings">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin cơ bản" icon={<span>📝</span>}>
          <Form.Item name="title" label="Tiêu đề tin rao" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="VD: Cần tìm người mua nhà đất" />
          </Form.Item>

          <Form.Item name="categoryId" label="Thể loại" rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}>
            <Select
              placeholder="Chọn thể loại"
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={categoriesData?.items.map((category) => ({ label: category.name, value: category.id }))}
            />
          </Form.Item>

          <Form.Item name="price" label="Giá (VNĐ)" tooltip="Để trống nếu giá liên hệ">
            <InputNumber placeholder="Nhập giá (VD: 5000000)" style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item name="content" label="Nội dung chi tiết" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <TextArea rows={8} placeholder="Nhập mô tả chi tiết về tin rao" />
          </Form.Item>
        </FormSection>

        <FormSection title="Hình ảnh" icon={<span>🖼️</span>}>
          <Upload
            listType="picture-card"
            fileList={fileList}
            onChange={handleUploadChange}
            customRequest={customRequest}
            multiple
            maxCount={10}
            accept="image/*"
          >
            {fileList.length >= 10 ? null : (
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </button>
            )}
          </Upload>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>Hỗ trợ: JPG, PNG, GIF. Tối đa 10 ảnh.</div>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/listings'), size: 'large' }}
          primaryAction={{ label: 'Cập nhật', htmlType: 'submit', icon: <SaveOutlined />, loading: updateMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
};

export default ListingEditPage;
