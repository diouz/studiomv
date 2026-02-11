import React, { useState } from 'react';
import { Camera, Edit, Palette, Star, Clock, Users, Film, Clapperboard, Mic, Lightbulb, X, Zap } from 'lucide-react';
import StandardButton from '../components/StandardButton';

interface CatalogItem {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  duration?: string;
  rating?: number;
  views?: string;
  tags: string[];
  featured?: boolean;
  icon?: React.ReactNode;
  price?: string;
  detailedDescription?: string;
  features?: string[];
  process?: string[];
  deliverables?: string[];
}

const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<CatalogItem | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const catalogItems: CatalogItem[] = [
    {
      id: 1,
      title: "Pré-Produção",
      category: "Desenvolvimento",
      description: "Planejamento detalhado do projeto audiovisual, incluindo roteiro, storyboard e cronograma de produção. Desenvolvemos a base criativa crucial onde lançamos as bases para um projeto bem-sucedido.",
      detailedDescription: "A pré-produção é a fase mais crucial de qualquer projeto audiovisual. É aqui que transformamos ideias em planos concretos e executáveis. Nossa equipe trabalha em estreita colaboração com você para desenvolver cada aspecto do projeto, desde o conceito inicial até os detalhes técnicos mais específicos.",
      image: "/api/placeholder/400/250",
      duration: "2-4 semanas",
      rating: 5,
      views: "1.2k",
      tags: ["Roteiro", "Storyboard", "Planejamento"],
      featured: true,
      icon: <Lightbulb className="w-6 h-6" />,
      price: "A partir de €800",
      features: ["Desenvolvimento de conceito criativo", "Roteiro e storyboard detalhado", "Planeamento de cronogramas", "Scouting de localizações", "Casting e seleção de talentos", "Orçamentação detalhada"],
      process: ["Briefing inicial e análise de objetivos", "Desenvolvimento do conceito criativo", "Criação do roteiro e storyboard", "Planeamento logístico e cronograma", "Apresentação e aprovação final"],
      deliverables: ["Roteiro completo", "Storyboard ilustrado", "Cronograma de produção", "Lista de equipamentos", "Plano de localizações", "Orçamento detalhado"]
    },
    {
      id: 2,
      title: "Filmagem Principal",
      category: "Produção",
      description: "Captura profissional com equipamentos 4K, iluminação cinematográfica e direção especializada. Nossa equipe experiente garante que cada frame conte sua história.",
      detailedDescription: "A filmagem principal é onde a magia acontece. Com equipamentos de última geração e uma equipe técnica altamente qualificada, capturamos cada momento com precisão cinematográfica. Utilizamos câmeras 4K, drones profissionais, estabilizadores e um sistema de iluminação completo para garantir a máxima qualidade visual.",
      image: "/api/placeholder/400/250",
      duration: "1-3 dias",
      rating: 5,
      views: "2.1k",
      tags: ["4K", "Cinematografia", "Direção"],
      featured: true,
      icon: <Camera className="w-6 h-6" />,
      price: "A partir de €1.500",
      features: ["Filmagem em 4K Ultra HD", "Equipamento cinematográfico profissional", "Direção especializada", "Iluminação cinematográfica", "Captação de áudio profissional", "Múltiplos ângulos e perspetivas"],
      process: ["Setup e preparação do equipamento", "Briefing da equipe e ensaios", "Filmagem das sequências principais", "Captação de B-roll e detalhes", "Backup e organização do material"],
      deliverables: ["Material filmado em 4K", "Áudio sincronizado", "B-roll e material adicional", "Backup seguro dos ficheiros", "Relatório de filmagem"]
    },
    {
      id: 3,
      title: "Pós-Produção",
      category: "Finalização",
      description: "Edição profissional, color grading, sound design e efeitos visuais para resultado cinematográfico. Transformamos material bruto em obras de arte visuais.",
      detailedDescription: "A pós-produção é onde damos vida ao material filmado. Utilizando software profissional como DaVinci Resolve, Adobe Premiere e After Effects, criamos uma narrativa coesa e visualmente impactante. Cada projeto recebe tratamento personalizado de cor, áudio e efeitos visuais.",
      image: "/api/placeholder/400/250",
      duration: "1-2 semanas",
      rating: 5,
      views: "1.8k",
      tags: ["Edição", "Color Grading", "VFX"],
      icon: <Edit className="w-6 h-6" />,
      price: "A partir de €1.200",
      features: ["Edição cinematográfica profissional", "Color grading avançado", "Sound design e mixagem", "Efeitos visuais e motion graphics", "Correção e estabilização", "Múltiplos formatos de entrega"],
      process: ["Organização e sincronização do material", "Montagem e estruturação narrativa", "Color grading e correção de cor", "Sound design e mixagem de áudio", "Efeitos visuais e finalizações", "Renderização e entrega final"],
      deliverables: ["Vídeo final em alta resolução", "Versões para diferentes plataformas", "Ficheiros de áudio separados", "Projeto editável", "Backup do projeto completo"]
    },
    {
      id: 4,
      title: "Motion Graphics",
      category: "Animação",
      description: "Criação de animações, títulos e elementos gráficos para enriquecer a narrativa visual. Damos vida às suas ideias com movimento e impacto visual.",
      detailedDescription: "Motion graphics são elementos essenciais para criar vídeos modernos e envolventes. Criamos animações personalizadas, títulos dinâmicos, infográficos animados e elementos visuais que complementam perfeitamente a sua narrativa, sempre alinhados com a identidade visual da sua marca.",
      image: "/api/placeholder/400/250",
      duration: "3-5 dias",
      rating: 4.8,
      views: "950",
      tags: ["Animação", "Gráficos", "Títulos"],
      icon: <Palette className="w-6 h-6" />,
      price: "A partir de €900",
      features: ["Animações 2D e 3D personalizadas", "Títulos e lower thirds dinâmicos", "Infográficos animados", "Transições cinematográficas", "Elementos de marca animados", "Integração perfeita com o vídeo"],
      process: ["Análise do projeto e briefing criativo", "Desenvolvimento de conceitos visuais", "Criação de storyboard animado", "Produção das animações", "Integração e ajustes finais"],
      deliverables: ["Animações em alta resolução", "Elementos gráficos separados", "Versões com transparência", "Projeto editável", "Guia de utilização"]
    },
    {
      id: 5,
      title: "Fotografia Corporativa",
      category: "Fotografia",
      description: "Sessões fotográficas profissionais para empresas, produtos e eventos corporativos. Capturamos a essência da sua marca com estética cinematográfica.",
      image: "/api/placeholder/400/250",
      duration: "1 dia",
      rating: 4.9,
      views: "1.5k",
      tags: ["Corporativo", "Produtos", "Eventos"],
      icon: <Camera className="w-6 h-6" />,
      price: "A partir de €600"
    },
    {
      id: 6,
      title: "Documentários",
      category: "Produção",
      description: "Produção completa de documentários, desde a pesquisa até a entrega final. Contamos histórias reais com profundidade e impacto emocional.",
      image: "/api/placeholder/400/250",
      duration: "4-8 semanas",
      rating: 5,
      views: "800",
      tags: ["Documentário", "Narrativa", "Pesquisa"],
      icon: <Film className="w-6 h-6" />,
      price: "A partir de €2.500"
    },
    {
      id: 7,
      title: "Videoclipes Musicais",
      category: "Produção",
      description: "Criação de videoclipes com conceito artístico único, direção criativa e produção cinematográfica de alta qualidade.",
      image: "/api/placeholder/400/250",
      duration: "1-2 semanas",
      rating: 4.9,
      views: "1.3k",
      tags: ["Música", "Criativo", "Artístico"],
      icon: <Mic className="w-6 h-6" />,
      price: "A partir de €1.800"
    },
    {
      id: 8,
      title: "Publicidade & Comerciais",
      category: "Produção",
      description: "Produção de conteúdo publicitário impactante para marcas, com foco em storytelling e conversão.",
      image: "/api/placeholder/400/250",
      duration: "2-3 semanas",
      rating: 5,
      views: "2.5k",
      tags: ["Publicidade", "Branding", "Comercial"],
      featured: true,
      icon: <Clapperboard className="w-6 h-6" />,
      price: "A partir de €2.000"
    }
  ];

  const categories = ["Todos", "Desenvolvimento", "Produção", "Finalização", "Animação", "Fotografia"];
  const [selectedCategory, setSelectedCategory] = React.useState("Todos");

  const filteredItems = selectedCategory === "Todos"
    ? catalogItems
    : catalogItems.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-black pt-20 relative">
      {/* Grid Background - Castanho */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(139,69,19,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139,69,19,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Film Grain - Castanho */}
      <div className="fixed inset-0 opacity-15 pointer-events-none z-0"
        style={{
          backgroundImage: `radial-gradient(circle, transparent 1px, rgba(139,69,19,0.15) 1px)`,
          backgroundSize: '3px 3px',
          animation: 'grain 8s steps(10) infinite'
        }} />

      {/* Electric Grid Effect */}
      <div className="fixed inset-0 opacity-5 pointer-events-none z-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-amber-600/30 to-transparent animate-pulse"
            style={{
              left: `${(i + 1) * 12.5}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: '3s'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Elegante */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 relative z-10">
              Catálogo de <span className="text-stone-400 font-light">Serviços</span>
            </h1>
            {/* Electric Effect Behind Title */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent animate-pulse" />
              <div className="absolute top-1/2 left-1/4 w-px h-8 bg-gradient-to-b from-transparent via-stone-500 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
              <div className="absolute top-1/2 right-1/4 w-px h-8 bg-gradient-to-b from-transparent via-stone-400 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
          </div>
          <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
            Explore nossos serviços de produção audiovisual e descubra como podemos transformar suas ideias em realidade cinematográfica.
          </p>
        </div>

        {/* Category Filter Elegante */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`relative px-6 py-3 rounded-2xl font-light tracking-wider transition-all duration-500 overflow-hidden group ${selectedCategory === category
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 text-black shadow-lg shadow-amber-500/30 scale-105'
                  : 'bg-gradient-to-r from-stone-900/40 via-amber-950/20 to-stone-900/40 text-stone-200 border border-amber-800/20 hover:border-amber-600/40 hover:bg-gradient-to-r hover:from-amber-950/30 hover:via-stone-800/30 hover:to-amber-950/30 hover:text-amber-200 hover:scale-105'
                }`}
            >
              <span className="relative z-10">{category}</span>
              {selectedCategory !== category && (
                <div className="absolute inset-0 bg-gradient-to-r from-amber-800/0 via-amber-700/10 to-amber-800/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
            </button>
          ))}
        </div>

        {/* Catalog Grid Elegante */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="group relative bg-gradient-to-br from-stone-950/40 via-amber-950/20 to-stone-900/60 backdrop-blur-xl border border-amber-800/20 rounded-3xl overflow-hidden hover:border-amber-600/50 hover:scale-[1.02] transition-all duration-700 hover:shadow-2xl hover:shadow-amber-600/25 cursor-pointer"
              style={{
                animation: `fadeInUp 0.8s ease-out ${index * 0.15}s both`
              }}
              onMouseEnter={() => setHoveredCard(item.id)}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => setSelectedService(item)}
            >
              {/* Electric Border Effect */}
              <div className={`absolute inset-0 rounded-3xl transition-opacity duration-700 ${hoveredCard === item.id ? 'opacity-100' : 'opacity-0'
                }`}>
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
                <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-r from-transparent via-stone-400 to-transparent" />
                <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-transparent via-amber-600 to-transparent" />
                <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-transparent via-stone-500 to-transparent" />
              </div>

              {/* Featured Badge */}
              {item.featured && (
                <div className="absolute top-4 left-4 z-20 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-black px-4 py-2 rounded-2xl text-xs font-medium shadow-xl shadow-amber-500/30 flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  Destaque
                </div>
              )}

              {/* Video/Image Container */}
              <div className="relative h-48 bg-gradient-to-br from-stone-950 via-amber-950/30 to-stone-900 overflow-hidden">
                {/* Glass Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-950/20 via-stone-900/40 to-amber-900/30 backdrop-blur-sm" />

                {/* Electric Grid Pattern */}
                {hoveredCard === item.id && (
                  <div className="absolute inset-0 opacity-20">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute h-full w-px bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-pulse"
                        style={{
                          left: `${(i + 1) * 20}%`,
                          animationDelay: `${i * 0.3}s`
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Animated Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-800/40 via-stone-700/30 to-amber-900/50 flex items-center justify-center transition-all duration-700 ${hoveredCard === item.id ? 'scale-110 rotate-3 shadow-2xl shadow-amber-600/40' : 'shadow-xl shadow-stone-900/30'
                      }`}>
                      <div className={`transition-all duration-700 ${hoveredCard === item.id ? 'scale-110 text-amber-200' : 'text-amber-500'
                        }`}>
                        {React.cloneElement(item.icon as React.ReactElement, {
                          className: "w-8 h-8"
                        })}
                      </div>
                    </div>

                    {/* Electric Pulse Effect */}
                    {hoveredCard === item.id && (
                      <div className="absolute inset-0 w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-600/20 to-stone-600/10 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Category & Price */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-amber-400 text-xs font-light uppercase tracking-widest">
                    {item.category}
                  </span>
                  {item.price && (
                    <span className="text-stone-300 text-xs font-medium bg-amber-950/30 px-2 py-1 rounded-lg">
                      {item.price}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className={`text-xl font-light mb-3 transition-colors duration-700 line-clamp-1 ${hoveredCard === item.id ? 'text-amber-200' : 'text-stone-200'
                  }`}>
                  {item.title}
                </h3>

                {/* Description */}
                <p className={`text-sm mb-4 leading-relaxed line-clamp-3 transition-colors duration-700 ${hoveredCard === item.id ? 'text-stone-300' : 'text-stone-400'
                  }`}>
                  {item.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-stone-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>{item.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3 text-amber-600" />
                    <span>{item.views}</span>
                  </div>
                </div>

                {/* Rating */}
                {item.rating && (
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(item.rating!)
                            ? 'text-amber-500 fill-current'
                            : 'text-stone-600'
                          }`}
                      />
                    ))}
                    <span className="text-stone-400 text-xs ml-2">{item.rating}</span>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {item.tags.slice(0, 3).map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="px-3 py-1 bg-amber-800/20 text-amber-400 text-xs rounded-full border border-amber-700/30 font-light"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <StandardButton
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setSelectedService(item)}
                >
                  Ver Detalhes
                </StandardButton>
              </div>
            </div>
          ))}
        </div>

        {/* Seção de Projetos Completos */}
        <div className="relative mt-24 py-20 overflow-hidden">
          {/* Background com efeito de vidro */}
          <div className="absolute inset-0 bg-gradient-to-br from-stone-950/40 via-amber-950/10 to-stone-900/60 backdrop-blur-xl"></div>

          <div className="relative z-10 text-center">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Veja Nossos <span className="text-stone-400">Projetos Completos</span>
            </h2>
            <p className="text-stone-300 text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Explore nossa galeria completa de trabalhos realizados e inspire-se com nossas criações cinematográficas.
            </p>

            {/* Grid de Projetos em Destaque */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                {
                  title: "Documentário Corporativo",
                  category: "Produção",
                  image: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800",
                  duration: "3:45"
                },
                {
                  title: "Casamento Cinematográfico",
                  category: "Evento",
                  image: "https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800",
                  duration: "8:20"
                },
                {
                  title: "Comercial Publicitário",
                  category: "Publicidade",
                  image: "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=800",
                  duration: "1:30"
                }
              ].map((project, index) => (
                <div key={index} className="group relative cursor-pointer">
                  <div className="relative bg-gradient-to-br from-stone-900/40 to-stone-950/60 backdrop-blur-md rounded-2xl overflow-hidden border border-stone-700/30 hover:border-stone-600/40 transition-all duration-500 hover:scale-[1.02]">
                    <div className="aspect-video relative overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Play Button */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-stone-800/30 backdrop-blur-sm border border-stone-600/40 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-stone-300 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                        </div>
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-sm">
                        {project.duration}
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="text-white font-light text-lg mb-1">{project.title}</h3>
                      <p className="text-stone-400 text-sm">{project.category}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <StandardButton
              variant="secondary"
              size="lg"
              href="/portfolio"
            >
              Ver Todos os Projetos
            </StandardButton>
          </div>
        </div>

        {/* CTA Section Elegante */}
        <div className="text-center bg-gradient-to-br from-amber-950/20 via-stone-900/30 to-amber-900/10 backdrop-blur-xl border border-amber-800/30 rounded-3xl p-16 relative overflow-hidden">
          {/* Electric Background Effect */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute h-full w-px bg-gradient-to-b from-transparent via-amber-400 to-transparent animate-pulse"
                style={{
                  left: `${(i + 1) * 16.66}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 leading-tight">
              Pronto para começar o seu <span className="text-amber-400">projeto</span>?
            </h2>
            <p className="text-stone-300 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Entre em contacto connosco e transformemos a sua visão em realidade cinematográfica.
            </p>
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
      </div>

      {/* Modal de Detalhes do Serviço */}
      {selectedService && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-stone-950 via-amber-950/20 to-stone-900 backdrop-blur-xl border border-amber-800/30 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            {/* Close Button */}
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 w-10 h-10 bg-stone-800/50 hover:bg-amber-900/50 rounded-full flex items-center justify-center text-stone-300 hover:text-amber-200 transition-all duration-300 z-10"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-8 border-b border-amber-800/20">
              <div className="flex items-center gap-6 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-800/40 via-stone-700/30 to-amber-900/50 flex items-center justify-center">
                  {React.cloneElement(selectedService.icon as React.ReactElement, {
                    className: "w-8 h-8 text-amber-400"
                  })}
                </div>
                <div>
                  <h2 className="text-3xl font-light text-white mb-2">{selectedService.title}</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-amber-400 text-sm uppercase tracking-wider">{selectedService.category}</span>
                    {selectedService.price && (
                      <span className="text-stone-300 text-sm bg-amber-950/30 px-3 py-1 rounded-lg">{selectedService.price}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-light text-amber-300 mb-4">Sobre o Serviço</h3>
                <p className="text-stone-300 leading-relaxed">
                  {selectedService.detailedDescription || selectedService.description}
                </p>
              </div>

              {/* Features, Process, Deliverables */}
              <div className="grid md:grid-cols-3 gap-8">
                {selectedService.features && (
                  <div>
                    <h4 className="text-lg font-light text-amber-300 mb-4">Características</h4>
                    <ul className="space-y-2">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2 text-stone-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.process && (
                  <div>
                    <h4 className="text-lg font-light text-amber-300 mb-4">Processo</h4>
                    <ul className="space-y-2">
                      {selectedService.process.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-stone-300 text-sm">
                          <span className="w-5 h-5 rounded-full bg-amber-800/30 text-amber-400 text-xs flex items-center justify-center mt-0.5 flex-shrink-0">
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedService.deliverables && (
                  <div>
                    <h4 className="text-lg font-light text-amber-300 mb-4">Entregáveis</h4>
                    <ul className="space-y-2">
                      {selectedService.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-start gap-2 text-stone-300 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                          {deliverable}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* CTA */}
              <div className="mt-8 pt-8 border-t border-amber-800/20 text-center">
                <StandardButton
                  variant="primary"
                  size="lg"
                  href="https://wa.me/244949838924?text=Olá! Gostaria de saber mais sobre os serviços da MV Studio."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar Orçamento
                </StandardButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          50% { transform: translate(-1px, 1px) }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Hover effects for cards */
        .group:hover .animate-ping {
          animation-duration: 1s;
        }

        .group:hover .animate-pulse {
          animation-duration: 0.5s;
        }
      `}</style>
    </div>
  );
};

export default ServicesPage;