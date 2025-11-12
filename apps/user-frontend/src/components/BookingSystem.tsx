import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Video,
  MapPin,
  ArrowLeft,
  ArrowRight,
  X,
  Briefcase,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateConsultation } from "@/hooks/useConsultations";
import { transformConsultationData } from "@/utils/consultation.utils";
import { consultationSchema, step1Schema, step2Schema, step3Schema, step4Schema } from "@/schemas/consultation.schema";
import { toast as sonnerToast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  consultationType: string;
  legalArea: string;
  preferredDate: string;
  preferredTime: string;
  meetingType: string;
  description: string;
  documents: File[];
}

const BookingSystem = () => {
  const { toast } = useToast();
  const { isAuthenticated, user } = useAuth();
  const createConsultation = useCreateConsultation();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [bookingData, setBookingData] = useState<BookingData>({
    fullName: '',
    email: '',
    phone: '',
    consultationType: '',
    legalArea: '',
    preferredDate: '',
    preferredTime: '',
    meetingType: '',
    description: '',
    documents: []
  });

  // Pre-fill user data if logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setBookingData(prev => ({
        ...prev,
        fullName: user.fullName || '',
        email: user.email || '',
        phone: user.phone || ''
      }));
    }
  }, [isAuthenticated, user]);

  const consultationTypes = [
    { value: "free-consultation", label: "Tư vấn miễn phí (30 phút)", duration: "30 phút", price: "Miễn phí" },
    { value: "standard-consultation", label: "Tư vấn chuẩn (60 phút)", duration: "60 phút", price: "500,000 VNĐ" },
    { value: "premium-consultation", label: "Tư vấn chuyên sâu (90 phút)", duration: "90 phút", price: "800,000 VNĐ" },
    { value: "legal-review", label: "Xem xét tài liệu pháp lý", duration: "45 phút", price: "600,000 VNĐ" }
  ];

  const legalAreas = [
    { value: "corporate", label: "Luật Doanh nghiệp", icon: "🏢" },
    { value: "family", label: "Luật Gia đình", icon: "👨‍👩‍👧‍👦" },
    { value: "real-estate", label: "Bất động sản", icon: "🏠" },
    { value: "criminal", label: "Luật Hình sự", icon: "⚖️" },
    { value: "labor", label: "Luật Lao động", icon: "👷" },
    { value: "immigration", label: "Xuất nhập cảnh", icon: "✈️" },
    { value: "intellectual", label: "Sở hữu trí tuệ", icon: "💡" },
    { value: "other", label: "Khác", icon: "📋" }
  ];

  const meetingTypes = [
    { value: "office", label: "Tại văn phòng", icon: <MapPin className="w-4 h-4" />, description: "123 Nguyễn Huệ, Q1, TP.HCM" },
    { value: "video", label: "Video call", icon: <Video className="w-4 h-4" />, description: "Zoom/Google Meet" },
    { value: "phone", label: "Điện thoại", icon: <Phone className="w-4 h-4" />, description: "Cuộc gọi trực tiếp" }
  ];

  // Generate next 14 days
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          display: date.toLocaleDateString('vi-VN', { 
            weekday: 'short', 
            day: '2-digit', 
            month: '2-digit' 
          })
        });
      }
    }
    return dates;
  };

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"
  ];

  const handleInputChange = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'];
      return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "File không hợp lệ",
        description: "Chỉ chấp nhận PDF, Word, JPG, PNG dưới 10MB.",
        variant: "destructive"
      });
    }

    setBookingData(prev => ({
      ...prev,
      documents: [...prev.documents, ...validFiles]
    }));
  };

  const removeFile = (index: number) => {
    setBookingData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    handleInputChange('preferredDate', date);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    handleInputChange('preferredTime', time);
  };

  const validateCurrentStep = (): boolean => {
    setValidationErrors({});

    try {
      switch (currentStep) {
        case 1:
          step1Schema.parse(bookingData);
          break;
        case 2:
          step2Schema.parse(bookingData);
          break;
        case 3:
          step3Schema.parse(bookingData);
          break;
        case 4:
          step4Schema.parse(bookingData);
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setValidationErrors(errors);

        // Show first error in toast
        const firstError = error.errors[0];
        sonnerToast.error('Lỗi xác thực', {
          description: firstError.message,
        });
      }
      return false;
    }
  };

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = async () => {
    // Check authentication first
    if (!isAuthenticated) {
      sonnerToast.error('Vui lòng đăng nhập', {
        description: 'Bạn cần đăng nhập để đặt lịch tư vấn',
        action: {
          label: 'Đăng nhập',
          onClick: () => navigate('/login?returnUrl=/contact'),
        },
      });
      return;
    }

    // Validate entire form
    try {
      consultationSchema.parse(bookingData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        sonnerToast.error('Lỗi xác thực', {
          description: firstError.message,
        });
      }
      return;
    }

    try {
      // Transform data for API
      const apiData = transformConsultationData(bookingData);

      // Show info about documents if any
      if (bookingData.documents.length > 0) {
        sonnerToast.info('Tài liệu đính kèm', {
          description: `Bạn đã chọn ${bookingData.documents.length} tài liệu. Vui lòng gửi tài liệu qua email sau khi đặt lịch.`,
          duration: 4000,
        });
      }

      // Call API
      await createConsultation.mutateAsync(apiData);

      // Reset form on success
      setCurrentStep(1);
      setSelectedDate("");
      setSelectedTime("");
      setBookingData({
        fullName: user?.fullName || '',
        email: user?.email || '',
        phone: user?.phone || '',
        consultationType: '',
        legalArea: '',
        preferredDate: '',
        preferredTime: '',
        meetingType: '',
        description: '',
        documents: []
      });
      setValidationErrors({});

    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Consultation booking error:', error);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return bookingData.fullName && bookingData.email && bookingData.phone;
      case 2:
        return bookingData.consultationType && bookingData.legalArea;
      case 3:
        return bookingData.preferredDate && bookingData.preferredTime && bookingData.meetingType;
      case 4:
        return bookingData.description;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Thông tin liên hệ</h3>
              <p className="text-muted-foreground">Vui lòng cung cấp thông tin để chúng tôi liên hệ</p>
            </div>

            {!isAuthenticated && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  Bạn cần{' '}
                  <Link to="/login?returnUrl=/contact" className="font-medium underline hover:text-amber-900">
                    đăng nhập
                  </Link>
                  {' '}để đặt lịch tư vấn. Thông tin của bạn sẽ được điền sẵn sau khi đăng nhập.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Họ và tên *</label>
                <Input
                  value={bookingData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  className={cn(
                    "border-2 focus:border-accent h-12",
                    validationErrors.fullName && "border-red-500"
                  )}
                />
                {validationErrors.fullName && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Email *</label>
                <Input
                  type="email"
                  value={bookingData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@example.com"
                  className={cn(
                    "border-2 focus:border-accent h-12",
                    validationErrors.email && "border-red-500"
                  )}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Số điện thoại *</label>
                <Input
                  type="tel"
                  value={bookingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0901 234 567"
                  className={cn(
                    "border-2 focus:border-accent h-12",
                    validationErrors.phone && "border-red-500"
                  )}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.phone}</p>
                )}
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Loại tư vấn</h3>
              <p className="text-muted-foreground">Chọn gói tư vấn phù hợp với nhu cầu</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Chọn gói tư vấn *</label>
                <div className="grid gap-3">
                  {consultationTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => handleInputChange('consultationType', type.value)}
                      className={cn(
                        "p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md",
                        bookingData.consultationType === type.value
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">Thời gian: {type.duration}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-accent">{type.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Lĩnh vực pháp lý *</label>
                <div className="grid grid-cols-2 gap-3">
                  {legalAreas.map((area) => (
                    <div
                      key={area.value}
                      onClick={() => handleInputChange('legalArea', area.value)}
                      className={cn(
                        "p-3 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md text-center",
                        bookingData.legalArea === area.value
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="text-2xl mb-1">{area.icon}</div>
                      <div className="text-sm font-medium">{area.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Chọn lịch hẹn</h3>
              <p className="text-muted-foreground">Chọn ngày, giờ và hình thức tư vấn</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Chọn ngày *</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {generateAvailableDates().map((dateObj) => (
                    <button
                      key={dateObj.date}
                      onClick={() => handleDateSelect(dateObj.date)}
                      className={cn(
                        "p-3 border-2 rounded-xl text-sm font-medium transition-all hover:shadow-md",
                        selectedDate === dateObj.date
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {dateObj.display}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Chọn giờ *</label>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => handleTimeSelect(time)}
                      className={cn(
                        "p-2 border-2 rounded-lg text-sm font-medium transition-all hover:shadow-md",
                        selectedTime === time
                          ? "border-accent bg-accent text-accent-foreground"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-3 block">Hình thức tư vấn *</label>
                <div className="space-y-3">
                  {meetingTypes.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => handleInputChange('meetingType', type.value)}
                      className={cn(
                        "p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md",
                        bookingData.meetingType === type.value
                          ? "border-accent bg-accent/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="text-accent">{type.icon}</div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{type.label}</div>
                          <div className="text-sm text-gray-600">{type.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-primary mb-2">Chi tiết & Tài liệu</h3>
              <p className="text-muted-foreground">Mô tả vấn đề và tải lên tài liệu liên quan</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Mô tả vấn đề cần tư vấn *</label>
                <Textarea
                  value={bookingData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Vui lòng mô tả chi tiết vấn đề pháp lý mà bạn cần tư vấn..."
                  className="border-2 focus:border-accent min-h-[120px] resize-none"
                  maxLength={1000}
                />
                <div className="text-xs text-muted-foreground text-right mt-1">
                  {bookingData.description.length}/1000 ký tự
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Tải lên tài liệu (nếu có)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-accent transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">Tải lên hợp đồng, giấy tờ pháp lý hoặc tài liệu liên quan</p>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="mb-2"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Chọn file
                  </Button>
                  <p className="text-xs text-gray-500">PDF, Word, JPG, PNG tối đa 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                
                {bookingData.documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {bookingData.documents.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                          <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-2xl border-0 overflow-hidden">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Đặt lịch tư vấn</CardTitle>
              <p className="text-white/80 text-sm">Bước {currentStep} / 4</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            {currentStep === 1 && "Thông tin"}
            {currentStep === 2 && "Loại tư vấn"}
            {currentStep === 3 && "Lịch hẹn"}
            {currentStep === 4 && "Chi tiết"}
          </Badge>
        </div>
      </CardHeader>

      {/* Progress Bar */}
      <div className="px-6 py-4 bg-gray-50">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center flex-1">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold",
                step <= currentStep 
                  ? "bg-accent text-white" 
                  : "bg-gray-200 text-gray-500"
              )}>
                {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
              </div>
              {step < 4 && (
                <div className={cn(
                  "flex-1 h-1 mx-3",
                  step < currentStep ? "bg-accent" : "bg-gray-200"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-6">
        {renderStep()}
      </CardContent>

      {/* Footer */}
      <div className="border-t bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              setCurrentStep(prev => Math.max(1, prev - 1));
              setValidationErrors({});
            }}
            disabled={currentStep === 1}
            className="text-muted-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>

          <Button
            onClick={currentStep === 4 ? handleSubmit : handleNext}
            disabled={!canProceed() || createConsultation.isPending}
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8"
          >
            {createConsultation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : currentStep === 4 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Xác nhận đặt lịch
              </>
            ) : (
              <>
                Tiếp theo
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BookingSystem;