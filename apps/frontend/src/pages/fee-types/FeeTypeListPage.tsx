import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { feeTypeService, FeeType, CalculationMethod } from '../../services/fee-type.service';

const FeeTypeListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: feeTypeService.deleteFeeType,
    onSuccess: () => {
      message.success('Xóa loại phí thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa loại phí thất bại');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: boolean }) =>
      feeTypeService.updateFeeTypeStatus(id, status),
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });

  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatPercentage = (value: number | null | undefined) => {
    if (!value) return '-';
    return `${(value * 100).toFixed(2)}%`;
  };

  const getMethodColor = (method: CalculationMethod): string => {
    const colorMap: Record<CalculationMethod, string> = {
      [CalculationMethod.FIXED]: 'default',
      [CalculationMethod.PERCENT]: 'blue',
      [CalculationMethod.TIERED]: 'green',
      [CalculationMethod.VALUE_BASED]: 'orange',
      [CalculationMethod.FORMULA]: 'purple',
    };
    return colorMap[method] || 'default';
  };

  const columns: ProColumns<FeeType>[] = [
    {
      title: 'Tên loại phí',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 200,
    },
    {
      title: 'Nhóm giấy tờ',
      dataIndex: ['documentGroup', 'name'],
      key: 'documentGroupName',
      ellipsis: true,
      width: 180,
    },
    {
      title: 'Phương pháp tính',
      dataIndex: 'calculationMethod',
      key: 'calculationMethod',
      width: 140,
      render: (_, record) => (
        <Tag color={getMethodColor(record.calculationMethod)}>
          {record.calculationMethod}
        </Tag>
      ),
      valueType: 'select',
      valueEnum: {
        FIXED: { text: 'FIXED', status: 'Default' },
        PERCENT: { text: 'PERCENT', status: 'Processing' },
        TIERED: { text: 'TIERED', status: 'Success' },
        VALUE_BASED: { text: 'VALUE_BASED', status: 'Warning' },
        FORMULA: { text: 'FORMULA', status: 'Error' },
      },
    },
    {
      title: 'Phí cơ bản',
      dataIndex: 'baseFee',
      key: 'baseFee',
      width: 130,
      search: false,
      render: (_, record) => formatCurrency(record.baseFee),
    },
    {
      title: 'Tỷ lệ %',
      dataIndex: 'percentage',
      key: 'percentage',
      width: 100,
      search: false,
      render: (_, record) => formatPercentage(record.percentage),
    },
    {
      title: 'Phí tối thiểu',
      dataIndex: 'minFee',
      key: 'minFee',
      width: 130,
      search: false,
      render: (_, record) => formatCurrency(record.minFee),
    },
    {
      title: 'Phí tối đa',
      dataIndex: 'maxFee',
      key: 'maxFee',
      width: 130,
      search: false,
      render: (_, record) => formatCurrency(record.maxFee),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.status}
          onChange={(checked) =>
            toggleStatusMutation.mutate({ id: record.id, status: checked })
          }
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm ngưng"
        />
      ),
      valueType: 'select',
      valueEnum: {
        true: { text: 'Hoạt động', status: 'Success' },
        false: { text: 'Tạm ngưng', status: 'Default' },
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 150,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/fee-types/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa loại phí này?"
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
      <ProTable<FeeType>
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

          const response = await feeTypeService.getFeeTypes({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.name,
            calculationMethod: params.calculationMethod,
            status: params.status === 'true' ? true : params.status === 'false' ? false : undefined,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} loại phí`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Loại phí
          </span>
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/fee-types/create')}
          >
            Tạo loại phí mới
          </Button>,
        ]}
      />
    </div>
  );
};

export default FeeTypeListPage;
