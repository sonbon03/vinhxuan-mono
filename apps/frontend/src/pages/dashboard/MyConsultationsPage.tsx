import React, { useRef } from 'react';
import { Button, message, Modal, Tag, Space, Tooltip, Input } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { consultationService, Consultation, ConsultationStatus } from '../../services/consultation.service';
import { serviceService } from '../../services/service.service';
import dayjs from 'dayjs';

const MyConsultationsPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const [cancelReason, setCancelReason] = React.useState('');
  const [cancelModalVisible, setCancelModalVisible] = React.useState(false);
  const [selectedConsultationId, setSelectedConsultationId] = React.useState<string>('');

  // Fetch services for filtering
  const { data: servicesData } = useQuery({
    queryKey: ['services'],
    queryFn: () => serviceService.getServices({
      status: true,
      limit: 100
    }),
  });

  const cancelMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      consultationService.cancelConsultation(id, { cancelReason: reason }),
    onSuccess: () => {
      message.success('Hủy lịch tư vấn thành công!');
      actionRef.current?.reload();
      setCancelModalVisible(false);
      setCancelReason('');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Hủy lịch tư vấn thất bại');
    },
  });

  const handleCancelClick = (id: string) => {
    setSelectedConsultationId(id);
    setCancelModalVisible(true);
  };

  const handleCancelConfirm = () => {
    if (!cancelReason.trim()) {
      message.warning('Vui lòng nhập lý do hủy');
      return;
    }
    cancelMutation.mutate({ id: selectedConsultationId, reason: cancelReason });
  };

  const getStatusColor = (status: ConsultationStatus): string => {
    const colorMap: Record<ConsultationStatus, string> = {
      [ConsultationStatus.PENDING]: 'orange',
      [ConsultationStatus.APPROVED]: 'blue',
      [ConsultationStatus.COMPLETED]: 'green',
      [ConsultationStatus.CANCELLED]: 'red',
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

  const canCancel = (status: ConsultationStatus): boolean => {
    return status === ConsultationStatus.PENDING || status === ConsultationStatus.APPROVED;
  };

  const columns: ProColumns<Consultation>[] = [
    {
      title: 'Thời gian hẹn',
      dataIndex: 'requestedDatetime',
      key: 'requestedDatetime',
      width: 160,
      search: false,
      sorter: true,
      render: (_, record) => (
        <span style={{ fontWeight: 500 }}>
          {dayjs(record.requestedDatetime).format('DD/MM/YYYY HH:mm')}
        </span>
      ),
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
      key: 'serviceId',
      ellipsis: true,
      width: 150,
      render: (_, record) => record.service?.name || 'Chưa chọn',
      valueType: 'select',
      valueEnum: servicesData?.items?.reduce((acc, service) => {
        acc[service.id] = { text: service.name };
        return acc;
      }, {} as Record<string, { text: string }>),
    },
    {
      title: 'Nhân viên phụ trách',
      dataIndex: ['staff', 'name'],
      key: 'staffName',
      ellipsis: true,
      width: 150,
      search: false,
      render: (_, record) => (
        <span style={{ color: record.staff ? '#1890ff' : '#8c8c8c' }}>
          {record.staff?.name || 'Chưa phân công'}
        </span>
      ),
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
        PENDING: { text: 'Chờ duyệt', status: 'Warning' },
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
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/consultations/${record.id}`)}
            />
          </Tooltip>
          {canCancel(record.status) && (
            <Button
              type="link"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => handleCancelClick(record.id)}
            >
              Hủy
            </Button>
          )}
        </Space>
      ),
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
        request={async (params, sort) => {
          const sortBy = Object.keys(sort || {})[0] || 'createdAt';
          const sortOrder = sort?.[sortBy] === 'ascend' ? 'ASC' : 'DESC';

          const response = await consultationService.getMyConsultations({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.content,
            status: params.status as ConsultationStatus,
            serviceId: params.serviceId,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} lịch tư vấn`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Lịch tư vấn của tôi
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

      <Modal
        title="Hủy lịch tư vấn"
        open={cancelModalVisible}
        onOk={handleCancelConfirm}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason('');
        }}
        okText="Xác nhận"
        cancelText="Đóng"
        confirmLoading={cancelMutation.isPending}
      >
        <div style={{ marginTop: 16 }}>
          <label style={{ fontWeight: 500, marginBottom: 8, display: 'block' }}>
            Lý do hủy <span style={{ color: 'red' }}>*</span>
          </label>
          <Input.TextArea
            rows={4}
            placeholder="Vui lòng nhập lý do hủy lịch tư vấn..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default MyConsultationsPage;
