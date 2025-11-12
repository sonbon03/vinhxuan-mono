import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { consultationService, Consultation, ConsultationStatus } from '../../services/consultation.service';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const ConsultationListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const { isAdmin, isAdminOrStaff } = usePermissions();
  const { user } = useAuth();

  const deleteMutation = useMutation({
    mutationFn: consultationService.deleteConsultation,
    onSuccess: () => {
      message.success('Xóa lịch tư vấn thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa lịch tư vấn thất bại');
    },
  });

  const completeMutation = useMutation({
    mutationFn: consultationService.completeConsultation,
    onSuccess: () => {
      message.success('Hoàn thành lịch tư vấn thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Hoàn thành lịch tư vấn thất bại');
    },
  });

  const getStatusColor = (status: ConsultationStatus): string => {
    const colorMap: Record<ConsultationStatus, string> = {
      [ConsultationStatus.PENDING]: 'default',
      [ConsultationStatus.APPROVED]: 'processing',
      [ConsultationStatus.COMPLETED]: 'success',
      [ConsultationStatus.CANCELLED]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: ConsultationStatus): string => {
    const textMap: Record<ConsultationStatus, string> = {
      [ConsultationStatus.PENDING]: 'Chờ duyệt',
      [ConsultationStatus.APPROVED]: 'Đã duyệt',
      [ConsultationStatus.COMPLETED]: 'Đã hoàn thành',
      [ConsultationStatus.CANCELLED]: 'Đã hủy',
    };
    return textMap[status];
  };

  const columns: ProColumns<Consultation>[] = [
    {
      title: 'Khách hàng',
      dataIndex: ['customer', 'fullName'],
      key: 'customerName',
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      width: 300,
    },
    {
      title: 'Dịch vụ',
      dataIndex: ['service', 'name'],
      key: 'serviceName',
      ellipsis: true,
      width: 150,
      render: (_, record) => record.service?.name || 'Chưa chọn',
    },
    {
      title: 'Nhân viên phụ trách',
      dataIndex: ['staff', 'name'],
      key: 'staffName',
      ellipsis: true,
      width: 150,
      render: (_, record) => record.staff?.name || 'Chưa phân công',
    },
    {
      title: 'Thời gian hẹn',
      dataIndex: 'requestedDatetime',
      key: 'requestedDatetime',
      width: 160,
      search: false,
      sorter: true,
      render: (_, record) => dayjs(record.requestedDatetime).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (_, record) => (
        <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
      ),
      valueType: 'select',
      valueEnum: {
        PENDING: { text: 'Chờ duyệt', status: 'Default' },
        APPROVED: { text: 'Đã duyệt', status: 'Processing' },
        COMPLETED: { text: 'Đã hoàn thành', status: 'Success' },
        CANCELLED: { text: 'Đã hủy', status: 'Error' },
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
      render: (_, record) => {
        const isOwner = user?.id === record.customerId;

        return (
          <Space>
            <Tooltip title="Xem chi tiết">
              <Button
                type="text"
                icon={<EyeOutlined />}
                onClick={() => navigate(`/consultations/${record.id}`)}
              />
            </Tooltip>
            {isAdminOrStaff() && record.status === ConsultationStatus.PENDING && (
              <Button
                type="link"
                icon={<CheckOutlined />}
                onClick={() => navigate(`/consultations/${record.id}`)}
                style={{ color: '#52c41a' }}
              >
                Duyệt
              </Button>
            )}
            {isAdminOrStaff() && record.status === ConsultationStatus.APPROVED && (
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => completeMutation.mutate(record.id)}
                style={{ color: '#1890ff' }}
              >
                Hoàn thành
              </Button>
            )}
            {(isOwner || isAdminOrStaff()) &&
              record.status !== ConsultationStatus.COMPLETED &&
              record.status !== ConsultationStatus.CANCELLED && (
                <Button
                  type="link"
                  icon={<CloseCircleOutlined />}
                  onClick={() => navigate(`/consultations/${record.id}`)}
                  danger
                >
                  Hủy
                </Button>
              )}
            {isAdmin() && (
              <Popconfirm
                title="Xác nhận xóa"
                description="Bạn có chắc chắn muốn xóa lịch tư vấn này?"
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
      <ProTable<Consultation>
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

          const response = await consultationService.getConsultations({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.content,
            status: params.status as ConsultationStatus,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch tư vấn`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Lịch tư vấn
          </span>
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/consultations/create')}
          >
            Đặt lịch tư vấn
          </Button>,
        ]}
      />
    </div>
  );
};

export default ConsultationListPage;
