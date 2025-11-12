import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { recordService, Record as RecordType, RecordStatus } from '../../services/record.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';

const RecordListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();
  const { can, isAdminOrStaff } = usePermissions();

  const deleteMutation = useMutation({
    mutationFn: recordService.deleteRecord,
    onSuccess: () => {
      message.success('Xóa hồ sơ thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa hồ sơ thất bại');
    },
  });

  const getStatusColor = (status: RecordStatus): string => {
    const colorMap: Record<RecordStatus, string> = {
      [RecordStatus.PENDING]: 'processing',
      [RecordStatus.APPROVED]: 'success',
      [RecordStatus.REJECTED]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: RecordStatus): string => {
    const textMap: Record<RecordStatus, string> = {
      [RecordStatus.PENDING]: 'Chờ duyệt',
      [RecordStatus.APPROVED]: 'Đã duyệt',
      [RecordStatus.REJECTED]: 'Bị từ chối',
    };
    return textMap[status];
  };

  const columns: ProColumns<RecordType>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Khách hàng',
      dataIndex: ['customer', 'fullName'],
      key: 'customerName',
      ellipsis: true,
      width: 150,
      hideInSearch: !isAdminOrStaff(),
    },
    {
      title: 'Loại hồ sơ',
      dataIndex: ['type', 'name'],
      key: 'typeName',
      ellipsis: true,
      width: 180,
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
        PENDING: { text: 'Chờ duyệt', status: 'Processing' },
        APPROVED: { text: 'Đã duyệt', status: 'Success' },
        REJECTED: { text: 'Bị từ chối', status: 'Error' },
      },
    },
    {
      title: 'Người duyệt',
      dataIndex: ['reviewer', 'fullName'],
      key: 'reviewerName',
      ellipsis: true,
      width: 150,
      search: false,
      render: (_, record) => record.reviewer?.fullName || '-',
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
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/records/${record.id}`)}
            />
          </Tooltip>
          {(record.status === RecordStatus.PENDING || can('records', 'update')) && (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => navigate(`/records/edit/${record.id}`)}
            >
              Sửa
            </Button>
          )}
          {can('records', 'delete') && (
            <Popconfirm
              title="Xác nhận xóa"
              description="Bạn có chắc chắn muốn xóa hồ sơ này?"
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
      <ProTable<RecordType>
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

          const response = await recordService.getRecords({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.title,
            status: params.status as RecordStatus,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} hồ sơ`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Hồ sơ
          </span>
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/records/create')}
          >
            Tạo hồ sơ mới
          </Button>,
        ]}
      />
    </div>
  );
};

export default RecordListPage;
