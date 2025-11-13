import { Form, Input, Select, DatePicker, message, InputNumber } from 'antd';
import {
  SaveOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  CalendarOutlined,
  TeamOutlined,
  IdcardOutlined,
  TrophyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { CreateUserDto, UserRole } from '@/types';
import dayjs from 'dayjs';
import { useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

type CreateUserValues = {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: dayjs.Dayjs;
  role: UserRole;
  password: string;
  position?: string;
  yearsOfExperience?: number;
};

const roleOptions = [
  { label: 'Quản trị viên', value: UserRole.ADMIN },
  { label: 'Nhân viên', value: UserRole.STAFF },
  { label: 'Khách hàng', value: UserRole.CUSTOMER },
];

export default function UserCreatePage() {
  const navigate = useNavigate();
  const [form] = Form.useForm<CreateUserValues>();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

  const createMutation = useMutation({
    mutationFn: (data: CreateUserDto) => userService.createUser(data),
    onSuccess: () => {
      message.success('Tạo người dùng thành công!');
      navigate('/users');
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } };
      message.error(err.response?.data?.message || 'Tạo người dùng thất bại!');
    },
  });

  const onFinish = (values: CreateUserValues) => {
    const data: CreateUserDto = {
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth.toDate(),
      role: values.role,
      password: values.password,
    };
    createMutation.mutate(data);
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.CUSTOMER) {
      form.setFieldsValue({
        position: undefined,
        yearsOfExperience: undefined,
      } as Partial<CreateUserValues>);
    }
  };

  const isStaffOrAdmin = selectedRole === UserRole.ADMIN || selectedRole === UserRole.STAFF;

  return (
    <PageContainer title="Thêm người dùng mới" backUrl="/users">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ role: UserRole.CUSTOMER }}
        size="large"
      >
        <FormSection title="Thông tin cá nhân" icon={<span>👤</span>}>
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Nguyễn Văn A"
            />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#9ca3af' }} />}
              placeholder="example@vinhxuan.com"
            />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />}
              placeholder="0901234567"
            />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày sinh"
            rules={[
              { required: true, message: 'Vui lòng chọn ngày sinh!' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const age = dayjs().diff(value, 'year');
                  return age < 18
                    ? Promise.reject(new Error('Người dùng phải từ 18 tuổi trở lên!'))
                    : Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              suffixIcon={<CalendarOutlined style={{ color: '#9ca3af' }} />}
              disabledDate={(current) => current && current > dayjs().subtract(18, 'year')}
            />
          </Form.Item>
        </FormSection>

        <FormSection title="Cài đặt tài khoản" icon={<span>⚙️</span>}>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}
          >
            <Select
              options={roleOptions}
              placeholder="Chọn vai trò"
              suffixIcon={<TeamOutlined style={{ color: '#9ca3af' }} />}
              onChange={handleRoleChange}
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#9ca3af' }} />}
              placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
            />
          </Form.Item>
        </FormSection>

        {isStaffOrAdmin && (
          <FormSection title="Thông tin nhân viên" icon={<span>🧾</span>}>
            <Form.Item
              name="position"
              label="Chức vụ"
              rules={[
                { required: isStaffOrAdmin, message: 'Vui lòng nhập chức vụ!' },
                { min: 2, message: 'Chức vụ phải có ít nhất 2 ký tự!' },
              ]}
            >
              <Input
                prefix={<IdcardOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Ví dụ: Công chứng viên, Trợ lý pháp lý..."
              />
            </Form.Item>
            <Form.Item
              name="yearsOfExperience"
              label="Số năm kinh nghiệm"
              rules={[{ required: isStaffOrAdmin, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}
              initialValue={0}
            >
              <InputNumber
                prefix={<TrophyOutlined style={{ color: '#9ca3af' }} />}
                placeholder="Nhập số năm kinh nghiệm"
                min={0}
                max={50}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </FormSection>
        )}

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/users'), size: 'large' }}
          primaryAction={{
            label: 'Tạo người dùng',
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
