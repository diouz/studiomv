import React, { useState } from 'react';
import { Users, Award, Clock, Target, Heart, Lightbulb, Zap, Eye, Circle } from 'lucide-react';
import { AnimatedElement, useStaggeredAnimation } from '../hooks/useScrollAnimation';

const AboutPage: React.FC = () => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const stats = [
    { icon: <Award className="w-8 h-8" />, number: "150+", label: "Projetos Concluídos" },
    { icon: <Users className="w-8 h-8" />, number: "80+", label: "Clientes Satisfeitos" },
    { icon: <Clock className="w-8 h-8" />, number: "7+", label: "Anos de Experiência" },
    { icon: <Target className="w-8 h-8" />, number: "98%", label: "Taxa de Satisfação" }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Paixão",
      description: "Cada projeto é tratado com dedicação e amor pela arte cinematográfica."
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: "Criatividade",
      description: "Soluções inovadoras que destacam a sua marca no mercado."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Colaboração",
      description: "Trabalhamos em parceria para alcançar os melhores resultados."
    }
  ];

  const timeline = [
    {
      year: "2017",
      title: "Fundação",
      description: "Início da jornada com os primeiros projetos de videografia."
    },
    {
      year: "2019",
      title: "Expansão",
      description: "Crescimento da equipa e investimento em equipamento profissional."
    },
    {
      year: "2021",
      title: "Reconhecimento",
      description: "Primeiros prémios e reconhecimento na indústria audiovisual."
    },
    {
      year: "2024",
      title: "Inovação",
      description: "Implementação de tecnologias 4K e realidade virtual nos projetos."
    }
  ];

  const team = [
    {
      name: "Miguel Vieira",
      role: "Diretor Criativo & Fundador",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Visionário por trás do MV Studio, com mais de 10 anos de experiência em cinema."
    },
    {
      name: "Ana Santos",
      role: "Produtora Executiva",
      image: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Especialista em gestão de projetos e coordenação de equipas criativas."
    },
    {
      name: "João Silva",
      role: "Director de Fotografia",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Mestre da luz e composição, responsável pela estética visual dos projetos."
    },
    {
      name: "Sofia Costa",
      role: "Editora Principal",
      image: "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400",
      description: "Especialista em pós-produção e narrativa visual através da montagem."
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(120,113,108,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(120,113,108,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Header Eletrificado */}
        <AnimatedElement animation="slideUp" className="text-center mb-20 relative">
          {/* Electric Effect Behind Title */}
          <div className="absolute inset-0 flex items-center justify-center opacity-15">
            <div className="w-80 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent animate-pulse"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-light text-white mb-6 relative">
            Sobre <span className="text-stone-400 font-normal">Nós</span>
            <Zap className="inline-block w-6 h-6 sm:w-8 sm:h-8 ml-4 text-stone-500 animate-pulse" />
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-stone-600 to-transparent"></div>
          </h1>
          <p className="text-lg sm:text-xl text-stone-300 max-w-3xl mx-auto leading-relaxed px-4">
            Somos contadores de histórias apaixonados, dedicados a criar experiências visuais que inspiram e conectam.
          </p>
        </AnimatedElement>

        {/* Manifesto */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          <AnimatedElement animation="slideLeft" delay={200}>
            <div>
              <h2 className="text-4xl font-light text-white mb-6 relative">
                O Nosso <span className="text-stone-400">Manifesto</span>
                <Eye className="inline-block w-6 h-6 ml-3 text-stone-500" />
              </h2>
              <div className="space-y-6 text-gray-300 leading-relaxed">
                <p>
                  No MV Studio, acreditamos que cada frame tem o poder de contar uma história única.
                  Não criamos apenas vídeos — criamos experiências que tocam corações e transformam perspectivas.
                </p>
                <p>
                  A nossa missão é dar vida às suas ideias através da magia do cinema, combinando técnica
                  profissional com visão artística para criar conteúdo que não apenas impressiona, mas inspira.
                </p>
                <p>
                  Cada projeto é uma nova aventura, uma oportunidade de explorar territórios criativos
                  inexplorados e de superar as expectativas dos nossos clientes.
                </p>
              </div>
            </div>
          </AnimatedElement>

          <AnimatedElement animation="slideRight" delay={400}>
            <div className="relative">
              <div className="aspect-[4/5] bg-gradient-to-br from-stone-900/20 to-black rounded-lg overflow-hidden relative group hover:scale-105 transition-transform duration-500">
                <img
                  src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="MV Studio Team"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                />

                {/* Film Strip Effect */}
                <div className="absolute left-0 top-0 w-8 h-full bg-black opacity-80">
                  <div className="flex flex-col justify-between h-full py-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-stone-900/30 rounded-sm mx-auto" />
                    ))}
                  </div>
                </div>
                <div className="absolute right-0 top-0 w-8 h-full bg-black opacity-80">
                  <div className="flex flex-col justify-between h-full py-4">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className="w-4 h-4 bg-stone-900/30 rounded-sm mx-auto" />
                    ))}
                  </div>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              </div>
            </div>
          </AnimatedElement>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <AnimatedElement
              key={index}
              animation="scaleIn"
              delay={300 + (index * 150)}
              className="text-center group"
            >
              <div className="w-20 h-20 bg-stone-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-stone-900/30 transition-all duration-300 hover:scale-110">
                <div className="text-stone-400 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
              </div>
              <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </AnimatedElement>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <AnimatedElement animation="fadeIn" delay={200} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Os Nossos <span className="text-stone-400">Valores</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Princípios que guiam cada decisão e cada projeto que desenvolvemos.
            </p>
          </AnimatedElement>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <AnimatedElement
                key={index}
                animation="slideUp"
                delay={400 + (index * 200)}
                className="group text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-stone-600/30 transition-all duration-500 hover:scale-105"
              >
                <div className="text-stone-400 mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300">
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-stone-400 transition-colors duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {value.description}
                </p>
              </AnimatedElement>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-20">
          <AnimatedElement animation="fadeIn" delay={200} className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              A Nossa <span className="text-stone-400">Jornada</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Marcos importantes na evolução do MV Studio.
            </p>
          </AnimatedElement>

          <div className="relative">
            {/* Timeline Line */}
            <AnimatedElement animation="scaleIn" delay={400} className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-stone-600/30"></AnimatedElement>

            <div className="space-y-12">
              {timeline.map((item, index) => (
                <AnimatedElement
                  key={index}
                  animation={index % 2 === 0 ? "slideLeft" : "slideRight"}
                  delay={600 + (index * 200)}
                  className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                      <div className="text-2xl font-bold text-stone-400 mb-2">{item.year}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="w-4 h-4 bg-stone-600 rounded-full border-4 border-black relative z-10 hover:bg-stone-400 transition-colors duration-300"></div>

                  <div className="w-1/2"></div>
                </AnimatedElement>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              A Nossa <span className="text-stone-400">Equipa</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Profissionais apaixonados que dão vida aos seus projetos.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group text-center">
                <div className="relative mb-6">
                  <div className="aspect-square bg-gradient-to-br from-stone-900/20 to-black rounded-lg overflow-hidden relative">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />

                    {/* Film Strip Effect */}
                    <div className="absolute left-0 top-0 w-6 h-full bg-black opacity-60">
                      <div className="flex flex-col justify-between h-full py-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-stone-900/30 rounded-sm mx-auto" />
                        ))}
                      </div>
                    </div>
                    <div className="absolute right-0 top-0 w-6 h-full bg-black opacity-60">
                      <div className="flex flex-col justify-between h-full py-2">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-3 h-3 bg-stone-900/30 rounded-sm mx-auto" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                <div className="text-stone-400 font-medium mb-3">{member.role}</div>
                <p className="text-gray-300 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Vamos criar algo extraordinário juntos?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Entre em contacto connosco e descubra como podemos dar vida à sua visão.
          </p>
          <a
            href="https://wa.me/244949838924?text=Olá! Gostaria de saber mais sobre os serviços da MV Studio."
            target="_blank"
            rel="noopener noreferrer"
            className={`relative inline-flex items-center gap-2 px-8 py-4 sm:px-10 sm:py-5 rounded-full text-lg sm:text-xl text-white font-bold shadow-lg overflow-hidden group transform transition-all duration-500 ease-out ${isButtonHovered
              ? 'bg-gray-800 border-2 border-red-500 shadow-red-500/25 scale-105'
              : 'bg-gradient-to-r from-stone-700 via-stone-600 to-stone-800 shadow-stone-500/25 scale-100 hover:scale-105'
              }`}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            <span className={`relative z-10 flex items-center gap-2 transition-all duration-300 ease-out ${isButtonHovered ? 'transform -translate-y-0.5' : 'transform translate-y-0'
              }`}>
              <Circle className={`w-2 h-2 fill-red-500 text-red-500 transition-all duration-300 ease-out ${isButtonHovered
                ? 'opacity-100 scale-100 animate-pulse'
                : 'opacity-0 scale-0'
                }`} />
              Vamos Falar
            </span>

            {/* Background transition overlay */}
            <div className={`absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 transition-opacity duration-500 ease-out ${isButtonHovered ? 'opacity-100' : 'opacity-0'
              }`}></div>

            {/* Electric flow animations */}
            <div className={`absolute inset-0 transition-opacity duration-300 ease-out ${isButtonHovered ? 'opacity-100' : 'opacity-0'
              }`}>
              <div className="absolute inset-0 animate-electric-flow opacity-60">
                <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse"></div>
                <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400 to-transparent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              </div>

              <div className="absolute inset-0 animate-electric-flow-2 opacity-40">
                <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <style>{`
        @keyframes grain {
          0%, 100% { transform: translate(0, 0) }
          50% { transform: translate(-1px, 1px) }
        }

        @keyframes electric-flow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }

        @keyframes electric-flow-2 {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.6; }
        }

        .animate-electric-flow {
          animation: electric-flow 1.5s ease-in-out infinite;
        }

        .animate-electric-flow-2 {
          animation: electric-flow-2 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default AboutPage;