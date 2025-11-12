import React, { useState, useRef, useEffect } from 'react';
import { Card, Input, Button, Space, Avatar, Tag, message } from 'antd';
import {
  MessageOutlined,
  CloseOutlined,
  SendOutlined,
  UserOutlined,
  RobotOutlined,
  CustomerServiceOutlined,
} from '@ant-design/icons';
import { useMutation } from '@tanstack/react-query';
import { chatbotService, ChatMessage, MessageSender } from '../services/chatbot.service';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: chatbotService.sendMessage,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, data.userMessage, data.botResponse]);
      setSessionId(data.session.id);
      setInputText('');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Gửi tin nhắn thất bại');
    },
  });

  const escalateMutation = useMutation({
    mutationFn: chatbotService.escalateToAgent,
    onSuccess: () => {
      message.success('Đã chuyển đến nhân viên hỗ trợ!');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Chuyển tiếp thất bại');
    },
  });

  const handleSend = () => {
    if (!inputText.trim()) {
      message.warning('Vui lòng nhập tin nhắn!');
      return;
    }

    sendMessageMutation.mutate({
      sessionId: sessionId || undefined,
      messageText: inputText,
    });
  };

  const handleEscalate = () => {
    if (!sessionId) {
      message.warning('Vui lòng gửi tin nhắn trước!');
      return;
    }
    escalateMutation.mutate(sessionId);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 1000,
          }}
        >
          <Button
            type="primary"
            shape="circle"
            size="large"
            icon={<MessageOutlined />}
            onClick={() => setIsOpen(true)}
            style={{
              width: '60px',
              height: '60px',
              fontSize: '24px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          />
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            width: '380px',
            height: '550px',
            zIndex: 1000,
            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Card
            title={
              <Space>
                <RobotOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                <span>Trợ lý ảo Vinh Xuân</span>
              </Space>
            }
            extra={
              <CloseOutlined
                style={{ cursor: 'pointer', fontSize: '16px' }}
                onClick={() => setIsOpen(false)}
              />
            }
            bodyStyle={{ padding: 0, height: '450px', display: 'flex', flexDirection: 'column' }}
            headStyle={{ borderBottom: '1px solid #f0f0f0' }}
          >
            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                background: '#fafafa',
              }}
            >
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#999', marginTop: '50px' }}>
                  <RobotOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <p>Xin chào! Tôi có thể giúp gì cho bạn?</p>
                </div>
              )}

              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender === MessageSender.USER ? 'flex-end' : 'flex-start',
                    marginBottom: '12px',
                  }}
                >
                  {msg.sender !== MessageSender.USER && (
                    <Avatar
                      icon={msg.sender === MessageSender.BOT ? <RobotOutlined /> : <CustomerServiceOutlined />}
                      style={{
                        backgroundColor: msg.sender === MessageSender.BOT ? '#1890ff' : '#52c41a',
                        marginRight: '8px',
                      }}
                    />
                  )}
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: msg.sender === MessageSender.USER ? '#1890ff' : '#fff',
                      color: msg.sender === MessageSender.USER ? '#fff' : '#000',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.messageText}
                    <div
                      style={{
                        fontSize: '11px',
                        marginTop: '4px',
                        opacity: 0.7,
                      }}
                    >
                      {dayjs(msg.createdAt).format('HH:mm')}
                    </div>
                  </div>
                  {msg.sender === MessageSender.USER && (
                    <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff', marginLeft: '8px' }} />
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div
              style={{
                padding: '12px',
                borderTop: '1px solid #f0f0f0',
                background: '#fff',
              }}
            >
              <Space direction="vertical" style={{ width: '100%' }} size="small">
                {sessionId && (
                  <Button
                    type="link"
                    size="small"
                    icon={<CustomerServiceOutlined />}
                    onClick={handleEscalate}
                    loading={escalateMutation.isPending}
                  >
                    Chuyển đến nhân viên hỗ trợ
                  </Button>
                )}
                <Space.Compact style={{ width: '100%' }}>
                  <TextArea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    autoSize={{ minRows: 1, maxRows: 3 }}
                    style={{ flex: 1 }}
                  />
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSend}
                    loading={sendMessageMutation.isPending}
                  >
                    Gửi
                  </Button>
                </Space.Compact>
              </Space>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
