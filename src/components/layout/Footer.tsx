import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Phone, PhoneCall,} from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">م. مبارك سعيد</h3>
            <p className="text-gray-300 mb-4">
              متخصص في تطوير البرمجيات وتكنولوجيا المعلومات.، أقدم خدمات احترافية في مجال تطوير البرمجيات.
            </p>
            <div className="flex space-x-4 space-x-reverse">
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-blue-400 transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/projects" className="text-gray-300 hover:text-blue-400 transition-colors">
                  المشاريع
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-blue-400 transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link to="/skills" className="text-gray-300 hover:text-blue-400 transition-colors">
                  المهارات
                </Link>
              </li>
              <li>
                <Link to="/cv" className="text-gray-300 hover:text-blue-400 transition-colors">
                  السيرة الذاتية
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-blue-400 transition-colors">
                  اتصل بي
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">معلومات الاتصال</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <Mail size={18} className="ml-2 text-blue-400" />
                <a href="mailto:eng.mubarakai@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                  eng.mubarakai@gmail.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="ml-2 text-blue-400" />
                <a href="tel:+967779032862" className="text-gray-300 hover:text-blue-400 transition-colors">
                  779032862
                </a>
              </li>
              <li className="flex items-center">
                <PhoneCall size={18} className="ml-2 text-blue-400" />
                <a href="tel:+967779032862" className="text-gray-300 hover:text-blue-400 transition-colors">
                  737659508
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} م. مبارك سعيد. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;