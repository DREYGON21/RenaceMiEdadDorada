import React, { useEffect, useState } from 'react';

const Loader = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => onLoadingComplete(), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onLoadingComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center z-50 transition-opacity duration-500">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white text-2xl font-bold">R</span>
          </div>
          <h2 className="text-2xl font-bold text-emerald-800">Renace Mi Edad Dorada</h2>
          <p className="text-emerald-600 mt-2">Cargando...</p>
        </div>
        
        <div className="w-64 bg-emerald-200 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-emerald-600 mt-2 text-sm">{progress}%</p>
      </div>
    </div>
  );
};

export default Loader;