import { Form, Input, Button, Select, DatePicker, InputNumber, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { employeeService, EmployeeStatus } from '@/services/employee.service';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const statusOptions = [
  { label: 'Đang làm việc', value: EmployeeStatus.WORKING },
  { label: 'Tạm nghỉ', value: EmployeeStatus.ON_LEAVE },
  { label: 'Nghỉ việc', value: EmployeeStatus.RESIGNED },
];

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const createMutation = useMutation({
    mutationFn: employeeService.createEmployee,
    onSuccess: () => {
      message.success('Tạo nhân viên thành công!');
      navigate('/employees');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Tạo nhân viên thất bại!');
    },
  });

  const onFinish = (values: any) => {
    const data = {
      ...values,
      dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined,
    };
    createMutation.mutate(data);
  };

  return (
    <PageContainer title="Thêm nhân viên mới" backUrl="/employees">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: EmployeeStatus.WORKING,
          yearsOfExperience: 0,
        }}
        size="large"
      >
        <FormSection title="Thông tin cá nhân" icon={<span>👤</span>}>
          <Form.Item
            name="name"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>

          <Form.Item
            name="position"
            label="Chức vụ"
            rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}
          >
            <Input placeholder="Công chứng viên" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input placeholder="employee@vinhxuan.com" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input placeholder="0901234567" />
          </Form.Item>

          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker
              placeholder="Chọn ngày sinh"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) => current && current > dayjs().subtract(18, 'year')}
            />
          </Form.Item>
        </FormSection>

        <FormSection title="Kinh nghiệm & Trạng thái" icon={<span>💼</span>}>
          <Form.Item
            name="yearsOfExperience"
            label="Số năm kinh nghiệm"
            rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
          >
            <InputNumber min={0} max={50} placeholder="0" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
          >
            <Select options={statusOptions} placeholder="Chọn trạng thái" />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/employees'), size: 'large' }}
          primaryAction={{
            label: 'Tạo nhân viên',
            htmlType: 'submit',
            icon: <SaveOutlined />,
            loading: createMutation.isPending,
            size: 'large',
          }}
        />
      </Form>
    </PageContainer>
  );
}
