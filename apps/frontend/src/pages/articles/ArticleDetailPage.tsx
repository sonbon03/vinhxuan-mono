import React from 'react';
import { Card, Button, Space, Tag, Descriptions, Spin, message, Divider } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CheckOutlined,
  InboxOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService, ArticleStatus, ArticleType } from '../../services/article.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin } = usePermissions();

  const { data: article, isLoading } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articleService.getArticleById(id!),
    enabled: !!id,
  });

  const publishMutation = useMutation({
    mutationFn: articleService.publishArticle,
    onSuccess: () => {
      message.success('Publish bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Publish bài viết thất bại');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: articleService.archiveArticle,
    onSuccess: () => {
      message.success('Lưu trữ bài viết thành công!');
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lưu trữ bài viết thất bại');
    },
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: articleService.toggleHidden,
    onSuccess: () => {
      message.success('Cập nhật trạng thái hiển thị thành công!');
      queryClient.invalidateQueries({ queryKey: ['article', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });

  const getStatusColor = (status: ArticleStatus): string => {
    const colorMap: Record<ArticleStatus, string> = {
      [ArticleStatus.DRAFT]: 'default',
      [ArticleStatus.PUBLISHED]: 'success',
      [ArticleStatus.ARCHIVED]: 'warning',
      [ArticleStatus.HIDDEN]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: ArticleStatus): string => {
    const textMap: Record<ArticleStatus, string> = {
      [ArticleStatus.DRAFT]: 'Nháp',
      [ArticleStatus.PUBLISHED]: 'Đã publish',
      [ArticleStatus.ARCHIVED]: 'Đã lưu trữ',
      [ArticleStatus.HIDDEN]: 'Đã ẩn',
    };
    return textMap[status];
  };

  const getTypeText = (type: ArticleType): string => {
    const textMap: Record<ArticleType, string> = {
      [ArticleType.NEWS]: 'Tin tức',
      [ArticleType.SHARE]: 'Chia sẻ',
      [ArticleType.INTERNAL]: 'Nội bộ',
    };
    return textMap[type];
  };

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!article) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>Không tìm thấy bài viết.</p>
          <Button onClick={() => navigate('/articles')}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  const canEdit = article.status === ArticleStatus.DRAFT || isAdmin();

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined
              onClick={() => navigate('/articles')}
              style={{ cursor: 'pointer' }}
            />
            <span>Chi tiết Bài viết</span>
          </Space>
        }
        extra={
          <Space>
            {canEdit && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => navigate(`/articles/edit/${article.id}`)}
              >
                Sửa
              </Button>
            )}
            {isAdmin() && article.status === ArticleStatus.DRAFT && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => publishMutation.mutate(article.id)}
                loading={publishMutation.isPending}
              >
                Publish
              </Button>
            )}
            {isAdmin() && article.status === ArticleStatus.PUBLISHED && (
              <Button
                icon={<InboxOutlined />}
                onClick={() => archiveMutation.mutate(article.id)}
                loading={archiveMutation.isPending}
              >
                Lưu trữ
              </Button>
            )}
            {isAdmin() && (
              <Button
                icon={article.status === ArticleStatus.HIDDEN ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => toggleHiddenMutation.mutate(article.id)}
                loading={toggleHiddenMutation.isPending}
              >
                {article.status === ArticleStatus.HIDDEN ? 'Hiện' : 'Ẩn'}
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Tiêu đề" span={2}>
            {article.title}
          </Descriptions.Item>

          <Descriptions.Item label="Slug" span={2}>
            {article.slug}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(article.status)}>{getStatusText(article.status)}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Loại bài viết">
            <Tag color="blue">{getTypeText(article.type)}</Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Tác giả">
            {article.author?.fullName || 'N/A'}
          </Descriptions.Item>

          <Descriptions.Item label="Thể loại">
            {article.category?.name || 'Chưa phân loại'}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày tạo">
            {dayjs(article.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(article.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          {article.publishedAt && (
            <Descriptions.Item label="Ngày publish">
              {dayjs(article.publishedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          )}

          {article.approver && (
            <Descriptions.Item label="Người duyệt">
              {article.approver.fullName}
            </Descriptions.Item>
          )}

          {article.isCrawled && (
            <Descriptions.Item label="Bài crawl" span={2}>
              <Tag color="orange">Bài viết được crawl từ nguồn ngoài</Tag>
            </Descriptions.Item>
          )}

          {article.sourceUrl && (
            <Descriptions.Item label="URL nguồn" span={2}>
              <a href={article.sourceUrl} target="_blank" rel="noopener noreferrer">
                {article.sourceUrl}
              </a>
            </Descriptions.Item>
          )}

          {article.thumbnail && (
            <Descriptions.Item label="Hình ảnh thumbnail" span={2}>
              <img
                src={article.thumbnail}
                alt={article.title}
                style={{ maxWidth: '400px', width: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </Descriptions.Item>
          )}
        </Descriptions>

        <Divider>Nội dung</Divider>

        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: article.content }}
          style={{
            padding: '24px',
            background: '#fafafa',
            borderRadius: '8px',
            minHeight: '300px',
          }}
        />

        <style>{`
          .article-content img {
            max-width: 100%;
            height: auto;
          }
          .article-content h1 {
            font-size: 2em;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
          }
          .article-content h2 {
            font-size: 1.5em;
            margin-top: 0.83em;
            margin-bottom: 0.83em;
          }
          .article-content h3 {
            font-size: 1.17em;
            margin-top: 1em;
            margin-bottom: 1em;
          }
          .article-content p {
            margin: 1em 0;
            line-height: 1.6;
          }
          .article-content ul, .article-content ol {
            margin: 1em 0;
            padding-left: 2em;
          }
          .article-content blockquote {
            border-left: 4px solid #ccc;
            padding-left: 1em;
            margin: 1em 0;
            color: #666;
          }
        `}</style>
      </Card>
    </div>
  );
};

export default ArticleDetailPage;
