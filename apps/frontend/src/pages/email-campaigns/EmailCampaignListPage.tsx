import React, { useRef } from 'react';
import { Button, message, Popconfirm, Tag, Space, Tooltip } from 'antd';
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  SendOutlined,
  PoweroffOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { emailCampaignService, EmailCampaign, EventType } from '../../services/email-campaign.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';

const EmailCampaignListPage: React.FC = () => {
  const navigate = useNavigate();
  const actionRef = useRef<ActionType>();
  const { isAdmin } = usePermissions();

  const deleteMutation = useMutation({
    mutationFn: emailCampaignService.deleteEmailCampaign,
    onSuccess: () => {
      message.success('Xóa chiến dịch thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Xóa chiến dịch thất bại');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: emailCampaignService.toggleStatus,
    onSuccess: () => {
      message.success('Cập nhật trạng thái thành công!');
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật trạng thái thất bại');
    },
  });

  const sendCampaignMutation = useMutation({
    mutationFn: emailCampaignService.sendCampaign,
    onSuccess: (data) => {
      message.success(`Gửi email thành công! Đã gửi ${data.sentCount} email.`);
      actionRef.current?.reload();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Gửi email thất bại');
    },
  });

  const getEventTypeText = (type: EventType): string => {
    const textMap: Record<EventType, string> = {
      [EventType.BIRTHDAY]: 'Sinh nhật',
      [EventType.HOLIDAY]: 'Ngày lễ',
      [EventType.ANNIVERSARY]: 'Kỷ niệm',
      [EventType.OTHER]: 'Khác',
    };
    return textMap[type];
  };

  const columns: ProColumns<EmailCampaign>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      width: 250,
    },
    {
      title: 'Loại sự kiện',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
      render: (_, record) => <Tag color="blue">{getEventTypeText(record.eventType)}</Tag>,
      valueType: 'select',
      valueEnum: {
        BIRTHDAY: { text: 'Sinh nhật' },
        HOLIDAY: { text: 'Ngày lễ' },
        ANNIVERSARY: { text: 'Kỷ niệm' },
        OTHER: { text: 'Khác' },
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (_, record) => (
        <Tag color={record.status ? 'success' : 'default'} icon={record.status ? <CheckCircleOutlined /> : <PoweroffOutlined />}>
          {record.status ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
      valueType: 'select',
      valueEnum: {
        true: { text: 'Hoạt động' },
        false: { text: 'Tạm dừng' },
      },
    },
    {
      title: 'Số lần gửi',
      dataIndex: 'sentCount',
      key: 'sentCount',
      width: 100,
      search: false,
    },
    {
      title: 'Lần gửi cuối',
      dataIndex: 'lastSentAt',
      key: 'lastSentAt',
      width: 160,
      search: false,
      render: (_, record) => (record.lastSentAt ? dayjs(record.lastSentAt).format('DD/MM/YYYY HH:mm') : 'Chưa gửi'),
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
      width: 280,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/email-campaigns/${record.id}`)}
            />
          </Tooltip>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/email-campaigns/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<PoweroffOutlined />}
            onClick={() => toggleStatusMutation.mutate(record.id)}
          >
            {record.status ? 'Tắt' : 'Bật'}
          </Button>
          {isAdmin() && (
            <Button
              type="link"
              icon={<SendOutlined />}
              onClick={() => sendCampaignMutation.mutate(record.id)}
              loading={sendCampaignMutation.isPending}
              style={{ color: '#52c41a' }}
            >
              Gửi
            </Button>
          )}
          <Popconfirm
            title="Xác nhận xóa"
            description="Bạn có chắc chắn muốn xóa chiến dịch này?"
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
      <ProTable<EmailCampaign>
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

          const response = await emailCampaignService.getEmailCampaigns({
            page: params.current || 1,
            limit: params.pageSize ?? 20,
            search: params.title,
            eventType: params.eventType as EventType,
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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chiến dịch`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle={
          <span style={{ fontSize: '24px', fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Danh sách Chiến dịch Email
          </span>
        }
        toolBarRender={() => [
          <Button
            key="create"
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate('/email-campaigns/create')}
          >
            Tạo chiến dịch mới
          </Button>,
        ]}
      />
    </div>
  );
};

export default EmailCampaignListPage;
