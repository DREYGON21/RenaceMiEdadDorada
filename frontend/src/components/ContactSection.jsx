import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useToast } from '../hooks/use-toast';
import { contactInfo } from '../mock';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "¡Mensaje enviado!",
        description: "Nos pondremos en contacto contigo pronto.",
      });
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contacto" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Contáctanos
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            ¿Tienes alguna pregunta o quieres formar parte de nuestra comunidad? 
            Estamos aquí para ayudarte. Contáctanos por cualquiera de estos medios.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="flex items-center space-x-3 text-emerald-800">
                  <MapPin size={24} />
                  <span>Nuestra Ubicación</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-2 text-gray-700">
                  <p className="font-semibold text-lg">{contactInfo.organization}</p>
                  <p>{contactInfo.address}</p>
                  <p>{contactInfo.city}</p>
                  <p className="text-sm text-gray-500 mt-3">{contactInfo.nit}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="flex items-center space-x-3 text-emerald-800">
                  <Phone size={24} />
                  <span>Información de Contacto</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone size={20} className="text-emerald-600" />
                    <div>
                      <p className="font-semibold">Teléfono / WhatsApp</p>
                      <a 
                        href={contactInfo.socialLinks.whatsapp}
                        className="text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        {contactInfo.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardHeader className="bg-emerald-50">
                <CardTitle className="flex items-center space-x-3 text-emerald-800">
                  <MapPin size={24} />
                  <span>Encuéntranos</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-video">
                  <iframe
                    src={contactInfo.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Ubicación de Renace Mi Edad Dorada"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Mail size={28} />
                  <span>Envíanos un Mensaje</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name" className="text-gray-700 font-semibold">
                        Nombre *
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Tu nombre completo"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-gray-700 font-semibold">
                        Correo Electrónico *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-semibold">
                      Asunto *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="¿De qué quieres hablarnos?"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-gray-700 font-semibold">
                      Mensaje *
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Escribe tu mensaje aquí..."
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      className="mt-2 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Enviando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Send size={20} />
                        <span>Enviar Mensaje</span>
                      </div>
                    )}
                  </Button>

                  <p className="text-sm text-gray-500 text-center mt-4">
                    * Campos requeridos
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* WhatsApp Quick Contact */}
            <div className="mt-6">
              <Card className="border-2 border-green-200 bg-green-50">
                <CardContent className="p-6 text-center">
                  <h3 className="font-bold text-green-800 mb-2">¿Prefieres WhatsApp?</h3>
                  <p className="text-green-700 mb-4 text-sm">
                    Contáctanos directamente por WhatsApp para una respuesta más rápida
                  </p>
                  <Button
                    asChild
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <a
                      href={contactInfo.socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2"
                    >
                      <span>📱</span>
                      <span>Chatear por WhatsApp</span>
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;