import React, { useState } from 'react';
import { Form, Input, InputNumber, message, Select, Upload } from 'antd';
import { SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { listingService } from '../../services/listing.service';
import { categoryService, ModuleType } from '../../services/category.service';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

type CreateListingValues = {
  title: string;
  content: string;
  price?: number;
  categoryId: string;
};

type UploadSuccessResponse = { url: string };

type CategoryItem = { id: string; name: string };

type CategoriesResponse = { items: CategoryItem[] };

const ListingCreatePage: React.FC = () => {
  const [form] = Form.useForm<CreateListingValues>();
  const navigate = useNavigate();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const { data: categoriesData } = useQuery<CategoriesResponse>({
    queryKey: ['categories', 'listing'],
    queryFn: () => categoryService.getCategories({ moduleType: ModuleType.LISTING, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateListingValues & { images?: string[] }) =>
      listingService.createListing(data),
    onSuccess: () => {
      message.success('Đăng tin rao thành công!');
      navigate('/listings');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Đăng tin rao thất bại');
    },
  });

  const handleSubmit = async (values: CreateListingValues) => {
    const images = fileList
      .filter(
        (file) =>
          file.status === 'done' &&
          (file as UploadFile & { response?: UploadSuccessResponse }).response?.url,
      )
      .map((file) => (file as UploadFile & { response?: UploadSuccessResponse }).response!.url);

    const data: CreateListingValues & { images?: string[] } = {
      title: values.title,
      content: values.content,
      price: values.price,
      categoryId: values.categoryId,
      images: images.length > 0 ? images : undefined,
    };

    createMutation.mutate(data);
  };

  const handleUploadChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const customRequest: UploadProps['customRequest'] = async ({ file, onSuccess }) => {
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/listings/${Date.now()}-${(file as File).name}`;
      const cb = onSuccess as unknown as (response: UploadSuccessResponse, file?: File) => void;
      cb?.({ url: mockUrl }, file as File);
      message.success(`${(file as File).name} uploaded successfully`);
    }, 1000);
  };

  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Tải ảnh</div>
    </button>
  );

  return (
    <PageContainer title="Đăng tin rao mới" backUrl="/listings">
      <Form form={form} layout="vertical" onFinish={handleSubmit} size="large">
        <FormSection title="Thông tin cơ bản" icon={<span>📝</span>}>
          <Form.Item
            name="title"
            label="Tiêu đề tin rao"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="VD: Cần tìm người mua nhà đất" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
          >
            <Select
              placeholder="Chọn thể loại"
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

          <Form.Item name="price" label="Giá (VNĐ)" tooltip="Để trống nếu giá liên hệ">
            <InputNumber placeholder="Nhập giá (VD: 5000000)" style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
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
            {fileList.length >= 10 ? null : uploadButton}
          </Upload>
          <div style={{ marginTop: 8, color: '#999', fontSize: 12 }}>
            Hỗ trợ: JPG, PNG, GIF. Tối đa 10 ảnh.
          </div>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/listings'), size: 'large' }}
          primaryAction={{
            label: 'Đăng tin',
            htmlType: 'submit',
            icon: <SaveOutlined />,
            loading: createMutation.isPending,
            size: 'large',
          }}
        />

        <div
          style={{
            padding: 12,
            background: '#f0f0f0',
            borderRadius: 8,
            marginTop: 16,
            fontSize: 12,
            color: '#666',
          }}
        >
          <strong>Lưu ý:</strong> Tin rao của bạn sẽ được gửi đến quản trị viên để phê duyệt trước
          khi hiển thị công khai.
        </div>
      </Form>
    </PageContainer>
  );
};

export default ListingCreatePage;
