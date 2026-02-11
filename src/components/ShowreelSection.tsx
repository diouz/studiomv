import React, { useState, useEffect } from 'react';
import { useScrollAnimation } from '../hooks/useParallax';
import ImmersiveTransitions from './ImmersiveTransitions';
import { usePublicSettings } from '../hooks/usePublicData';
import VideoRenderer from './VideoRenderer';

const ShowreelSection: React.FC = () => {
  const { settings } = usePublicSettings();
  const [isInView, setIsInView] = useState(false);
  const { elementRef: sectionRef } = useScrollAnimation(0.1);

  // URL do vídeo showreel (do Firebase ou padrão)
  const showreelVideoUrl = settings?.showreelVideoUrl || '/videos/showreel.mp4';

  // Intersection Observer para detectar quando o vídeo está visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 } // 30% do vídeo deve estar visível para começar
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);



  return (
    <section
      id="showreel"
      ref={sectionRef}
      className="relative py-32 lg:py-48 bg-black overflow-hidden"
    >
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        {/* SHOWREEL Title */}
        <div className="relative py-16 w-full flex items-center justify-center">
          <ImmersiveTransitions direction="up" delay={300} duration={1200}>
            <h2 className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black text-white tracking-tighter leading-none text-center">
              SHOWREEL
            </h2>
          </ImmersiveTransitions>
        </div>

        {/* Video Container */}
        <div className="relative flex justify-center w-full mx-auto py-16 px-8 lg:px-16">
          <div className="relative w-full max-w-6xl aspect-video bg-gray-900/20 overflow-hidden rounded-3xl">
            <VideoRenderer
              url={showreelVideoUrl}
              title="Showreel MV Studio"
              className="w-full h-full rounded-3xl"
              autoPlay={isInView}
              muted={true}
              controls={true}
              loop={true}
              showPlayButton={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShowreelSection;
