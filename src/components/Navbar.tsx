import React, { useState, useEffect } from 'react';
import { Menu, X, Camera, Circle } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Portfólio', href: '/portfolio', isPage: true },
    { name: 'Catálogo', href: '/services', isPage: true },
    { name: 'Sobre Nós', href: '/about', isPage: true },
    { name: 'Contacto', href: '/contact', isPage: true }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
      isScrolled
        ? 'backdrop-blur-xl bg-black/40 border-b border-white/10'
        : 'backdrop-blur-md bg-black/20'
    }`}>
      <div className="w-full px-8 lg:px-16 xl:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
          >
            <img
              src="/img/logo/MV_logo Branco.png"
              alt="MV Studio"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative transition-colors duration-300 text-sm font-light tracking-wide pb-1 ${
                  location.pathname === item.href || (item.href === '/' && location.pathname === '/')
                    ? 'text-amber-600'
                    : 'text-white/80 hover:text-white'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                {item.name}
                {/* Active tab indicator line */}
                {(location.pathname === item.href || (item.href === '/' && location.pathname === '/')) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full"></div>
                )}
              </Link>
            ))}
            <a
              href="https://wa.me/244949838924?text=Olá! Gostaria de saber mais sobre os serviços da MV Studio."
              target="_blank"
              rel="noopener noreferrer"
              className={`relative px-6 py-3 rounded-full text-sm font-light shadow-lg overflow-hidden group transform transition-all duration-500 ease-out ${
                isButtonHovered
                  ? 'bg-gray-800 border-2 border-red-500 shadow-red-500/25 scale-105'
                  : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 shadow-amber-500/25 scale-100 hover:scale-105'
              }`}
              style={{ fontFamily: 'Poppins, sans-serif' }}
              onMouseEnter={() => setIsButtonHovered(true)}
              onMouseLeave={() => setIsButtonHovered(false)}
            >
              <span className={`relative z-10 text-white flex items-center gap-2 transition-all duration-300 ease-out ${
                isButtonHovered ? 'transform -translate-y-0.5' : 'transform translate-y-0'
              }`}>
                <Circle className={`w-2 h-2 fill-red-500 text-red-500 transition-all duration-300 ease-out ${
                  isButtonHovered
                    ? 'opacity-100 scale-100 animate-pulse'
                    : 'opacity-0 scale-0'
                }`} />
                vamos falar 
              </span>

              {/* Background transition overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 transition-opacity duration-500 ease-out ${
                isButtonHovered ? 'opacity-100' : 'opacity-0'
              }`}></div>

              {/* Efeito de gradiente eletrizante */}
              <div className={`absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 transition-opacity duration-500 ease-out ${
                !isButtonHovered ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
              } animate-gradient-flow`}></div>

              {/* Efeito de raios elétricos quando hover */}
              <div className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                isButtonHovered ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="absolute inset-0 animate-electric-flow opacity-60">
                  <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                  <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '0.2s'}}></div>
                </div>

                <div className="absolute inset-0 animate-electric-flow-2 opacity-40">
                  <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.1s'}}></div>
                </div>
              </div>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-md border-b border-white/10">
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-white/80 hover:text-white transition-colors duration-300 py-2"
                  onClick={(e) => {
                    if (item.isPage) {
                      e.preventDefault();
                      const page = item.href.replace('#', '').replace('-page', '');
                      window.location.hash = page;
                      window.location.reload();
                    }
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
              <a
                href="https://wa.me/244949838924?text=Olá! Gostaria de saber mais sobre os serviços da MV Studio."
                target="_blank"
                rel="noopener noreferrer"
                className={`relative w-full px-6 py-3 rounded-full mt-4 shadow-lg overflow-hidden group transform transition-all duration-500 ease-out ${
                  isButtonHovered
                    ? 'bg-gray-800 border-2 border-red-500 shadow-red-500/25 scale-105'
                    : 'bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 shadow-amber-500/25 scale-100 hover:scale-105'
                }`}
                style={{ fontFamily: 'Poppins, sans-serif' }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <span className={`relative z-10 text-white flex items-center justify-center gap-2 transition-all duration-300 ease-out ${
                  isButtonHovered ? 'transform -translate-y-0.5' : 'transform translate-y-0'
                }`}>
                  <Circle className={`w-2 h-2 fill-red-500 text-red-500 transition-all duration-300 ease-out ${
                    isButtonHovered
                      ? 'opacity-100 scale-100 animate-pulse'
                      : 'opacity-0 scale-0'
                  }`} />
                  vamos falar
                </span>

                {/* Background transition overlay */}
                <div className={`absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 transition-opacity duration-500 ease-out ${
                  isButtonHovered ? 'opacity-100' : 'opacity-0'
                }`}></div>

                {/* Efeito de gradiente eletrizante */}
                <div className={`absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 transition-opacity duration-500 ease-out ${
                  !isButtonHovered ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'
                } animate-gradient-flow`}></div>

                {/* Efeito de raios elétricos quando hover */}
                <div className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                  isButtonHovered ? 'opacity-100' : 'opacity-0'
                }`}>
                  <div className="absolute inset-0 animate-electric-flow opacity-60">
                    <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                    <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  </div>

                  <div className="absolute inset-0 animate-electric-flow-2 opacity-40">
                    <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '0.1s'}}></div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Estilos CSS para efeitos eletrizantes */}
      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes electric-flow {
          0%, 100% { opacity: 0.6; transform: scaleY(1); }
          25% { opacity: 1; transform: scaleY(1.2); }
          50% { opacity: 0.3; transform: scaleY(0.8); }
          75% { opacity: 0.9; transform: scaleY(1.1); }
        }

        @keyframes electric-flow-2 {
          0%, 100% { opacity: 0.4; transform: scaleX(1); }
          20% { opacity: 0.8; transform: scaleX(1.3); }
          40% { opacity: 0.2; transform: scaleX(0.7); }
          60% { opacity: 1; transform: scaleX(1.2); }
          80% { opacity: 0.3; transform: scaleX(0.9); }
        }

        .animate-gradient-flow {
          background-size: 200% 200%;
          animation: gradient-flow 2s ease-in-out infinite;
        }

        .animate-electric-flow {
          animation: electric-flow 1s ease-in-out infinite;
        }

        .animate-electric-flow-2 {
          animation: electric-flow-2 1.5s ease-in-out infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;