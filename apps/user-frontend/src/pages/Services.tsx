import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Scale,
  Shield, 
  Clock, 
  Users, 
  FileText, 
  MessageCircle,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
  Award,
  Globe,
  Zap,
  TrendingUp,
  Building,
  Briefcase,
  Phone,
  Mail,
  Calendar,
  PlayCircle,
  Target,
  Heart,
  BookOpen,
  Gavel,
  Home,
  UserCheck,
  DollarSign,
  Lightbulb,
  Headphones,
  MonitorSpeaker,
  PieChart,
  Lock,
  Cloud,
  Smartphone,
  Workflow
} from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const Services = () => {
  const [activeService, setActiveService] = useState("practice-management");

  const serviceCategories = [
    {
      id: "practice-management",
      name: "Practice Management",
      icon: Briefcase,
      color: "text-blue-600",
      description: "Complete law firm management solutions"
    },
    {
      id: "client-services",
      name: "Client Services",
      icon: Users,
      color: "text-green-600", 
      description: "Enhanced client communication tools"
    },
    {
      id: "document-management",
      name: "Document Management",
      icon: FileText,
      color: "text-purple-600",
      description: "Secure document handling and storage"
    },
    {
      id: "legal-tech",
      name: "Legal Technology",
      icon: Zap,
      color: "text-orange-600",
      description: "AI-powered legal solutions"
    }
  ];

  const practiceManagementServices = [
    {
      title: "Case Management System",
      description: "Comprehensive case tracking with automated workflows, deadline management, and progress monitoring.",
      features: ["Automated deadline tracking", "Progress monitoring", "Task assignment", "Calendar integration"],
      icon: FileText,
      price: "Starting at $99/month",
      popular: true
    },
    {
      title: "Time & Billing Management", 
      description: "Accurate time tracking with automated billing and invoice generation for all practice areas.",
      features: ["Automatic time tracking", "Invoice generation", "Payment processing", "Financial reporting"],
      icon: Clock,
      price: "Starting at $79/month",
      popular: false
    },
    {
      title: "Client Portal",
      description: "Secure client communication platform with document sharing and case status updates.",
      features: ["Secure messaging", "Document sharing", "Case updates", "Appointment scheduling"],
      icon: Users,
      price: "Starting at $59/month", 
      popular: false
    },
    {
      title: "Analytics & Reporting",
      description: "Comprehensive business intelligence with performance metrics and growth insights.",
      features: ["Performance dashboards", "Custom reports", "Trend analysis", "ROI tracking"],
      icon: BarChart3,
      price: "Starting at $129/month",
      popular: false
    }
  ];

  const clientServices = [
    {
      title: "Virtual Reception",
      description: "Professional virtual receptionist service with legal intake and appointment scheduling.",
      features: ["24/7 call answering", "Legal intake forms", "Appointment scheduling", "Message forwarding"],
      icon: Phone,
      price: "Starting at $199/month",
      popular: true
    },
    {
      title: "Client Communication Suite",
      description: "Multichannel communication platform with video conferencing and secure messaging.",
      features: ["Video conferencing", "Secure messaging", "Document sharing", "Mobile app access"],
      icon: MessageCircle,
      price: "Starting at $89/month",
      popular: false
    },
    {
      title: "Legal Forms Library",
      description: "Extensive library of legal forms and documents for all practice areas.",
      features: ["1000+ legal forms", "Customizable templates", "State-specific documents", "Regular updates"],
      icon: BookOpen,
      price: "Starting at $49/month",
      popular: false
    },
    {
      title: "Client Relationship Management",
      description: "CRM system designed specifically for legal practices with client lifecycle management.",
      features: ["Contact management", "Case history tracking", "Automated follow-ups", "Referral tracking"],
      icon: UserCheck,
      price: "Starting at $119/month",
      popular: false
    }
  ];

  const documentServices = [
    {
      title: "Document Automation",
      description: "AI-powered document generation with smart templates and clause libraries.",
      features: ["Smart templates", "Clause libraries", "Auto-population", "Version control"],
      icon: FileText,
      price: "Starting at $149/month",
      popular: true
    },
    {
      title: "Secure Document Storage",
      description: "Bank-level security document storage with advanced search and organization.",
      features: ["Encrypted storage", "Advanced search", "Access controls", "Audit trails"],
      icon: Lock,
      price: "Starting at $69/month",
      popular: false
    },
    {
      title: "E-Signature Solutions",
      description: "Legally compliant electronic signature platform with workflow automation.",
      features: ["Legal compliance", "Workflow automation", "Multi-party signing", "Integration support"],
      icon: Shield,
      price: "Starting at $39/month",
      popular: false
    },
    {
      title: "Document Review & Analysis",
      description: "AI-assisted document review with contract analysis and risk assessment.",
      features: ["AI contract analysis", "Risk assessment", "Key term extraction", "Comparison tools"],
      icon: MonitorSpeaker,
      price: "Starting at $299/month",
      popular: false
    }
  ];

  const legalTechServices = [
    {
      title: "AI Legal Research",
      description: "Advanced AI-powered legal research with case law analysis and precedent finding.",
      features: ["Case law analysis", "Precedent finding", "Legal citation", "Research automation"],
      icon: Lightbulb,
      price: "Starting at $199/month",
      popular: true
    },
    {
      title: "Predictive Case Analytics",
      description: "Machine learning algorithms to predict case outcomes and strategies.",
      features: ["Outcome prediction", "Strategy recommendations", "Judge analytics", "Settlement probability"],
      icon: TrendingUp,
      price: "Starting at $399/month",
      popular: false
    },
    {
      title: "Legal Compliance Monitoring",
      description: "Automated compliance monitoring with regulatory updates and alerts.",
      features: ["Regulatory monitoring", "Compliance alerts", "Risk assessment", "Audit preparation"],
      icon: Shield,
      price: "Starting at $249/month",
      popular: false
    },
    {
      title: "Workflow Automation",
      description: "Intelligent workflow automation for repetitive legal processes and tasks.",
      features: ["Process automation", "Task routing", "Approval workflows", "Integration APIs"],
      icon: Workflow,
      price: "Starting at $179/month",
      popular: false
    }
  ];

  const specialtyServices = [
    {
      title: "Real Estate Law",
      description: "Specialized tools for real estate transactions, closings, and documentation.",
      icon: Home,
      features: ["Transaction management", "Closing coordination", "Title searches", "Document preparation"],
      caseStudy: "Reduced closing time by 40% for major real estate firm"
    },
    {
      title: "Corporate Law",
      description: "Enterprise solutions for corporate legal departments and business law firms.",
      icon: Building,
      features: ["Contract lifecycle management", "Compliance tracking", "Corporate governance", "M&A support"],
      caseStudy: "Streamlined contract management for Fortune 500 company"
    },
    {
      title: "Family Law",
      description: "Compassionate tools for family law practice with client-focused features.",
      icon: Heart,
      features: ["Custody scheduling", "Financial calculations", "Mediation support", "Client communication"],
      caseStudy: "Improved client satisfaction by 60% in family law practice"
    },
    {
      title: "Criminal Defense",
      description: "Comprehensive case management for criminal defense attorneys.",
      icon: Gavel,
      features: ["Case timeline tracking", "Evidence management", "Court scheduling", "Client communication"],
      caseStudy: "Enhanced case preparation efficiency by 50%"
    },
    {
      title: "Personal Injury",
      description: "Specialized practice management for personal injury law firms.",
      icon: Shield,
      features: ["Medical record management", "Settlement tracking", "Expense tracking", "Client portals"],
      caseStudy: "Increased settlement amounts by 25% on average"
    },
    {
      title: "Intellectual Property",
      description: "Advanced tools for IP attorneys and patent prosecution.",
      icon: Lightbulb,
      features: ["Patent docketing", "Trademark monitoring", "IP portfolio management", "Filing automation"],
      caseStudy: "Reduced patent filing errors by 90%"
    }
  ];

  const supportTiers = [
    {
      name: "Essential Support",
      price: "Included",
      features: [
        "Email support (48hr response)",
        "Knowledge base access",
        "Video tutorials",
        "Community forum"
      ],
      icon: Mail,
      popular: false
    },
    {
      name: "Priority Support",
      price: "$99/month",
      features: [
        "Phone support (4hr response)",
        "Priority email support",
        "Live chat support",
        "Training webinars",
        "Dedicated account manager"
      ],
      icon: Headphones,
      popular: true
    },
    {
      name: "Enterprise Support",
      price: "Custom",
      features: [
        "24/7 phone support",
        "Dedicated support team",
        "On-site training",
        "Custom integrations",
        "White-glove implementation"
      ],
      icon: Award,
      popular: false
    }
  ];

  const getCurrentServices = () => {
    switch (activeService) {
      case "practice-management":
        return practiceManagementServices;
      case "client-services":
        return clientServices;
      case "document-management":
        return documentServices;
      case "legal-tech":
        return legalTechServices;
      default:
        return practiceManagementServices;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary/95 to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium mb-4">
              <Briefcase className="w-4 h-4 mr-2" />
              Comprehensive Legal Services
            </div>
            <h1 className="font-sans text-4xl md:text-6xl font-bold mb-6">
              Professional Legal Solutions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              From solo practitioners to large firms, our comprehensive suite of legal services and technology solutions helps you serve clients better and grow your practice.
            </p>
            <div className="flex justify-center space-x-8 pt-6">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-2 mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Trusted Solutions</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-2 mx-auto">
                  <Headphones className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Expert Support</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full mb-2 mx-auto">
                  <Globe className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium">Nationwide Service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Service Categories */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Our Service Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose from our comprehensive range of legal technology and professional services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {serviceCategories.map((category) => (
              <Card 
                key={category.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 border-2 hover:shadow-lg",
                  activeService === category.id 
                    ? "border-accent bg-accent/5 shadow-md" 
                    : "border-transparent hover:border-accent/50"
                )}
                onClick={() => setActiveService(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4", category.color === "text-blue-600" ? "bg-blue-50" : category.color === "text-green-600" ? "bg-green-50" : category.color === "text-purple-600" ? "bg-purple-50" : "bg-orange-50")}>
                    <category.icon className={cn("h-8 w-8", category.color)} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Service Details */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {getCurrentServices().map((service, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md relative overflow-hidden">
                {service.popular && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-accent text-accent-foreground">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-accent/10 to-accent/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <service.icon className="h-7 w-7 text-accent" />
                    </div>
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-accent transition-colors">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-4">
                      <Button className="w-full bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent text-accent-foreground">
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Specialty Practice Areas */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Specialty Practice Solutions</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tailored solutions for specific legal practice areas with industry expertise
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {specialtyServices.map((specialty, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <specialty.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-bold group-hover:text-accent transition-colors">
                    {specialty.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {specialty.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <ul className="space-y-2">
                      {specialty.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="p-3 bg-accent/5 rounded-lg border-l-4 border-accent">
                      <p className="text-sm text-accent font-medium">Success Story</p>
                      <p className="text-xs text-muted-foreground mt-1">{specialty.caseStudy}</p>
                    </div>
                    <Button variant="outline" className="w-full hover:bg-accent hover:text-accent-foreground">
                      Learn More
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Support Tiers */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl font-bold text-primary mb-4">Support & Training</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the level of support that fits your practice needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {supportTiers.map((tier, index) => (
              <Card key={index} className={cn(
                "group hover:shadow-xl transition-all duration-300 border-0 shadow-md relative",
                tier.popular && "border-2 border-accent"
              )}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-accent text-accent-foreground px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent/10 to-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <tier.icon className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-xl font-bold">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{tier.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className={cn(
                    "w-full mt-6",
                    tier.popular 
                      ? "bg-gradient-to-r from-accent to-accent/90 hover:from-accent/90 hover:to-accent" 
                      : "variant-outline"
                  )}>
                    {tier.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-accent via-accent/90 to-primary text-white rounded-2xl p-12 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="font-sans text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Practice?
            </h2>
            <p className="text-xl text-white/90">
              Get started with a free consultation and see how our solutions can help your firm grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" variant="secondary" className="bg-white text-accent hover:bg-white/90 shadow-xl" asChild>
                <Link to="/contact">
                  Schedule Free Consultation
                  <Calendar className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10 backdrop-blur-sm">
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-8 pt-6 border-t border-white/20">
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>Free Setup</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>30-Day Trial</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <CheckCircle className="w-5 h-5" />
                <span>No Long-term Contracts</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;