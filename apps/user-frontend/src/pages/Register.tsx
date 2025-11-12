import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Scale, Eye, EyeOff, CheckCircle, CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  registerSchema,
  type RegisterFormData,
  calculatePasswordStrength,
  getPasswordStrengthLabel,
  getPasswordStrengthColor,
} from "@/schemas/auth.schema";
import { useAuth } from "@/contexts/AuthContext";

const Register = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    control,
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      agreeToTerms: false,
      agreeToMarketing: false,
    },
  });

  const password = watch("password");
  const agreeToTerms = watch("agreeToTerms");
  const agreeToMarketing = watch("agreeToMarketing");
  const passwordStrength = password ? calculatePasswordStrength(password) : 0;

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      // Format the date to ISO string for backend
      const formattedData = {
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        phone: data.phone,
        dateOfBirth: format(data.dateOfBirth, "yyyy-MM-dd"),
      };

      await registerUser(formattedData);

      toast.success("Đăng ký thành công!", {
        description: "Chào mừng bạn đến với Vinh Xuân. Hãy khám phá các dịch vụ của chúng tôi.",
      });

      // Reset form
      reset();

      // Redirect to dashboard or home page
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);

      // Handle different error types
      const errorMessage =
        error?.response?.data?.message || error?.message || "Đăng ký thất bại";

      toast.error("Đăng ký thất bại", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    "Quản lý hồ sơ công chứng toàn diện",
    "Tính phí công chứng tự động",
    "Đặt lịch tư vấn trực tuyến",
    "Tra cứu hồ sơ nhanh chóng",
    "Thông báo qua email và SMS",
    "Hỗ trợ 24/7",
  ];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Benefits */}
        <div className="hidden lg:flex bg-gradient-hero text-primary-foreground p-12 items-center">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-2 mb-8">
              <Scale className="h-8 w-8 text-accent" />
              <span className="font-sans font-bold text-2xl">Vinh Xuân</span>
            </div>

            <h2 className="font-sans text-3xl font-bold mb-6">
              Dịch vụ Công chứng Chuyên nghiệp
            </h2>

            <p className="text-lg text-primary-foreground/90 mb-8">
              Tham gia cùng hàng nghìn khách hàng tin tưởng sử dụng dịch vụ công chứng của Vinh Xuân.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                  <span className="text-primary-foreground/90">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-primary-foreground/10 rounded-lg">
              <p className="text-sm text-primary-foreground/80">
                "Vinh Xuân đã giúp chúng tôi tiết kiệm rất nhiều thời gian trong việc xử lý hồ sơ công chứng."
              </p>
              <p className="text-sm font-medium mt-2">- Nguyễn Văn A, Khách hàng</p>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="text-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center space-x-2">
                <Scale className="h-8 w-8 text-accent" />
                <span className="font-sans font-bold text-2xl text-primary">Vinh Xuân</span>
              </Link>
            </div>

            <Card className="bg-card border-0 shadow-elegant">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center">Tạo tài khoản</CardTitle>
                <CardDescription className="text-center">
                  Đăng ký để sử dụng dịch vụ công chứng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      placeholder="Nguyễn Văn A"
                      disabled={isLoading}
                      {...register("fullName")}
                      className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500 mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Địa chỉ Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@example.com"
                      disabled={isLoading}
                      {...register("email")}
                      className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0912345678"
                      disabled={isLoading}
                      {...register("phone")}
                      className={errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  {/* Date of Birth Field */}
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Ngày sinh <span className="text-red-500">*</span>
                    </Label>
                    <Controller
                      control={control}
                      name="dateOfBirth"
                      render={({ field }) => (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                                errors.dateOfBirth && "border-red-500 focus-visible:ring-red-500"
                              )}
                              disabled={isLoading}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP", { locale: vi })
                              ) : (
                                <span>Chọn ngày sinh</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1900-01-01")
                              }
                              initialFocus
                              captionLayout="dropdown-buttons"
                              fromYear={1900}
                              toYear={new Date().getFullYear()}
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    />
                    {errors.dateOfBirth && (
                      <p className="text-sm text-red-500 mt-1">{errors.dateOfBirth.message}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Tạo mật khẩu mạnh"
                        disabled={isLoading}
                        {...register("password")}
                        className={
                          errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {password && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Độ mạnh mật khẩu:
                          </span>
                          <span className="text-xs font-medium">
                            {getPasswordStrengthLabel(passwordStrength)}
                          </span>
                        </div>
                        <Progress
                          value={(passwordStrength / 4) * 100}
                          className="h-2"
                          indicatorClassName={getPasswordStrengthColor(passwordStrength)}
                        />
                      </div>
                    )}
                    {errors.password && (
                      <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Xác nhận mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Nhập lại mật khẩu"
                        disabled={isLoading}
                        {...register("confirmPassword")}
                        className={
                          errors.confirmPassword
                            ? "border-red-500 focus-visible:ring-red-500 pr-10"
                            : "pr-10"
                        }
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                      </Button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  {/* Terms and Marketing Checkboxes */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreeToTerms}
                        onCheckedChange={(checked) =>
                          setValue("agreeToTerms", checked as boolean, { shouldValidate: true })
                        }
                        disabled={isLoading}
                        className={errors.agreeToTerms ? "border-red-500" : ""}
                      />
                      <div className="space-y-1">
                        <Label htmlFor="terms" className="text-sm leading-5 cursor-pointer">
                          Tôi đồng ý với{" "}
                          <Link to="/terms" className="text-accent hover:text-accent-light">
                            Điều khoản dịch vụ
                          </Link>{" "}
                          và{" "}
                          <Link to="/privacy" className="text-accent hover:text-accent-light">
                            Chính sách bảo mật
                          </Link>{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        {errors.agreeToTerms && (
                          <p className="text-sm text-red-500">{errors.agreeToTerms.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="marketing"
                        checked={agreeToMarketing}
                        onCheckedChange={(checked) =>
                          setValue("agreeToMarketing", checked as boolean)
                        }
                        disabled={isLoading}
                      />
                      <Label htmlFor="marketing" className="text-sm leading-5 cursor-pointer">
                        Tôi muốn nhận thông tin về sản phẩm, dịch vụ và tin tức pháp lý
                      </Label>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    variant="accent"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang đăng ký...
                      </>
                    ) : (
                      "Đăng ký"
                    )}
                  </Button>
                </form>

                <div className="text-center mt-6">
                  <p className="text-sm text-muted-foreground">
                    Đã có tài khoản?{" "}
                    <Link
                      to="/login"
                      className="text-accent hover:text-accent-light font-medium transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <p className="text-xs text-muted-foreground">
                Miễn phí • Không cần thẻ tín dụng • Hủy bất cứ lúc nào
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
