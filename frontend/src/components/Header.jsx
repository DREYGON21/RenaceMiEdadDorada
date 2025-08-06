import React, { useState, useEffect } from 'react';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import { contactInfo } from '../mock';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const socialIcons = [
    { icon: Facebook, link: contactInfo.socialLinks.facebook, label: 'Facebook' },
    { icon: Instagram, link: contactInfo.socialLinks.instagram, label: 'Instagram' },
    { 
      icon: () => (
        <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ), 
      link: contactInfo.socialLinks.tiktok, 
      label: 'TikTok' 
    },
    { icon: Youtube, link: contactInfo.socialLinks.youtube, label: 'YouTube' }
  ];

  return (
    <header className={`fixed top-0 w-full z-40 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className={`ml-2 font-bold text-lg ${
              isScrolled ? 'text-emerald-800' : 'text-white'
            }`}>
              Renace Mi Edad Dorada
            </span>
          </div>

          {/* Navigation Menu - Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('inicio')}
              className={`font-medium transition-colors hover:text-emerald-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-emerald-200'
              }`}
            >
              Inicio
            </button>
            <button
              onClick={() => scrollToSection('nosotros')}
              className={`font-medium transition-colors hover:text-emerald-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-emerald-200'
              }`}
            >
              Nosotros
            </button>
            <button
              onClick={() => scrollToSection('actividades')}
              className={`font-medium transition-colors hover:text-emerald-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-emerald-200'
              }`}
            >
              Actividades
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className={`font-medium transition-colors hover:text-emerald-600 ${
                isScrolled ? 'text-gray-700' : 'text-white hover:text-emerald-200'
              }`}
            >
              Contacto
            </button>

            {/* Social Icons */}
            <div className="flex items-center space-x-3 ml-6 border-l border-gray-300 pl-6">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors hover:text-emerald-600 ${
                    isScrolled ? 'text-gray-600' : 'text-white hover:text-emerald-200'
                  }`}
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`}
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center">
                <span className={`block w-5 h-0.5 bg-current transform transition-transform ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-1' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-current mt-1 transition-opacity ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`} />
                <span className={`block w-5 h-0.5 bg-current mt-1 transform transition-transform ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-1' : ''
                }`} />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg rounded-lg mt-2 overflow-hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => scrollToSection('inicio')}
                className="block w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-emerald-50 rounded-md transition-colors"
              >
                Inicio
              </button>
              <button
                onClick={() => scrollToSection('nosotros')}
                className="block w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-emerald-50 rounded-md transition-colors"
              >
                Nosotros
              </button>
              <button
                onClick={() => scrollToSection('actividades')}
                className="block w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-emerald-50 rounded-md transition-colors"
              >
                Actividades
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="block w-full text-left px-3 py-2 text-gray-700 font-medium hover:bg-emerald-50 rounded-md transition-colors"
              >
                Contacto
              </button>
            </div>
            
            {/* Social Icons Mobile */}
            <div className="border-t border-gray-200 px-2 py-3">
              <div className="flex justify-center space-x-6">
                {socialIcons.map((social, index) => (
                  <a
                    key={index}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-emerald-600 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;