import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [splinePreloaded, setSplinePreloaded] = useState(false);

  // Preload Spline durante o splash
  useEffect(() => {
    const preloadSpline = () => {
      // Criar elemento spline-viewer invisível para preload
      const splineElement = document.createElement('spline-viewer');
      splineElement.setAttribute('url', 'https://prod.spline.design/jTMyGBieAUQfvg0X/scene.splinecode');
      splineElement.style.position = 'absolute';
      splineElement.style.top = '-9999px';
      splineElement.style.left = '-9999px';
      splineElement.style.width = '1px';
      splineElement.style.height = '1px';
      splineElement.style.opacity = '0';
      splineElement.style.pointerEvents = 'none';

      const handleLoad = () => {
        console.log('Spline preloaded successfully during splash');
        setSplinePreloaded(true);
        document.body.removeChild(splineElement);
      };

      const handleError = () => {
        console.warn('Spline preload failed during splash');
        setSplinePreloaded(true); // Continue anyway
        if (document.body.contains(splineElement)) {
          document.body.removeChild(splineElement);
        }
      };

      splineElement.addEventListener('load', handleLoad);
      splineElement.addEventListener('ready', handleLoad);
      splineElement.addEventListener('error', handleError);

      document.body.appendChild(splineElement);

      // Timeout para preload
      setTimeout(() => {
        if (document.body.contains(splineElement)) {
          handleError();
        }
      }, 4000);
    };

    // Iniciar preload após 500ms
    const preloadTimer = setTimeout(preloadSpline, 500);

    return () => clearTimeout(preloadTimer);
  }, []);

  useEffect(() => {
    const timer1 = setTimeout(() => setLogoVisible(true), 300);
    const timer2 = setTimeout(() => setTextVisible(true), 800);

    // Aguardar preload do Spline antes de fazer fade out
    const checkSplineAndFadeOut = () => {
      if (splinePreloaded) {
        setFadeOut(true);
        setTimeout(() => {
          setIsVisible(false);
          onComplete();
        }, 700);
      } else {
        // Verificar novamente em 200ms
        setTimeout(checkSplineAndFadeOut, 200);
      }
    };

    const timer3 = setTimeout(checkSplineAndFadeOut, 2500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete, splinePreloaded]);

  if (!isVisible) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ${
      fadeOut ? 'opacity-0' : 'opacity-100'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(201,169,97,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(201,169,97,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className={`flex items-center justify-center mb-8 transition-all duration-1000 ease-out ${
          logoVisible
            ? 'opacity-100 transform translate-y-0 scale-100'
            : 'opacity-0 transform translate-y-8 scale-90'
        }`}>
          <div className="relative">
            {/* MV Studio Logo - Maior e mais livre */}
            <div className="w-32 h-32 flex items-center justify-center">
              <img
                src="/img/logo/MV_logo Branco.png"
                alt="MV Studio"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Glow effect sutil */}
            <div className="absolute inset-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl"></div>
          </div>
        </div>

        {/* Company Description */}
        <div className={`transition-all duration-1000 ease-out delay-300 ${
          textVisible
            ? 'opacity-100 transform translate-y-0'
            : 'opacity-0 transform translate-y-4'
        }`}>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-800 to-transparent mx-auto mb-6"></div>

          <p className="text-amber-800/90 text-xl font-light tracking-wider">
            Produção Audiovisual
          </p>
        </div>

        {/* Loading Animation */}
        <div className={`mt-12 transition-all duration-500 ease-out ${
          textVisible 
            ? 'opacity-100 transform translate-y-0' 
            : 'opacity-0 transform translate-y-4'
        }`}>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-amber-800 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
            <div className="w-2 h-2 bg-amber-700 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
            <div className="w-2 h-2 bg-amber-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default SplashScreen;
