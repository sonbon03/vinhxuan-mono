/**
 * Profile Page
 * Shows and allows editing of user profile information
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  User2,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Edit,
  Save,
  X,
  Loader2,
  CheckCircle2,
  Shield,
  Clock,
  UserCircle,
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import apiClient from '@/services/api.client';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  dateOfBirth: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      fullName: user?.fullName || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth ? format(new Date(user.dateOfBirth), 'yyyy-MM-dd') : '',
    });
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSaving(true);
    try {
      const payload = {
        fullName: data.fullName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || undefined,
      };

      const response = await apiClient.patch(`/users/${user?.id}`, payload);

      // Update localStorage with the new user data
      const updatedUser = {
        ...user,
        fullName: data.fullName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth || user?.dateOfBirth,
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Cập nhật thành công', {
        description: 'Thông tin của bạn đã được cập nhật.',
      });

      // Refresh user from localStorage
      refreshUser();
      setIsEditing(false);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Cập nhật thất bại. Vui lòng thử lại.';
      toast.error('Lỗi', {
        description: message,
      });
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const memberSince = format(new Date(), 'MMMM yyyy');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Hồ sơ cá nhân</h1>
        <p className="text-muted-foreground text-lg">
          Quản lý và cập nhật thông tin tài khoản của bạn
        </p>
      </div>

      {/* Profile Hero Section */}
      <Card className="border-2 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-28 w-28 border-4 border-background shadow-xl ring-4 ring-primary/20">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-3xl font-bold">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 h-7 w-7 bg-green-500 border-4 border-background rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <h2 className="text-3xl font-bold">{user?.fullName}</h2>
                  <p className="text-muted-foreground flex items-center gap-2 mt-1">
                    <Mail className="h-4 w-4" />
                    {user?.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    <Shield className="h-3 w-3 mr-1.5" />
                    {user?.role === 'CUSTOMER' ? 'Khách hàng' : user?.role}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-sm px-3 py-1 bg-green-50 text-green-700 border-green-200"
                  >
                    <CheckCircle2 className="h-3 w-3 mr-1.5" />
                    Đang hoạt động
                  </Badge>
                </div>
              </div>
            </div>
            {!isEditing && (
              <Button
                onClick={handleEdit}
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow"
              >
                <Edit className="h-4 w-4 mr-2" />
                Chỉnh sửa hồ sơ
              </Button>
            )}
          </div>
        </div>

        <Separator />

        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-3">
                <Label
                  htmlFor="fullName"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <User2 className="h-4 w-4 text-primary" />
                  Họ và tên
                </Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      id="fullName"
                      {...register('fullName')}
                      placeholder="Nhập họ và tên"
                      className="h-11"
                    />
                    {errors.fullName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.fullName.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-base font-medium">{user?.fullName || 'Chưa cập nhật'}</p>
                  </div>
                )}
              </div>

              {/* Email (Read-only) */}
              <div className="space-y-3">
                <Label className="text-base font-semibold flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  Email
                </Label>
                <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border/50">
                  <p className="text-base font-medium text-muted-foreground">{user?.email}</p>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  Email không thể thay đổi
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <Label htmlFor="phone" className="text-base font-semibold flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Số điện thoại
                </Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      id="phone"
                      {...register('phone')}
                      placeholder="Nhập số điện thoại"
                      type="tel"
                      className="h-11"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-base font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-3">
                <Label
                  htmlFor="dateOfBirth"
                  className="text-base font-semibold flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4 text-primary" />
                  Ngày sinh
                </Label>
                {isEditing ? (
                  <div className="space-y-2">
                    <Input
                      id="dateOfBirth"
                      {...register('dateOfBirth')}
                      type="date"
                      className="h-11"
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        {errors.dateOfBirth.message}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="px-4 py-3 rounded-lg bg-muted/50 border border-border/50">
                    <p className="text-base font-medium">
                      {user?.dateOfBirth
                        ? format(new Date(user.dateOfBirth), 'dd/MM/yyyy')
                        : 'Chưa cập nhật'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <>
                <Separator />
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                    size="lg"
                    className="sm:min-w-[120px]"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={!isDirty || isSaving}
                    size="lg"
                    className="sm:min-w-[160px] shadow-md hover:shadow-lg transition-shadow"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Lưu thay đổi
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Account Status */}
        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trạng thái tài khoản
              </CardTitle>
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Badge
                variant="default"
                className="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1.5"
              >
                Đang hoạt động
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Member Since */}
        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Thành viên từ
              </CardTitle>
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <p className="text-2xl font-bold">{memberSince}</p>
            </div>
          </CardContent>
        </Card>

        {/* Role */}
        <Card className="border-2 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">Vai trò</CardTitle>
              <UserCircle className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Badge variant="secondary" className="text-sm px-3 py-1.5">
                {user?.role === 'CUSTOMER' ? 'Khách hàng' : user?.role}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Avatar Upload Section */}
      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCircle className="h-5 w-5" />
            Ảnh đại diện
          </CardTitle>
          <CardDescription>Tải lên ảnh đại diện của bạn để cá nhân hóa tài khoản</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-6 rounded-lg bg-muted/30 border-2 border-dashed border-muted-foreground/20">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg ring-2 ring-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-4xl font-bold">
                {user?.fullName?.charAt(0).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="font-semibold mb-1">Cập nhật ảnh đại diện</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tải lên một hình ảnh JPG, PNG hoặc GIF (tối đa 5MB)
                </p>
              </div>
              <Button variant="outline" disabled className="w-full sm:w-auto">
                Tải ảnh lên
              </Button>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Tính năng đang được phát triển
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
