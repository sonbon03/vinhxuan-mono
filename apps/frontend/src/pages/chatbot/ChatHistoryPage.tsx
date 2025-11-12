import React, { useRef } from 'react';
import { Button, Tag, Space, Modal } from 'antd';
import { EyeOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { ProColumns, ActionType } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { useMutation } from '@tanstack/react-query';
import { chatbotService, ChatSession, ChatSessionStatus } from '../../services/chatbot.service';
import dayjs from 'dayjs';

const ChatHistoryPage: React.FC = () => {
  const actionRef = useRef<ActionType>();

  const closeSessionMutation = useMutation({
    mutationFn: chatbotService.closeSession,
    onSuccess: () => {
      actionRef.current?.reload();
    },
  });

  const showSessionDetails = (record: ChatSession) => {
    Modal.info({
      title: `Chi tiết phiên chat - ${record.id}`,
      width: 800,
      content: (
        <div>
          <p><strong>Người dùng:</strong> {record.user ? `${record.user.fullName} (${record.user.email})` : 'Khách (Guest)'}</p>
          <p><strong>Trạng thái:</strong> {getStatusTag(record.status)}</p>
          <p><strong>Bắt đầu:</strong> {dayjs(record.startedAt).format('DD/MM/YYYY HH:mm')}</p>
          {record.endedAt && <p><strong>Kết thúc:</strong> {dayjs(record.endedAt).format('DD/MM/YYYY HH:mm')}</p>}
          {record.escalatedAt && <p><strong>Chuyển tiếp:</strong> {dayjs(record.escalatedAt).format('DD/MM/YYYY HH:mm')}</p>}

          <div style={{ marginTop: '16px' }}>
            <strong>Tin nhắn:</strong>
            <div style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '8px' }}>
              {record.messages && record.messages.length > 0 ? (
                record.messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '8px',
                      margin: '4px 0',
                      background: msg.sender === 'USER' ? '#e6f7ff' : msg.sender === 'BOT' ? '#f0f0f0' : '#fffbe6',
                      borderRadius: '4px',
                    }}
                  >
                    <strong>{msg.sender}:</strong> {msg.messageText}
                    <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                      {dayjs(msg.createdAt).format('HH:mm:ss')}
                    </div>
                  </div>
                ))
              ) : (
                <p>Không có tin nhắn</p>
              )}
            </div>
          </div>
        </div>
      ),
    });
  };

  const getStatusTag = (status: ChatSessionStatus) => {
    const statusConfig = {
      [ChatSessionStatus.ACTIVE]: { color: 'green', text: 'Đang hoạt động' },
      [ChatSessionStatus.CLOSED]: { color: 'default', text: 'Đã đóng' },
      [ChatSessionStatus.ESCALATED]: { color: 'orange', text: 'Đã chuyển tiếp' },
    };
    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns: ProColumns<ChatSession>[] = [
    {
      title: 'ID Phiên',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      ellipsis: true,
      copyable: true,
    },
    {
      title: 'Người dùng',
      dataIndex: ['user', 'fullName'],
      key: 'user',
      width: 200,
      render: (_, record) => record.user ? `${record.user.fullName} (${record.user.email})` : 'Khách',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => getStatusTag(record.status),
      valueType: 'select',
      valueEnum: {
        ACTIVE: { text: 'Đang hoạt động' },
        CLOSED: { text: 'Đã đóng' },
        ESCALATED: { text: 'Đã chuyển tiếp' },
      },
    },
    {
      title: 'Số tin nhắn',
      dataIndex: 'messages',
      key: 'messageCount',
      width: 100,
      search: false,
      render: (_, record) => record.messages?.length || 0,
    },
    {
      title: 'Bắt đầu',
      dataIndex: 'startedAt',
      key: 'startedAt',
      width: 160,
      search: false,
      sorter: true,
      render: (_, record) => dayjs(record.startedAt).format('DD/MM/YYYY HH:mm'),
    },
    {
      title: 'Kết thúc',
      dataIndex: 'endedAt',
      key: 'endedAt',
      width: 160,
      search: false,
      render: (_, record) => record.endedAt ? dayjs(record.endedAt).format('DD/MM/YYYY HH:mm') : '-',
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      search: false,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showSessionDetails(record)}
          >
            Xem
          </Button>
          {record.status === ChatSessionStatus.ACTIVE && (
            <Button
              type="link"
              danger
              icon={<CloseCircleOutlined />}
              onClick={() => closeSessionMutation.mutate(record.id)}
              loading={closeSessionMutation.isPending}
            >
              Đóng
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <ProTable<ChatSession>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params) => {
          const response = await chatbotService.getAllSessions(params.current || 1, params.pageSize ?? 20);

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
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} cuộc trò chuyện`,
          pageSizeOptions: [10, 20, 50, 100],
          showLessItems: false,
        }}
        dateFormatter="string"
        headerTitle="Lịch sử Chat"
      />
    </div>
  );
};

export default ChatHistoryPage;
