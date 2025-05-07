import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-emerald-800 text-white pt-8 pb-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">About VrudhaCare</h3>
            <p className="text-emerald-100 text-sm">
              VrudhaCare is an initiative by senior residents of our old age
              home, selling handmade products and accepting donations to support
              their well-being.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-emerald-100 hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  className="text-emerald-100 hover:text-white"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="text-emerald-100 hover:text-white"
                >
                  Donate
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-emerald-100 hover:text-white">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-emerald-300" />
                <span className="text-emerald-100">
                  123 Care Lane, Silver City, SV 12345
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-4 w-4 mr-2 text-emerald-300" />
                <span className="text-emerald-100">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-emerald-300" />
                <a
                  href="mailto:contact@vrudhacare.com"
                  className="text-emerald-100 hover:text-white"
                >
                  contact@vrudhacare.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a
                href="#facebook"
                className="text-white hover:text-emerald-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#instagram"
                className="text-white hover:text-emerald-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#twitter"
                className="text-white hover:text-emerald-300"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-700 mt-8 pt-4 text-center text-xs text-emerald-200">
          <p>© {new Date().getFullYear()} VrudhaCare. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
