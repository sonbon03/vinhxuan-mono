import React, { useState, useEffect } from 'react';
import { Form, Input, Select, message, DatePicker, Switch, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import { emailCampaignService, EventType, UpdateEmailCampaignData } from '../../services/email-campaign.service';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { Option } = Select;
const { TextArea } = Input;

const EmailCampaignEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const [template, setTemplate] = useState('');

  const { data: campaign, isLoading } = useQuery({
    queryKey: ['email-campaign', id],
    queryFn: () => emailCampaignService.getEmailCampaignById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (campaign) {
      form.setFieldsValue({
        title: campaign.title,
        eventType: campaign.eventType,
        subject: campaign.subject,
        status: campaign.status,
        schedule: !!campaign.schedule,
        scheduleType: campaign.schedule?.type || 'once',
        scheduleDate: campaign.schedule?.date ? dayjs(`${campaign.schedule.date} ${campaign.schedule.time}`) : null,
        recipientCriteria: campaign.recipientCriteria ? JSON.stringify(campaign.recipientCriteria, null, 2) : '',
      });
      setTemplate(campaign.template);
    }
  }, [campaign, form]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateEmailCampaignData) => emailCampaignService.updateEmailCampaign(id!, data),
    onSuccess: () => {
      message.success('Cập nhật chiến dịch thành công!');
      navigate('/email-campaigns');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật chiến dịch thất bại');
    },
  });

  const onFinish = (values: any) => {
    const data: UpdateEmailCampaignData = {
      title: values.title,
      eventType: values.eventType,
      subject: values.subject,
      template: template,
      schedule: values.schedule
        ? {
            type: values.scheduleType,
            date: values.scheduleDate?.format('YYYY-MM-DD'),
            time: values.scheduleDate?.format('HH:mm'),
          }
        : undefined,
      recipientCriteria: values.recipientCriteria ? JSON.parse(values.recipientCriteria) : undefined,
      status: values.status,
    };

    updateMutation.mutate(data);
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
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
        <p>Không tìm thấy thông tin chiến dịch</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Chỉnh sửa chiến dịch email" subtitle={campaign.title} backUrl="/email-campaigns">
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <FormSection title="Thông tin chung" icon={<span>📣</span>}>
          <Form.Item name="title" label="Tiêu đề chiến dịch" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}>
            <Input placeholder="VD: Chúc mừng sinh nhật khách hàng" />
          </Form.Item>

          <Form.Item name="eventType" label="Loại sự kiện" rules={[{ required: true, message: 'Vui lòng chọn loại sự kiện!' }]}>
            <Select placeholder="Chọn loại sự kiện">
              <Option value={EventType.BIRTHDAY}>Sinh nhật</Option>
              <Option value={EventType.HOLIDAY}>Ngày lễ</Option>
              <Option value={EventType.ANNIVERSARY}>Kỷ niệm</Option>
              <Option value={EventType.OTHER}>Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item name="subject" label="Tiêu đề email" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề email!' }]}>
            <Input placeholder="VD: Chúc mừng sinh nhật {{name}}!" />
          </Form.Item>
        </FormSection>

        <FormSection title="Nội dung email" description="Hỗ trợ biến {{name}}, {{date}}" icon={<span>✉️</span>}>
          <Form.Item label="Nội dung email" required help="Bạn có thể sử dụng biến: {{name}}, {{date}}">
            <ReactQuill
              theme="snow"
              value={template}
              onChange={setTemplate}
              modules={quillModules}
              placeholder="Nhập nội dung email..."
              style={{ height: 300, marginBottom: 50 }}
            />
          </Form.Item>
        </FormSection>

        <FormSection title="Lịch gửi" icon={<span>🗓️</span>}>
          <Form.Item label="Bật lịch gửi" name="schedule" valuePropName="checked">
            <Switch />
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, cur) => prev.schedule !== cur.schedule}>
            {({ getFieldValue }) =>
              getFieldValue('schedule') ? (
                <>
                  <Form.Item label="Loại lịch" name="scheduleType">
                    <Select>
                      <Option value="once">Một lần</Option>
                      <Option value="daily">Hàng ngày</Option>
                      <Option value="weekly">Hàng tuần</Option>
                      <Option value="monthly">Hàng tháng</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="Ngày giờ gửi" name="scheduleDate">
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" style={{ width: '100%' }} />
                  </Form.Item>
                </>
              ) : null
            }
          </Form.Item>
        </FormSection>

        <FormSection title="Người nhận" icon={<span>👥</span>}>
          <Form.Item label="Tiêu chí người nhận (JSON)" name="recipientCriteria" help='VD: {"roles": ["CUSTOMER"], "dateOfBirth": true}'>
            <TextArea rows={4} placeholder='{"roles": ["CUSTOMER"], "dateOfBirth": true}' />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" valuePropName="checked">
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Tạm dừng" />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/email-campaigns'), size: 'large' }}
          primaryAction={{ label: 'Cập nhật chiến dịch', htmlType: 'submit', icon: <SaveOutlined />, loading: updateMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
};

export default EmailCampaignEditPage;
