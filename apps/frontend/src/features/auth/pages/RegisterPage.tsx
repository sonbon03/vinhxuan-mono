import { Form, Input, Button, Card, Typography, message, DatePicker } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { RegisterDto } from '@/types';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [form] = Form.useForm();

  const registerMutation = useMutation({
    mutationFn: (registerDto: RegisterDto) => authService.register(registerDto),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken, data.refreshToken);
      message.success('Đăng ký thành công!');
      navigate('/');
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || 'Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.'
      );
    },
  });

  const onFinish = (values: any) => {
    const registerDto: RegisterDto = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
      phone: values.phone,
      dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD'),
    };
    registerMutation.mutate(registerDto);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
      }}
    >
      <Card style={{ width: 500, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Đăng ký tài khoản</Title>
          <p>Hệ thống quản lý dịch vụ công chứng</p>
        </div>

        <Form form={form} name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ và tên!' },
              { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nguyễn Văn A"
              size="large"
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
              prefix={<MailOutlined />}
              placeholder="example@vinhxuan.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              {
                pattern: /^(0|\+84)[0-9]{9,10}$/,
                message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="0901234567"
              size="large"
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
                  if (age < 18) {
                    return Promise.reject(new Error('Bạn phải từ 18 tuổi trở lên!'));
                  }
                  if (age > 100) {
                    return Promise.reject(new Error('Ngày sinh không hợp lệ!'));
                  }
                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              placeholder="Chọn ngày sinh"
              size="large"
              style={{ width: '100%' }}
              format="DD/MM/YYYY"
              disabledDate={(current) => {
                return current && current > dayjs().subtract(18, 'year');
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                message: 'Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={registerMutation.isPending}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <span>Đã có tài khoản? </span>
            <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}
