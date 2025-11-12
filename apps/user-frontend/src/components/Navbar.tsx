import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Scale,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Home,
  Newspaper,
  Megaphone,
  MessageCircle,
  Briefcase,
  Users,
  Phone,
  Calendar,
  UserCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import logoNoBackground from '@/assets/logo-no-background.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const navigation = [
    { name: 'Trang Chủ', href: '/', icon: Home },
    { name: 'Dịch Vụ', href: '/services', icon: Briefcase },
    { name: 'Tin Tức', href: '/news', icon: Newspaper },
    { name: 'Thông Báo', href: '/announcements', icon: Megaphone },
    // { name: "Giới Thiệu", href: "/about", icon: Users },
    { name: 'Liên Hệ', href: '/contact', icon: Phone },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-md border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300"> */}
              {/* <div className="text-white text-xl">⚖️</div> */}
              {/* </div> */}
              <img
                src={logoNoBackground}
                alt="Logo"
                width={72}
                height={72}
                className="transition-all duration-200"
              />
              <div className="flex flex-col">
                <span className="font-sans font-bold text-xl text-primary group-hover:text-accent transition-colors leading-tight">
                  Công Chứng Vĩnh Xuân
                </span>
                <span className="text-xs text-muted-foreground font-normal hidden sm:block">
                  Khách quan · Trung thực · Chí công vô tư
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-accent/10 hover:text-accent',
                  isActive(item.href)
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-muted-foreground',
                )}
              >
                <item.icon className="hidden xl:block h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {!isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover:bg-accent/10 hover:text-accent"
                  asChild
                >
                  <Link to="/login">Đăng Nhập</Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all"
                  asChild
                >
                  <Link to="/register">Đăng Ký</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-accent/10"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{user?.fullName}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/consultations" className="cursor-pointer">
                      <Calendar className="mr-2 h-4 w-4" />
                      Lịch Tư vấn
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/announcements" className="cursor-pointer">
                      <Megaphone className="mr-2 h-4 w-4" />
                      Tin đăng của tôi
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile" className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Hồ Sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng Xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-accent/10 hover:text-accent transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-2 pb-4 space-y-2 bg-background/95 backdrop-blur-md border-t border-border">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200',
                  isActive(item.href)
                    ? 'bg-accent/10 text-accent font-semibold'
                    : 'text-muted-foreground hover:text-accent hover:bg-accent/5',
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-border">
              {!isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start hover:bg-accent/10 hover:text-accent"
                    asChild
                  >
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <User className="mr-2 h-4 w-4" />
                      Đăng Nhập
                    </Link>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-md"
                    asChild
                  >
                    <Link to="/register" onClick={() => setIsOpen(false)}>
                      Đăng Ký
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-accent/5 rounded-lg">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} alt={user?.fullName} />
                      <AvatarFallback className="bg-accent text-accent-foreground">
                        {user?.fullName ? getInitials(user.fullName) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <Link
                    to="/dashboard/consultations"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>Lịch Tư vấn</span>
                  </Link>
                  <Link
                    to="/dashboard/announcements"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <Megaphone className="h-5 w-5" />
                    <span>Tin đăng của tôi</span>
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserCircle className="h-5 w-5" />
                    <span>Hồ Sơ</span>
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Cài đặt</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Đăng Xuất</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
