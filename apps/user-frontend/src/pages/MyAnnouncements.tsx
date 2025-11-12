/**
 * My Announcements Page - Enhanced
 * Shows user's announcement listings with stats, filtering, and beautiful UI
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useMyListings, useDeleteListing } from '@/hooks/useListings';
import {
  Megaphone, Plus, Search, Heart, Trash2, Edit, Loader2, Calendar,
  Eye, MessageSquare, CheckCircle2, XCircle, AlertCircle, TrendingUp
} from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { useDebounce } from '@/hooks/useDebounce';

const MyAnnouncements = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostLiked'>('newest');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<string | null>(null);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch listings
  const { data, isLoading } = useMyListings({
    page: 1,
    limit: 100,
  });

  const deleteMutation = useDeleteListing();

  const listings = data?.data?.items || [];

  // Calculate statistics
  const stats = {
    total: listings.length,
    pending: listings.filter((l) => l.status === 'PENDING').length,
    approved: listings.filter((l) => l.status === 'APPROVED').length,
    rejected: listings.filter((l) => l.status === 'REJECTED').length,
    totalLikes: listings.reduce((sum, l) => sum + (l._count?.likes || 0), 0),
    totalComments: listings.reduce((sum, l) => sum + (l._count?.comments || 0), 0),
  };

  // Filter and sort
  const filteredListings = listings
    .filter((listing) => {
      if (statusFilter !== 'all' && listing.status !== statusFilter) return false;
      if (!debouncedSearch) return true;
      const searchLower = debouncedSearch.toLowerCase();
      return (
        listing.title.toLowerCase().includes(searchLower) ||
        listing.content.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return (b._count?.likes || 0) - (a._count?.likes || 0);
      }
    });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }
    > = {
      PENDING: { label: 'Chờ duyệt', variant: 'secondary', color: 'bg-amber-50 text-amber-700 border-amber-200' },
      APPROVED: { label: 'Đã duyệt', variant: 'default', color: 'bg-green-50 text-green-700 border-green-200' },
      REJECTED: { label: 'Bị từ chối', variant: 'destructive', color: 'bg-red-50 text-red-700 border-red-200' },
    };

    const config = statusConfig[status] || { label: status, variant: 'outline', color: '' };
    return (
      <Badge variant={config.variant} className={`text-xs ${config.color} border`}>
        {config.label}
      </Badge>
    );
  };

  const handleDeleteClick = (id: string) => {
    setSelectedListing(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedListing) return;

    await deleteMutation.mutateAsync(selectedListing);
    setDeleteDialogOpen(false);
    setSelectedListing(null);
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Tin đăng của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý và theo dõi tất cả tin đăng bất động sản</p>
        </div>
        <Link to="/announcements">
          <Button className="shadow-md hover:shadow-lg transition-all">
            <Plus className="h-4 w-4 mr-2" />
            Đăng tin mới
          </Button>
        </Link>
      </div>

      {/* Statistics Cards */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="hover:shadow-md transition-shadow border-2">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tổng số</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </div>
                <Megaphone className="h-8 w-8 text-primary/60" />
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
                <CheckCircle2 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Bị từ chối</p>
                  <h3 className="text-2xl font-bold mt-1 text-red-700">{stats.rejected}</h3>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-pink-700">Lượt thích</p>
                  <h3 className="text-2xl font-bold mt-1 text-pink-700">{stats.totalLikes}</h3>
                </div>
                <Heart className="h-8 w-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-2 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">Bình luận</p>
                  <h3 className="text-2xl font-bold mt-1 text-purple-700">{stats.totalComments}</h3>
                </div>
                <MessageSquare className="h-8 w-8 text-purple-500" />
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
                placeholder="Tìm kiếm theo tiêu đề, nội dung..."
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
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="APPROVED">Đã duyệt</SelectItem>
                <SelectItem value="REJECTED">Bị từ chối</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="oldest">Cũ nhất</SelectItem>
                <SelectItem value="mostLiked">Nhiều lượt thích nhất</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Listings Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-96 w-full rounded-xl" />
          ))}
        </div>
      ) : filteredListings.length === 0 ? (
        <Card className="shadow-md">
          <CardContent className="py-16">
            <div className="text-center">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
                <Megaphone className="relative h-20 w-20 mx-auto text-primary mb-6" />
              </div>
              <h3 className="text-2xl font-semibold mb-2">Không tìm thấy tin đăng</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {searchQuery || (statusFilter && statusFilter !== 'all')
                  ? 'Thử thay đổi bộ lọc để xem kết quả khác'
                  : 'Bạn chưa có tin đăng nào. Đăng tin ngay để bắt đầu!'}
              </p>
              <Link to="/announcements">
                <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
                  <Plus className="h-5 w-5 mr-2" />
                  Đăng tin mới ngay
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-xl transition-all group overflow-hidden border-2">
              <CardContent className="p-0">
                {/* Image placeholder or first image */}
                <div className="aspect-video bg-gradient-to-br from-primary/10 via-primary/5 to-primary/20 flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform">
                  {listing.images && listing.images.length > 0 ? (
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Megaphone className="h-16 w-16 text-primary/40" />
                  )}
                  <div className="absolute top-3 left-3">{getStatusBadge(listing.status)}</div>
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold">
                    {listing.price.toLocaleString('vi-VN')} ₫
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {/* Title */}
                  <h3 className="font-bold text-lg line-clamp-2 group-hover:text-primary transition-colors min-h-[3.5rem]">
                    {listing.title}
                  </h3>

                  {/* Category */}
                  {listing.category && (
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        <span className="mr-1">🏷️</span>
                        {listing.category.name}
                      </Badge>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5 hover:text-pink-600 transition-colors">
                        <Heart className="h-4 w-4" />
                        <span className="font-semibold">{listing._count?.likes || 0}</span>
                      </span>
                      <span className="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-semibold">{listing._count?.comments || 0}</span>
                      </span>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(listing.createdAt), 'dd/MM/yyyy')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 hover:bg-primary/10 hover:text-primary hover:border-primary transition-all"
                      disabled={listing.status === 'REJECTED'}
                    >
                      <Edit className="h-3 w-3 mr-1.5" />
                      Sửa
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex-1 hover:shadow-md transition-all"
                      onClick={() => handleDeleteClick(listing.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      Xóa
                    </Button>
                  </div>

                  {/* Rejection reason if applicable */}
                  {listing.status === 'REJECTED' && listing.reviewNotes && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-3">
                      <p className="text-xs text-red-700 font-medium mb-1">Lý do từ chối:</p>
                      <p className="text-xs text-red-900">{listing.reviewNotes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa tin đăng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa tin đăng này? Hành động này không thể hoàn tác và mọi dữ liệu liên quan sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteMutation.isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MyAnnouncements;
