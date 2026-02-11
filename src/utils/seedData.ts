/**
 * Seed Data Utility
 * Adiciona dados de exemplo ao Firebase para testar funcionalidade
 */

import { FirebaseService } from '../services/firebaseService';

// Dados de exemplo para serviços
const sampleServices = [
  {
    title: 'Produção de Vídeo Corporativo',
    slug: 'video-corporativo',
    description: 'Criamos vídeos corporativos profissionais que comunicam a essência da sua marca de forma impactante e memorável.',
    shortDescription: 'Vídeos corporativos profissionais para sua marca',
    icon: 'video',
    featured: true,
    published: true,
    order: 1,
    priceFromKz: 150000,
    priceType: 'from' as const,
    priceDisplay: 'A partir de 150.000 Kz',
    deliverables: [
      'Vídeo final em alta qualidade',
      'Versões para redes sociais',
      'Arquivos de origem'
    ],
    process: [
      'Briefing e conceituação',
      'Pré-produção e planejamento',
      'Gravação profissional',
      'Pós-produção e edição',
      'Entrega final'
    ],
    features: [
      'Equipamento profissional 4K',
      'Equipe especializada',
      'Roteiro personalizado',
      'Trilha sonora original'
    ],
    metaTitle: 'Produção de Vídeo Corporativo - MV Studio',
    metaDescription: 'Serviços profissionais de produção de vídeo corporativo em Luanda, Angola.'
  },
  {
    title: 'Fotografia Comercial',
    slug: 'fotografia-comercial',
    description: 'Fotografia comercial de alta qualidade para produtos, eventos e campanhas publicitárias.',
    shortDescription: 'Fotografia comercial profissional',
    icon: 'camera',
    featured: false,
    published: true,
    order: 2,
    priceFromKz: 75000,
    priceType: 'from' as const,
    priceDisplay: 'A partir de 75.000 Kz',
    deliverables: [
      'Fotos editadas em alta resolução',
      'Versões para web e impressão',
      'Galeria online privada'
    ],
    process: [
      'Consulta inicial',
      'Planejamento da sessão',
      'Sessão fotográfica',
      'Edição profissional',
      'Entrega digital'
    ],
    features: [
      'Equipamento profissional',
      'Estúdio próprio',
      'Edição avançada',
      'Entrega rápida'
    ],
    metaTitle: 'Fotografia Comercial - MV Studio',
    metaDescription: 'Serviços de fotografia comercial profissional em Luanda, Angola.'
  }
];

// Dados de exemplo para testemunhos
const sampleTestimonials = [
  {
    clientName: 'Maria Silva',
    clientRole: 'Diretora de Marketing',
    clientCompany: 'Empresa ABC',
    clientAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    content: 'O trabalho da MV Studio superou todas as nossas expectativas. A qualidade do vídeo corporativo foi excepcional.',
    rating: 5,
    featured: true,
    published: true,
    order: 1
  },
  {
    clientName: 'João Santos',
    clientRole: 'CEO',
    clientCompany: 'StartupXYZ',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    content: 'Profissionalismo e criatividade em cada detalhe. Recomendo a MV Studio para qualquer projeto audiovisual.',
    rating: 5,
    featured: false,
    published: true,
    order: 2
  }
];

// Função para adicionar dados de exemplo
export const seedFirebaseData = async () => {
  try {
    console.log('🌱 Iniciando seed de dados...');

    // Adicionar serviços
    for (const service of sampleServices) {
      try {
        await FirebaseService.createService(service);
        console.log(`✅ Serviço criado: ${service.title}`);
      } catch (error) {
        console.error(`❌ Erro ao criar serviço ${service.title}:`, error);
      }
    }

    // Adicionar testemunhos
    for (const testimonial of sampleTestimonials) {
      try {
        await FirebaseService.createTestimonial(testimonial);
        console.log(`✅ Testemunho criado: ${testimonial.clientName}`);
      } catch (error) {
        console.error(`❌ Erro ao criar testemunho ${testimonial.clientName}:`, error);
      }
    }

    console.log('🎉 Seed de dados concluído!');
    return true;
  } catch (error) {
    console.error('❌ Erro durante seed de dados:', error);
    return false;
  }
};

// Função para limpar dados de teste
export const clearSeedData = async () => {
  try {
    console.log('🧹 Limpando dados de teste...');
    
    // Buscar e deletar serviços de teste
    const services = await FirebaseService.getServices();
    for (const service of services) {
      if (sampleServices.some(sample => sample.slug === service.slug)) {
        await FirebaseService.deleteService(service.id!);
        console.log(`🗑️ Serviço removido: ${service.title}`);
      }
    }

    // Buscar e deletar testemunhos de teste
    const testimonials = await FirebaseService.getTestimonials();
    for (const testimonial of testimonials) {
      if (sampleTestimonials.some(sample => sample.clientName === testimonial.clientName)) {
        await FirebaseService.deleteTestimonial(testimonial.id!);
        console.log(`🗑️ Testemunho removido: ${testimonial.clientName}`);
      }
    }

    console.log('✅ Limpeza concluída!');
    return true;
  } catch (error) {
    console.error('❌ Erro durante limpeza:', error);
    return false;
  }
};

export default {
  seedFirebaseData,
  clearSeedData,
  sampleServices,
  sampleTestimonials
};
