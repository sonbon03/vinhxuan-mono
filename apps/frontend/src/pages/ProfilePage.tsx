import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  DatePicker,
  message,
  Avatar,
  Typography,
  Divider,
  Tag,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  LockOutlined,
  SaveOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/store/auth.store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/services/user.service';
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import './ProfilePage.css';

const { Title, Text } = Typography;

interface ProfileFormValues {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: Dayjs | undefined;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Fetch user profile data
  const { data: userProfile, isLoading } = useQuery<User>({
    queryKey: ['user-profile', user?.id],
    queryFn: () => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return userService.getUserById(user.id);
    },
    enabled: !!user?.id,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: (data: { fullName: string; phone: string; dateOfBirth?: Date }) => {
      if (!user?.id) {
        throw new Error('User ID is required');
      }
      return userService.updateUser(user.id, data);
    },
    onSuccess: () => {
      message.success('Cập nhật thông tin thành công!');
      setProfileLoading(false);
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || 'Cập nhật thông tin thất bại!');
      setProfileLoading(false);
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      userService.updatePassword(data),
    onSuccess: () => {
      message.success('Đổi mật khẩu thành công!');
      passwordForm.resetFields();
      setPasswordLoading(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      message.error(error.response?.data?.message || 'Đổi mật khẩu thất bại!');
      setPasswordLoading(false);
    },
  });

  // Initialize form when user data is loaded
  React.useEffect(() => {
    if (userProfile) {
      profileForm.setFieldsValue({
        fullName: userProfile.fullName,
        email: userProfile.email,
        phone: userProfile.phone,
        dateOfBirth: userProfile.dateOfBirth ? dayjs(userProfile.dateOfBirth) : undefined,
      });
    }
  }, [userProfile, profileForm]);

  const handleUpdateProfile = async (values: ProfileFormValues) => {
    setProfileLoading(true);
    const data = {
      fullName: values.fullName,
      phone: values.phone,
      ...(values.dateOfBirth && {
        dateOfBirth: values.dateOfBirth.toDate(),
      }),
    };
    updateProfileMutation.mutate(data);
  };

  const handleUpdatePassword = async (values: PasswordFormValues) => {
    setPasswordLoading(true);
    updatePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const getRoleInfo = (role: string) => {
    const roleConfig: Record<string, { label: string; color: string }> = {
      ADMIN: { label: 'Quản trị viên', color: 'red' },
      STAFF: { label: 'Nhân viên', color: 'blue' },
      CUSTOMER: { label: 'Khách hàng', color: 'green' },
    };
    return roleConfig[role] || { label: role, color: 'default' };
  };

  if (isLoading) {
    return (
      <div
        style={{
          padding: '24px',
          textAlign: 'center',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <div
            className="loading-spinner"
            style={{
              margin: '0 auto 16px',
              width: '40px',
              height: '40px',
              border: '4px solid #f3f4f6',
              borderTopColor: '#6366f1',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          />
          <Text>Đang tải thông tin...</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      {/* Profile Header */}
      <div className="profile-header">
        <Avatar size={100} icon={<UserOutlined />} className="profile-avatar">
          {user?.fullName?.[0]?.toUpperCase() || 'U'}
        </Avatar>
        <div className="profile-info">
          <Title level={2} className="profile-name">
            {user?.fullName || 'User'}
          </Title>
          <Text className="profile-email">{user?.email}</Text>
          {user?.role && (
            <div style={{ marginTop: 8 }}>
              <Tag color={getRoleInfo(user.role).color} className="profile-role-tag">
                {getRoleInfo(user.role).label}
              </Tag>
            </div>
          )}
        </div>
      </div>

      <Row gutter={[24, 24]}>
        {/* Section 1: Update Profile Information */}
        <Col xs={24} lg={12}>
          <Card className="profile-section-card">
            <div className="profile-section-header">
              <UserOutlined className="profile-section-icon" />
              <Title level={4} className="profile-section-title">
                Thông tin cá nhân
              </Title>
            </div>
            <Divider className="profile-section-divider" />

            <Form
              form={profileForm}
              layout="vertical"
              onFinish={handleUpdateProfile}
              className="profile-form"
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[
                  { required: true, message: 'Vui lòng nhập họ và tên!' },
                  { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' },
                ]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nguyễn Văn A" size="large" />
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
                  disabled
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
                <Input prefix={<PhoneOutlined />} placeholder="0901234567" size="large" />
              </Form.Item>

              <Form.Item
                name="dateOfBirth"
                label="Ngày sinh"
                rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }]}
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

              <Form.Item label="Vai trò">
                <Input
                  value={user?.role ? getRoleInfo(user.role).label : ''}
                  size="large"
                  disabled
                  style={{ color: '#000', fontWeight: 500 }}
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SaveOutlined />}
                  loading={profileLoading}
                  block
                  className="profile-submit-btn"
                >
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* Section 2: Change Password */}
        <Col xs={24} lg={12}>
          <Card className="profile-section-card">
            <div className="profile-section-header">
              <SafetyOutlined className="profile-section-icon" />
              <Title level={4} className="profile-section-title">
                Đổi mật khẩu
              </Title>
            </div>
            <Divider className="profile-section-divider" />

            <Form
              form={passwordForm}
              layout="vertical"
              onFinish={handleUpdatePassword}
              className="profile-form"
            >
              <Form.Item
                label="Mật khẩu hiện tại"
                name="currentPassword"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  placeholder="Nhập mật khẩu hiện tại"
                />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                  { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                />
              </Form.Item>

              <Form.Item
                label="Xác nhận mật khẩu mới"
                name="confirmPassword"
                dependencies={['newPassword']}
                rules={[
                  { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('newPassword') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  size="large"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </Form.Item>

              <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  icon={<SafetyOutlined />}
                  loading={passwordLoading}
                  block
                  className="profile-submit-btn"
                >
                  Đổi mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
