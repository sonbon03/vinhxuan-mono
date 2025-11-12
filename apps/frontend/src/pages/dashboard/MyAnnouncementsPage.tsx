import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { listingService, Listing, ListingStatus } from '../../services/listing.service';
import { categoryService, ModuleType } from '../../services/category.service';
import dayjs from 'dayjs';

const MyAnnouncementsPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();

  // Fetch categories for filtering
  const { data: categoriesData } = useQuery({
    queryKey: ['categories', ModuleType.LISTING],
    queryFn: () => categoryService.getCategories({
      moduleType: ModuleType.LISTING,
      status: true,
      limit: 100
    }),
  });

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

  const getStatusColor = (status: ListingStatus): string => {
    const colorMap: Record<ListingStatus, string> = {
      [ListingStatus.PENDING]: 'orange',
      [ListingStatus.APPROVED]: 'green',
      [ListingStatus.REJECTED]: 'red',
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
      render: (_, record) => (
        <a onClick={() => navigate(`/listings/${record.id}`)}>{record.title}</a>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: ['category', 'name'],
      key: 'categoryId',
      ellipsis: true,
      width: 150,
      render: (_, record) => record.category?.name || 'Chưa phân loại',
      valueType: 'select',
      valueEnum: categoriesData?.items?.reduce((acc, cat) => {
        acc[cat.id] = { text: cat.name };
        return acc;
      }, {} as Record<string, { text: string }>),
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      width: 150,
      render: (_, record) => formatPrice(record.price),
      hideInSearch: true,
    },
    {
      title: 'Khoảng giá',
      key: 'priceRange',
      hideInTable: true,
      renderFormItem: () => {
        return (
          <Space>
            <input type="number" placeholder="Giá tối thiểu" style={{ width: 120 }} />
            <span>-</span>
            <input type="number" placeholder="Giá tối đa" style={{ width: 120 }} />
          </Space>
        );
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
        PENDING: { text: 'Chờ duyệt', status: 'Warning' },
        APPROVED: { text: 'Đã duyệt', status: 'Success' },
        REJECTED: { text: 'Đã từ chối', status: 'Error' },
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
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/listings/${record.id}`)}
            />
          </Tooltip>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/listings/edit/${record.id}`)}
          >
            Sửa
          </Button>
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
        </Space>
      ),
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
        request={async (params, sort) => {
          const sortBy = Object.keys(sort || {})[0] || 'createdAt';
          const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

          const response = await listingService.getMyListings({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.title,
            status: params.status as ListingStatus,
            categoryId: params.categoryId,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
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
          defaultCollapsed: false,
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
            Tin rao của tôi
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

export default MyAnnouncementsPage;
