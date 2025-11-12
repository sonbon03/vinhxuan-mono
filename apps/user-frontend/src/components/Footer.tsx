import { Link } from "react-router-dom";
import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Scale className="h-8 w-8 text-accent" />
              <span className="font-sans font-bold text-xl">LegalPro</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md">
              Professional law office management system providing comprehensive case management, 
              client communication, and practice administration solutions.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-primary-foreground/60 hover:text-accent cursor-pointer transition-colors" />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/cases" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Case Management
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Legal Resources
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-foreground/80 hover:text-accent transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-accent" />
                <span className="text-primary-foreground/80">info@legalpro.com</span>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-accent mt-1" />
                <span className="text-primary-foreground/80">
                  123 Legal Street<br />
                  Suite 456<br />
                  New York, NY 10001
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center">
          <p className="text-primary-foreground/60">
            © 2024 LegalPro. All rights reserved. | 
            <Link to="/privacy" className="hover:text-accent transition-colors ml-2">Privacy Policy</Link> | 
            <Link to="/terms" className="hover:text-accent transition-colors ml-2">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;