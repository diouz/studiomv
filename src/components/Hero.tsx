import React, { useEffect, useState, useRef } from 'react';
import { useScrollAnimation as useParallaxScrollAnimation } from '../hooks/useParallax';
import { ParallaxElement, ParallaxLayers } from './HomeParallax';
import DramaticTransitions, { TypewriterEffect } from './DramaticTransitions';
import { usePublicSettings } from '../hooks/usePublicData';
import { AnimatedElement } from '../hooks/useScrollAnimation';
import ResponsiveButton from './ui/ResponsiveButton';

// Spline Scene Component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'spline-viewer': {
        url: string;
        ref?: React.RefObject<any>;
        style?: React.CSSProperties;
        className?: string;
        'events-target'?: string;
      };
    }
  }
}

// Hook para detectar scroll e trigger click automático no Spline
const useSplineAutoClick = (splineRef: React.RefObject<any>) => {
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const triggerPoint = window.innerHeight * 0.15; // 15% da altura da tela

      if (scrollY > triggerPoint && !hasTriggered && splineRef.current) {
        // Simula um clique no centro do Spline
        const splineElement = splineRef.current;
        const rect = splineElement.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Dispara evento de clique
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + centerX,
          clientY: rect.top + centerY,
          bubbles: true
        });

        splineElement.dispatchEvent(clickEvent);
        setHasTriggered(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasTriggered, splineRef]);

  return { hasTriggered };
};


