/**
 * DashboardLayout Component
 * Main layout wrapper for all dashboard pages with sidebar navigation
 */

import { useState } from 'react';
import { Link, useLocation, Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '@/assets/logo-no-background.png';
import {
  LayoutDashboard,
  Calendar,
  Megaphone,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Home,
} from 'lucide-react';
import Dashboard from '@/pages/Dashboard';
import MyConsultations from '@/pages/MyConsultations';
import MyAnnouncements from '@/pages/MyAnnouncements';
import Profile from '@/pages/Profile';
import SettingsPage from '@/pages/Settings';

const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Tổng quan', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Lịch tư vấn', url: '/dashboard/consultations', icon: Calendar },
    { title: 'Tin đăng', url: '/dashboard/announcements', icon: Megaphone },
    { title: 'Hồ sơ', url: '/dashboard/profile', icon: User },
    // { title: 'Cài đặt', url: '/dashboard/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  const isCollapsed = state === 'collapsed';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar className={isCollapsed ? 'w-14' : 'w-64'}>
      <div className="p-3">
        <Link to="/" title="Về trang chủ" className="flex items-center">
          <img src={Logo} alt="Trang chủ" className={isCollapsed ? 'h-8 w-8' : 'h-8 w-auto'} />
        </Link>
      </div>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? 'hidden' : ''}>
            Quản lý tài khoản
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`${
                        isActive(item.url)
                          ? 'bg-accent text-accent-foreground font-medium'
                          : 'hover:bg-accent/10'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              {/* Logout button */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  {!isCollapsed && <span>Đăng xuất</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User info at bottom (when expanded) */}
        {!isCollapsed && user && (
          <div className="mt-auto p-4 border-t">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.fullName?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};

const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto">
          {/* Header */}
          <header className="bg-background border-b border-border px-6 py-4 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="inline-flex" />
                <Link to="/" className="inline-flex">
                  <Button variant="ghost" size="icon" title="Về trang chính">
                    <Home className="h-5 w-5" />
                  </Button>
                </Link>
                <h1 className="font-sans text-2xl font-bold text-primary">
                  Chào mừng, {user?.fullName}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Quản lý lịch tư vấn và tin đăng của bạn
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Link to="/dashboard/profile">
                  <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 ring-primary transition-all">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6">
            <Routes>
              <Route index element={<Dashboard />} />
              <Route path="consultations" element={<MyConsultations />} />
              <Route path="announcements" element={<MyAnnouncements />} />
              <Route path="profile" element={<Profile />} />
              {/* <Route path="settings" element={<SettingsPage />} /> */}
            </Routes>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
