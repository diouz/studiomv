import React, { useState, useEffect } from 'react';
import { Camera, ArrowRight, Zap, Eye } from 'lucide-react';
import StandardButton from './StandardButton';

const NewFooter: React.FC = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  // Detectar quando o footer entra na viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const footerElement = document.querySelector('footer');
    if (footerElement) {
      observer.observe(footerElement);
    }

    return () => observer.disconnect();
  }, []);

  // Rastrear posição do mouse para efeitos interativos
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139,69,19,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,69,19,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Grid Vertical Animada - mais visível */}
      <div className="absolute inset-0 z-10 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-amber-900/60 to-transparent"
            style={{
              left: `${(i + 1) * 5}%`,
              animation: `verticalGrid ${3 + i * 0.2}s ease-in-out infinite`,
              animationDelay: `${i * 0.1}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Main CTA Section */}
        <div className="py-16 lg:py-24">
          <div className="bg-gradient-to-br from-amber-900/20 via-amber-800/10 to-amber-700/20 backdrop-blur-sm border border-amber-800/30 rounded-3xl p-8 lg:p-16 text-center hover:backdrop-blur-md hover:border-amber-700/40 transition-all duration-500">
            {/* Logo */}
            <div className="flex items-center justify-center mb-8">
              <img
                src="/img/logo/MV_logo Branco.png"
                alt="MV Studio"
                className="h-16 w-auto object-contain"
              />
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-white mb-6 leading-tight">
              Não nos limitamos a vídeos,<br />
              somos seus companheiros criativos.
            </h2>

            {/* Subtitle */}
            <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto">
              Tem dúvidas, ideias para projetos ou só quer dizer oi? Estamos todos a ouvir!
            </p>

            {/* CTA Button Padronizado */}
            <StandardButton
              variant="primary"
              size="lg"
              href="https://wa.me/244949838924?text=Olá! Gostaria de saber mais sobre os serviços da MV Studio."
              target="_blank"
              rel="noopener noreferrer"
            >
              Vamos Falar
            </StandardButton>
          </div>
        </div>

        {/* Footer Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 py-12 border-t border-gray-800/50">
          {/* Address */}
          <div
            className="backdrop-blur-sm bg-black/60 border border-white/10 rounded-xl p-6 transition-all duration-500 ease-out hover:backdrop-blur-md hover:bg-black/70 hover:border-amber-800/30 hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-2 hover:scale-105 group"
            onMouseEnter={() => setHoveredCard(0)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-lg font-light text-white mb-4 group-hover:text-amber-100 transition-colors duration-300">Endereço:</h3>
            <p className="text-gray-300 text-sm leading-relaxed group-hover:text-gray-200 transition-colors duration-300">
              Luanda, 21 de Janeiro, de frente à Clínica Multiperfil
            </p>

            <div className="mt-6">
              <h4 className="text-base font-light text-white mb-2 group-hover:text-amber-100 transition-colors duration-300">Email:</h4>
              <p className="text-amber-600 text-sm group-hover:text-amber-500 transition-colors duration-300">mvstudiointermov@gmail.com</p>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-light text-white mb-2 group-hover:text-amber-100 transition-colors duration-300">Telefone / WhatsApp:</h4>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">+244 949 838 924</p>
            </div>

            <div className="mt-6">
              <h4 className="text-base font-light text-white mb-2 group-hover:text-amber-100 transition-colors duration-300">Horário de Funcionamento:</h4>
              <p className="text-gray-300 text-sm group-hover:text-gray-200 transition-colors duration-300">Segunda - Sexta: 8h às 17h</p>
            </div>

            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-900/5 via-transparent to-amber-800/5"></div>
            </div>
          </div>

          {/* Quick Links */}
          <div
            className="backdrop-blur-sm bg-black/60 border border-white/10 rounded-xl p-6 transition-all duration-500 ease-out hover:backdrop-blur-md hover:bg-black/70 hover:border-amber-800/30 hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-2 hover:scale-105 group"
            onMouseEnter={() => setHoveredCard(1)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-lg font-light text-white mb-6 group-hover:text-amber-100 transition-colors duration-300">Links Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-amber-600 hover:text-amber-500 transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">INÍCIO</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">PROJETOS</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">PROJETOS SIMPLIFICADOS</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">SOBRE</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">SERVIÇOS</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">CONTACTO</a></li>
            </ul>

            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-900/5 via-transparent to-amber-800/5"></div>
            </div>
          </div>

          {/* Legal & Social */}
          <div
            className="backdrop-blur-sm bg-black/60 border border-white/10 rounded-xl p-6 transition-all duration-500 ease-out hover:backdrop-blur-md hover:bg-black/70 hover:border-amber-800/30 hover:shadow-lg hover:shadow-amber-900/10 hover:-translate-y-2 hover:scale-105 group"
            onMouseEnter={() => setHoveredCard(2)}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <h3 className="text-lg font-light text-white mb-6 group-hover:text-amber-100 transition-colors duration-300">Legal</h3>
            <ul className="space-y-3 mb-8">
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">POLÍTICA DE PRIVACIDADE</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">TERMOS E CONDIÇÕES</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">POLÍTICA DE REEMBOLSO</a></li>
            </ul>

            <h4 className="text-lg font-light text-white mb-4 group-hover:text-amber-100 transition-colors duration-300">Redes Sociais</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">FACEBOOK</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">INSTAGRAM</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-light tracking-wide uppercase hover:translate-x-1">TIKTOK</a></li>
            </ul>

            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-amber-900/5 via-transparent to-amber-800/5"></div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes verticalGrid {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          25% { opacity: 0.6; transform: scaleY(1.05); }
          50% { opacity: 0.2; transform: scaleY(0.95); }
          75% { opacity: 0.5; transform: scaleY(1.02); }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        @keyframes cardGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(245, 158, 11, 0); }
          50% { box-shadow: 0 0 20px rgba(245, 158, 11, 0.1); }
        }

        /* Aplicar animação suave aos cards */
        .grid > div:nth-child(1) {
          animation: cardFloat 6s ease-in-out infinite;
          animation-delay: 0s;
        }

        .grid > div:nth-child(2) {
          animation: cardFloat 6s ease-in-out infinite;
          animation-delay: 2s;
        }

        .grid > div:nth-child(3) {
          animation: cardFloat 6s ease-in-out infinite;
          animation-delay: 4s;
        }
      `}</style>
    </footer>
  );
};

export default NewFooter;
