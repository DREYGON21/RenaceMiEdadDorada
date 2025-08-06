import React from 'react';
import { MapPin, Phone, Facebook, Instagram, Youtube, Heart } from 'lucide-react';
import { contactInfo } from '../mock';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const socialIcons = [
    { 
      icon: Facebook, 
      link: contactInfo.socialLinks.facebook, 
      label: 'Facebook',
      color: 'hover:text-blue-600'
    },
    { 
      icon: Instagram, 
      link: contactInfo.socialLinks.instagram, 
      label: 'Instagram',
      color: 'hover:text-pink-600'
    },
    { 
      icon: () => (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ), 
      link: contactInfo.socialLinks.tiktok, 
      label: 'TikTok',
      color: 'hover:text-black'
    },
    { 
      icon: Youtube, 
      link: contactInfo.socialLinks.youtube, 
      label: 'YouTube',
      color: 'hover:text-red-600'
    }
  ];

  const quickLinks = [
    { name: 'Inicio', id: 'inicio' },
    { name: 'Nosotros', id: 'nosotros' },
    { name: 'Actividades', id: 'actividades' },
    { name: 'Contacto', id: 'contacto' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Organization Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <h3 className="text-2xl font-bold text-white">
                  {contactInfo.organization}
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Una comunidad dedicada al bienestar y la alegría de nuestros adultos mayores 
                en la Comuna 17 de Bucaramanga.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3 text-gray-300">
                <MapPin size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{contactInfo.address}</p>
                  <p>{contactInfo.city}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-gray-300">
                <Phone size={20} className="text-emerald-500 flex-shrink-0" />
                <div>
                  <p>Teléfono / WhatsApp:</p>
                  <a 
                    href={contactInfo.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {contactInfo.phone}
                  </a>
                </div>
              </div>

              <div className="text-sm text-gray-400 mt-4">
                <p>{contactInfo.nit}</p>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Heart className="text-emerald-500" size={24} />
              <span>Síguenos</span>
            </h3>
            
            <p className="text-gray-400">
              Mantente al día con nuestras actividades y eventos especiales
            </p>

            <div className="flex flex-wrap gap-4">
              {socialIcons.map((social, index) => (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full text-gray-300 transition-all duration-300 transform hover:scale-110 hover:bg-gray-700 ${social.color}`}
                  aria-label={social.label}
                >
                  <social.icon size={24} />
                </a>
              ))}
            </div>

            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-300 mb-2">¿Prefieres WhatsApp?</p>
              <a
                href={contactInfo.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                <span>📱</span>
                <span>Chatea con nosotros</span>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Navegación Rápida</h3>
            
            <div className="space-y-3">
              {quickLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-gray-300 hover:text-emerald-400 transition-colors duration-300 text-left hover:translate-x-1 transform"
                >
                  {link.name}
                </button>
              ))}
            </div>

            <div className="bg-emerald-600/20 rounded-lg p-4 border border-emerald-600/30">
              <h4 className="font-semibold text-emerald-300 mb-2">¡Únete a nosotros!</h4>
              <p className="text-sm text-emerald-100 mb-3">
                Participa en nuestras actividades semanales
              </p>
              <button
                onClick={() => scrollToSection('contacto')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full text-sm transition-colors"
              >
                Contáctanos
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} {contactInfo.organization}. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Fundación sin ánimo de lucro comprometida con nuestros adultos mayores
              </p>
            </div>
            
            <div className="flex items-center space-x-2 text-gray-400 text-sm">
              <span>Hecho con</span>
              <Heart className="text-red-500" size={16} />
              <span>para la comunidad</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;