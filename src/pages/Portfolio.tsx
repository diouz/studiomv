import React, { useState } from 'react';
import { Play, User, Image as ImageIcon, Video, Loader } from 'lucide-react';
import StandardButton from '../components/StandardButton';
import { usePublicProjectsByCategory, useProjectCategories } from '../hooks/usePublicData';
import VideoModal from '../components/VideoModal';
import DramaticTransitions from '../components/DramaticTransitions';

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedVideo, setSelectedVideo] = useState<{ url: string; title: string; description?: string } | null>(null);

  // Hooks para dados do Firebase
  const { projects, loading: projectsLoading, error: projectsError } = usePublicProjectsByCategory(selectedCategory);
  const { categories, loading: categoriesLoading } = useProjectCategories();
  // Preparar categorias para o filtro
  const categoryOptions = [
    { id: 'all', name: 'Todos os Projetos' },
    ...categories.map(cat => ({ id: cat, name: cat }))
  ];

  // Função para formatar nome da categoria
  const formatCategoryName = (category: string) => {
    const categoryNames: { [key: string]: string } = {
      'corporate': 'Corporativo',
      'wedding': 'Casamentos',
      'commercial': 'Comercial',
      'documentary': 'Documentário',
      'music': 'Música',
      'event': 'Eventos',
      'fashion': 'Moda',
      'brand': 'Branding'
    };
    return categoryNames[category] || category;
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Background igual à home */}
      <div className="absolute inset-0 z-0 bg-black"></div>

      {/* Grid Vertical igual à Hero - castanho escuro */}
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

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Padronizado - Castanho Escuro */}
        <div className="text-center mb-20 relative">
          {/* Electric Effect Behind Title */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div className="w-80 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent animate-pulse"></div>
          </div>

          <DramaticTransitions type="fadeIn" delay={200} duration={800}>
            <h1 className="text-5xl md:text-7xl font-light text-white mb-6 relative">
              Nosso <span className="text-stone-400 font-normal">Portfólio</span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent"></div>
            </h1>
          </DramaticTransitions>
          <DramaticTransitions type="slideUp" delay={400} duration={800}>
            <p className="text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed">
              Projetos que definem nossa excelência criativa e paixão cinematográfica
            </p>
          </DramaticTransitions>
        </div>

        {/* Filters Modernos */}
        {!categoriesLoading && (
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {categoryOptions.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-8 py-3 rounded-2xl border transition-all duration-500 backdrop-blur-sm ${selectedCategory === category.id
                  ? 'bg-stone-800/30 border-stone-600/50 text-stone-300 shadow-lg shadow-stone-600/20'
                  : 'bg-stone-900/30 border-stone-700/30 text-stone-400 hover:bg-stone-800/40 hover:border-stone-600/30 hover:text-stone-300'
                  }`}
              >
                {category.id === 'all' ? category.name : formatCategoryName(category.name)}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {projectsLoading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex items-center gap-3 text-stone-400">
              <Loader className="w-6 h-6 animate-spin" />
              <span>A carregar projetos...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {projectsError && (
          <div className="text-center py-20">
            <p className="text-red-400 mb-4">{projectsError}</p>
            <StandardButton
              variant="secondary"
              onClick={() => window.location.reload()}
            >
              Tentar Novamente
            </StandardButton>
          </div>
        )}

        {/* Projects Grid Moderno */}
        {!projectsLoading && !projectsError && (
          <>
            {projects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-stone-400 text-lg">
                  {selectedCategory === 'all'
                    ? 'Nenhum projeto encontrado.'
                    : `Nenhum projeto encontrado na categoria "${formatCategoryName(selectedCategory)}".`
                  }
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="group relative cursor-pointer"
                  >
                    {/* Card Moderno */}
                    <div className="relative bg-gradient-to-br from-stone-900/40 to-stone-950/60 backdrop-blur-md rounded-3xl overflow-hidden border border-stone-700/30 hover:border-stone-600/40 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/20">
                      {/* Mídia do Projeto */}
                      <div className="aspect-video relative overflow-hidden">
                        {/* Renderizar thumbnail com botão de play para vídeos */}
                        {project.videos && project.videos.length > 0 ? (
                          <div className="relative w-full h-full group">
                            <img
                              src={project.images?.[0]?.url || project.videos[0].thumbnailUrl || project.thumbnail || 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=1'}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                            />

                            {/* Botão de play apenas no hover */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedVideo({
                                    url: project.videos[0].url,
                                    title: project.title,
                                    description: project.description
                                  });
                                }}
                                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/40 flex items-center justify-center hover:bg-white/30 hover:scale-110 transition-all duration-300"
                                aria-label={`Reproduzir vídeo: ${project.title}`}
                              >
                                <Play className="w-6 h-6 text-white ml-1" />
                              </button>
                            </div>
                          </div>
                        ) : project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="w-full h-full bg-stone-800 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 text-stone-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                        {/* Media Count Badges */}
                        <div className="absolute top-3 right-3 flex gap-2">
                          {project.images && project.images.length > 0 && (
                            <span className="bg-blue-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                              <ImageIcon className="w-3 h-3" />
                              {project.images.length}
                            </span>
                          )}
                          {project.videos && project.videos.length > 0 && (
                            <span className="bg-purple-500/80 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
                              <Video className="w-3 h-3" />
                              {project.videos.length}
                            </span>
                          )}
                        </div>

                        {/* Play Button */}
                        {project.videos && project.videos.length > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 rounded-full bg-stone-800/30 backdrop-blur-sm border border-stone-600/40 flex items-center justify-center">
                              <Play className="w-6 h-6 text-stone-300 ml-1" />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Project Info */}
                      <div className="p-6">
                        <h3 className="text-xl font-light text-white mb-2">{project.title}</h3>
                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>

                        <div className="flex items-center justify-between mb-3">
                          <span className="text-stone-400 text-sm font-medium">
                            {formatCategoryName(project.category)}
                          </span>
                          <span className="text-gray-500 text-xs">{project.year}</span>
                        </div>

                        {/* Client and Duration */}
                        <div className="space-y-1 text-xs text-gray-500">
                          <div className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            <span>{project.client}</span>
                          </div>
                          {project.duration && (
                            <div className="flex items-center gap-2">
                              <Play className="w-3 h-3" />
                              <span>{project.duration}</span>
                            </div>
                          )}
                          {/* Media Summary */}
                          <div className="flex items-center gap-4 pt-1">
                            {project.images && project.images.length > 0 && (
                              <span className="flex items-center gap-1">
                                <ImageIcon className="w-3 h-3" />
                                {project.images.length} foto{project.images.length !== 1 ? 's' : ''}
                              </span>
                            )}
                            {project.videos && project.videos.length > 0 && (
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                {project.videos.length} vídeo{project.videos.length !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <StandardButton
            variant="primary"
            size="lg"
            href="https://wa.me/244949838924?text=Olá! Gostaria de criar um projeto como estes da MV Studio."
            target="_blank"
            rel="noopener noreferrer"
          >
            Quero um Projeto Como Este
          </StandardButton>
        </div>
      </div>

      <style jsx>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          50% { transform: translate(-1px, 1px) }
        }
      `}</style>

      {/* Modal de Vídeo */}
      {selectedVideo && (
        <VideoModal
          isOpen={!!selectedVideo}
          onClose={() => setSelectedVideo(null)}
          videoUrl={selectedVideo.url}
          title={selectedVideo.title}
          description={selectedVideo.description}
        />
      )}
    </div>
  );
};

export default Portfolio;