import React, { useRef } from 'react';
import { Button, Space, Tag, Popconfirm, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckCircleOutlined, StopOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Service, serviceService } from '../../services/service.service';
import { usePermissions } from '../../hooks/usePermissions';
import { Can } from '../../components/Can';
import dayjs from 'dayjs';

const ServiceListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();
  const { can } = usePermissions();

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: serviceService.deleteService,
    onSuccess: () => {
      message.success('Xóa dịch vụ thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: () => {
      message.error('Xóa dịch vụ thất bại');
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      serviceService.updateServiceStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['services'] });
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

  const columns: ProColumns<Service>[] = [
    {
      title: 'Tên dịch vụ',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 250,
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
      title: 'Giá (VNĐ)',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      search: false,
      sorter: true,
      render: (_, record) => {
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(record.price);
      },
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'categoryId',
      width: 150,
      search: false,
      render: (_, record) => record.category?.name || '-',
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
              onClick={() => navigate(`/services/${record.id}`)}
            />
          </Tooltip>
          <Can module="services" action="update">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/services/edit/${record.id}`)}
            >
              Sửa
            </Button>
          </Can>
          <Can module="services" action="update">
            <Button
              type="link"
              icon={record.status ? <StopOutlined /> : <CheckCircleOutlined />}
              onClick={() => handleToggleStatus(record.id, record.status)}
            >
              {record.status ? 'Tạm ngưng' : 'Kích hoạt'}
            </Button>
          </Can>
          <Can module="services" action="delete">
            <Popconfirm
              title="Xóa dịch vụ"
              description="Bạn có chắc chắn muốn xóa dịch vụ này?"
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
      <ProTable<Service>
        columns={columns}
        actionRef={actionRef}
        cardBordered={false}
        search={{
          labelWidth: 'auto',
          defaultCollapsed: false,
          optionRender: (searchConfig, formProps, dom) => [
            ...dom.reverse(),
          ],
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

            const response = await serviceService.getServices({
              page: params.current || 1,
              limit: params.pageSize ?? 20,
              search: params.name || undefined,
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
            message.error('Lỗi khi tải danh sách dịch vụ');
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} dịch vụ`,
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
            🛍️ Danh sách dịch vụ
          </span>
        }
        toolBarRender={() => [
          <Can key="create" module="services" action="create">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/services/create')}
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

export default ServiceListPage;
