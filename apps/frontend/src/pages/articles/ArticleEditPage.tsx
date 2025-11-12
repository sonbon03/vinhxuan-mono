import React, { useState, useMemo, useEffect } from 'react';
import { Form, Input, Button, Card, Space, message, Select, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { articleService, ArticleType, ArticleStatus } from '../../services/article.service';
import { categoryService } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ArticleEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = usePermissions();
  const [content, setContent] = useState('');

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
      });
      setContent(article.content);
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

  const handleSubmit = async (values: any) => {
    const data = {
      title: values.title,
      slug: values.slug,
      content: content,
      categoryId: values.categoryId,
      type: values.type,
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
