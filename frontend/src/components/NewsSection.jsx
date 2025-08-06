import React, { useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { newsVideos } from '../mock';

const NewsSection = () => {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % newsVideos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + newsVideos.length) % newsVideos.length);
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Noticias y Actividades
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Mantente al día con nuestras actividades semanales y los momentos especiales que compartimos con nuestros adultos mayores.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Video carousel */}
          <div className="relative overflow-hidden rounded-xl">
            <div className="flex">
              {newsVideos.map((video, index) => (
                <div
                  key={video.id}
                  className={`w-full flex-shrink-0 transition-transform duration-500 ease-in-out`}
                  style={{
                    transform: `translateX(-${currentVideo * 100}%)`
                  }}
                >
                  <Card className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative group cursor-pointer" onClick={() => openVideo(video)}>
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-64 sm:h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="bg-emerald-600 rounded-full p-4 transform group-hover:scale-110 transition-transform duration-300">
                            <Play size={32} className="text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                          <h3 className="text-white font-semibold text-lg mb-2">{video.title}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <Button
            onClick={prevVideo}
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
          >
            <ChevronLeft size={20} />
          </Button>
          
          <Button
            onClick={nextVideo}
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-lg z-10"
          >
            <ChevronRight size={20} />
          </Button>

          {/* Video indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {newsVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentVideo(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentVideo ? 'bg-emerald-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Video Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-4xl w-full">
              <Button
                onClick={closeVideo}
                variant="outline"
                size="icon"
                className="absolute -top-12 right-0 bg-white text-black hover:bg-gray-100"
              >
                ✕
              </Button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NewsSection;