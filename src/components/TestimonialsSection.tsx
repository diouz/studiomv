import React, { useState } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { usePublicFeaturedTestimonials, usePublicSettings } from '../hooks/usePublicData';
import ImmersiveTransitions from './ImmersiveTransitions';
import { useScrollAnimation } from '../hooks/useParallax';

const TestimonialsSection: React.FC = () => {
  const { testimonials, loading } = usePublicFeaturedTestimonials();
  const { settings } = usePublicSettings();
  const { elementRef: sectionRef } = useScrollAnimation(0.1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Títulos da seção (do Firebase ou padrão)
  const testimonialsTitle = settings?.sectionTitles?.testimonials || 'O Que Dizem Sobre Nós';
  const testimonialsDescription = settings?.sectionDescriptions?.testimonials || 'Feedback dos nossos clientes que confiaram na nossa visão criativa';

  // Testemunhos padrão se não houver no Firebase
  const defaultTestimonials = [
    {
      id: '1',
      clientName: 'Maria Silva',
      clientRole: 'Diretora de Marketing',
      clientCompany: 'Empresa Exemplo',
      content: 'A MV Studio superou todas as nossas expectativas. O vídeo corporativo que criaram elevou significativamente a nossa presença digital.',
      rating: 5,
      clientAvatar: '',
      featured: true,
      published: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: '2',
      clientName: 'João Santos',
      clientRole: 'CEO',
      clientCompany: 'StartUp Tech',
      content: 'Profissionalismo e criatividade excepcionais. Recomendo a MV Studio para qualquer projeto audiovisual.',
      rating: 5,
      clientAvatar: '',
      featured: true,
      published: true,
      createdAt: '',
      updatedAt: ''
    }
  ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : defaultTestimonials;

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayTestimonials.length) % displayTestimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-amber-400 fill-current' : 'text-stone-400'
        }`}
      />
    ));
  };

  if (displayTestimonials.length === 0) {
    return null; // Não renderizar se não há testemunhos
  }

  const currentTestimonial = displayTestimonials[currentIndex];

  return (
    <section
      ref={sectionRef}
      className="relative py-32 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950/20 overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          style={{
            backgroundImage: `
              linear-gradient(rgba(201,169,97,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(201,169,97,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
          className="w-full h-full"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <ImmersiveTransitions direction="up" delay={200} duration={1000}>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-white mb-6 leading-tight">
              {testimonialsTitle}
            </h2>
          </ImmersiveTransitions>
          
          <ImmersiveTransitions direction="up" delay={400} duration={1000}>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto">
              {testimonialsDescription}
            </p>
          </ImmersiveTransitions>
        </div>

        {/* Testimonial Card */}
        <ImmersiveTransitions direction="up" delay={600} duration={1000}>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 md:p-12 relative">
              {/* Quote Icon */}
              <Quote className="absolute top-6 left-6 w-12 h-12 text-amber-400/30" />
              
              {/* Content */}
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {renderStars(currentTestimonial.rating)}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-xl md:text-2xl text-white leading-relaxed mb-8 italic">
                  "{currentTestimonial.content}"
                </blockquote>

                {/* Client Info */}
                <div className="flex items-center justify-center gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {currentTestimonial.clientAvatar ? (
                      <img
                        src={currentTestimonial.clientAvatar}
                        alt={currentTestimonial.clientName}
                        className="w-16 h-16 rounded-full object-cover border-2 border-amber-400/30"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-stone-700 rounded-full flex items-center justify-center border-2 border-amber-400/30">
                        <User className="w-8 h-8 text-stone-400" />
                      </div>
                    )}
                  </div>

                  {/* Client Details */}
                  <div className="text-left">
                    <div className="text-lg font-semibold text-white">
                      {currentTestimonial.clientName}
                    </div>
                    <div className="text-stone-400">
                      {currentTestimonial.clientRole}
                      {currentTestimonial.clientCompany && (
                        <span> • {currentTestimonial.clientCompany}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              {displayTestimonials.length > 1 && (
                <div className="flex justify-center gap-4 mt-8">
                  <button
                    onClick={prevTestimonial}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                    aria-label="Testemunho anterior"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  
                  <button
                    onClick={nextTestimonial}
                    className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-110"
                    aria-label="Próximo testemunho"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </div>
              )}

              {/* Dots Indicator */}
              {displayTestimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {displayTestimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? 'bg-amber-400 scale-125'
                          : 'bg-white/30 hover:bg-white/50'
                      }`}
                      aria-label={`Ir para testemunho ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </ImmersiveTransitions>
      </div>
    </section>
  );
};

export default TestimonialsSection;
