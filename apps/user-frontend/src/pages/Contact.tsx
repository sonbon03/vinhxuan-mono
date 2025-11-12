import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Users,
  Headphones,
  Globe,
  Building,
  CheckCircle,
  ArrowRight,
  Star,
  Video,
  FileText,
  Shield,
  Zap,
  Heart,
  Award,
  PlayCircle,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Youtube,
  Instagram
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import BookingSystem from "@/components/BookingSystem";

const Contact = () => {

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our legal technology experts",
      detail: "+1 (555) 123-4567",
      hours: "Mon-Fri 8AM-8PM EST",
      color: "text-green-600",
      bgColor: "bg-green-50",
      action: "Call Now"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Get instant answers to your questions",
      detail: "Available 24/7",
      hours: "Average response: 2 minutes",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your needs",
      detail: "support@advoconnect.com",
      hours: "Response within 4 hours",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      action: "Send Email"
    },
    {
      icon: Calendar,
      title: "Schedule Demo",
      description: "Book a personalized demonstration",
      detail: "30-minute consultation",
      hours: "Available all business days",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      action: "Book Demo"
    }
  ];

  const offices = [
    {
      city: "New York",
      address: "123 Legal Plaza, Suite 4500",
      zip: "New York, NY 10004",
      phone: "+1 (212) 555-0123",
      email: "ny@advoconnect.com",
      hours: "Mon-Fri 8AM-7PM EST"
    },
    {
      city: "San Francisco",
      address: "456 Tech Street, Floor 12",
      zip: "San Francisco, CA 94105",
      phone: "+1 (415) 555-0456", 
      email: "sf@advoconnect.com",
      hours: "Mon-Fri 8AM-7PM PST"
    },
    {
      city: "Chicago",
      address: "789 Business Avenue, Suite 2100",
      zip: "Chicago, IL 60601",
      phone: "+1 (312) 555-0789",
      email: "chi@advoconnect.com",
      hours: "Mon-Fri 8AM-7PM CST"
    },
    {
      city: "London",
      address: "321 Legal Lane, Level 8",
      zip: "London EC2M 7PP, UK",
      phone: "+44 20 7555 0321",
      email: "london@advoconnect.com",
      hours: "Mon-Fri 9AM-6PM GMT"
    }
  ];

  const faqs = [
    {
      question: "How quickly can we get started?",
      answer: "Most clients are up and running within 24-48 hours. Our onboarding team provides white-glove service to ensure smooth implementation."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We maintain SOC 2 Type II certification, use bank-level encryption, and follow strict security protocols designed for legal professionals."
    },
    {
      question: "Do you offer training?",
      answer: "Yes, we provide comprehensive training including live webinars, one-on-one sessions, video tutorials, and ongoing support."
    },
    {
      question: "What integrations do you support?",
      answer: "We integrate with major legal software including QuickBooks, Microsoft Office, DocuSign, and many state court filing systems."
    },
    {
      question: "Can I try before purchasing?",
      answer: "Yes, we offer a 30-day free trial with full access to all features and dedicated support to help you evaluate our platform."
    },
    {
      question: "What if we need custom features?",
      answer: "Our enterprise team works with large firms to develop custom solutions and integrations tailored to specific workflow requirements."
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-subtle">
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Booking System */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-accent/10 text-accent text-xl">
              Đặt Lịch Nhanh
            </Badge>
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Đặt Lịch Tư Vấn Trực Tuyến</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Đặt lịch hẹn với luật sư chuyên nghiệp một cách nhanh chóng và tiện lợi
            </p>
          </div>
          
          <BookingSystem />
        </section>

        {/* Contact Methods */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Các Cách Liên Hệ Khác</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nhiều cách để liên hệ với đội ngũ chuyên gia công nghệ pháp lý của chúng tôi
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform", method.bgColor)}>
                    <method.icon className={cn("h-8 w-8", method.color)} />
                  </div>
                  <h3 className="font-bold text-lg mb-2 group-hover:text-accent transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                    {method.description}
                  </p>
                  <div className="space-y-1 mb-4">
                    <p className="font-semibold text-primary">{method.detail}</p>
                    <p className="text-xs text-muted-foreground">{method.hours}</p>
                  </div>
                  <Button variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                    {method.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>


        {/* Office Locations */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Our Global Offices</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Visit us at one of our locations or schedule a virtual meeting
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-bold text-lg group-hover:text-accent transition-colors">
                      {office.city}
                    </h3>
                  </div>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-gray-700">{office.address}</p>
                        <p className="text-muted-foreground">{office.zip}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-accent font-medium">{office.phone}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-accent font-medium">{office.email}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-muted-foreground">{office.hours}</p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full mt-4 hover:bg-accent hover:text-accent-foreground">
                    Get Directions
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Quick answers to common questions about our platform and services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-accent transition-colors">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              <FileText className="mr-2 h-5 w-5" />
              View Full FAQ
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Contact;