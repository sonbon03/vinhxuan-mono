import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { listingService, Listing, ListingStatus } from '../../services/listing.service';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const ListingListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const { isAdmin, isAdminOrStaff } = usePermissions();
  const { user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: listingService.deleteListing,
    onSuccess: () => {
      message.success('Xóa tin rao thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa tin rao thất bại');
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => listingService.approveListing(id, {}),
    onSuccess: () => {
      message.success('Phê duyệt tin rao thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Phê duyệt tin rao thất bại');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => listingService.rejectListing(id, {}),
    onSuccess: () => {
      message.success('Từ chối tin rao thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Từ chối tin rao thất bại');
    },
  });

  const toggleHiddenMutation = useMutation({
    mutationFn: listingService.toggleHidden,
    onSuccess: () => {
      message.success('Cập nhật trạng thái hiển thị thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });

  const getStatusColor = (status: ListingStatus): string => {
    const colorMap: Record<ListingStatus, string> = {
      [ListingStatus.PENDING]: 'default',
      [ListingStatus.APPROVED]: 'success',
      [ListingStatus.REJECTED]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: ListingStatus): string => {
    const textMap: Record<ListingStatus, string> = {
      [ListingStatus.PENDING]: 'Chờ duyệt',
      [ListingStatus.APPROVED]: 'Đã duyệt',
      [ListingStatus.REJECTED]: 'Đã từ chối',
    };
    return textMap[status];
  };

  const formatPrice = (price: number | null): string => {
    if (!price) return 'Liên hệ';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const columns: ProColumns<Listing>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Người đăng',
      dataIndex: ['author', 'fullName'],
      key: 'authorName',
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (_, record) => formatPrice(record.price),
      search: false,
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
        PENDING: { text: 'Chờ duyệt', status: 'Default' },
        APPROVED: { text: 'Đã duyệt', status: 'Success' },
        REJECTED: { text: 'Đã từ chối', status: 'Error' },
      },
    },
    {
      title: 'Hiển thị',
      dataIndex: 'isHidden',
      key: 'isHidden',
      width: 100,
      render: (_, record) => (
        <Tag color={record.isHidden ? 'red' : 'green'}>
          {record.isHidden ? 'Đã ẩn' : 'Hiển thị'}
        </Tag>
      ),
      valueType: 'select',
      valueEnum: {
        false: { text: 'Hiển thị' },
        true: { text: 'Đã ẩn' },
      },
    },
    {
      title: 'Lượt thích',
      dataIndex: 'likeCount',
      key: 'likeCount',
      width: 100,
      search: false,
    },
    {
      title: 'Bình luận',
      dataIndex: 'commentCount',
      key: 'commentCount',
      width: 100,
      search: false,
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
      width: 300,
      fixed: 'right',
      search: false,
      render: (_, record) => {
        const isAuthor = user?.id === record.authorId;

        return (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/listings/${record.id}`)}
              />
            </Tooltip>
            {(isAuthor || isAdmin()) && (
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => navigate(`/listings/edit/${record.id}`)}
              >
                Sửa
              </Button>
            )}
            {isAdminOrStaff() && record.status === ListingStatus.PENDING && (
              <>
                <Button
                  type="link"
                  icon={<CheckOutlined />}
                  onClick={() => approveMutation.mutate(record.id)}
                  style={{ color: '#52c41a' }}
                >
                  Duyệt
                </Button>
                <Button
                  type="link"
                  icon={<CloseOutlined />}
                  onClick={() => rejectMutation.mutate(record.id)}
                  danger
                >
                  Từ chối
                </Button>
              </>
            )}
            {isAdmin() && (
              <Button
                type="link"
                icon={record.isHidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                onClick={() => toggleHiddenMutation.mutate(record.id)}
              >
                {record.isHidden ? 'Hiện' : 'Ẩn'}
              </Button>
            )}
            {(isAuthor || isAdmin()) && (
              <Popconfirm
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa tin rao này?"
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
        );
      },
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'transparent' }}>
      <ProTable<Listing>
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

          const response = await listingService.getListings({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.title,
            status: params.status as ListingStatus,
            isHidden: params.isHidden === 'true' ? true : params.isHidden === 'false' ? false : undefined,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} tin rao`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Tin rao
          </span>
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/listings/create')}
          >
            Đăng tin rao mới
          </Button>,
        ]}
      />
    </div>
  );
};

export default ListingListPage;
