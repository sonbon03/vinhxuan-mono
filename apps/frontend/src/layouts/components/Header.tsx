import React from 'react';
import { Layout, Button, Dropdown, Avatar, Space, Typography, Tag } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import './Header.css';

const { Header: AntHeader } = Layout;
const { Text } = Typography;

interface HeaderProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const { user, clearAuth } = useAuthStore();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  const getRoleInfo = (role: string) => {
    const roleConfig: Record<string, { label: string; color: string }> = {
      ADMIN: { label: 'Quản trị viên', color: 'red' },
      STAFF: { label: 'Nhân viên', color: 'blue' },
      CUSTOMER: { label: 'Khách hàng', color: 'green' },
    };

    return roleConfig[role] || { label: role, color: 'default' };
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="user-menu-header">
          <Avatar size={48} icon={<UserOutlined />} className="user-menu-avatar">
            {user?.fullName?.[0]?.toUpperCase()}
          </Avatar>
          <div className="user-menu-info">
            <div className="user-menu-name">{user?.fullName || 'User'}</div>
            <div className="user-menu-email">{user?.email}</div>
            {user?.role && (
              <Tag color={getRoleInfo(user.role).color} className="user-menu-role">
                {getRoleInfo(user.role).label}
              </Tag>
            )}
          </div>
        </div>
      ),
      disabled: true,
    },
    {
      type: 'divider',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ cá nhân',
      onClick: handleProfile,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <AntHeader className="modern-header">
      {/* Left Section - Toggle Button & Logo */}
      <div className="header-left">
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={onToggle}
          className="header-toggle-btn"
        />
        <div className="header-logo">
          <div className="header-logo-icon">VX</div>
          {!collapsed && (
            <span className="header-logo-text">
              <span className="logo-primary">Vinh Xuân</span>
              <span className="logo-secondary">CMS</span>
            </span>
          )}
        </div>
      </div>

      {/* Right Section - User Info */}
      <div className="header-right">
        {user ? (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow={{ pointAtCenter: true }}
            trigger={['click']}
            overlayClassName="user-dropdown-menu"
          >
            <div className="header-user-info">
              <div className="header-user-content">
                <div className="header-user-text">
                  <Text className="header-user-name">{user?.fullName || 'User'}</Text>
                  {user?.role && (
                    <Tag color={getRoleInfo(user.role).color} className="header-role-tag">
                      {getRoleInfo(user.role).label}
                    </Tag>
                  )}
                </div>
                <Avatar size={36} className="header-avatar">
                  {user?.fullName?.[0]?.toUpperCase() || 'U'}
                </Avatar>
              </div>
            </div>
          </Dropdown>
        ) : (
          <Space size="middle">
            <Button
              type="default"
              className="header-auth-btn"
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </Button>
            <Button
              type="primary"
              className="header-auth-btn-primary"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          </Space>
        )}
      </div>
    </AntHeader>
  );
};

export default Header;
