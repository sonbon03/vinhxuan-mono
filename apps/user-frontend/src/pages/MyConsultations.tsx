/**
 * My Consultations Page - Enhanced
 * Shows user's consultation bookings with stats, filtering, and beautiful UI
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useMyConsultations, useCancelConsultation } from '@/hooks/useConsultations';
import {
  Calendar, Plus, Search, X, Loader2, User2, Clock,
  CheckCircle2, XCircle, AlertCircle, CalendarCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';

const MyConsultations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedConsultation, setSelectedConsultation] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch consultations
  const { data, isLoading, refetch } = useMyConsultations({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    page: 1,
    limit: 100,
  });

  const cancelMutation = useCancelConsultation();

  const consultations = data?.data?.items || [];

  // Calculate statistics
  const stats = {
    total: consultations.length,
    pending: consultations.filter((c) => c.status === 'PENDING').length,
    approved: consultations.filter((c) => c.status === 'APPROVED').length,
    completed: consultations.filter((c) => c.status === 'COMPLETED').length,
    cancelled: consultations.filter((c) => c.status === 'CANCELLED').length,
  };

  // Filter and sort
  const filteredConsultations = consultations
    .filter((c) => {
      if (!debouncedSearch) return true;
      const searchLower = debouncedSearch.toLowerCase();
      return (
        c.content.toLowerCase().includes(searchLower) ||
        c.service?.name.toLowerCase().includes(searchLower) ||
        c.staff?.fullName.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.requestedDatetime).getTime();
      const dateB = new Date(b.requestedDatetime).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }
    > = {
      PENDING: { label: 'Chờ xác nhận', variant: 'secondary', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      APPROVED: { label: 'Đã duyệt', variant: 'default', color: 'bg-green-50 text-green-700 border-green-200' },
      COMPLETED: { label: 'Hoàn thành', variant: 'outline', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      CANCELLED: { label: 'Đã hủy', variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-200' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline', color: '' };
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  const handleCancelClick = (id: string) => {
    setSelectedConsultation(id);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedConsultation || !cancelReason.trim()) return;

    await cancelMutation.mutateAsync({
      id: selectedConsultation,
      reason: cancelReason,
    });

    setCancelDialogOpen(false);
    setSelectedConsultation(null);
    setCancelReason('');
    refetch();
  };

  const canCancel = (status: string) => {
    return status === 'PENDING' || status === 'APPROVED';
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lịch tư vấn của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi tất cả lịch hẹn tư vấn</p>
        </div>
        <Link to="/contact">
          <Button className="shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Đặt lịch mới
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="hover:shadow-md transition-shadow border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </div>
                <Calendar className="h-8 w-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-amber-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-amber-700">Chờ duyệt</p>
                  <h3 className="text-2xl font-bold mt-1 text-amber-700">{stats.pending}</h3>
                </div>
                <AlertCircle className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Đã duyệt</p>
                  <h3 className="text-2xl font-bold mt-1 text-green-700">{stats.approved}</h3>
                </div>
                <CalendarCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Hoàn thành</p>
                  <h3 className="text-2xl font-bold mt-1 text-blue-700">{stats.completed}</h3>
                </div>
                <CheckCircle2 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Đã hủy</p>
                  <h3 className="text-2xl font-bold mt-1 text-red-700">{stats.cancelled}</h3>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo nội dung, dịch vụ, nhân viên..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="PENDING">Chờ xác nhận</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="COMPLETED">Hoàn thành</SelectItem>
                <SelectItem value="CANCELLED">Đã hủy</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'newest' | 'oldest')}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Consultations List */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredConsultations.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <Calendar className="relative h-20 w-20 mx-auto text-primary mb-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Không tìm thấy lịch tư vấn</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery || (statusFilter && statusFilter !== 'all')
                  ? 'Thử thay đổi bộ lọc để xem kết quả khác'
                  : 'Bạn chưa có lịch tư vấn nào. Đặt lịch ngay để nhận tư vấn từ chuyên gia!'}
              </p>
              <Link to="/contact">
                <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-5 w-5 mr-2" />
                  Đặt lịch tư vấn ngay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <Card
              key={consultation.id}
              className="hover:shadow-lg transition-all group border-l-4"
              style={{
                borderLeftColor:
                  consultation.status === 'PENDING' ? '#f59e0b' :
                  consultation.status === 'APPROVED' ? '#10b981' :
                  consultation.status === 'COMPLETED' ? '#3b82f6' : '#ef4444'
              }}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      {getStatusBadge(consultation.status)}
                      {consultation.service && (
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">📋</span>
                          {consultation.service.name}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl flex items-start gap-3">
                      <Calendar className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold">
                          {format(new Date(consultation.requestedDatetime), 'EEEE, dd MMMM yyyy', {
                            locale: vi,
                          })}
                        </div>
                        <div className="text-base text-muted-foreground font-normal">
                          <Clock className="inline h-4 w-4 mr-1" />
                          {format(new Date(consultation.requestedDatetime), 'HH:mm', {
                            locale: vi,
                          })}
                        </div>
                      </div>
                    </CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {canCancel(consultation.status) && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancelClick(consultation.id)}
                        className="shadow-sm hover:shadow-md transition-all"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Hủy lịch
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h4 className="font-semibold text-sm mb-2 text-primary">📝 Nội dung tư vấn:</h4>
                  <p className="text-muted-foreground leading-relaxed">{consultation.content}</p>
                </div>

                {consultation.staff && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="bg-green-100 p-2 rounded-full">
                      <User2 className="h-5 w-5 text-green-700" />
                    </div>
                    <div>
                      <p className="text-xs text-green-700 font-medium">Nhân viên phụ trách</p>
                      <p className="font-semibold text-green-900">{consultation.staff.fullName}</p>
                    </div>
                  </div>
                )}

                {consultation.notes && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-sm mb-2 text-blue-700">💬 Ghi chú từ nhân viên:</h4>
                    <p className="text-blue-900 text-sm leading-relaxed">{consultation.notes}</p>
                  </div>
                )}

                {consultation.cancelReason && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-semibold text-sm mb-2 text-red-700">❌ Lý do hủy:</h4>
                    <p className="text-red-900 text-sm leading-relaxed">{consultation.cancelReason}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                  <Clock className="h-3 w-3" />
                  <span>Đã tạo: {format(new Date(consultation.createdAt), 'dd/MM/yyyy HH:mm')}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cancel Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Hủy lịch tư vấn</DialogTitle>
            <DialogDescription>
              Vui lòng cho chúng tôi biết lý do bạn muốn hủy lịch tư vấn này.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Nhập lý do hủy lịch..."
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
              className="flex-1 sm:flex-none"
            >
              Đóng
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelConfirm}
              disabled={!cancelReason.trim() || cancelMutation.isPending}
              className="flex-1 sm:flex-none"
            >
              {cancelMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyConsultations;
