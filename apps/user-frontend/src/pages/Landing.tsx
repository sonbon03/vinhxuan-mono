import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isMobile } from 'react-device-detect';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Scale,
  Users,
  Building,
  FileText,
  Phone,
  Mail,
  MapPin,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  Award,
  Briefcase,
  Shield,
  Gavel,
  Home,
  Car,
  Factory,
  Heart,
  TrendingUp,
  Globe,
  Zap,
  BookOpen,
  MessageSquare,
  Calendar,
  Building2,
  FileCheck,
  Users2,
  Laptop,
  BadgeCheck,
  ScrollText,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';

// Import images
import heroImage from '/src/assets/hero-legal.jpg';
import servicesImage from '/src/assets/legal-services.jpg';

const Landing = () => {
  // Hero background slideshow - Professional notary themes
  const heroImages = [
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&h=1080&fit=crop&crop=center', // Notary stamping documents
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center', // Professional office meeting
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1920&h=1080&fit=crop&crop=center', // Legal consultation
    'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1920&h=1080&fit=crop&crop=center', // Handshake in legal setting
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&crop=center', // Law books and documents
  ];

  // CTA section office slideshow
  const officeImages = [
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&h=1080&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1920&h=1080&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1920&h=1080&fit=crop&crop=center',
  ];

  // State for hero background slideshow
  const [currentHeroImageIndex, setCurrentHeroImageIndex] = useState(0);

  // State for CTA section slideshow
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Hero slideshow effect
  useEffect(() => {
    const heroInterval = setInterval(() => {
      setCurrentHeroImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 6000); // Change hero image every 6 seconds

    return () => clearInterval(heroInterval);
  }, [heroImages.length]);

  // CTA slideshow effect
  useEffect(() => {
    const ctaInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % officeImages.length);
    }, 5000); // Change CTA image every 5 seconds

    return () => clearInterval(ctaInterval);
  }, [officeImages.length]);

  const notaryServices = [
    {
      id: 'contract-civil',
      title: 'Công chứng hợp đồng, giao dịch dân sự',
      documents: [
        'CMND/CCCD/Hộ chiếu của các bên tham gia giao dịch',
        'Giấy tờ chứng minh quyền sở hữu tài sản (nếu liên quan đến tài sản)',
        'Hợp đồng, thỏa thuận soạn sẵn (nếu có)',
        'Giấy ủy quyền (nếu người đại diện tham gia)',
      ],
    },
    {
      id: 'real-estate',
      title: 'Công chứng liên quan đến bất động sản',
      documents: [
        'CMND/CCCD/Hộ chiếu của các bên',
        'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở (sổ đỏ, sổ hồng)',
        'Hợp đồng mua bán/chuyển nhượng đã soạn (nếu có)',
        'Giấy tờ chứng minh tình trạng pháp lý của bất động sản (trừ trường hợp thỏa thuận khác)',
        'Giấy ủy quyền (nếu người đại diện tham gia)',
      ],
    },
    {
      id: 'mortgage',
      title: 'Công chứng các giao dịch thế chấp',
      documents: [
        'CMND/CCCD/Hộ chiếu của các bên',
        'Giấy chứng nhận quyền sử dụng đất, quyền sở hữu nhà ở hoặc tài sản thế chấp',
        'Hợp đồng thế chấp đã soạn',
        'Giấy tờ chứng minh tài sản thuộc sở hữu hợp pháp',
        'Giấy ủy quyền (nếu người đại diện tham gia)',
      ],
    },
    {
      id: 'inheritance',
      title: 'Công chứng liên quan đến thừa kế, di chúc',
      documents: [
        'CMND/CCCD/Hộ chiếu của các bên',
        'Giấy chứng tử (nếu là thừa kế sau khi người mất đã mất)',
        'Giấy chứng nhận quyền sở hữu tài sản',
        'Di chúc (nếu có) hoặc văn bản thỏa thuận phân chia thừa kế',
        'Sổ hộ khẩu, giấy tờ chứng minh quan hệ gia đình',
        'Giấy ủy quyền (nếu người đại diện tham gia)',
      ],
    },
    {
      id: 'authentication',
      title: 'Chứng thực',
      documents: [
        'CMND/CCCD/Hộ chiếu của người yêu cầu chứng thực',
        'Bản chính hoặc bản sao cần chứng thực',
        'Hợp đồng, văn bản cần chứng thực (nếu là hợp đồng)',
        'Giấy tờ ủy quyền (nếu người khác thực hiện thay)',
      ],
    },
  ];

  // News articles data
  const newsArticles = [
    {
      id: 1,
      title: 'Thủ tục công chứng hợp đồng mua bán nhà đất mới nhất 2024',
      excerpt:
        'Hướng dẫn chi tiết các thủ tục, giấy tờ cần thiết và quy trình công chứng hợp đồng mua bán bất động sản theo quy định mới nhất.',
      publishDate: '2024-03-15',
      category: 'Hướng dẫn',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
      tags: ['Bất động sản', 'Thủ tục', 'Hướng dẫn'],
      author: 'Luật sư Nguyễn Văn Minh',
    },
    {
      id: 2,
      title: 'Những lưu ý quan trọng khi công chứng di chúc',
      excerpt:
        'Các điều kiện, thủ tục và lưu ý cần thiết khi thực hiện công chứng di chúc để đảm bảo tính pháp lý và hiệu lực.',
      publishDate: '2024-03-10',
      category: 'Tư vấn',
      readTime: '7 phút đọc',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&h=400&fit=crop',
      tags: ['Di chúc', 'Thừa kế', 'Pháp lý'],
      author: 'Công chứng viên Trần Thị Lan',
    },
    {
      id: 3,
      title: 'Quy định mới về phí công chứng năm 2024',
      excerpt:
        'Cập nhật mức phí công chứng mới nhất theo Thông tư 01/2024/TT-BTP về việc quy định mức thu, chế độ thu, nộp và quản lý phí công chứng.',
      publishDate: '2024-03-08',
      category: 'Thông báo',
      readTime: '4 phút đọc',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop',
      tags: ['Phí công chứng', 'Quy định', '2024'],
      author: 'Văn phòng Công chứng Vĩnh Xuân',
    },
    {
      id: 4,
      title: 'Hướng dẫn công chứng hợp đồng chuyển nhượng quyền sử dụng đất',
      excerpt:
        'Quy trình, thủ tục và các giấy tờ cần thiết để thực hiện công chứng hợp đồng chuyển nhượng quyền sử dụng đất một cách nhanh chóng và chính xác.',
      publishDate: '2024-03-05',
      category: 'Hướng dẫn',
      readTime: '6 phút đọc',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=600&h=400&fit=crop',
      tags: ['Chuyển nhượng', 'Quyền sử dụng đất', 'Thủ tục'],
      author: 'Công chứng viên Lê Văn Đức',
    },
    {
      id: 5,
      title: 'Công chứng trực tuyến - Xu hướng mới trong dịch vụ công chứng',
      excerpt:
        'Tìm hiểu về dịch vụ công chứng trực tuyến, lợi ích và cách thức thực hiện để tiết kiệm thời gian và chi phí cho khách hàng.',
      publishDate: '2024-03-01',
      category: 'Công nghệ',
      readTime: '5 phút đọc',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      tags: ['Công chứng trực tuyến', 'Công nghệ', 'Tiện ích'],
      author: 'Đội ngũ IT - Văn phòng Công chứng Vĩnh Xuân',
    },
    {
      id: 6,
      title: 'Các trường hợp bắt buộc phải công chứng theo quy định pháp luật',
      excerpt:
        'Danh sách đầy đủ các loại hợp đồng, giao dịch bắt buộc phải thực hiện công chứng theo quy định của pháp luật Việt Nam hiện hành.',
      publishDate: '2024-02-28',
      category: 'Pháp lý',
      readTime: '8 phút đọc',
      image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=600&h=400&fit=crop',
      tags: ['Bắt buộc công chứng', 'Pháp luật', 'Quy định'],
      author: 'Luật sư Nguyễn Văn Minh',
    },
  ];

  const achievements = [
    { number: '10+', label: 'Năm kinh nghiệm', icon: Clock },
    { number: '5000+', label: 'Giao dịch công chứng', icon: Award },
    { number: '100%', label: 'Độ tin cậy', icon: TrendingUp },
    { number: '20+', label: 'Công chứng viên', icon: Users },
  ];

  const recentCases = [
    {
      id: 1,
      title: 'Công chứng hợp đồng mua bán biệt thự 50 tỷ đồng tại TP.HCM',
      category: 'Bất động sản',
      result: 'Hoàn thành',
      date: '2024-01-10',
    },
    {
      id: 2,
      title: 'Công chứng thành lập công ty TNHH vốn điều lệ 100 tỷ',
      category: 'Doanh nghiệp',
      result: 'Thành công',
      date: '2024-01-08',
    },
    {
      id: 3,
      title: 'Công chứng di chúc và phân chia tài sản thừa kế 20 tỷ',
      category: 'Thừa kế',
      result: 'Hoàn tất',
      date: '2024-01-05',
    },
  ];

  const handlerCall = () => {
    if (typeof window === 'undefined') return;
    if (isMobile) {
      window.location.href = 'tel:0901234567';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Full-Width Background Slideshow */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        {/* Background Slideshow */}
        <div className="absolute inset-0">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                index === currentHeroImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`,
              }}
            ></div>
          ))}
        </div>

        {/* Lighter Semi-transparent Overlay for Professional Look */}
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-800/40 to-slate-900/50"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/30"></div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-12 xs:py-16 sm:py-20">
          <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
            <div className="space-y-8">
              <div className="space-y-6">
                <Badge className="bg-blue-500/20 text-blue-100 border-blue-300/30 text-base px-4 py-2 backdrop-blur-md">
                  Khách quan · Trung thực · Chí công vô tư
                </Badge>

                <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                  <span className="block mb-2">
                    Công chứng dễ dàng, an tâm trong từng giao dịch
                  </span>
                </h1>

                <p className="text-base xs:text-lg sm:text-xl lg:text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto lg:mx-0">
                  Hơn 10 năm kinh nghiệm trong lĩnh vực công chứng, với hàng nghìn giao dịch thành
                  công. Chúng tôi cam kết mang đến dịch vụ nhanh chóng, chính xác và an toàn tuyệt
                  đối cho khách hàng.
                </p>
              </div>

              {/* Contact Info Row - Glassmorphism Style */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-6 sm:gap-8">
                {/* <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20">
                  <Phone className="w-5 h-5 text-blue-300" />
                  <div className="text-left">
                    <div className="text-xs text-white/80">Hotline 24/7</div>
                    <div className="font-semibold text-base">0901 234 567</div>
                  </div>
                </div> */}

                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md rounded-2xl px-3 xs:px-5 py-3 border border-white/20">
                  <MapPin className="w-4 xs:w-5 h-4 xs:h-5 text-blue-300 flex-shrink-0" />
                  <div className="text-left min-w-0">
                    <div className="text-xs text-white/80">Địa chỉ</div>
                    <div className="font-semibold text-xs xs:text-sm sm:text-base leading-tight">
                      622 Đ. Kim Giang, Thanh Quang, Thanh Trì, Hà Nội
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Buttons - Professional Blue Theme */}
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 xs:gap-4 pt-4 !mb-4 md:mb-0">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 xs:px-6 sm:px-8 py-3 xs:py-4 text-sm xs:text-base sm:text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  asChild
                >
                  <Link to="/contact">
                    <Calendar className="w-4 xs:w-5 h-4 xs:h-5 mr-1 xs:mr-2" />
                    <span className="hidden xs:inline">Đặt lịch công chứng ngay</span>
                    <span className="xs:hidden">Đặt lịch ngay</span>
                  </Link>
                </Button>

                <Button
                  onClick={handlerCall}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-blue-600 px-4 xs:px-6 sm:px-8 py-3 xs:py-4 text-sm xs:text-base sm:text-lg font-bold backdrop-blur-md shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <Phone className="w-4 xs:w-5 h-4 xs:h-5 mr-1 xs:mr-2" />
                  <span className="hidden xs:inline">Gọi ngay: 0901 234 567</span>
                  <span className="xs:hidden">Gọi ngay</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Trust Badges - Top Right */}
        <div className="absolute top-8 right-8 hidden lg:flex space-x-4">
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <TrendingUp className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-semibold text-white">100% Tin cậy</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20">
            <Award className="w-4 h-4 text-blue-300" />
            <span className="text-sm font-semibold text-white">5000+ Thành công</span>
          </div>
        </div>

        {/* Slideshow Indicators - Enhanced */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-2 bg-black/20 backdrop-blur-md rounded-full px-3 py-2">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentHeroImageIndex
                    ? 'bg-blue-400 shadow-lg w-6'
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile Trust Badges */}
        <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 lg:hidden z-20 w-max">
          <div
            className="
              grid grid-cols-2 gap-2
              items-center justify-center
            "
          >
            <div
              className="flex items-center justify-center space-x-1 
              bg-white/15 backdrop-blur-md rounded-full 
              px-2 py-1 border border-white/30 shadow-lg 
              w-32 whitespace-nowrap"
            >
              <TrendingUp className="w-3 h-3 text-blue-300" />
              <span className="text-xs font-semibold text-white">100% Tin cậy</span>
            </div>

            <div
              className="flex items-center justify-center space-x-1 
              bg-white/15 backdrop-blur-md rounded-full 
              px-2 py-1 border border-white/30 shadow-lg 
              w-32 whitespace-nowrap"
            >
              <Award className="w-3 h-3 text-blue-300" />
              <span className="text-xs font-semibold text-white">5000+</span>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-12 xs:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-6 sm:gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center w-12 xs:w-14 sm:w-16 h-12 xs:h-14 sm:h-16 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-3 xs:mb-4">
                  <achievement.icon className="w-6 xs:w-7 sm:w-8 h-6 xs:h-7 sm:h-8 text-white" />
                </div>
                <div className="font-bold text-xl xs:text-2xl sm:text-3xl text-primary mb-1 xs:mb-2">
                  {achievement.number}
                </div>
                <div className="text-muted-foreground font-medium text-sm xs:text-base">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Notary Services Table */}
      <section className="py-12 xs:py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent">
              Lĩnh vực chuyên môn
            </Badge>
            <h2 className="font-sans text-4xl font-bold text-primary mb-6">
              Dịch vụ công chứng và giấy tờ cần chuẩn bị
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Click vào từng loại dịch vụ để xem chi tiết giấy tờ cần chuẩn bị. Vui lòng chuẩn bị
              đầy đủ để quá trình công chứng diễn ra thuận lợi.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <Accordion type="single" collapsible className="w-full">
              {notaryServices.map((service, index) => {
                return (
                  <AccordionItem key={service.id} value={service.id} className="border-0">
                    <AccordionTrigger
                      className={`
                      ${index % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'} 
                      hover:bg-gradient-to-r hover:from-primary/10 hover:to-accent/10 
                      transition-all duration-300 px-8 py-6 text-left
                      border-b border-gray-200 last:border-b-0
                      group
                    `}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded-full group-hover:scale-110 transition-transform duration-300 bg-gradient-to-r from-primary to-accent"></div>
                        <span className="font-bold text-lg text-primary group-hover:text-accent transition-colors duration-300">
                          {service.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent
                      className={`
                      ${index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'} 
                      px-8 py-6 border-b border-gray-100 last:border-b-0
                    `}
                    >
                      <div className="ml-7">
                        <h4 className="font-semibold text-accent mb-4 flex items-center">
                          <FileText className="w-4 h-4 mr-2" />
                          Giấy tờ cần chuẩn bị:
                        </h4>
                        <ul className="space-y-3">
                          {service.documents.map((document, docIndex) => (
                            <li key={docIndex} className="flex items-start">
                              <div className="flex items-start space-x-3 w-full">
                                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
                                <span className="flex-1 leading-relaxed text-gray-700">
                                  {document}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>

                        {/* Notice section for each accordion item */}
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-blue-800 text-sm text-center">
                            <strong>Lưu ý:</strong> Đây chỉ là những giấy tờ chung nhất.
                            <Link
                              to={`/services#notary-service-${index + 1}`}
                              className="text-blue-600 hover:text-blue-800 underline font-medium ml-1"
                            >
                              Bấm vào đây để xem hướng dẫn chi tiết hơn
                            </Link>
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          <div className="text-center mt-12">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 max-w-4xl mx-auto">
              <div className="flex items-center justify-center mb-3">
                <Badge className="bg-amber-100 text-amber-700 px-3 py-1">
                  <FileText className="w-4 h-4 mr-2" />
                  Lưu ý quan trọng
                </Badge>
              </div>
              <p className="text-amber-800 font-medium mb-2">
                Tất cả giấy tờ phải là bản chính hoặc bản sao có chứng thực
              </p>
              <p className="text-amber-700">
                Đối với giấy tờ bằng tiếng nước ngoài, cần có bản dịch thuật được chứng thực
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white font-bold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              asChild
            >
              <Link to="/contact">
                <Calendar className="w-5 h-5 mr-2" />
                Đặt lịch công chứng ngay
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Recent Cases */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {/* <Badge variant="secondary" className="mb-4 bg-green-100 text-green-700">
              Dịch vụ gần đây
            </Badge> */}
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              Dịch vụ gần đây
            </Badge>
            <h2 className="font-sans text-4xl font-bold text-primary mb-6">
              Công chứng thành công
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Một số giao dịch công chứng điển hình mà chúng tôi đã thực hiện thành công trong thời
              gian gần đây.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {recentCases.map((case_item) => (
              <Card
                key={case_item.id}
                className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {case_item.result}
                    </Badge>
                    <Badge variant="outline">{case_item.category}</Badge>
                  </div>
                  <CardTitle className="text-lg font-bold text-primary group-hover:text-accent transition-colors leading-tight">
                    {case_item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {new Date(case_item.date).toLocaleDateString('vi-VN')}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-primary text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link to="/services">
                Xem thêm dịch vụ <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              <ScrollText className="w-4 h-4 mr-2" />
              Tin tức & Hướng dẫn
            </Badge>
            <h2 className="font-sans text-4xl font-bold text-primary mb-6">
              Cập nhật thông tin pháp lý mới nhất
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Theo dõi các tin tức, hướng dẫn và quy định mới nhất về lĩnh vực công chứng, giúp bạn
              nắm bắt thông tin pháp lý một cách chính xác và kịp thời.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {newsArticles.map((article) => (
              <Card
                key={article.id}
                className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden bg-gradient-to-b from-white to-gray-50"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-primary text-white px-3 py-1 shadow-lg">
                      {article.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant="secondary"
                      className="bg-white/90 text-gray-700 px-2 py-1 text-xs"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {article.readTime}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-black mb-3 leading-tight group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4">{article.excerpt}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-xs px-2 py-1 border-primary/20 text-primary/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {article.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(article.publishDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all group">
                    <FileText className="w-4 h-4 mr-2" />
                    Đọc chi tiết
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white font-bold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
              asChild
            >
              <Link to="/news">
                <ScrollText className="w-5 h-5 mr-2" />
                Xem tất cả tin tức
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {/* <section className="relative py-20 bg-gradient-to-r from-primary to-accent text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/40"></div> */}
      {/* Office Images Slideshow */}
      {/* <div className="absolute inset-0">
          {officeImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30 transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-30' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `url('${image}')`
              }}
            ></div>
          ))}
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-sans text-4xl font-bold mb-6">
            Cần dịch vụ công chứng ngay lập tức?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Đừng để giấy tờ thiếu tính pháp lý làm bạn lo lắng. Liên hệ ngay với chúng tôi để được tư vấn miễn phí 
            từ đội ngũ công chứng viên chuyên nghiệp.
          </p>
          
          <div className="flex flex-col md:flex-row justify-center items-stretch gap-6">
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-5 py-3 border-2 border-white min-h-[64px]">
              <Phone className="w-5 h-5 text-yellow-300" />
              <div className="text-left">
                <div className="text-xs text-white/80">Hotline 24/7</div>
                <div className="font-semibold text-lg">0901 234 567</div>
              </div>
            </div>

            <Button
              className="bg-white text-[#2563eb] hover:bg-gray-50 font-semibold px-5 py-3 text-lg rounded-lg border-2 border-white shadow-lg hover:shadow-xl transition-all duration-300 min-h-[72px] flex items-center justify-center"
              asChild
            >
              <Link to="/contact" className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Đặt lịch công chứng
              </Link>
            </Button>
          </div>
        </div> */}
      {/* </section> */}

      {/* Google Map Section */}
      <section className="py-12 xs:py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
              <MapPin className="w-4 h-4 mr-2" />
              Vị trí văn phòng
            </Badge>
            <h2 className="font-sans text-4xl font-bold text-primary mb-6">
              Tìm đến văn phòng chúng tôi
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Văn phòng Công chứng Vĩnh Xuân tọa lạc tại vị trí thuận lợi, dễ dàng tìm kiếm và tiếp
              cận. Chúng tôi luôn sẵn sàng phục vụ khách hàng với không gian chuyên nghiệp và thoải
              mái.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 xs:gap-8 sm:gap-12 items-start">
            <div className="space-y-8">
              <div className="bg-white p-4 xs:p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100">
                <h3 className="text-xl xs:text-2xl font-bold text-primary mb-4 xs:mb-6 flex items-center">
                  <Building className="w-5 xs:w-6 h-5 xs:h-6 mr-2 xs:mr-3 text-accent" />
                  Thông tin liên hệ
                </h3>

                <div className="space-y-4 xs:space-y-6">
                  <div className="flex items-start space-x-3 xs:space-x-4">
                    <div className="w-10 xs:w-12 h-10 xs:h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 xs:w-6 h-5 xs:h-6 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">
                        Địa chỉ
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base leading-tight">
                        622 Đ. Kim Giang
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base leading-tight">
                        Thanh Châu, Thanh Liệt, Thanh Trì, Hà Nội
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 xs:space-x-4">
                    <div className="w-10 xs:w-12 h-10 xs:h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 xs:w-6 h-5 xs:h-6 text-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">
                        Điện thoại
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base">0901 234 567</div>
                      <div className="text-xs xs:text-sm text-gray-500">Hotline 24/7</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 xs:space-x-4">
                    <div className="w-10 xs:w-12 h-10 xs:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 xs:w-6 h-5 xs:h-6 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">
                        Email
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base break-all">
                        info@congchungvinhxuan.vn
                      </div>
                      <div className="text-xs xs:text-sm text-gray-500">Tư vấn trực tuyến</div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 xs:space-x-4">
                    <div className="w-10 xs:w-12 h-10 xs:h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 xs:w-6 h-5 xs:h-6 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-gray-900 mb-1 text-sm xs:text-base">
                        Giờ làm việc
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base">
                        Thứ 2 - Thứ 6: 8:00 - 17:30
                      </div>
                      <div className="text-gray-600 text-sm xs:text-base">Thứ 7: 8:00 - 12:00</div>
                      <div className="text-xs xs:text-sm text-gray-500">Chủ nhật: Nghỉ</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 xs:mt-8 pt-4 xs:pt-6 border-t border-gray-200">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 text-sm xs:text-base"
                    asChild
                  >
                    <Link to="/contact">
                      <Calendar className="w-4 xs:w-5 h-4 xs:h-5 mr-2" />
                      Đặt lịch hẹn ngay
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.4737146332896!2d105.89894631489562!3d21.047681992307164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135a8b9e3c6e1dd%3A0x43900f1d4539408b!2zTmcuIDczNCDEkC4gS2ltIEdpYW5nLCBUaGFuaCBDaMOidSwgVGhhbmggTGnhu4d0LCBUYW5oIFTSm2ksIEjDoCBO4buZaQ!5e0!3m2!1svi!2s!4v1631234567890!5m2!1svi!2s"
                width="100%"
                height="500"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-[500px]"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