const Hero: React.FC = () => {
  const { settings } = usePublicSettings();
  const splineRef = useRef<any>(null);
  const { elementRef: heroRef } = useParallaxScrollAnimation(0.1);
  const [isHoveringTitle, setIsHoveringTitle] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [splineError, setSplineError] = useState(false);
  const [splineLoaded, setSplineLoaded] = useState(false);

  // Textos do Hero (do Firebase ou padrão)
  const heroTitle = settings?.heroTitle || 'Filmes que carregam';
  const heroSubtitle = settings?.heroSubtitle || 'emoções, frames que guardam histórias.';
  const heroDescription = settings?.heroDescription || 'O vídeo que a sua marca precisa, nós criamos com paixão.';

  // Hook para trigger automático no Spline quando faz scroll
  useSplineAutoClick(splineRef);

  // Error handling para Spline
  useEffect(() => {
    const handleSplineError = () => {
      console.warn('Spline viewer failed to load, using fallback');
      setSplineError(true);
    };

    const handleSplineLoad = () => {
      console.log('Spline viewer loaded successfully');
      setSplineLoaded(true);
    };

    // Timeout para detectar falha de carregamento
    const timeout = setTimeout(() => {
      if (!splineLoaded) {
        handleSplineError();
      }
    }, 10000); // 10 segundos

    return () => clearTimeout(timeout);
  }, [splineLoaded]);

  // Mouse tracking para interação orbital
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // -1 to 1
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Função para scroll suave para showreel
  const scrollToShowreel = () => {
    const showreelSection = document.querySelector('#showreel');
    if (showreelSection) {
      showreelSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Função para detectar se o usuário fez scroll após chegar ao showreel
  const hasUserScrolledAfterShowreel = () => {
    const showreelSection = document.querySelector('#showreel');
    if (!showreelSection) return false;

    const rect = showreelSection.getBoundingClientRect();
    const showreelTop = rect.top + window.scrollY;
    const currentScroll = window.scrollY;

    // Se o usuário scrollou mais de 100px após o showreel, considera que fez scroll manual
    return currentScroll > showreelTop + 100;
  };

  // Adicionar event listener para cliques no Spline
  useEffect(() => {
    const handleSplineClick = () => {
      console.log('Spline clicked! Scrolling to showreel...');
      scrollToShowreel();
    };

    if (splineRef.current) {
      splineRef.current.addEventListener('click', handleSplineClick);
    }

    return () => {
      if (splineRef.current) {
        splineRef.current.removeEventListener('click', handleSplineClick);
      }
    };
  }, []);

  // Função para scroll suave para o Showreel
  const handleScrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    scrollToShowreel();
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-between overflow-hidden bg-black"
    >
      {/* Background simples sem parallax */}
      <div className="absolute inset-0 z-0 bg-black"></div>

      {/* Grid Vertical Estática - castanho escuro - Atrás do Spline */}
      <div className="absolute inset-0 z-0 overflow-hidden opacity-30">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-amber-900/40 to-transparent"
            style={{
              left: `${(i + 1) * 8.33}%`,
            }}
          />
        ))}
      </div>

      {/* Spline 3D sem parallax - posição fixa e maior com interação orbital */}
      <div
        className="absolute top-1/2 sm:top-1/4 right-1/2 sm:right-4 lg:right-8 w-5/6 sm:w-4/6 lg:w-4/6 h-3/5 sm:h-4/5 z-10 transform translate-x-1/2 -translate-y-1/2 sm:translate-x-0 sm:translate-y-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px) rotateY(${mousePosition.x * 5}deg) rotateX(${-mousePosition.y * 5}deg)`
        }}
      >
        <div className="w-full h-full relative">
          {!splineError ? (
            <spline-viewer
              ref={splineRef}
              url="https://prod.spline.design/jTMyGBieAUQfvg0X/scene.splinecode"
              className="w-full h-full opacity-70"
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent'
              }}
              events-target="global"
            />
          ) : (
            // Fallback quando Spline falha
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-900/20 to-stone-900/30 rounded-2xl">
              <div className="text-center text-white/60">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-900/30 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm">Carregando experiência 3D...</p>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 via-yellow-900/5 to-amber-950/15 blur-xl pointer-events-none"></div>
        </div>
      </div>

      {/* Elementos 3D estáticos - Atrás do texto mas na frente do Spline */}
      <div className="absolute inset-0 z-15 pointer-events-none opacity-50">
        {/* Partículas flutuantes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-amber-400/40 rounded-full animate-pulse"
            style={{
              left: `${25 + i * 10}%`,
              top: `${35 + (i % 3) * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${3 + i % 2}s`
            }}
          />
        ))}

        {/* Formas geométricas */}
        <div className="absolute top-1/4 right-1/4 w-12 h-12 border border-amber-900/30 rotate-45 animate-spin" style={{ animationDuration: '25s' }}></div>
        <div className="absolute bottom-1/3 left-1/5 w-6 h-6 bg-amber-800/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-1/3 w-8 h-1 bg-gradient-to-r from-transparent via-amber-600/40 to-transparent animate-pulse"></div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-start sm:items-center min-h-screen pt-16 sm:pt-0">
        {/* Left side - Text content */}
        <div className="flex-1 max-w-5xl relative z-30 pr-8 lg:pr-16">
          <DramaticTransitions type="fadeIn" delay={300} duration={1000}>
            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light text-white leading-[0.9] tracking-tight mb-6 cursor-pointer transition-all duration-300 relative"
              style={{
                transform: isHoveringTitle ? 'scale(1.02)' : 'scale(1)', // Tamanho normal aumentado
              }}
              onMouseEnter={() => setIsHoveringTitle(true)}
              onMouseLeave={() => setIsHoveringTitle(false)}
            >
              <span className={isHoveringTitle ? 'animate-glitch-text' : ''}>
                {heroTitle}
                <br />
                {heroSubtitle}
              </span>

              {/* Efeito de matriz elétrica - Grid organizado */}
              {isHoveringTitle && (
                <>
                  {/* Linhas verticais - Grid de 6 colunas - Castanhas */}
                  <div className="absolute inset-0 animate-electric-1 opacity-40">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`v-${i}`}
                        className={`absolute top-0 h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent animate-pulse`}
                        style={{
                          left: `${(i + 1) * 14.28}%`,
                          width: '0.5px',
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Linhas horizontais - Grid de 6 linhas - Castanhas */}
                  <div className="absolute inset-0 animate-electric-2 opacity-30">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={`h-${i}`}
                        className={`absolute left-0 w-full bg-gradient-to-r from-transparent via-amber-600 to-transparent animate-pulse`}
                        style={{
                          top: `${(i + 1) * 16.66}%`,
                          height: '0.5px',
                          animationDelay: `${i * 0.15}s`
                        }}
                      />
                    ))}
                  </div>

                  {/* Pontos de intersecção brilhantes - Castanhos */}
                  <div className="absolute inset-0 animate-electric-1 opacity-50">
                    {[...Array(6)].map((_, col) =>
                      [...Array(6)].map((_, row) => (
                        <div
                          key={`point-${col}-${row}`}
                          className="absolute bg-amber-500 rounded-full animate-pulse"
                          style={{
                            left: `${(col + 1) * 14.28}%`,
                            top: `${(row + 1) * 16.66}%`,
                            width: '2px',
                            height: '2px',
                            animationDelay: `${(col + row) * 0.05}s`
                          }}
                        />
                      ))
                    )}
                  </div>
                </>
              )}
            </h1>
          </DramaticTransitions>

          <DramaticTransitions type="slideUp" delay={2000} duration={1000}>
            <p className="text-base sm:text-lg text-gray-300 font-light mb-8 max-w-2xl">
              <TypewriterEffect
                text={heroDescription}
                speed={80}
                delay={500}
              />
            </p>
          </DramaticTransitions>


        </div>
      </div>

      {/* Scroll Indicator Centralizado e Clicável com Transição Dramática */}
      <AnimatedElement
        animation="fadeIn"
        delay={3000}
        className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-50"
      >
        <button
          onClick={handleScrollClick}
          className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-stone-600 rounded-lg p-2 sm:p-3 bg-stone-950/20 backdrop-blur-sm hover:bg-stone-950/40 transition-all duration-300"
          aria-label="Scroll para showreel e ativar Spline"
        >
          <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-stone-600/50 rounded-full flex justify-center animate-bounce group-hover:border-stone-500 group-hover:shadow-lg group-hover:shadow-stone-600/30 transition-all duration-300">
            <div className="w-1 h-2 sm:h-3 bg-stone-600 rounded-full mt-1 sm:mt-2 animate-pulse group-hover:bg-stone-500"></div>
          </div>
          <span className="text-stone-600 text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Clique para continuar
          </span>
        </button>
      </AnimatedElement>

      {/* Estilos CSS para efeitos glitch e elétricos */}
      <style>{`
        @keyframes glitch-text {
          0% { transform: translate(0); }
          10% { transform: translate(-2px, 2px); }
          20% { transform: translate(-2px, -2px); }
          30% { transform: translate(2px, 2px); }
          40% { transform: translate(2px, -2px); }
          50% { transform: translate(-2px, 2px); }
          60% { transform: translate(-2px, -2px); }
          70% { transform: translate(2px, 2px); }
          80% { transform: translate(-2px, -2px); }
          90% { transform: translate(2px, 2px); }
          100% { transform: translate(0); }
        }

        @keyframes electric-1 {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          25% { opacity: 1; transform: scaleY(1.1); }
          50% { opacity: 0.3; transform: scaleY(0.9); }
          75% { opacity: 0.8; transform: scaleY(1.05); }
        }

        @keyframes electric-2 {
          0%, 100% { opacity: 0.4; transform: scaleX(1); }
          20% { opacity: 0.8; transform: scaleX(1.1); }
          40% { opacity: 0.2; transform: scaleX(0.9); }
          60% { opacity: 0.9; transform: scaleX(1.05); }
          80% { opacity: 0.3; transform: scaleX(0.95); }
        }

        @keyframes verticalGrid {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          25% { opacity: 0.6; transform: scaleY(1.05); }
          50% { opacity: 0.2; transform: scaleY(0.95); }
          75% { opacity: 0.5; transform: scaleY(1.02); }
        }

        @keyframes parallaxFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          25% { transform: translateY(-10px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(-5px) rotate(180deg); opacity: 0.4; }
          75% { transform: translateY(-15px) rotate(270deg); opacity: 0.5; }
        }

        .animate-glitch-text {
          animation: glitch-text 0.3s infinite;
        }

        .animate-electric-1 {
          animation: electric-1 0.8s ease-in-out infinite;
        }

        .animate-electric-2 {
          animation: electric-2 1.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;