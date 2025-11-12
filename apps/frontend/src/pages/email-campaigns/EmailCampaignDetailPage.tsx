import React from 'react';
import { Card, Descriptions, Tag, Button, Spin, Space, Statistic, Row, Col } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { emailCampaignService, EventType } from '../../services/email-campaign.service';
import { usePermissions } from '../../hooks/usePermissions';
import { PageContainer } from '@/components/common/PageContainer';

const EmailCampaignDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAdmin } = usePermissions();

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['email-campaign', id],
    queryFn: () => emailCampaignService.getEmailCampaignById(id!),
    enabled: !!id,
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

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/email-campaigns">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" />
        </div>
      </PageContainer>
    );
  }

  if (!campaign) {
    return (
      <PageContainer title="Không tìm thấy chiến dịch" backUrl="/email-campaigns">
        <p>Không tìm thấy chiến dịch email.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={campaign.title}
      subtitle="Chi tiết chiến dịch email"
      backUrl="/email-campaigns"
      actions={
        <Space>
          {isAdmin && (
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/email-campaigns/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card>
            <Statistic title="Số lần đã gửi" value={campaign.sentCount} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Lần gửi cuối"
              value={campaign.lastSentAt ? dayjs(campaign.lastSentAt).format('DD/MM/YYYY HH:mm') : 'Chưa gửi'}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <Statistic
              title="Trạng thái"
              value={campaign.status ? 'Hoạt động' : 'Tạm dừng'}
              valueStyle={{ color: campaign.status ? '#3f8600' : '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Chi tiết chiến dịch" style={{ marginTop: 16 }}>
        <Descriptions bordered column={1} labelStyle={{ width: 200 }}>
          <Descriptions.Item label="Tiêu đề chiến dịch">{campaign.title}</Descriptions.Item>
          <Descriptions.Item label="Loại sự kiện">
            <Tag color="blue">{getEventTypeText(campaign.eventType)}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Tiêu đề email">{campaign.subject}</Descriptions.Item>
          <Descriptions.Item label="Nội dung email">
            <div dangerouslySetInnerHTML={{ __html: campaign.template }} />
          </Descriptions.Item>
          <Descriptions.Item label="Lịch gửi">
            {campaign.schedule ? (
              <div>
                <p>
                  <strong>Loại:</strong> {campaign.schedule.type}
                </p>
                {campaign.schedule.date && (
                  <p>
                    <strong>Ngày:</strong> {campaign.schedule.date}
                  </p>
                )}
                {campaign.schedule.time && (
                  <p>
                    <strong>Giờ:</strong> {campaign.schedule.time}
                  </p>
                )}
              </div>
            ) : (
              'Chưa cấu hình'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Tiêu chí người nhận">
            {campaign.recipientCriteria ? (
              <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                {JSON.stringify(campaign.recipientCriteria, null, 2)}
              </pre>
            ) : (
              'Chưa cấu hình'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            <Tag color={campaign.status ? 'success' : 'default'}>
              {campaign.status ? 'Hoạt động' : 'Tạm dừng'}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {dayjs(campaign.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(campaign.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default EmailCampaignDetailPage;
