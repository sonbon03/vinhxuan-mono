/**
 * Dashboard Overview Page
 * Main dashboard showing stats and recent activity for customers
 */

import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useMyConsultations } from '@/hooks/useConsultations';
import { useMyListings } from '@/hooks/useListings';
import {
  Calendar,
  Megaphone,
  Clock,
  Eye,
  Heart,
  Plus,
  ArrowRight,
  TrendingUp,
  FileText,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch consultations and listings
  const { data: consultationsData, isLoading: consultationsLoading } = useMyConsultations({
    page: 1,
    limit: 5,
  });

  const { data: listingsData, isLoading: listingsLoading } = useMyListings({
    page: 1,
    limit: 5,
  });

  const consultations = consultationsData?.data?.items || [];
  const listings = listingsData?.data?.items || [];

  // Calculate stats
  const totalConsultations = consultationsData?.data?.total || 0;
  const pendingConsultations = consultations.filter((c) => c.status === 'PENDING').length;
  const totalListings = listingsData?.data?.total || 0;
  const pendingListings = listings.filter((l) => l.status === 'PENDING').length;

  // Stats cards data with modern styling
  const stats = [
    {
      title: 'Tổng lịch tư vấn',
      value: totalConsultations,
      icon: Calendar,
      gradient: 'from-blue-500 to-blue-600',
      bgGradient: 'from-blue-50 to-blue-100/50',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Lịch chờ xác nhận',
      value: pendingConsultations,
      icon: Clock,
      gradient: 'from-amber-500 to-amber-600',
      bgGradient: 'from-amber-50 to-amber-100/50',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Tin đăng của tôi',
      value: totalListings,
      icon: Megaphone,
      gradient: 'from-green-500 to-green-600',
      bgGradient: 'from-green-50 to-green-100/50',
      iconBg: 'bg-green-500/10',
      iconColor: 'text-green-600',
      borderColor: 'border-green-200',
    },
    {
      title: 'Tin đăng đang chờ',
      value: pendingListings,
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      bgGradient: 'from-purple-50 to-purple-100/50',
      iconBg: 'bg-purple-500/10',
      iconColor: 'text-purple-600',
      borderColor: 'border-purple-200',
    },
  ];

  // Status badge helper
  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
    > = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary' },
      APPROVED: { label: 'Đã duyệt', variant: 'default' },
      COMPLETED: { label: 'Hoàn thành', variant: 'outline' },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive' },
      REJECTED: { label: 'Bị từ chối', variant: 'destructive' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Chào mừng trở lại, {user?.fullName?.split(' ')[0] || 'Bạn'}!
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Tổng quan về hoạt động và thống kê tài khoản của bạn
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`border-2 ${stat.borderColor} shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden relative group`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
              <CardTitle className="text-sm font-semibold text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`p-3 rounded-xl ${stat.iconBg} group-hover:scale-110 transition-transform duration-300`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline gap-2">
                <div
                  className={`text-4xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                >
                  {stat.value}
                </div>
                {index === 0 && totalConsultations > 0 && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Consultations */}
        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Lịch tư vấn gần đây</CardTitle>
                  <CardDescription>5 lịch tư vấn mới nhất của bạn</CardDescription>
                </div>
              </div>
              <Link to="/dashboard/consultations">
                <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {consultationsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : consultations.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Chưa có lịch tư vấn</h3>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu đặt lịch tư vấn để nhận hỗ trợ từ chúng tôi
                </p>
                <Link to="/contact">
                  <Button size="lg" className="shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Đặt lịch ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map((consultation, index) => (
                  <div key={consultation.id}>
                    <div className="group flex items-start justify-between p-4 rounded-xl border-2 border-border hover:border-blue-300 hover:bg-blue-50/50 transition-all duration-200 cursor-pointer">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Calendar className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="font-semibold text-sm">
                            {format(new Date(consultation.requestedDatetime), 'PPp', {
                              locale: vi,
                            })}
                          </span>
                        </div>
                        {consultation.service && (
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <span className="font-medium">Dịch vụ:</span>
                            {consultation.service.name}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {consultation.content}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        {getStatusBadge(consultation.status)}
                        <Link to={`/dashboard/consultations`}>
                          <Button variant="ghost" size="sm" className="h-8">
                            Xem
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {index < consultations.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            )}

            {consultations.length > 0 && (
              <>
                <Separator className="my-6" />
                <Link to="/dashboard/consultations">
                  <Button variant="outline" className="w-full" size="lg">
                    Xem tất cả lịch tư vấn
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>

        {/* Recent Announcements */}
        <Card className="border-2 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Megaphone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold">Tin đăng gần đây</CardTitle>
                  <CardDescription>5 tin đăng mới nhất của bạn</CardDescription>
                </div>
              </div>
              <Link to="/dashboard/announcements">
                <Button variant="outline" size="sm" className="shadow-sm hover:shadow-md">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {listingsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full rounded-lg" />
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Megaphone className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Chưa có tin đăng</h3>
                <p className="text-muted-foreground mb-6">
                  Bắt đầu đăng tin để chia sẻ thông tin với cộng đồng
                </p>
                <Link to="/announcements">
                  <Button size="lg" className="shadow-md hover:shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Đăng tin ngay
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((listing, index) => (
                  <div key={listing.id}>
                    <div className="group flex items-start justify-between p-4 rounded-xl border-2 border-border hover:border-green-300 hover:bg-green-50/50 transition-all duration-200 cursor-pointer">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-base line-clamp-1">{listing.title}</h4>
                        </div>
                        {listing.category && (
                          <Badge variant="outline" className="text-xs">
                            {listing.category.name}
                          </Badge>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            {listing._count?.comments || 0} lượt xem
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Heart className="h-4 w-4" />
                            {listing._count?.likes || 0} thích
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(listing.createdAt), 'dd/MM/yyyy')}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        {getStatusBadge(listing.status)}
                        <Link to={`/dashboard/announcements`}>
                          <Button variant="ghost" size="sm" className="h-8">
                            Xem
                          </Button>
                        </Link>
                      </div>
                    </div>
                    {index < listings.length - 1 && <Separator className="my-4" />}
                  </div>
                ))}
              </div>
            )}

            {listings.length > 0 && (
              <>
                <Separator className="my-6" />
                <Link to="/dashboard/announcements">
                  <Button variant="outline" className="w-full" size="lg">
                    Xem tất cả tin đăng
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-2 shadow-lg bg-gradient-to-br from-background to-muted/20">
        <CardHeader className="border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Thao tác nhanh</CardTitle>
              <CardDescription>Các hành động phổ biến để bắt đầu</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/contact" className="block group">
              <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50 p-6 hover:shadow-xl hover:border-blue-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-500 text-white group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Đặt lịch tư vấn</h3>
                    <p className="text-sm text-muted-foreground">Đặt lịch tư vấn với chuyên gia</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            <Link to="/announcements" className="block group">
              <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100/50 p-6 hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-green-500 text-white group-hover:scale-110 transition-transform duration-300">
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">Đăng tin mới</h3>
                    <p className="text-sm text-muted-foreground">Chia sẻ thông tin với cộng đồng</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          {/* Additional Info */}
          {(pendingConsultations > 0 || pendingListings > 0) && (
            <>
              <Separator className="my-6" />
              <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900 mb-1">
                    Bạn có {pendingConsultations + pendingListings} mục đang chờ xử lý
                  </p>
                  <p className="text-xs text-amber-700">
                    {pendingConsultations > 0 &&
                      `${pendingConsultations} lịch tư vấn đang chờ xác nhận`}
                    {pendingConsultations > 0 && pendingListings > 0 && ' và '}
                    {pendingListings > 0 && `${pendingListings} tin đăng đang chờ duyệt`}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
