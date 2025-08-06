import React, { useState, useEffect } from 'react';
import './App.css';
import { Toaster } from './components/ui/toaster';

// Components
import Loader from './components/Loader';
import Header from './components/Header';
import HeroCarousel from './components/HeroCarousel';
import NewsSection from './components/NewsSection';
import AboutSection from './components/AboutSection';
import ActivitiesSection from './components/ActivitiesSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Smooth scrolling for the entire app
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
  }, []);

  return (
    <div className="App">
      {isLoading ? (
        <Loader onLoadingComplete={handleLoadingComplete} />
      ) : (
        <>
          <Header />
          <main>
            <HeroCarousel />
            <NewsSection />
            <AboutSection />
            <ActivitiesSection />
            <ContactSection />
          </main>
          <Footer />
          <Toaster />
        </>
      )}
    </div>
  );
}

export default App;