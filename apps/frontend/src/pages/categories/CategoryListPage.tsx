import React, { useRef } from 'react';
import { Button, Space, Tag, Popconfirm, message, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Category, categoryService, ModuleType } from '../../services/category.service';
import { usePermissions } from '../../hooks/usePermissions';
import { Can } from '../../components/Can';
import dayjs from 'dayjs';

const CategoryListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      message.success('Xóa danh mục thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      message.error('Xóa danh mục thất bại');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      categoryService.updateCategoryStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => {
      message.error('Cập nhật trạng thái thất bại');
    },
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleToggleStatus = (id: string, currentStatus: boolean) => {
    updateStatusMutation.mutate({ id, status: !currentStatus });
  };

  const moduleTypeLabels: Record<ModuleType, string> = {
    [ModuleType.SERVICE]: 'Dịch vụ',
    [ModuleType.ARTICLE]: 'Bài viết',
    [ModuleType.LISTING]: 'Tin rao',
    [ModuleType.RECORD]: 'Hồ sơ',
  };

  const moduleTypeColors: Record<ModuleType, string> = {
    [ModuleType.SERVICE]: 'blue',
    [ModuleType.ARTICLE]: 'green',
    [ModuleType.LISTING]: 'orange',
    [ModuleType.RECORD]: 'purple',
  };

  const columns: ProColumns<Category>[] = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
      width: 200,
      search: false,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      search: false,
    },
    {
      title: 'Loại module',
      dataIndex: 'moduleType',
      key: 'moduleType',
      width: 150,
      valueType: 'select',
      valueEnum: {
        [ModuleType.SERVICE]: { text: 'Dịch vụ', status: 'Processing' },
        [ModuleType.ARTICLE]: { text: 'Bài viết', status: 'Success' },
        [ModuleType.LISTING]: { text: 'Tin rao', status: 'Warning' },
        [ModuleType.RECORD]: { text: 'Hồ sơ', status: 'Error' },
      },
      render: (_, record) => (
        <Tag color={moduleTypeColors[record.moduleType]}>{moduleTypeLabels[record.moduleType]}</Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: {
        true: { text: 'Hoạt động', status: 'Success' },
        false: { text: 'Tạm ngưng', status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status ? 'success' : 'default'}>
          {record.status ? 'Hoạt động' : 'Tạm ngưng'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      search: false,
      sorter: true,
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      search: false,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/categories/${record.id}`)}
            />
          </Tooltip>
          <Can module="categories" action="update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/categories/edit/${record.id}`)}
            >
              Sửa
            </Button>
          </Can>
          <Can module="categories" action="update">
            <Button
              type="link"
              icon={record.status ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status)}
            >
              {record.status ? 'Tạm ngưng' : 'Kích hoạt'}
            </Button>
          </Can>
          <Can module="categories" action="delete">
            <Popconfirm
              title="Xóa danh mục"
              description="Bạn có chắc chắn muốn xóa danh mục này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Xóa
              </Button>
            </Popconfirm>
          </Can>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
      <ProTable<Category>
        columns={columns}
        actionRef={actionRef}
        cardBordered={false}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [...dom.reverse()],
          filterType: 'light',
        }}
        options={{
          reload: true,
          density: true,
          fullScreen: true,
          setting: {
            listsHeight: 400,
          },
        }}
        request={async (params, sort) => {
          try {
            const sortBy = Object.keys(sort || {})[0] || 'createdAt';
            const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

            const response = await categoryService.getCategories({
              page: params.current || 1,
              limit: params.pageSize ?? 20,
              search: params.name || undefined,
              moduleType: params.moduleType as ModuleType,
              status: params.status !== undefined ? params.status === 'true' : undefined,
              sortBy,
              sortOrder,
            });

            return {
              data: response.items,
              success: true,
              total: response.total,
            };
          } catch (error) {
            message.error('Lỗi khi tải danh sách danh mục');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span
            style={{
              fontSize: '24px',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            📁 Danh sách danh mục
          </span>
        }
        toolBarRender={() => [
          <Can key="create" module="categories" action="create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/categories/create')}
              size="large"
              style={{
                borderRadius: '8px',
                height: '40px',
                fontWeight: 600,
                boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
              }}
            >
              Thêm mới
            </Button>
          </Can>,
        ]}
        scroll={{ x: 'max-content' }}
        sticky={{ offsetHeader: 64 }}
      />
    </div>
  );
};

export default CategoryListPage;
