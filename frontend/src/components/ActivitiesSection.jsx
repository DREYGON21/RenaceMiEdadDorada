import React, { useState } from 'react';
import { Calendar, Users, Image as ImageIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { weeklyActivities } from '../mock';

const ActivitiesSection = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openImageGallery = (images, startIndex = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
  };

  const closeImageGallery = () => {
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % selectedImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + selectedImages.length) % selectedImages.length);
  };

  return (
    <section id="actividades" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nuestras Actividades
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Cada semana ofrecemos diferentes actividades diseñadas para promover el bienestar, 
            la socialización y la alegría en nuestros adultos mayores.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {weeklyActivities.map((activity, index) => (
            <Card 
              key={activity.week} 
              className="group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border-0 shadow-lg overflow-hidden bg-white"
            >
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-white/20 rounded-bl-3xl p-4">
                  <Calendar size={24} />
                </div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="bg-white/20 rounded-full p-2">
                    <span className="font-bold text-lg">S{activity.week}</span>
                  </div>
                  <div>
                    <p className="text-emerald-100 text-sm">Semana {activity.week}</p>
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                  {activity.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {activity.description}
                </p>

                {/* Image Gallery */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <ImageIcon size={20} />
                    <span className="font-semibold">Galería de Fotos</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {activity.images.slice(0, 2).map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square"
                        onClick={() => openImageGallery(activity.images, imageIndex)}
                      >
                        <img
                          src={image}
                          alt={`${activity.title} - Imagen ${imageIndex + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-2">
                            <ImageIcon size={20} className="text-gray-700" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {activity.images.length > 2 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-3 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                      onClick={() => openImageGallery(activity.images)}
                    >
                      Ver más fotos ({activity.images.length})
                    </Button>
                  )}
                </div>

                {/* Activity Stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users size={16} />
                      <span>Actividad grupal</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar size={16} />
                      <span>Semanal</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Image Gallery Modal */}
        {selectedImages.length > 0 && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              {/* Close button */}
              <Button
                onClick={closeImageGallery}
                variant="outline"
                size="icon"
                className="absolute -top-12 right-0 bg-white/90 hover:bg-white z-10"
              >
                <X size={20} />
              </Button>

              {/* Image container */}
              <div className="relative bg-white rounded-lg overflow-hidden">
                <img
                  src={selectedImages[currentImageIndex]}
                  alt={`Imagen ${currentImageIndex + 1}`}
                  className="w-full max-h-[80vh] object-contain"
                />

                {/* Navigation arrows */}
                {selectedImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={nextImage}
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white"
                    >
                      →
                    </Button>
                  </>
                )}

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {selectedImages.length}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 text-center">
          <div className="bg-emerald-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">¿Te gustaría participar?</h3>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Únete a nuestras actividades y forma parte de esta hermosa comunidad. 
              Todas las actividades son gratuitas y están abiertas para adultos mayores de la Comuna 17.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-3"
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Contáctanos para más información
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActivitiesSection;