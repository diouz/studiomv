import React, { useState, useEffect } from 'react';
import Cursor from './components/Cursor';
import Navbar from './components/Navbar';
import SocialSidebar from './components/SocialSidebar';
import Hero from './components/Hero';
import ShowreelSection from './components/ShowreelSection';
import ProjectCarousel from './components/ProjectCarousel';
import ServicesSection from './components/ServicesSection';
import AboutSection from './components/AboutSection';
import TestimonialsSection from './components/TestimonialsSection';
import ImageGallery from './components/ImageGallery';
import AcademiaSection from './components/AcademiaSection';
import Footer from './components/Footer';
import Loading from './components/Loading';
import SEO, { usePageSEO } from './components/SEO';
import {
  LazyContact,
  LazyPortfolio,
  LazyServicesPage,
  LazyAboutPage,
  LazyContactPage,
  useProgressiveLoading
} from './components/LazyComponent';
import NotFound from './pages/NotFound';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Progressive loading of components
  useProgressiveLoading([
    () => import('./components/Contact'),
  ], 1000);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Simple routing based on hash
  const currentPage = window.location.hash.slice(1) || 'home';

  // Generate SEO data for current page
  const seoData = usePageSEO(currentPage);

  const renderPage = () => {
    switch (currentPage) {
      case 'portfolio':
        return <LazyPortfolio />;
      case 'services-page':
      case 'services':
        return <LazyServicesPage />;
      case 'about-page':
      case 'about':
        return <LazyAboutPage />;
      case 'contact-page':
      case 'contact':
        return <LazyContactPage />;
      case 'home':
      case '':
        return (
          <main className="relative overflow-hidden">
            {/* Hero como base */}
            <Hero />

            {/* Showreel Section */}
            <ShowreelSection />

            {/* Portfolio Carousel */}
            <ProjectCarousel />

            {/* Services Section */}
            <ServicesSection />

            {/* About Section */}
            <AboutSection />

            {/* Testimonials Section */}
            <TestimonialsSection />

            {/* Contact Section */}
            <LazyContact />
          </main>
        );
      default:
        // Página 404 para rotas não encontradas
        return <NotFound />;
    }
  };

  if (isLoading) {
    return (
      <>
        <SEO {...seoData} />
        <Loading />
      </>
    );
  }

  return (
    <>
      <SEO {...seoData} />
      <div className="relative min-h-screen bg-black overflow-x-hidden">
      {/* Global CSS for smooth transitions */}
      <style jsx global>{`
        * {
          scroll-behavior: smooth;
        }

        body {
          transition: all 0.3s ease;
          cursor: none;
        }

        * {
          cursor: none !important;
        }

        .custom-cursor-area {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Enhanced hover effects */
        button, a {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:hover, a:hover {
          transform: translateY(-2px);
          filter: brightness(1.1);
        }

        /* Smooth scrolling for webkit browsers */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.5);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 119, 6, 0.8);
        }

        /* Animação de gradiente para botões */
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 3s ease infinite;
        }

        .gradient-animate:hover {
          animation-duration: 1s;
        }
      `}</style>
      {/* Background Grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <Navbar />
      <SocialSidebar />

      {/* Main content with padding-top */}
      <div className="pt-6">
        {renderPage()}
      </div>

      <Footer />

      {/* Cursor deve estar no final para ficar sempre no topo */}
      <Cursor />
      </div>
    </>
  );
}

export default App;