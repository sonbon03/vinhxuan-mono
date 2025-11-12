import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Scale,
  Shield, 
  Users, 
  Globe,
  Award,
  Target,
  Heart,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Star,
  Building,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Quote,
  Briefcase,
  GraduationCap,
  BookOpen,
  Zap,
  MonitorSpeaker,
  Clock,
  FileText,
  Home,
  Building2,
  HandshakeIcon,
  Eye,
  CheckCircle2
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import servicesImage from "@/assets/legal-services.jpg";
import { cn } from "@/lib/utils";
import { useState, useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";

const About = () => {
  const location = useLocation();
  
  // State for accordion open items
  const [openAccordionValue, setOpenAccordionValue] = useState<string>("");

  const notaryServices = useMemo(() => [
    {
      category: "1. Công chứng hợp đồng, giao dịch dân sự",
      icon: HandshakeIcon,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      services: [
        {
          subCategory: "1.1 Hợp đồng mua bán, chuyển nhượng tài sản",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy tờ chứng minh quyền sở hữu tài sản (xe, máy móc, thiết bị, cổ phần…)",
            "Hợp đồng mua bán/chuyển nhượng (nếu đã soạn)",
            "Giấy ủy quyền (nếu có người đại diện)"
          ]
        },
        {
          subCategory: "1.2 Hợp đồng cho thuê, thuê mua",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy tờ chứng minh quyền sở hữu tài sản cho thuê (nhà, đất, xe, máy móc…)",
            "Hợp đồng cho thuê/thuê mua (nếu đã soạn)",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "1.3 Hợp đồng vay mượn, bảo lãnh",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Hợp đồng vay mượn/bảo lãnh (nếu đã soạn)",
            "Giấy tờ chứng minh tài sản dùng để bảo lãnh (nếu có)",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "1.4 Các giao dịch dân sự khác theo luật",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy tờ chứng minh liên quan đến giao dịch",
            "Văn bản giao dịch (nếu đã soạn)",
            "Giấy ủy quyền (nếu có)"
          ]
        }
      ]
    },
    {
      category: "2. Công chứng liên quan đến bất động sản",
      icon: Home,
      color: "text-green-600",
      bgColor: "bg-green-50",
      services: [
        {
          subCategory: "2.1 Hợp đồng chuyển nhượng quyền sử dụng đất",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sử dụng đất (sổ đỏ)",
            "Hợp đồng chuyển nhượng (nếu đã soạn)",
            "Giấy xác nhận tình trạng hôn nhân (đối với cá nhân chuyển nhượng)",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "2.2 Hợp đồng mua bán nhà, căn hộ",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sử dụng đất + quyền sở hữu nhà ở (sổ hồng)",
            "Hợp đồng mua bán nhà/căn hộ",
            "Giấy xác nhận tình trạng hôn nhân (nếu cần)",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "2.3 Hợp đồng góp vốn, thế chấp bất động sản",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở",
            "Hợp đồng góp vốn/thế chấp (nếu đã soạn)",
            "Giấy tờ chứng minh quyền sở hữu hợp pháp tài sản",
            "Giấy ủy quyền (nếu có)"
          ]
        }
      ]
    },
    {
      category: "3. Công chứng các giao dịch thế chấp",
      icon: Building2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      services: [
        {
          subCategory: "3.1 Thế chấp quyền sử dụng đất",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sử dụng đất",
            "Hợp đồng thế chấp (nếu đã soạn)",
            "Giấy tờ chứng minh quyền hợp pháp về đất (nếu cần)",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "3.2 Thế chấp nhà ở, tài sản gắn liền với đất",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sở hữu nhà ở và quyền sử dụng đất",
            "Hợp đồng thế chấp (nếu đã soạn)",
            "Giấy tờ chứng minh tài sản gắn liền thuộc sở hữu hợp pháp",
            "Giấy ủy quyền (nếu có)"
          ]
        },
        {
          subCategory: "3.3 Thỏa thuận giải chấp",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên",
            "Giấy chứng nhận quyền sử dụng đất/nhà/tài sản thế chấp trước đó",
            "Văn bản thỏa thuận giải chấp (nếu đã soạn)",
            "Hợp đồng thế chấp cũ (nếu có)",
            "Giấy ủy quyền (nếu có)"
          ]
        }
      ]
    },
    {
      category: "4. Công chứng liên quan đến thừa kế, di chúc",
      icon: Users,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      services: [
        {
          subCategory: "4.1 Di chúc cá nhân",
          documents: [
            "CMND/CCCD/Hộ chiếu của người lập di chúc",
            "Giấy chứng nhận quyền sở hữu tài sản (nếu để lại tài sản)",
            "Sổ hộ khẩu hoặc giấy xác nhận nơi cư trú",
            "Giấy tờ chứng minh quan hệ gia đình (nếu cần)"
          ]
        },
        {
          subCategory: "4.2 Hợp đồng phân chia thừa kế",
          documents: [
            "CMND/CCCD/Hộ chiếu của những người thừa kế",
            "Giấy chứng tử của người để lại di sản",
            "Giấy chứng nhận quyền sở hữu tài sản (để lại thừa kế)",
            "Sổ hộ khẩu hoặc giấy tờ chứng minh quan hệ gia đình",
            "Văn bản thỏa thuận phân chia (nếu đã soạn)"
          ]
        },
        {
          subCategory: "4.3 Xác nhận quyền thừa kế",
          documents: [
            "CMND/CCCD/Hộ chiếu của người thừa kế",
            "Giấy chứng tử của người để lại di sản",
            "Giấy chứng nhận quyền sở hữu tài sản thừa kế",
            "Sổ hộ khẩu hoặc giấy tờ chứng minh quan hệ gia đình",
            "Giấy ủy quyền (nếu có)"
          ]
        }
      ]
    },
    {
      category: "5. Chứng thực",
      icon: FileText,
      color: "text-red-600",
      bgColor: "bg-red-50",
      services: [
        {
          subCategory: "5.1 Chứng thực chữ ký",
          documents: [
            "CMND/CCCD/Hộ chiếu của người cần chứng thực",
            "Văn bản cần chứng thực chữ ký"
          ]
        },
        {
          subCategory: "5.2 Chứng thực bản sao từ bản chính",
          documents: [
            "Bản chính giấy tờ cần chứng thực",
            "Bản sao giấy tờ cần chứng thực",
            "CMND/CCCD/Hộ chiếu của người yêu cầu (một số nơi yêu cầu)"
          ]
        },
        {
          subCategory: "5.3 Chứng thực hợp đồng, văn bản",
          documents: [
            "CMND/CCCD/Hộ chiếu của các bên ký kết",
            "Hợp đồng, văn bản cần chứng thực",
            "Giấy tờ chứng minh liên quan (nếu có)",
            "Giấy ủy quyền (nếu có)"
          ]
        }
      ]
    }
  ], []);

  // Effect to handle auto-opening accordion based on URL hash
  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      // Extract the service number from hash like #notary-service-1
      const match = hash.match(/#notary-service-(\d+)/);
      if (match) {
        const serviceIndex = parseInt(match[1]) - 1; // Convert to 0-based index
        if (serviceIndex >= 0 && serviceIndex < notaryServices.length) {
          const serviceCategory = notaryServices[serviceIndex];
          setOpenAccordionValue(serviceCategory.category);
          
          // Scroll to the element after a short delay to ensure it's rendered
          setTimeout(() => {
            const element = document.getElementById(`notary-service-${serviceIndex + 1}`);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      } else if (hash === '#notary-services') {
        // Just scroll to the section without opening any accordion
        setTimeout(() => {
          const element = document.getElementById('notary-services');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    }
  }, [location.hash, notaryServices]);

  const stats = [
    { number: "2015", label: "Founded", icon: Calendar },
    { number: "5,000+", label: "Legal Professionals", icon: Users },
    { number: "150,000+", label: "Cases Managed", icon: Briefcase },
    { number: "50+", label: "Countries Served", icon: Globe }
  ];

  const values = [
    {
      icon: Eye,
      title: "Khách quan",
      description: "Đánh giá và xử lý mọi vấn đề một cách khách quan, không bị ảnh hưởng bởi cảm xúc cá nhân hay định kiến, đảm bảo tính công bằng trong mọi quyết định.",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: CheckCircle2,
      title: "Trung thực",
      description: "Luôn trung thực trong mọi giao dịch và thủ tục công chứng, cung cấp thông tin chính xác và minh bạch, không che giấu hay xuyên tạc sự thật.",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Scale,
      title: "Chí công vô tư",
      description: "Thực hiện công việc với tinh thần vô tư, không thiên vị bất kỳ bên nào, luôn đặt lợi ích chung và công lý lên hàng đầu trong mọi hoạt động công chứng.",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const timeline = [
    {
      year: "2015",
      title: "Company Founded",
      description: "AdvoConnect was founded by Sarah Johnson to address the technology gap in legal practice management.",
      icon: Building
    },
    {
      year: "2017",
      title: "First 1,000 Users",
      description: "Reached our first milestone of 1,000 legal professionals using our platform across 10 states.",
      icon: Users
    },
    {
      year: "2019",
      title: "AI Integration",
      description: "Launched our first AI-powered features for document analysis and legal research automation.",
      icon: Lightbulb
    },
    {
      year: "2021",
      title: "Global Expansion",
      description: "Expanded internationally, now serving legal professionals in over 50 countries worldwide.",
      icon: Globe
    },
    {
      year: "2023",
      title: "SOC 2 Certification",
      description: "Achieved SOC 2 Type II certification, demonstrating our commitment to data security and privacy.",
      icon: Shield
    },
    {
      year: "2024",
      title: "5,000+ Users",
      description: "Celebrating over 5,000 legal professionals and 150,000+ cases managed on our platform.",
      icon: Award
    }
  ];

  const awards = [
    {
      title: "Legal Tech Innovation Award 2024",
      organization: "American Bar Association",
      description: "Recognized for outstanding innovation in legal technology solutions"
    },
    {
      title: "Best Practice Management Software",
      organization: "Legal Technology Review",
      description: "Top-rated practice management platform for three consecutive years"
    },
    {
      title: "Cybersecurity Excellence Award",
      organization: "Cybersecurity Excellence Awards",
      description: "Outstanding achievement in cybersecurity for legal technology"
    },
    {
      title: "Client Choice Award",
      organization: "Software Reviews",
      description: "Highest client satisfaction scores in the legal software category"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
    
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <section className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Badge
                  variant="secondary"
                  className="mb-4 bg-accent/10 text-accent text-xl font-semibold"
                >
                  Sứ mệnh của chúng tôi
                </Badge>

                <h2 className="font-sans text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                  Bảo vệ quyền lợi, xây dựng lòng tin
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  Chúng tôi tin rằng mọi giao dịch đều cần được bảo vệ bằng sự chính xác và minh bạch. 
                  Văn phòng công chứng của chúng tôi là cầu nối tin cậy giữa các bên, đảm bảo mọi thỏa thuận 
                  đều có giá trị pháp lý cao nhất.
                </p>
                {/* <p className="text-gray-600 leading-relaxed">
                  Với kinh nghiệm nhiều năm và đội ngũ chuyên nghiệp, chúng tôi không chỉ thực hiện 
                  các thủ tục công chứng mà còn tư vấn pháp lý toàn diện, giúp khách hàng yên tâm 
                  trong mọi giao dịch quan trọng.
                </p> */}
              </div>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Bảo đảm pháp lý</div>
                    <div className="text-xs text-gray-600">An toàn tuyệt đối</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">Nhanh chóng</div>
                    <div className="text-xs text-gray-600">Tiết kiệm thời gian</div>
                  </div>
                </div>
              </div>
              
              <Button size="lg" className="bg-gradient-to-r from-accent to-accent/90 text-accent-foreground" asChild>
                <Link to="/contact">
                  Liên Hệ Tư Vấn Ngay
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={logo} 
                alt="Văn phòng công chứng chuyên nghiệp"
                className="rounded-2xl shadow-2xl"
              />
              {/* <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Scale className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">Luôn sẵn sàng</div>
                    <div className="text-sm text-gray-600">Vì công lý</div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              Tinh thần văn phòng
            </Badge>
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Tinh thần của Văn phòng Công chứng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              3 giá trị cốt lõi định hướng mọi hoạt động của chúng tôi trong lĩnh vực công chứng
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform", value.bgColor)}>
                    <value.icon className={cn("h-8 w-8", value.color)} />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-accent transition-colors">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Notary Services */}
        <section id="notary-services" className="mb-20">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
              Dịch vụ công chứng
            </Badge>
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Giấy tờ cần chuẩn bị cho dịch vụ công chứng
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hướng dẫn chi tiết về các loại giấy tờ cần chuẩn bị cho từng dịch vụ công chứng khác nhau
            </p>
          </div>
          
          {/* Services Overview Cards */}
          {/* <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
            {notaryServices.map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform", service.bgColor)}>
                    <service.icon className={cn("h-8 w-8", service.color)} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 group-hover:text-accent transition-colors leading-tight">
                    {service.category.split('.')[1]?.trim()}
                          </h3>
                  <p className="text-xs text-gray-600 mt-2">
                    {service.services.length} loại dịch vụ
                  </p>
                </CardContent>
              </Card>
            ))}
          </div> */}
                      
          {/* Detailed Services Accordion */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-primary to-accent text-white py-6">
              <div className="flex items-center space-x-4">
                <FileText className="w-8 h-8 text-white" />
                        <div>
                  <CardTitle className="text-xl font-bold text-white">
                    Chi tiết giấy tờ cần chuẩn bị
                  </CardTitle>
                  <CardDescription className="text-white/90">
                    Mở từng mục để xem chi tiết giấy tờ cần thiết
                  </CardDescription>
                </div>
                          </div>
            </CardHeader>
            
            <CardContent className="p-0">
              <Accordion 
                type="single" 
                collapsible 
                className="w-full"
                value={openAccordionValue}
                onValueChange={setOpenAccordionValue}
              >
                {notaryServices.map((serviceCategory, categoryIndex) => (
                  <AccordionItem 
                    key={categoryIndex} 
                    value={serviceCategory.category} 
                    className="border-0"
                    id={`notary-service-${categoryIndex + 1}`}
                  >
                    <AccordionTrigger className="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center space-x-3 sm:space-x-4 w-full">
                        <div className={cn("w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0", serviceCategory.bgColor)}>
                          <serviceCategory.icon className={cn("h-5 w-5 sm:h-6 sm:w-6", serviceCategory.color)} />
                        </div>
                        <div className="text-left flex-1 min-w-0">
                          <h3 className="font-bold text-sm sm:text-base lg:text-lg text-gray-900 leading-tight">
                            {serviceCategory.category}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                            {serviceCategory.services.length} loại dịch vụ chi tiết
                          </p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 pb-6">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Nested Accordion for sub-services */}
                        <Accordion type="single" collapsible className="w-full">
                          {serviceCategory.services.map((service, serviceIndex) => (
                            <AccordionItem 
                              key={serviceIndex} 
                              value={`${serviceCategory.category}-${serviceIndex}`}
                              className="border border-gray-200 rounded-lg mb-2 sm:mb-3 overflow-hidden"
                            >
                              <AccordionTrigger className="px-3 sm:px-4 py-3 hover:bg-gray-50 transition-colors [&[data-state=open]]:bg-gray-50">
                                <div className="flex items-start sm:items-center w-full text-left">
                                  <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                                    <div className={cn("w-2 h-2 rounded-full flex-shrink-0 mt-1 sm:mt-0", 
                                    serviceCategory.color.replace('text-', 'bg-'))} 
                                  />
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-semibold text-primary text-xs sm:text-sm leading-tight pr-2">
                                    {service.subCategory}
                                  </h4>
                                      <div className="sm:hidden mt-1">
                                        <Badge variant="outline" className="text-xs px-2 py-0.5">
                                          {service.documents.length} giấy tờ
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="hidden sm:block flex-shrink-0">
                                  <Badge variant="outline" className="text-xs">
                                    {service.documents.length} giấy tờ
                                  </Badge>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="px-3 sm:px-4 pb-4">
                                {/* Document list */}
                                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mt-2">
                                  <h5 className="font-medium text-gray-900 mb-3 text-xs sm:text-sm">
                                    Giấy tờ cần chuẩn bị:
                                  </h5>
                                  <ul className="space-y-2">
                                    {service.documents.map((document, docIndex) => (
                                      <li key={docIndex} className="flex items-start">
                                        <div className="flex items-start space-x-2 sm:space-x-3 w-full">
                                          <div className="w-1.5 h-1.5 bg-accent rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                                          <span className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                                            {document}
                                          </span>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Important Notes & CTA - Enhanced Design */}
          <div className="mt-12 relative">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-amber-50 to-green-50 rounded-2xl sm:rounded-3xl opacity-50"></div>
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-xl sm:blur-2xl"></div>
            <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-tr from-amber-200/20 to-orange-200/20 rounded-full blur-lg sm:blur-xl"></div>
            
            <div className="relative bg-white/80 backdrop-blur-sm border border-white/50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-start lg:items-center">
                
                {/* Important Guidelines - Professional & Modern */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Header Section */}
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-2xl sm:rounded-3xl blur-lg sm:blur-xl"></div>
                      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-xl">
                        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                      </div>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Hướng dẫn chuẩn bị hồ sơ
                      </h3>
                    <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4 sm:px-0">
                      Đảm bảo quy trình công chứng diễn ra thuận lợi và chính xác
                    </p>
                  </div>
                  
                  {/* Guidelines Grid */}
                  <div className="grid gap-4">
                    {[
                      { 
                        icon: FileText, 
                        title: "Tính hợp lệ của giấy tờ",
                        text: "Giấy tờ phải là bản chính hoặc bản sao có chứng thực hợp lệ",
                        color: "blue",
                        bgColor: "bg-blue-50",
                        iconBg: "bg-blue-100",
                        textColor: "text-blue-700"
                      },
                      { 
                        icon: Globe, 
                        title: "Giấy tờ nước ngoài",
                        text: "Cần có bản dịch thuật được chứng thực và hợp pháp hóa lãnh sự",
                        color: "emerald",
                        bgColor: "bg-emerald-50",
                        iconBg: "bg-emerald-100",
                        textColor: "text-emerald-700"
                      },
                      { 
                        icon: Phone, 
                        title: "Tư vấn trước thực hiện",
                        text: "Liên hệ trước để được tư vấn chi tiết về thủ tục và giấy tờ cần thiết",
                        color: "purple",
                        bgColor: "bg-purple-50",
                        iconBg: "bg-purple-100",
                        textColor: "text-purple-700"
                      },
                      { 
                        icon: MonitorSpeaker, 
                        title: "Hỗ trợ chuyên nghiệp",
                        text: "Đội ngũ luôn sẵn sàng hỗ trợ trong trường hợp cần tư vấn bổ sung",
                        color: "amber",
                        bgColor: "bg-amber-50",
                        iconBg: "bg-amber-100",
                        textColor: "text-amber-700"
                      }
                    ].map((item, index) => (
                      <div key={index} className={`relative group ${item.bgColor} border border-${item.color}-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-lg hover:shadow-${item.color}-500/10 transition-all duration-300 hover:-translate-y-1`}>
                        {/* Background Pattern */}
                        <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 opacity-5">
                          <item.icon className="w-full h-full" />
                        </div>
                        
                        <div className="relative flex items-start space-x-3 sm:space-x-4">
                          <div className={`${item.iconBg} rounded-lg sm:rounded-xl p-2 sm:p-3 group-hover:scale-110 transition-transform duration-300 shadow-sm flex-shrink-0`}>
                            <item.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${item.textColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-gray-800 transition-colors text-sm sm:text-base">
                              {item.title}
                            </h4>
                            <p className="text-gray-700 leading-relaxed text-xs sm:text-sm group-hover:text-gray-800 transition-colors">
                          {item.text}
                        </p>
                          </div>
                        </div>
                        
                        {/* Hover Effect Line */}
                        <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-${item.color}-400 to-${item.color}-600 rounded-b-xl sm:rounded-b-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Notice */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 border border-gray-200/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="text-xs sm:text-sm font-medium text-gray-700">Lưu ý quan trọng</span>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
                      Để đảm bảo quy trình công chứng diễn ra nhanh chóng và chính xác, 
                      vui lòng chuẩn bị đầy đủ giấy tờ theo hướng dẫn hoặc liên hệ để được tư vấn chi tiết.
                    </p>
                  </div>
                </div>
                
                {/* CTA Section - Modern & Enhanced */}
                <div className="relative mt-6 lg:mt-0">
                  {/* Floating Elements */}
                  <div className="absolute -top-2 -left-2 sm:-top-4 sm:-left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-full blur-lg sm:blur-xl animate-pulse"></div>
                  <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-md sm:blur-lg animate-pulse delay-1000"></div>
                  
                  <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm border border-white/60 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-2xl">
                    {/* Header with Icon */}
                    <div className="text-center mb-6 sm:mb-8">
                      <div className="relative inline-flex items-center justify-center mb-4">
                        <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary rounded-xl sm:rounded-2xl blur-md sm:blur-lg opacity-30 animate-pulse"></div>
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-accent to-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-xl">
                          <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                    </div>
                    </div>
                      
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-3">
                        Sẵn sàng bắt đầu?
                      </h3>
                      <p className="text-sm sm:text-base lg:text-lg text-gray-600 leading-relaxed max-w-md mx-auto px-4 sm:px-0">
                        Đội ngũ chuyên gia với <span className="font-semibold text-accent">10+ năm kinh nghiệm</span> luôn sẵn sàng hỗ trợ bạn
                      </p>
                    </div>

                  
                    {/* CTA Buttons */}
                    <div className="space-y-3 sm:space-y-4">
                      {/* Primary CTA - Enhanced */}
                    <Button 
                      size="lg" 
                        className="w-full bg-gradient-to-r from-accent via-primary to-accent hover:from-accent/90 hover:via-primary/90 hover:to-accent/90 text-white font-bold py-4 sm:py-5 px-6 sm:px-8 rounded-xl sm:rounded-2xl shadow-2xl hover:shadow-accent/25 transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 border-0 relative overflow-hidden group"
                      asChild
                    >
                      <Link to="/contact">
                          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          <div className="relative flex items-center justify-center">
                            <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 group-hover:rotate-12 transition-transform duration-300" />
                            <span className="text-sm sm:text-base lg:text-lg font-bold">Đặt lịch tư vấn miễn phí</span>
                            <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-2 sm:ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                          </div>
                      </Link>
                    </Button>
                    
                      {/* Secondary CTA - Modern Glass Effect */}
                    <Button 
                      variant="outline" 
                      size="lg"
                        className="w-full border-2 border-gray-200 hover:border-accent/50 text-gray-700 hover:text-accent bg-white/70 hover:bg-white/90 backdrop-blur-md rounded-xl sm:rounded-2xl py-4 sm:py-5 font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-accent/10 group"
                      asChild
                    >
                      <Link to="/services">
                          <div className="flex items-center justify-center">
                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 group-hover:scale-110 transition-transform duration-300" />
                            <span className="text-sm sm:text-base">Khám phá tất cả dịch vụ</span>
                          </div>
                      </Link>
                    </Button>
                  </div>
                  
                    {/* Trust Indicators - Enhanced */}
                    <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gradient-to-r from-transparent via-gray-200 to-transparent">
                      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6 lg:space-x-8">
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 group hover:text-green-600 transition-colors">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition-colors">
                            <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-600" />
                          </div>
                          <span className="font-medium">Tư vấn miễn phí</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 group hover:text-blue-600 transition-colors">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                            <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-blue-600" />
                          </div>
                          <span className="font-medium">Bảo mật tuyệt đối</span>
                        </div>
                        <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600 group hover:text-purple-600 transition-colors">
                          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-purple-600" />
                          </div>
                          <span className="font-medium">Chất lượng cao</span>
                        </div>
                    </div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </section>

  

      </div>
    </div>
  );
};

export default About;