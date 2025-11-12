import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { 
  FileText, 
  X, 
  Send, 
  Upload,
  CheckCircle,
  File,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useFloatingButtons } from "@/contexts/FloatingButtonsContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  company: string;
  experience: string;
  coverLetter: string;
  linkedIn: string;
}

const FloatingApplication = () => {
  const { toast } = useToast();
  const { setApplicationIsOpen } = useFloatingButtons();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const isMobile = useIsMobile();
  
  // Rating popup states
  const [showRatingDialog, setShowRatingDialog] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [formData, setFormData] = useState<ApplicationData>({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    experience: '',
    coverLetter: '',
    linkedIn: ''
  });

  const positions = [
    { value: "attorney", label: "Attorney" },
    { value: "paralegal", label: "Paralegal" },
    { value: "legal-assistant", label: "Legal Assistant" },
    { value: "law-clerk", label: "Law Clerk" },
    { value: "legal-secretary", label: "Legal Secretary" },
    { value: "compliance-officer", label: "Compliance Officer" },
    { value: "legal-counsel", label: "Legal Counsel" },
    { value: "other", label: "Other" }
  ];

  const experienceLevels = [
    { value: "entry", label: "Entry Level (0-2 years)" },
    { value: "mid", label: "Mid Level (3-5 years)" },
    { value: "senior", label: "Senior Level (6-10 years)" },
    { value: "expert", label: "Expert (10+ years)" }
  ];

  const handleInputChange = (field: keyof ApplicationData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      return validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024; // 5MB limit
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid Files",
        description: "Only PDF and Word documents under 5MB are allowed.",
        variant: "destructive"
      });
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Rating functions
  const handleRatingSubmit = () => {
    // Here you would typically send the rating and feedback to your backend
    console.log('Application Rating submitted:', { 
      rating, 
      feedback,
      applicationData: formData,
      timestamp: new Date().toISOString()
    });
    
    // Reset states and close dialog
    setRating(0);
    setFeedback("");
    setHoveredStar(0);
    setShowRatingDialog(false);
    
    // Show success message
    toast({
      title: "Cảm ơn bạn đã đánh giá!",
      description: "Phản hồi của bạn giúp chúng tôi cải thiện trải nghiệm ứng tuyển.",
    });
  };

  const handleCloseRating = () => {
    setRating(0);
    setFeedback("");
    setHoveredStar(0);
    setShowRatingDialog(false);
  };

  const handleSubmit = async () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Close application form first
      setIsOpen(false);
      setApplicationIsOpen(false);
      
      // Show rating dialog after a short delay
      setTimeout(() => {
        setShowRatingDialog(true);
      }, 500);
      
      // Reset form data
      setCurrentStep(1);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        position: '',
        company: '',
        experience: '',
        coverLetter: '',
        linkedIn: ''
      });
      setUploadedFiles([]);
    }, 2000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.email && formData.phone;
      case 2:
        return formData.position && formData.experience;
      case 3:
        return formData.coverLetter && uploadedFiles.length > 0;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Personal Information</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Tell us about yourself</p>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Full Name *</label>
              <Input
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="border-2 focus:border-accent text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Email Address *</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
                className="border-2 focus:border-accent text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Phone Number *</label>
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="(555) 123-4567"
                className="border-2 focus:border-accent text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Current Company</label>
              <Input
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Your current employer"
                className="border-2 focus:border-accent text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">LinkedIn Profile</label>
              <Input
                value={formData.linkedIn}
                onChange={(e) => handleInputChange('linkedIn', e.target.value)}
                placeholder="https://linkedin.com/in/yourprofile"
                className="border-2 focus:border-accent text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Professional Details</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Your career information</p>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Position Interested *</label>
              <Select value={formData.position} onValueChange={(value) => handleInputChange('position', value)}>
                <SelectTrigger className="border-2 focus:border-accent h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Select a position" />
                </SelectTrigger>
                <SelectContent>
                  {positions.map((position) => (
                    <SelectItem key={position.value} value={position.value}>
                      {position.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Experience Level *</label>
              <Select value={formData.experience} onValueChange={(value) => handleInputChange('experience', value)}>
                <SelectTrigger className="border-2 focus:border-accent h-9 sm:h-10 text-xs sm:text-sm">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-3 sm:space-y-4">
            <div className="text-center mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-semibold text-primary">Application Materials</h3>
              <p className="text-xs sm:text-sm text-muted-foreground">Upload your documents</p>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Cover Letter *</label>
              <Textarea
                value={formData.coverLetter}
                onChange={(e) => handleInputChange('coverLetter', e.target.value)}
                placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                className="border-2 focus:border-accent min-h-[80px] sm:min-h-[120px] resize-none text-xs sm:text-sm"
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right mt-1">
                {formData.coverLetter.length}/500 characters
              </div>
            </div>
            
            <div>
              <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2 block">Resume & Documents *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-6 text-center hover:border-accent transition-colors">
                <Upload className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-gray-400 mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">Upload your resume and any supporting documents</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="mb-1 sm:mb-2 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3"
                >
                  <File className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Choose Files
                </Button>
                <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-2 sm:mt-4 space-y-1 sm:space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-1.5 sm:p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-1 sm:space-x-2 min-w-0 flex-1">
                        <File className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-700 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0 ml-1"
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  if (isOpen) {
    if (isMobile) {
      return (
        <Sheet
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) setApplicationIsOpen(false);
          }}
        >
          <SheetContent side="bottom" className="p-0 h-[85vh] rounded-t-xl overflow-hidden">
            <Card className={cn(
              "w-full h-full flex flex-col border-0 shadow-none overflow-hidden",
              "bg-white"
            )}>
              <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold text-white">Apply Now</CardTitle>
                      <p className="text-xs text-white/80">Step {currentStep} of 3 • Quick Application</p>
                    </div>
                  </div>
                  {/* Hide minimize/close controls on mobile; Sheet provides close */}
                </div>
              </CardHeader>

              <div className="px-4 py-3 bg-background border-b">
                <div className="flex items-center space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        step <= currentStep 
                          ? "bg-accent text-white" 
                          : "bg-gray-200 text-gray-500"
                      )}>
                        {step < currentStep ? <CheckCircle className="w-4 h-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={cn(
                          "w-8 h-1 mx-2",
                          step < currentStep ? "bg-accent" : "bg-gray-200"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <CardContent className="flex-1 p-4 overflow-y-auto">
                {renderStep()}
              </CardContent>

              <div className="border-t border-border p-4 bg-background">
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="text-muted-foreground"
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-accent hover:bg-accent/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Application
                      </>
                    ) : (
                      'Next Step'
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </SheetContent>
        </Sheet>
      );
    }

      return (
        <div className={cn(
          "fixed bottom-2 right-2 z-50 animate-in slide-in-from-bottom-4 duration-300",
          "w-[calc(100vw-1rem)] max-w-md h-[85vh] max-h-[600px]",
          "sm:w-[420px] sm:h-[600px]",
          "sm:bottom-6 sm:right-6"
        )}>
        <Card className={cn(
          "w-full h-full flex flex-col border-0 shadow-2xl overflow-hidden backdrop-blur-md",
          "bg-white/95",
          "h-full"
        )}>
          <CardHeader className="bg-gradient-to-r from-primary to-accent text-white p-3 sm:p-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <CardTitle className="text-xs sm:text-sm font-semibold text-white">Apply Now</CardTitle>
                  <p className="text-xs text-white/80 hidden xs:block">Step {currentStep} of 3 • Quick Application</p>
                  <p className="text-xs text-white/80 xs:hidden">{currentStep}/3</p>
                </div>
              </div>
              <div className="flex items-center space-x-1">
                {/* <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                </Button> */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsOpen(false);
                    setApplicationIsOpen(false);
                  }}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-background border-b">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center">
                      <div className={cn(
                        "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        step <= currentStep 
                          ? "bg-accent text-white" 
                          : "bg-gray-200 text-gray-500"
                      )}>
                        {step < currentStep ? <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={cn(
                          "w-4 sm:w-8 h-1 mx-1 sm:mx-2",
                          step < currentStep ? "bg-accent" : "bg-gray-200"
                        )} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <CardContent className="flex-1 p-3 sm:p-4 overflow-y-auto">
                {renderStep()}
              </CardContent>

              <div className="border-t border-border p-3 sm:p-4 bg-background">
                <div className="flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                    disabled={currentStep === 1}
                    className="text-muted-foreground text-xs sm:text-sm px-2 sm:px-3"
                  >
                    Back
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!canProceed() || isSubmitting}
                    className="bg-accent hover:bg-accent/90 text-xs sm:text-sm px-2 sm:px-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Submitting...</span>
                        <span className="xs:hidden">...</span>
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Submit Application</span>
                        <span className="xs:hidden">Submit</span>
                      </>
                    ) : (
                      <>
                        <span className="hidden xs:inline">Next Step</span>
                        <span className="xs:hidden">Next</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-16 right-2 sm:bottom-20 sm:right-4 md:bottom-24 lg:bottom-28 md:right-6 z-40 group">
      <Button
        onClick={() => {
          setIsOpen(true);
          setApplicationIsOpen(true);
        }}
        className={cn(
          "h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 rounded-full shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-110"
        )}
      >
        <div className="relative">
          <FileText className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </div>
      </Button>
      
      {/* Tooltip */}
      <div className="absolute top-1/2 right-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none transform -translate-y-1/2 -translate-x-2">
        <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
          Ứng tuyển vị trí - Nộp hồ sơ ngay!
          <div className="absolute top-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-900 transform -translate-y-1/2"></div>
        </div>
      </div>
      
      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold text-primary">
              🎉 Gửi hồ sơ công chứng thành công!
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              Cảm ơn bạn tin tưởng và gửi hồ sơ công chứng. Chúng tôi sẽ xem xét và phản hồi trong vòng 48 giờ.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Success Message */}
            <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-2xl mb-2">✅</div>
              <p className="text-green-700 font-medium">
                Hồ sơ công chứng đã được gửi thành công!
              </p>
              <p className="text-green-600 text-sm mt-1">
                Chúng tôi sẽ liên hệ với bạn sớm nhất có thể
              </p>
            </div>

            {/* Rating Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700">
                Đánh giá trải nghiệm apply hồ sơ công chứng trực tuyến:
              </Label>
              
              {/* Star Rating */}
              <div className="flex justify-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="transition-transform duration-200 hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors duration-200 ${
                        star <= (hoveredStar || rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              
              {/* Rating Text */}
              <p className="text-center text-sm text-gray-600">
                {rating === 0 && "Nhấn vào sao để đánh giá"}
                {rating === 1 && "😞 Rất ít tin cậy"}
                {rating === 2 && "😐 Hơi không ổn"}
                {rating === 3 && "😊 Ổn"}
                {rating === 4 && "😄 Rất ổn"}
                {rating === 5 && "🤩 Tuyệt vời"}
              </p>
            </div>

            {/* Feedback Section */}
            <div className="space-y-3">
              <Label htmlFor="application-feedback" className="text-base font-semibold text-gray-700">
                Chia sẻ cảm nhận về quá trình nộp hồ sơ công chứng online (không bắt buộc):
              </Label>
              <Textarea
                id="application-feedback"
                placeholder="Quá trình apply hồ sơ công chứng có dễ dàng không? Form có rõ ràng không? Bạn có gặp khó khăn gì không? Góp ý để chúng tôi cải thiện..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={handleCloseRating}
                className="flex-1"
              >
                Bỏ qua
              </Button>
              <Button
                onClick={handleRatingSubmit}
                disabled={rating === 0}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {rating === 0 ? 'Chọn số sao' : 'Gửi đánh giá'}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="text-center pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Đánh giá của bạn giúp chúng tôi cải thiện quy trình gửi hồ sơ công chứng
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FloatingApplication;