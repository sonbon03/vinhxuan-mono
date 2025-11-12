
import React, { useState } from 'react';
import {
  Descriptions,
  Button,
  Space,
  Tag,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Divider,
  List,
  Card,
} from 'antd';
import { CheckOutlined, CloseOutlined, EditOutlined, DownloadOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recordService, RecordStatus } from '../../services/record.service';
import { usePermissions } from '../../hooks/usePermissions';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';

const { TextArea } = Input;

const RecordDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const { isAdminOrStaff } = usePermissions();

  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [reviewForm] = Form.useForm();

  const { data: record, isLoading } = useQuery({
    queryKey: ['record', id],
    queryFn: () => recordService.getRecordById(id!),
    enabled: !!id,
  });

  const approveMutation = useMutation({
    mutationFn: (data: { reviewNotes?: string }) => recordService.approveRecord(id!, data),
    onSuccess: () => {
      message.success('Phê duyệt hồ sơ thành công!');
      setApproveModalVisible(false);
      reviewForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['record', id] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Phê duyệt hồ sơ thất bại');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (data: { reviewNotes?: string }) => recordService.rejectRecord(id!, data),
    onSuccess: () => {
      message.success('Từ chối hồ sơ thành công!');
      setRejectModalVisible(false);
      reviewForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ['record', id] });
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Từ chối hồ sơ thất bại');
    },
  });

  const handleApprove = () => {
    reviewForm.validateFields().then((values) => {
      approveMutation.mutate(values);
    });
  };

  const handleReject = () => {
    reviewForm.validateFields().then((values) => {
      rejectMutation.mutate(values);
    });
  };

  const getStatusColor = (status: RecordStatus): string => {
    const colorMap: Record<RecordStatus, string> = {
      [RecordStatus.PENDING]: 'processing',
      [RecordStatus.APPROVED]: 'success',
      [RecordStatus.REJECTED]: 'error',
    };
    return colorMap[status];
  };

  const getStatusText = (status: RecordStatus): string => {
    const textMap: Record<RecordStatus, string> = {
      [RecordStatus.PENDING]: 'Chờ duyệt',
      [RecordStatus.APPROVED]: 'Đã duyệt',
      [RecordStatus.REJECTED]: 'Bị từ chối',
    };
    return textMap[status];
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/records">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!record) {
    return (
      <PageContainer title="Không tìm thấy hồ sơ" backUrl="/records">
        <Card>Không tìm thấy hồ sơ</Card>
      </PageContainer>
    );
  }

  const canApprove = isAdminOrStaff() && record.status === RecordStatus.PENDING;

  return (
    <PageContainer
      title={record.title}
      subtitle="Chi tiết hồ sơ"
      backUrl="/records"
      extra={
        <Space>
          {canApprove && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setApproveModalVisible(true)}
              >
                Phê duyệt
              </Button>
              <Button danger icon={<CloseOutlined />} onClick={() => setRejectModalVisible(true)}>
                Từ chối
              </Button>
            </>
          )}
          {(record.status === RecordStatus.PENDING || isAdminOrStaff()) && (
            <Button icon={<EditOutlined />} onClick={() => navigate(`/records/edit/${record.id}`)}>
              Chỉnh sửa
            </Button>
          )}
        </Space>
      }
    >
      <Descriptions column={2} bordered labelStyle={{ width: 220 }}>
        <Descriptions.Item label="Tiêu đề" span={2}>
          <strong>{record.title}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Loại hồ sơ">{record.type.name}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={getStatusColor(record.status)}>{getStatusText(record.status)}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          {record.customer.fullName} ({record.customer.email})
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">
          {dayjs(record.createdAt).format('DD/MM/YYYY HH:mm')}
        </Descriptions.Item>
        {record.reviewer && (
          <>
            <Descriptions.Item label="Người duyệt">{record.reviewer.fullName}</Descriptions.Item>
            <Descriptions.Item label="Ngày duyệt">
              {dayjs(record.updatedAt).format('DD/MM/YYYY HH:mm')}
            </Descriptions.Item>
          </>
        )}
        <Descriptions.Item label="Mô tả" span={2}>
          {record.description || <span style={{ color: '#999' }}>Không có mô tả</span>}
        </Descriptions.Item>
        {record.reviewNotes && (
          <Descriptions.Item label="Ghi chú duyệt" span={2}>
            <div style={{ background: '#fff9e6', padding: 12, borderRadius: 4 }}>
              {record.reviewNotes}
            </div>
          </Descriptions.Item>
        )}
      </Descriptions>

      {record.attachments && record.attachments.length > 0 && (
        <>
          <Divider>Tài liệu đính kèm</Divider>
          <List
            dataSource={record.attachments}
            renderItem={(url, index) => (
              <List.Item
                key={index}
                actions={[
                  <Button
                    key="download"
                    type="link"
                    icon={<DownloadOutlined />}
                    onClick={() => window.open(url, '_blank')}
                  >
                    Tải xuống
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={`Tài liệu ${index + 1}`}
                  description={url.split('/').pop()}
                />
              </List.Item>
            )}
          />
        </>
      )}

      {/* Approve Modal */}
      <Modal
        title="Phê duyệt hồ sơ"
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          reviewForm.resetFields();
        }}
        confirmLoading={approveMutation.isPending}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item name="reviewNotes" label="Ghi chú (tùy chọn)">
            <TextArea rows={4} placeholder="Nhập ghi chú về việc phê duyệt hồ sơ này" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Từ chối hồ sơ"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          reviewForm.resetFields();
        }}
        confirmLoading={rejectMutation.isPending}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <Form form={reviewForm} layout="vertical">
          <Form.Item
            name="reviewNotes"
            label="Lý do từ chối"
            rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
          >
            <TextArea rows={4} placeholder="Nhập lý do từ chối hồ sơ này" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default RecordDetailPage;
