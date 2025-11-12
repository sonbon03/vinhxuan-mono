import React, { useState, useEffect } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const { Content, Footer } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  // Check if sidebar should be collapsed on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Generate breadcrumb from current path
  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split('/').filter((i) => i);

    const breadcrumbNameMap: Record<string, string> = {
      '': 'Dashboard',
      users: 'Người dùng',
      employees: 'Nhân viên',
      services: 'Dịch vụ',
      categories: 'Thể loại',
      'document-groups': 'Nhóm Giấy tờ',
      'fee-types': 'Loại phí',
      'fee-calculator': 'Tính phí',
      history: 'Lịch sử',
      records: 'Hồ sơ',
      articles: 'Bài viết',
      listings: 'Tin rao',
      consultations: 'Lịch Tư vấn',
      'email-campaigns': 'Email Marketing',
      chatbot: 'Chatbot',
      statistics: 'Thống kê',
      performance: 'Hiệu suất',
      revenue: 'Doanh thu',
      profile: 'Hồ sơ cá nhân',
      create: 'Tạo mới',
      edit: 'Chỉnh sửa',
    };

    const breadcrumbItems = [
      {
        title: (
          <Link to="/">
            <HomeOutlined /> Dashboard
          </Link>
        ),
      },
    ];

    pathSnippets.forEach((snippet, index) => {
      const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
      const name = breadcrumbNameMap[snippet] || snippet;

      // Don't add breadcrumb for IDs (UUIDs)
      const isId = snippet.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

      if (!isId) {
        breadcrumbItems.push({
          title:
            index === pathSnippets.length - 1 ? <span>{name}</span> : <Link to={url}>{name}</Link>,
        });
      }
    });

    return breadcrumbItems;
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Layout */}
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'all 0.2s',
        }}
      >
        {/* Header */}
        <Header collapsed={collapsed} onToggle={toggleSidebar} />

        {/* Content */}
        <Content
          style={{
            margin: 0,
            overflow: 'initial',
            background: '#f5f7fa',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {/* Breadcrumb */}
          {location.pathname !== '/' && (
            <div style={{ padding: '16px 24px 0', background: 'transparent' }}>
              <Breadcrumb
                style={{
                  margin: 0,
                }}
                items={getBreadcrumbItems()}
              />
            </div>
          )}

          {/* Page Content */}
          <div
            style={{
              padding: location.pathname !== '/' ? '16px 24px 24px' : '24px',
              minHeight: 'calc(100vh - 64px)',
            }}
          >
            <Outlet />
          </div>
        </Content>

        {/* Footer */}
        <Footer
          style={{
            textAlign: 'center',
            background: 'transparent',
          }}
        >
          Vinh Xuân CMS ©{new Date().getFullYear()} Created with ❤️
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
