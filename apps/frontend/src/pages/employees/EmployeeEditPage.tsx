import { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, message, Typography, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { employeeService, EmployeeStatus } from '@/services/employee.service';
import dayjs from 'dayjs';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const { Title } = Typography;

const statusOptions = [
  { label: 'Đang làm việc', value: EmployeeStatus.WORKING },
  { label: 'Tạm nghỉ', value: EmployeeStatus.ON_LEAVE },
  { label: 'Nghỉ việc', value: EmployeeStatus.RESIGNED },
];

export default function EmployeeEditPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: employee, isLoading } = useQuery({
    queryKey: ['employee', id],
    queryFn: () => employeeService.getEmployeeById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => employeeService.updateEmployee(id!, data),
    onSuccess: () => {
      message.success('Cập nhật nhân viên thành công!');
      queryClient.invalidateQueries({ queryKey: ['employee', id] });
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      navigate('/employees');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật nhân viên thất bại!');
    },
  });

  useEffect(() => {
    if (employee) {
      form.setFieldsValue({
        name: employee.name,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        yearsOfExperience: employee.yearsOfExperience,
        dateOfBirth: employee.dateOfBirth ? dayjs(employee.dateOfBirth) : undefined,
        status: employee.status,
      });
    }
  }, [employee, form]);

  const onFinish = (values: any) => {
    const data = { ...values, dateOfBirth: values.dateOfBirth ? values.dateOfBirth.format('YYYY-MM-DD') : undefined };
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/employees">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <Spin size="large" tip="Đang tải dữ liệu..." />
        </div>
      </PageContainer>
    );
  }

  if (!employee) {
    return (
      <PageContainer title="Không tìm thấy nhân viên" backUrl="/employees">
        <Title level={4}>Không tìm thấy nhân viên</Title>
      </PageContainer>
    );
  }

  return (
    <PageContainer title={`Chỉnh sửa nhân viên: ${employee.name}`} backUrl="/employees">
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <FormSection title="Thông tin cá nhân" icon={<span>👤</span>}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }, { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' }]}>
            <Input placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="position" label="Chức vụ" rules={[{ required: true, message: 'Vui lòng nhập chức vụ!' }]}>
            <Input placeholder="Công chứng viên" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input placeholder="employee@vinhxuan.com" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' }]}>
            <Input placeholder="0901234567" />
          </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh">
            <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} format="DD/MM/YYYY" disabledDate={(current) => current && current > dayjs().subtract(18, 'year')} />
          </Form.Item>
        </FormSection>

        <FormSection title="Kinh nghiệm & Trạng thái" icon={<span>💼</span>}>
          <Form.Item name="yearsOfExperience" label="Số năm kinh nghiệm" rules={[{ required: true, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}>
            <InputNumber min={0} max={50} placeholder="0" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}>
            <Select options={statusOptions} placeholder="Chọn trạng thái" />
          </Form.Item>
        </FormSection>

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/employees'), size: 'large' }}
          primaryAction={{ label: 'Cập nhật nhân viên', htmlType: 'submit', icon: <SaveOutlined />, loading: updateMutation.isPending, size: 'large' }}
        />
      </Form>
    </PageContainer>
  );
}
