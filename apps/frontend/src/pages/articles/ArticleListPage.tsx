import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, InboxOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService, Article, ArticleStatus, ArticleType } from '../../services/article.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';

const ArticleListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();
  const { isAdmin, isAdminOrStaff } = usePermissions();

  const deleteMutation = useMutation({
    mutationFn: articleService.deleteArticle,
    onSuccess: () => {
      message.success('Xóa bài viết thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa bài viết thất bại');
    },
  });

  const publishMutation = useMutation({
    mutationFn: articleService.publishArticle,
    onSuccess: () => {
      message.success('Publish bài viết thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Publish bài viết thất bại');
    },
  });

  const archiveMutation = useMutation({
    mutationFn: articleService.archiveArticle,
    onSuccess: () => {
      message.success('Lưu trữ bài viết thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Lưu trữ bài viết thất bại');
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

  const columns: ProColumns<Article>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'fullName'],
      key: 'authorName',
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (_, record) => getTypeText(record.type),
      valueType: 'select',
      valueEnum: {
        NEWS: { text: 'Tin tức' },
        SHARE: { text: 'Chia sẻ' },
        INTERNAL: { text: 'Nội bộ' },
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
      ),
      valueType: 'select',
      valueEnum: {
        DRAFT: { text: 'Nháp', status: 'Default' },
        PUBLISHED: { text: 'Đã publish', status: 'Success' },
        ARCHIVED: { text: 'Đã lưu trữ', status: 'Warning' },
        HIDDEN: { text: 'Đã ẩn', status: 'Error' },
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 160,
      search: false,
      sorter: true,
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 250,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/articles/${record.id}`)}
            />
          </Tooltip>
          {(record.status === ArticleStatus.DRAFT || isAdmin()) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/articles/edit/${record.id}`)}
            >
              Sửa
            </Button>
          )}
          {isAdmin() && record.status === ArticleStatus.DRAFT && (
            <Button
              type="link"
              icon={<CheckOutlined />}
              onClick={() => publishMutation.mutate(record.id)}
            >
              Publish
            </Button>
          )}
          {isAdmin() && record.status === ArticleStatus.PUBLISHED && (
            <Button
              type="link"
              icon={<InboxOutlined />}
              onClick={() => archiveMutation.mutate(record.id)}
            >
              Lưu trữ
            </Button>
          )}
          {(record.status === ArticleStatus.DRAFT || isAdmin()) && (
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa bài viết này?"
              onConfirm={() => deleteMutation.mutate(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent' }}>
      <ProTable<Article>
        columns={columns}
        actionRef={actionRef}
        cardBordered={false}
        options={{
          reload: true,
          density: true,
          fullScreen: true,
          setting: {
            listsHeight: 400,
          },
        }}
        request={async (params, sort, filter) => {
          const sortBy = Object.keys(sort || {})[0] || 'createdAt';
          const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

          const response = await articleService.getArticles({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.title,
            status: params.status as ArticleStatus,
            type: params.type as ArticleType,
            sortBy,
            sortOrder,
          });

          return {
            data: response.items,
            success: true,
            total: response.total,
          };
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} bài viết`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Bài viết
          </span>
        }
        toolBarRender={() => [
          isAdminOrStaff() && (
            <Button
              key="create"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/articles/create')}
            >
              Tạo bài viết mới
            </Button>
          ),
        ]}
      />
    </div>
  );
};

export default ArticleListPage;
