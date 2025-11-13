import React from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  CalculatorOutlined,
  FolderOpenOutlined,
  FileProtectOutlined,
  ReadOutlined,
  ShopOutlined,
  CalendarOutlined,
  MailOutlined,
  CommentOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  TagsOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { useAuthStore } from '../../store/auth.store';
import { UserRole } from '@/types';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const getItem = (
    label: React.ReactNode,
    key: string,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
      type,
    } as MenuItem;
  };

  // Build menu items based on user role
  const menuItems: MenuItem[] = [
    // Show Dashboard only if authenticated
    user ? getItem('Dashboard', '/', <DashboardOutlined />) : null,

    // User Management (Admin + Staff)
    user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF
      ? getItem('Quản lý Người dùng', '/users-group', <TeamOutlined />, [
          user?.role === UserRole.ADMIN
            ? getItem('Danh sách Người dùng', '/users', <UserOutlined />)
            : null,
          user?.role === UserRole.ADMIN
            ? getItem('Nhân viên', '/employees', <CustomerServiceOutlined />)
            : null,
        ].filter(Boolean) as MenuItem[])
      : null,

    // Services Management (Admin + Staff)
    user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF
      ? getItem('Dịch vụ', '/services-group', <AppstoreOutlined />, [
          getItem('Danh sách Dịch vụ', '/services', <AppstoreOutlined />),
          getItem('Thể loại', '/categories', <TagsOutlined />),
          getItem('Nhóm Giấy tờ', '/document-groups', <FolderOpenOutlined />),
          getItem('Loại phí', '/fee-types', <DollarOutlined />),
        ])
      : null,

    // Fee Calculator (Public + Authenticated)
    getItem('Tính phí', '/fee-calculator-group', <CalculatorOutlined />, [
      getItem('Công cụ tính phí', '/fee-calculator', <CalculatorOutlined />),
      // History only for authenticated users
      user ? getItem('Lịch sử tính phí', '/fee-calculator/history', <FileTextOutlined />) : null,
    ].filter(Boolean) as MenuItem[]),

    // Articles (Public + Authenticated)
    getItem('Bài viết', '/articles', <ReadOutlined />),

    // Listings (Public + Authenticated)
    getItem('Tin rao', '/listings', <ShopOutlined />),

    // Records (Authenticated only)
    user ? getItem('Quản lý Hồ sơ', '/records', <FileProtectOutlined />) : null,

    // Consultations (Authenticated only)
    user ? getItem('Lịch Tư vấn', '/consultations', <CalendarOutlined />) : null,

    // Email Campaigns (Admin + Staff)
    user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF
      ? getItem('Email Marketing', '/email-campaigns', <MailOutlined />)
      : null,

    // Chatbot (Admin + Staff can see history)
    user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF
      ? getItem('Chatbot', '/chatbot/history', <CommentOutlined />)
      : null,

    // Statistics (Admin + Staff)
    user?.role === UserRole.ADMIN || user?.role === UserRole.STAFF
      ? getItem('Thống kê', '/statistics-group', <BarChartOutlined />, [
          getItem('Tổng quan', '/statistics', <DashboardOutlined />),
          getItem('Hồ sơ', '/statistics/records', <FileProtectOutlined />),
          user?.role === UserRole.ADMIN
            ? getItem('Người dùng', '/statistics/users', <UserOutlined />)
            : null,
          getItem('Hiệu suất', '/statistics/performance', <TeamOutlined />),
          user?.role === UserRole.ADMIN
            ? getItem('Doanh thu', '/statistics/revenue', <DollarOutlined />)
            : null,
        ].filter(Boolean) as MenuItem[])
      : null,
  ].filter(Boolean) as MenuItem[];

  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  // Get current selected key from location
  const getSelectedKey = () => {
    const path = location.pathname;

    // Match exact paths or parent paths for nested routes
    if (path === '/') return '/';
    if (path.startsWith('/users') && path !== '/users') return '/users';
    if (path.startsWith('/employees')) return '/employees';
    if (path.startsWith('/services')) return '/services';
    if (path.startsWith('/categories')) return '/categories';
    if (path.startsWith('/document-groups')) return '/document-groups';
    if (path.startsWith('/fee-types')) return '/fee-types';
    if (path.startsWith('/fee-calculator')) {
      if (path === '/fee-calculator/history') return '/fee-calculator/history';
      return '/fee-calculator';
    }
    if (path.startsWith('/records')) return '/records';
    if (path.startsWith('/articles')) return '/articles';
    if (path.startsWith('/listings')) return '/listings';
    if (path.startsWith('/consultations')) return '/consultations';
    if (path.startsWith('/email-campaigns')) return '/email-campaigns';
    if (path.startsWith('/chatbot')) return '/chatbot/history';
    if (path.startsWith('/statistics')) {
      if (path === '/statistics/records') return '/statistics/records';
      if (path === '/statistics/users') return '/statistics/users';
      if (path === '/statistics/performance') return '/statistics/performance';
      if (path === '/statistics/revenue') return '/statistics/revenue';
      return '/statistics';
    }

    return path;
  };

  // Get open keys for submenus
  const getOpenKeys = () => {
    const path = location.pathname;
    const openKeys: string[] = [];

    if (path.startsWith('/users') || path.startsWith('/employees')) {
      openKeys.push('/users-group');
    }
    if (
      path.startsWith('/services') ||
      path.startsWith('/categories') ||
      path.startsWith('/document-groups') ||
      path.startsWith('/fee-types')
    ) {
      openKeys.push('/services-group');
    }
    if (path.startsWith('/fee-calculator')) {
      openKeys.push('/fee-calculator-group');
    }
    if (path.startsWith('/statistics')) {
      openKeys.push('/statistics-group');
    }

    return openKeys;
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      trigger={null}
      width={250}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        background: '#001529',
      }}
    >
      {/* Logo */}
      <div
        style={{
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(255, 255, 255, 0.1)',
          margin: '16px',
          borderRadius: '8px',
        }}
      >
        <h1
          style={{
            color: '#fff',
            margin: 0,
            fontSize: collapsed ? '18px' : '20px',
            fontWeight: 'bold',
            transition: 'all 0.2s',
          }}
        >
          {collapsed ? 'VX' : 'Vinh Xuân'}
        </h1>
      </div>

      {/* Navigation Menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={onClick}
        style={{
          borderRight: 0,
        }}
      />
    </Sider>
  );
};

export default Sidebar;
