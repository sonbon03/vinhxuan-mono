import React from 'react';
import { Form, Input, message, Select, DatePicker } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { consultationService } from '../../services/consultation.service';
import { serviceService } from '../../services/service.service';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { TextArea } = Input;

const ConsultationCreatePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch services
  const { data: servicesData } = useQuery({
    queryKey: ['services', 'active'],
    queryFn: () => serviceService.getServices({ status: true, limit: 1000 }),
  });

  const createMutation = useMutation({
    mutationFn: consultationService.createConsultation,
    onSuccess: () => {
      message.success('Đặt lịch tư vấn thành công!');
      navigate('/consultations');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Đặt lịch tư vấn thất bại');
    },
  });

  const handleSubmit = async (values: any) => {
    const data = {
      serviceId: values.serviceId,
      requestedDatetime: values.requestedDatetime.toISOString(),
      content: values.content,
    };

    createMutation.mutate(data);
  };

  // Disable past dates and times
  const disabledDate = (current: dayjs.Dayjs) => current && current < dayjs().startOf('day');

  return (
    <PageContainer title="Đặt lịch tư vấn" subtitle="Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất" backUrl="/consultations">
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <FormSection title="Thông tin lịch hẹn" description="Vui lòng chọn dịch vụ và thời gian mong muốn" icon={<span>📅</span>}>
          <Form.Item name="serviceId" label="Dịch vụ cần tư vấn" tooltip="Chọn dịch vụ bạn muốn được tư vấn (tùy chọn)">
            <Select
              placeholder="Chọn dịch vụ (nếu có)"
              size="large"
              allowClear
              showSearch
              filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
              options={servicesData?.items.map((service) => ({ label: service.name, value: service.id }))}
            />
          </Form.Item>

          <Form.Item name="requestedDatetime" label="Thời gian mong muốn" rules={[{ required: true, message: 'Vui lòng chọn thời gian!' }]}>
            <DatePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder="Chọn ngày và giờ"
              size="large"
              style={{ width: '100%' }}
              disabledDate={disabledDate}
              showNow={false}
            />
          </Form.Item>
        </FormSection>

        <FormSection title="Nội dung tư vấn" icon={<span>🗒️</span>}>
          <Form.Item name="content" label="Nội dung cần tư vấn" rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}>
            <TextArea rows={8} placeholder="Vui lòng mô tả chi tiết nội dung bạn muốn được tư vấn..." />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/consultations'), size: 'large' }}
          primaryAction={{ label: 'Đặt lịch', htmlType: 'submit', icon: <SaveOutlined />, loading: createMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
};

export default ConsultationCreatePage;
