/**
 * Settings Page
 * Allows users to manage account settings, security, notifications, and privacy
 */

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Shield, Bell, Lock, Trash2, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services';

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu hiện tại'),
    newPassword: z
      .string()
      .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số'),
    confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu mới'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const Settings = () => {
  const { user, logout } = useAuth();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Notification settings (stored in local state for now)
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [browserNotifications, setBrowserNotifications] = useState(true);

  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [contactVisibility, setContactVisibility] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsChangingPassword(true);
    try {
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });

      toast.success('Đổi mật khẩu thành công', {
        description: 'Mật khẩu của bạn đã được cập nhật.',
      });

      reset();
    } catch (error: any) {
      const message =
        error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.';
      toast.error('Lỗi', {
        description: message,
      });
      console.error('Change password error:', error);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = () => {
    // This would be implemented with actual API call
    toast.error('Tính năng đang phát triển', {
      description: 'Chức năng xóa tài khoản đang được phát triển.',
    });
    setDeleteDialogOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Cài đặt</h1>
        <p className="text-muted-foreground mt-1">Quản lý cài đặt tài khoản và bảo mật</p>
      </div>

      <Tabs defaultValue="security" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="security">Bảo mật</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          <TabsTrigger value="privacy">Quyền riêng tư</TabsTrigger>
        </TabsList>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Đổi mật khẩu
              </CardTitle>
              <CardDescription>
                Cập nhật mật khẩu của bạn để bảo mật tài khoản
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onPasswordSubmit)} className="space-y-4">
                {/* Old Password */}
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Mật khẩu hiện tại</Label>
                  <div className="relative">
                    <Input
                      id="oldPassword"
                      type={showOldPassword ? 'text' : 'password'}
                      {...register('oldPassword')}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.oldPassword && (
                    <p className="text-sm text-destructive">{errors.oldPassword.message}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...register('newPassword')}
                      placeholder="Nhập mật khẩu mới"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword.message}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" disabled={isChangingPassword}>
                  {isChangingPassword ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Đổi mật khẩu
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quản lý tài khoản</CardTitle>
              <CardDescription>Các hành động liên quan đến tài khoản</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">Trạng thái tài khoản</h4>
                  <p className="text-sm text-muted-foreground">Tài khoản đang hoạt động</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                <div>
                  <h4 className="font-medium text-destructive">Xóa tài khoản</h4>
                  <p className="text-sm text-muted-foreground">
                    Hành động này không thể hoàn tác
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Xóa tài khoản
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý các thông báo bạn muốn nhận
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Thông báo qua Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo về lịch tư vấn và tin đăng qua email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notifications">Thông báo qua SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo quan trọng qua tin nhắn SMS
                  </p>
                </div>
                <Switch
                  id="sms-notifications"
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="browser-notifications">Thông báo trên trình duyệt</Label>
                  <p className="text-sm text-muted-foreground">
                    Nhận thông báo ngay trên trình duyệt
                  </p>
                </div>
                <Switch
                  id="browser-notifications"
                  checked={browserNotifications}
                  onCheckedChange={setBrowserNotifications}
                />
              </div>

              <Button onClick={() => toast.success('Đã lưu cài đặt thông báo')}>
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quyền riêng tư</CardTitle>
              <CardDescription>
                Kiểm soát ai có thể xem thông tin của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visibility">Hiển thị hồ sơ công khai</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác xem hồ sơ của bạn
                  </p>
                </div>
                <Switch
                  id="profile-visibility"
                  checked={profileVisibility}
                  onCheckedChange={setProfileVisibility}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="contact-visibility">Hiển thị thông tin liên hệ</Label>
                  <p className="text-sm text-muted-foreground">
                    Cho phép người khác xem số điện thoại và email của bạn
                  </p>
                </div>
                <Switch
                  id="contact-visibility"
                  checked={contactVisibility}
                  onCheckedChange={setContactVisibility}
                />
              </div>

              <Button onClick={() => toast.success('Đã lưu cài đặt quyền riêng tư')}>
                Lưu cài đặt
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa tài khoản?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả dữ liệu của bạn bao gồm lịch tư vấn,
              tin đăng sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-destructive hover:bg-destructive/90"
            >
              Xóa tài khoản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Settings;
