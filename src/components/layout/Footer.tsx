import { Scale, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-accent rounded-lg">
                <Scale className="h-6 w-6 text-accent-foreground" />
              </div>
              <div>
                <span className="text-xl font-display font-bold">Premier Law</span>
                <span className="block text-xs opacity-80">Associates</span>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Excellence in legal representation. Trusted advisors for individuals and businesses since 1985.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <NavLink to="/" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                Home
              </NavLink>
              <NavLink to="/practice-areas" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                Practice Areas
              </NavLink>
              <NavLink to="/attorneys" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                Our Attorneys
              </NavLink>
              <NavLink to="/about" className="text-sm opacity-80 hover:opacity-100 hover:text-accent transition-all">
                About Us
              </NavLink>
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 mt-0.5 opacity-80" />
                <span className="text-sm opacity-80">
                  123 Legal Plaza, Suite 500<br />
                  New York, NY 10001
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-80">(212) 555-0123</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 opacity-80" />
                <span className="text-sm opacity-80">info@premierlaw.com</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Office Hours</h3>
            <div className="text-sm opacity-80 space-y-2">
              <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
              <p>Saturday: 10:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="mt-4 text-accent">24/7 Emergency Legal Services Available</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm opacity-80">
            © {new Date().getFullYear()} Premier Law Associates. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-all">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-all">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-all">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
