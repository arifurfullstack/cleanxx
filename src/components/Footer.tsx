import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.jpeg";

const Footer = () => {
  const footerLinks = {
    forCustomers: [
      { label: "Find Cleaners", href: "/search" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Reviews", href: "/reviews" },
      { label: "FAQ", href: "/faq" },
    ],
    forCleaners: [
      { label: "Join Our Network", href: "/for-cleaners" },
      { label: "Cleaner Dashboard", href: "/dashboard/cleaner" },
      { label: "Success Stories", href: "/success-stories" },
      { label: "Resources", href: "/resources" },
      { label: "Support", href: "/support" },
    ],
    company: [
      { label: "About Us", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="col-span-2">
            <img src={logo} alt="The Cleaning Network" className="h-14 w-auto mb-4 rounded-lg" />
            <p className="text-primary-foreground/70 mb-6 max-w-xs">
              Canada's trusted marketplace for professional cleaning services. Find, compare, and book verified cleaners.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <Mail className="h-4 w-4" />
                <span>hello@thecleaningnetwork.ca</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <Phone className="h-4 w-4" />
                <span>1-800-CLEAN-NET</span>
              </div>
              <div className="flex items-center gap-3 text-primary-foreground/70">
                <MapPin className="h-4 w-4" />
                <span>Toronto, Canada</span>
              </div>
            </div>
          </div>

          {/* For Customers */}
          <div>
            <h4 className="font-heading font-semibold mb-4">For Customers</h4>
            <ul className="space-y-3">
              {footerLinks.forCustomers.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Cleaners */}
          <div>
            <h4 className="font-heading font-semibold mb-4">For Cleaners</h4>
            <ul className="space-y-3">
              {footerLinks.forCleaners.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-heading font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              © 2026 The Cleaning Network. All rights reserved.
            </p>
            
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
