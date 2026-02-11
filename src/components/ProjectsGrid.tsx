import React, { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { useScrollAnimation, useStaggeredAnimation } from '../hooks/useParallax';

interface Project {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  videoUrl?: string;
  description: string;
}

const ProjectsGrid: React.FC = () => {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);
  const { elementRef: sectionRef } = useScrollAnimation(0.1);
  const { visibleItems, containerRef } = useStaggeredAnimation(150);

  // Mock data - será substituído por dados do back office
  const projects: Project[] = [
    {
      id: '1',
      title: 'Corporate Vision',
      category: 'Corporativo',
      thumbnail: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      description: 'Vídeo corporativo inovador'
    },
    {
      id: '2',
      title: 'Wedding Dreams',
      category: 'Casamento',
      thumbnail: 'https://images.pexels.com/photos/1444442/pexels-photo-1444442.jpeg?auto=compress&cs=tinysrgb&w=800',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      description: 'Documentário de casamento cinematográfico'
    },
    {
      id: '3',
      title: 'Fashion Story',
      category: 'Moda',
      thumbnail: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Editorial de moda contemporâneo'
    },
    {
      id: '4',
      title: 'Event Capture',
      category: 'Evento',
      thumbnail: 'https://images.pexels.com/photos/2747449/pexels-photo-2747449.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Cobertura completa de evento'
    },
    {
      id: '5',
      title: 'Brand Identity',
      category: 'Marca',
      thumbnail: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Identidade visual em movimento'
    },
    {
      id: '6',
      title: 'Documentary',
      category: 'Documentário',
      thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
      description: 'Narrativa documental envolvente'
    }
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-12 lg:py-16 bg-black"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Projects Grid - thumbnails menores */}
        <div
          ref={containerRef}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`group relative aspect-square bg-stone-900 rounded-xl overflow-hidden cursor-pointer transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] ${visibleItems.has(index)
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
              style={{
                transitionDelay: `${index * 100}ms`
              }}
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Image */}
              <img
                src={project.thumbnail}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
              />

              {/* Overlay suave */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                {project.videoUrl ? (
                  <div className="w-12 h-12 bg-amber-500/90 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3 transform transition-transform group-hover:scale-110">
                    <Play className="w-5 h-5 text-black ml-0.5" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg mb-3 transform transition-transform group-hover:scale-110">
                    <ExternalLink className="w-5 h-5 text-black" />
                  </div>
                )}
                <h3 className="text-white text-sm font-light tracking-wide text-center">{project.title}</h3>
                <p className="text-amber-400 text-[10px] uppercase tracking-widest mt-1">{project.category}</p>
              </div>

              {/* Hover Effect Border */}
              <div className={`absolute inset-0 border-2 border-amber-500/50 rounded-xl transition-opacity duration-500 pointer-events-none ${hoveredProject === project.id ? 'opacity-100' : 'opacity-0'
                }`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectsGrid;
