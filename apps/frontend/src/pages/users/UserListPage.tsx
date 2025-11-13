import { useRef, useState } from 'react';
import { Button, Tag, Popconfirm, message, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  StopOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { ProTable, ActionType, ProColumns } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/services/user.service';
import { UserRole } from '@/types';
import Can from '@/components/Can';
import dayjs from 'dayjs';

const roleColors: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'red',
  [UserRole.STAFF]: 'blue',
  [UserRole.CUSTOMER]: 'green',
};

const roleLabels: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Quản trị viên',
  [UserRole.STAFF]: 'Nhân viên',
  [UserRole.CUSTOMER]: 'Khách hàng',
};

export default function UserListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const actionRef = useRef<ActionType>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      message.success('Xóa người dùng thành công!');
      actionRef.current?.reload();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Xóa người dùng thất bại!');
    },
  });

  // Activate user mutation
  const activateMutation = useMutation({
    mutationFn: userService.activateUser,
    onSuccess: () => {
      message.success('Kích hoạt tài khoản thành công!');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('Kích hoạt tài khoản thất bại!');
    },
  });

  // Deactivate user mutation
  const deactivateMutation = useMutation({
    mutationFn: userService.deactivateUser,
    onSuccess: () => {
      message.success('Vô hiệu hóa tài khoản thành công!');
      actionRef.current?.reload();
    },
    onError: () => {
      message.error('Vô hiệu hóa tài khoản thất bại!');
    },
  });

  const columns: ProColumns<User>[] = [
    {
      title: 'STT',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 60,
      fixed: 'left',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 200,
      fixed: 'left',
      sorter: true,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 250,
      copyable: true,
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      search: false,
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      width: 150,
      valueType: 'date',
      render: (_, record) => dayjs(record.dateOfBirth).format('DD/MM/YYYY'),
      search: false,
      sorter: true,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      filters: true,
      valueEnum: {
        [UserRole.ADMIN]: { text: roleLabels[UserRole.ADMIN], status: 'Error' },
        [UserRole.STAFF]: { text: roleLabels[UserRole.STAFF], status: 'Processing' },
        [UserRole.CUSTOMER]: { text: roleLabels[UserRole.CUSTOMER], status: 'Success' },
      },
      render: (_, record) => <Tag color={roleColors[record.role]}>{roleLabels[record.role]}</Tag>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      filters: true,
      valueEnum: {
        true: { text: 'Đang hoạt động', status: 'Success' },
        false: { text: 'Bị khóa', status: 'Default' },
      },
      render: (_, record) => (
        <Tag color={record.status ? 'success' : 'default'}>
          {record.status ? 'Đang hoạt động' : 'Bị khóa'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      valueType: 'dateTime',
      render: (_, record) => dayjs(record.createdAt).format('DD/MM/YYYY HH:mm'),
      search: false,
      sorter: true,
      defaultSortOrder: 'descend',
    },
    {
      title: 'Thao tác',
      valueType: 'option',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => [
        <Tooltip key="view" title="Xem chi tiết">
          <Button
            type="text"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/users/${record.id}`)}
          />
        </Tooltip>,
        <Can key="edit" module="users" action="update">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/users/${record.id}/edit`)}
          >
            Sửa
          </Button>
        </Can>,
        record.status ? (
          <Can key="deactivate" module="users" action="update">
            <Popconfirm
              title="Vô hiệu hóa tài khoản"
              description="Bạn có chắc chắn muốn vô hiệu hóa tài khoản này?"
              onConfirm={() => deactivateMutation.mutate(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                type="link"
                size="small"
                danger
                icon={<StopOutlined />}
                loading={deactivateMutation.isPending}
              >
                Khóa
              </Button>
            </Popconfirm>
          </Can>
        ) : (
          <Can key="activate" module="users" action="update">
            <Popconfirm
              title="Kích hoạt tài khoản"
              description="Bạn có chắc chắn muốn kích hoạt tài khoản này?"
              onConfirm={() => activateMutation.mutate(record.id)}
              okText="Xác nhận"
              cancelText="Hủy"
            >
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                loading={activateMutation.isPending}
              >
                Kích hoạt
              </Button>
            </Popconfirm>
          </Can>
        ),
        <Can key="delete" module="users" action="delete">
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!"
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={deleteMutation.isPending}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Can>,
      ],
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent', minHeight: 'calc(100vh - 64px)' }}>
      <ProTable<User>
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

            const response = await userService.getUsers({
              page: params.current || 1,
              limit: params.pageSize ?? 20,
              search: params.fullName || params.email || undefined,
              role: params.role as UserRole,
              status: params.status !== undefined ? params.status === 'true' : undefined,
              sortBy,
              sortOrder,
            });

            console.log('response: ', response);

            return {
              data: response.items,
              success: true,
              total: response.total,
            };
          } catch (error) {
            message.error('Lấy danh sách người dùng thất bại!');
            return {
              data: [],
              success: false,
              total: 0,
            };
          }
        }}
        columnsState={{
          persistenceKey: 'user-list-table',
          persistenceType: 'localStorage',
        }}
        rowKey="id"
        pagination={{
          defaultPageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
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
            👥 Danh sách người dùng
          </span>
        }
        toolBarRender={() => [
          <Can key="create" module="users" action="create">
            <Button
              key="button"
              icon={<PlusOutlined />}
              onClick={() => navigate('/users/create')}
              type="primary"
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
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => (
          <Space
            size={16}
            style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
          >
            <span style={{ fontWeight: 500, color: '#1f2937' }}>
              Đã chọn <strong style={{ color: '#667eea' }}>{selectedRowKeys.length}</strong> người
              dùng
            </span>
            <Button size="small" onClick={onCleanSelected} style={{ borderRadius: '6px' }}>
              Bỏ chọn
            </Button>
          </Space>
        )}
        tableAlertOptionRender={false}
        scroll={{ x: 'max-content' }}
        sticky={{ offsetHeader: 64 }}
      />
    </div>
  );
}
