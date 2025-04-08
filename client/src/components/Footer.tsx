import { Link } from 'wouter';
import { FaTwitter, FaTelegram, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} FUT Draft Spin. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6 mb-4 md:mb-0">
            <Link href="/terms">
              <a className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms
              </a>
            </Link>
            <Link href="/privacy">
              <a className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy
              </a>
            </Link>
            <Link href="/help">
              <a className="text-gray-400 hover:text-white text-sm transition-colors">
                Help
              </a>
            </Link>
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTwitter size={20} />
            </a>
            <a 
              href="https://t.me/FutDraftSpinBot" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaTelegram size={20} />
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
