import { Form, Input, Button, Select, DatePicker, message, Divider, InputNumber, Spin } from 'antd';
import { SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined, CalendarOutlined, TeamOutlined, IdcardOutlined, TrophyOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { UserRole } from '@/types';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { PageContainer } from '@/components/common/PageContainer';
import { FormSection } from '@/components/common/FormSection';
import { FormActionBar } from '@/components/common/FormActionBar';

const roleOptions = [
  { label: 'Quản trị viên', value: UserRole.ADMIN },
  { label: 'Nhân viên', value: UserRole.STAFF },
  { label: 'Khách hàng', value: UserRole.CUSTOMER },
];

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.CUSTOMER);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUserById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        dateOfBirth: dayjs(user.dateOfBirth),
        role: user.role,
        position: (user as any).position,
        yearsOfExperience: (user as any).yearsOfExperience,
      });
      setSelectedRole(user.role);
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => userService.updateUser(id!, data),
    onSuccess: () => {
      message.success('Cập nhật người dùng thành công!');
      navigate('/users');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Cập nhật người dùng thất bại!');
    },
  });

  const onFinish = (values: any) => {
    const data: any = { ...values, dateOfBirth: values.dateOfBirth.format('YYYY-MM-DD') };
    if (!data.password) delete data.password;
    updateMutation.mutate(data);
  };

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === UserRole.CUSTOMER) {
      form.setFieldsValue({ position: undefined, yearsOfExperience: undefined });
    }
  };

  const isStaffOrAdmin = selectedRole === UserRole.ADMIN || selectedRole === UserRole.STAFF;

  if (isLoading) {
    return (
      <PageContainer title="Đang tải dữ liệu" backUrl="/users">
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
      </PageContainer>
    );
  }

  if (!user) {
    return (
      <PageContainer title="Không tìm thấy người dùng" backUrl="/users">
        Không tìm thấy người dùng
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Chỉnh sửa người dùng" subtitle={user.fullName} backUrl="/users">
      <Form form={form} layout="vertical" onFinish={onFinish} size="large">
        <FormSection title="Thông tin cá nhân" icon={<span>👤</span>}>
          <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }, { min: 3, message: 'Họ và tên phải có ít nhất 3 ký tự!' }]}>
            <Input prefix={<UserOutlined style={{ color: '#9ca3af' }} />} placeholder="Nguyễn Văn A" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email!' }, { type: 'email', message: 'Email không hợp lệ!' }]}>
            <Input prefix={<MailOutlined style={{ color: '#9ca3af' }} />} placeholder="example@vinhxuan.com" />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^(0|\+84)[0-9]{9,10}$/, message: 'Số điện thoại không hợp lệ!' }]}>
            <Input prefix={<PhoneOutlined style={{ color: '#9ca3af' }} />} placeholder="0901234567" />
            </Form.Item>
          <Form.Item name="dateOfBirth" label="Ngày sinh" rules={[{ required: true, message: 'Vui lòng chọn ngày sinh!' }, { validator: (_, value) => { if (!value) return Promise.resolve(); const age = dayjs().diff(value, 'year'); return age < 18 ? Promise.reject(new Error('Người dùng phải từ 18 tuổi trở lên!')) : Promise.resolve(); } }]}>
            <DatePicker placeholder="Chọn ngày sinh" style={{ width: '100%' }} format="DD/MM/YYYY" suffixIcon={<CalendarOutlined style={{ color: '#9ca3af' }} />} disabledDate={(current) => current && current > dayjs().subtract(18, 'year')} />
            </Form.Item>
        </FormSection>

        <FormSection title="Cài đặt tài khoản" icon={<span>⚙️</span>}>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò!' }]}>
            <Select options={roleOptions} placeholder="Chọn vai trò" suffixIcon={<TeamOutlined style={{ color: '#9ca3af' }} />} onChange={handleRoleChange} />
            </Form.Item>
          <Form.Item name="password" label="Mật khẩu mới (để trống nếu không muốn thay đổi)" rules={[{ min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự!' }]}>
            <Input.Password placeholder="Nhập mật khẩu mới (tùy chọn)" />
            </Form.Item>
        </FormSection>

        {isStaffOrAdmin && (
          <FormSection title="Thông tin nhân viên" icon={<span>🧾</span>}>
            <Form.Item name="position" label="Chức vụ" rules={[{ required: isStaffOrAdmin, message: 'Vui lòng nhập chức vụ!' }, { min: 2, message: 'Chức vụ phải có ít nhất 2 ký tự!' }]}>
              <Input prefix={<IdcardOutlined style={{ color: '#9ca3af' }} />} placeholder="Ví dụ: Công chứng viên, Trợ lý pháp lý..." />
            </Form.Item>
            <Form.Item name="yearsOfExperience" label="Số năm kinh nghiệm" rules={[{ required: isStaffOrAdmin, message: 'Vui lòng nhập số năm kinh nghiệm!' }]}>
              <InputNumber prefix={<TrophyOutlined style={{ color: '#9ca3af' }} />} placeholder="Nhập số năm kinh nghiệm" min={0} max={50} style={{ width: '100%' }} />
            </Form.Item>
          </FormSection>
        )}

        <FormActionBar
          secondaryAction={{ label: 'Hủy', onClick: () => navigate('/users'), size: 'large' }}
          primaryAction={{ label: 'Cập nhật người dùng', htmlType: 'submit', icon: <SaveOutlined />, loading: updateMutation.isPending, size: 'large' }}
        />
        </Form>
    </PageContainer>
  );
}
