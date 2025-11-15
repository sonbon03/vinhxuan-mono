import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input, Button, Card, Space, message, Select, Spin, Upload } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { articleService, ArticleType, ArticleStatus } from '../../services/article.service';
import { categoryService } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import type { UploadFile, UploadProps } from 'antd';

const ArticleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = usePermissions();
  const [content, setContent] = useState('');
  const [thumbnailFileList, setThumbnailFileList] = useState<UploadFile[]>([]);
  const [previewImage, setPreviewImage] = useState<string>('');

  // Fetch article data
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleService.getArticleById(id!),
    enabled: !!id,
  });

  // Fetch categories for articles
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', 'article'],
    queryFn: () => categoryService.getCategories({ moduleType: 'ARTICLE' as any, limit: 1000 }),
  });

  // Pre-populate form when article data is loaded
  useEffect(() => {
    if (article) {
      form.setFieldsValue({
        title: article.title,
        slug: article.slug,
        categoryId: article.categoryId,
        type: article.type,
        sourceUrl: article.sourceUrl,
        thumbnail: article.thumbnail,
      });
      setContent(article.content);

      // Set preview image if thumbnail exists
      if (article.thumbnail) {
        setPreviewImage(article.thumbnail);
        // If it's a URL, don't set file list
        if (!article.thumbnail.startsWith('data:')) {
          setThumbnailFileList([]);
        }
      }
    }
  }, [article, form]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => articleService.updateArticle(id!, data),
    onSuccess: () => {
      message.success('Cập nhật bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['article', id] });
      navigate('/articles');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật bài viết thất bại');
    },
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    form.setFieldsValue({ slug });
  };

  // Handle thumbnail upload
  const handleThumbnailChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setThumbnailFileList(newFileList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('Bạn chỉ có thể tải lên file ảnh!');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Ảnh phải nhỏ hơn 5MB!');
      return false;
    }

    // Convert to base64 for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    return false; // Prevent auto upload
  };

  const handleSubmit = async (values: any) => {
    // Convert image to base64 if uploaded
    let thumbnailUrl = values.thumbnail;
    if (thumbnailFileList.length > 0 && previewImage) {
      thumbnailUrl = previewImage;
    }

    const data = {
      title: values.title,
      slug: values.slug,
      content: content,
      categoryId: values.categoryId,
      type: values.type,
      sourceUrl: values.sourceUrl,
      thumbnail: thumbnailUrl,
    };

    updateMutation.mutate(data);
  };

  // Quill editor configuration
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
        ['link', 'image', 'video'],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ['clean'],
      ],
    }),
    []
  );

  const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
    'image',
    'video',
    'color',
    'background',
    'align',
  ];

  // Check if user can edit
  const canEdit = article && (article.status === ArticleStatus.DRAFT || isAdmin());

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!canEdit) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>Bạn không có quyền chỉnh sửa bài viết này.</p>
          <Button onClick={() => navigate('/articles')}>Quay lại</Button>
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
              onClick={() => navigate('/articles')}
              style={{ cursor: 'pointer' }}
            />
            <span>Chỉnh sửa Bài viết</span>
          </Space>
        }
        extra={
          <Space>
            <Button onClick={() => navigate('/articles')}>Hủy</Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={() => form.submit()}
              loading={updateMutation.isPending}
            >
              Cập nhật
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input
              placeholder="VD: Hướng dẫn công chứng hợp đồng mua bán nhà"
              size="large"
              onChange={handleTitleChange}
            />
          </Form.Item>

          <Form.Item
            name="slug"
            label="Slug (URL thân thiện)"
            rules={[{ required: true, message: 'Vui lòng nhập slug!' }]}
          >
            <Input placeholder="huong-dan-cong-chung-hop-dong-mua-ban-nha" size="large" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Thể loại"
            rules={[{ required: true, message: 'Vui lòng chọn thể loại!' }]}
          >
            <Select
              placeholder="Chọn thể loại"
              size="large"
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
            name="type"
            label="Loại bài viết"
            rules={[{ required: true, message: 'Vui lòng chọn loại bài viết!' }]}
          >
            <Select size="large">
              <Select.Option value={ArticleType.NEWS}>Tin tức</Select.Option>
              <Select.Option value={ArticleType.SHARE}>Chia sẻ</Select.Option>
              <Select.Option value={ArticleType.INTERNAL}>Nội bộ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}
          >
            {({ getFieldValue }) =>
              getFieldValue('type') === ArticleType.NEWS && (
                <Form.Item
                  name="sourceUrl"
                  label="URL nguồn"
                  rules={[
                    { required: true, message: 'URL nguồn là bắt buộc khi loại bài viết là Tin tức!' },
                    { type: 'url', message: 'Vui lòng nhập URL hợp lệ!' },
                  ]}
                  help="URL bài viết gốc từ nguồn tin tức"
                >
                  <Input
                    placeholder="https://example.com/bai-viet-goc"
                    size="large"
                  />
                </Form.Item>
              )
            }
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Ảnh thumbnail"
            help="Tải lên ảnh đại diện cho bài viết (tối đa 5MB)"
          >
            <Upload
              listType="picture-card"
              fileList={thumbnailFileList}
              onChange={handleThumbnailChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept="image/*"
            >
              {thumbnailFileList.length === 0 && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            {previewImage && (
              <div style={{ marginTop: 16 }}>
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }}
                />
              </div>
            )}
          </Form.Item>

          <Form.Item
            label="Nội dung"
            required
          >
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              formats={formats}
              style={{ height: '400px', marginBottom: '50px' }}
              placeholder="Nhập nội dung bài viết..."
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ArticleEditPage;
