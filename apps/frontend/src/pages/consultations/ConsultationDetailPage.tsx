import React, { useState } from 'react';
import {
  Card,
  Button,
  Space,
  Tag,
  Descriptions,
  Spin,
  message,
  Modal,
  Form,
  Input,
  Select,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { consultationService, ConsultationStatus } from '../../services/consultation.service';
import { employeeService, EmployeeStatus } from '../../services/employee.service';
import { usePermissions } from '../../hooks/usePermissions';
import { useAuth } from '../../hooks/useAuth';
import dayjs from 'dayjs';

const { TextArea } = Input;

const ConsultationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAdmin, isAdminOrStaff } = usePermissions();
  const { user } = useAuth();
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [approveForm] = Form.useForm();
  const [cancelForm] = Form.useForm();

  const { data: consultation, isLoading } = useQuery({
    queryKey: ['consultation', id],
    queryFn: () => consultationService.getConsultationById(id!),
    enabled: !!id,
  });

  const { data: employeesData } = useQuery({
    queryKey: ['employees', 'active'],
    queryFn: () => employeeService.getEmployees({ status: EmployeeStatus.WORKING, limit: 1000 }),
  });

  const approveMutation = useMutation({
    mutationFn: (data: { staffId?: string; notes?: string }) =>
      consultationService.approveConsultation(id!, data),
    onSuccess: () => {
      message.success('Phê duyệt lịch tư vấn thành công!');
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      setApproveModalVisible(false);
      approveForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Phê duyệt lịch tư vấn thất bại');
    },
  });

  const completeMutation = useMutation({
    mutationFn: consultationService.completeConsultation,
    onSuccess: () => {
      message.success('Hoàn thành lịch tư vấn thành công!');
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Hoàn thành lịch tư vấn thất bại');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (data: { cancelReason: string }) =>
      consultationService.cancelConsultation(id!, data),
    onSuccess: () => {
      message.success('Hủy lịch tư vấn thành công!');
      queryClient.invalidateQueries({ queryKey: ['consultation', id] });
      setCancelModalVisible(false);
      cancelForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Hủy lịch tư vấn thất bại');
    },
  });

  const handleApprove = () => {
    approveForm.submit();
  };

  const handleApproveSubmit = (values: any) => {
    approveMutation.mutate(values);
  };

  const handleCancel = () => {
    cancelForm.submit();
  };

  const handleCancelSubmit = (values: any) => {
    cancelMutation.mutate(values);
  };

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

  if (isLoading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!consultation) {
    return (
      <div style={{ padding: '24px' }}>
        <Card>
          <p>Không tìm thấy lịch tư vấn.</p>
          <Button onClick={() => navigate('/consultations')}>Quay lại</Button>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === consultation.customerId;
  const canApprove = isAdminOrStaff() && consultation.status === ConsultationStatus.PENDING;
  const canComplete = isAdminOrStaff() && consultation.status === ConsultationStatus.APPROVED;
  const canCancel =
    (isOwner || isAdminOrStaff()) &&
    consultation.status !== ConsultationStatus.COMPLETED &&
    consultation.status !== ConsultationStatus.CANCELLED;

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <ArrowLeftOutlined
              onClick={() => navigate('/consultations')}
              style={{ cursor: 'pointer' }}
            />
            <span>Chi tiết Lịch tư vấn</span>
          </Space>
        }
        extra={
          <Space>
            {canApprove && (
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => setApproveModalVisible(true)}
              >
                Phê duyệt
              </Button>
            )}
            {canComplete && (
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                onClick={() => completeMutation.mutate(consultation.id)}
                loading={completeMutation.isPending}
              >
                Hoàn thành
              </Button>
            )}
            {canCancel && (
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => setCancelModalVisible(true)}
              >
                Hủy lịch
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions bordered column={2}>
          <Descriptions.Item label="Khách hàng" span={2}>
            <strong>{consultation.customer?.fullName || 'N/A'}</strong>
            <br />
            <span style={{ color: '#666' }}>{consultation.customer?.email || ''}</span>
          </Descriptions.Item>

          <Descriptions.Item label="Dịch vụ">
            {consultation.service?.name || 'Chưa chọn dịch vụ'}
          </Descriptions.Item>

          <Descriptions.Item label="Nhân viên phụ trách">
            {consultation.staff?.name || 'Chưa phân công'}
          </Descriptions.Item>

          <Descriptions.Item label="Thời gian hẹn">
            {dayjs(consultation.requestedDatetime).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Trạng thái">
            <Tag color={getStatusColor(consultation.status)}>
              {getStatusText(consultation.status)}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="Ngày đặt lịch">
            {dayjs(consultation.createdAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Ngày cập nhật">
            {dayjs(consultation.updatedAt).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>

          <Descriptions.Item label="Nội dung cần tư vấn" span={2}>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
              {consultation.content}
            </div>
          </Descriptions.Item>

          {consultation.notes && (
            <Descriptions.Item label="Ghi chú" span={2}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {consultation.notes}
              </div>
            </Descriptions.Item>
          )}

          {consultation.cancelReason && (
            <Descriptions.Item label="Lý do hủy" span={2}>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', color: '#ff4d4f' }}>
                {consultation.cancelReason}
              </div>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      {/* Approve Modal */}
      <Modal
        title="Phê duyệt lịch tư vấn"
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          approveForm.resetFields();
        }}
        confirmLoading={approveMutation.isPending}
        okText="Phê duyệt"
        cancelText="Hủy"
      >
        <Form form={approveForm} layout="vertical" onFinish={handleApproveSubmit}>
          <Form.Item name="staffId" label="Phân công nhân viên" tooltip="Tùy chọn">
            <Select
              placeholder="Chọn nhân viên phụ trách"
              allowClear
              showSearch
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              options={employeesData?.items.map((employee) => ({
                label: `${employee.name} - ${employee.position}`,
                value: employee.id,
              }))}
            />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <TextArea rows={4} placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        title="Hủy lịch tư vấn"
        open={cancelModalVisible}
        onOk={handleCancel}
        onCancel={() => {
          setCancelModalVisible(false);
          cancelForm.resetFields();
        }}
        confirmLoading={cancelMutation.isPending}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        okButtonProps={{ danger: true }}
      >
        <Form form={cancelForm} layout="vertical" onFinish={handleCancelSubmit}>
          <Form.Item
            name="cancelReason"
            label="Lý do hủy"
            rules={[{ required: true, message: 'Vui lòng nhập lý do hủy!' }]}
          >
            <TextArea rows={4} placeholder="Vui lòng cho biết lý do hủy lịch tư vấn" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ConsultationDetailPage;
