import React from 'react';
import { History, Target, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { aboutInfo } from '../mock';

const AboutSection = () => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'History':
        return History;
      case 'Target':
        return Target;
      case 'Eye':
        return Eye;
      default:
        return Target;
    }
  };

  return (
    <section id="nosotros" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Nosotros
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            {aboutInfo.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutInfo.sections.map((section, index) => {
            const IconComponent = getIcon(section.icon);
            return (
              <Card 
                key={index} 
                className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50"
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-600 transition-colors duration-300">
                    <IconComponent 
                      size={32} 
                      className="text-emerald-600 group-hover:text-white transition-colors duration-300" 
                    />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors duration-300">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed text-lg">
                    {section.content}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Decorative elements */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-4 bg-emerald-50 rounded-full px-8 py-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Heart className="text-white" size={24} />
            </div>
            <div className="text-emerald-800">
              <p className="font-semibold text-lg">Fundado con amor por:</p>
              <p className="text-sm">Ramiro Meléndez Díaz y Carmen Fuentes Ruiz</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;