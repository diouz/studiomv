import { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebaseService';

export const useFirebaseDebug = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Testando conexão Firebase...');
      
      // Teste básico de conexão
      const projects = await FirebaseService.getProjects();
      console.log('✅ Projetos:', projects);
      
      const services = await FirebaseService.getServices();
      console.log('✅ Serviços:', services);
      
      const settings = await FirebaseService.getSettings();
      console.log('✅ Configurações:', settings);
      
      setDebugInfo({
        projects: projects.length,
        services: services.length,
        settings: settings.length,
        timestamp: new Date().toISOString()
      });
      
    } catch (err: any) {
      console.error('❌ Erro Firebase:', err);
      setError(err.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const testCreateService = async () => {
    try {
      console.log('🔄 Testando criação de serviço...');
      
      const testService = {
        title: 'Teste Debug',
        description: 'Serviço de teste para debug',
        category: 'Debug',
        price: 'Grátis',
        duration: '1 min',
        features: ['Debug'],
        icon: 'lightbulb',
        published: false,
        featured: false,
        order: 999
      };

      const id = await FirebaseService.createService(testService);
      console.log('✅ Serviço criado:', id);
      
      // Deletar imediatamente
      await FirebaseService.deleteService(id);
      console.log('✅ Serviço removido');
      
      return true;
    } catch (err: any) {
      console.error('❌ Erro ao criar serviço:', err);
      throw err;
    }
  };

  return {
    debugInfo,
    loading,
    error,
    testConnection,
    testCreateService
  };
};

// Hook específico para serviços com debug
export const useServicesDebug = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      console.log('🔄 useServicesDebug: Carregando serviços...');
      setLoading(true);
      setError(null);
      
      const data = await FirebaseService.getServices();
      console.log('✅ useServicesDebug: Serviços carregados:', data);
      
      setServices(data);
    } catch (err: any) {
      console.error('❌ useServicesDebug: Erro ao carregar serviços:', err);
      setError(err.message || 'Erro ao carregar serviços');
    } finally {
      setLoading(false);
    }
  };

  const createService = async (service: any) => {
    try {
      console.log('🔄 useServicesDebug: Criando serviço:', service);
      
      const id = await FirebaseService.createService(service);
      console.log('✅ useServicesDebug: Serviço criado com ID:', id);
      
      await fetchServices(); // Recarregar lista
      return id;
    } catch (err: any) {
      console.error('❌ useServicesDebug: Erro ao criar serviço:', err);
      setError(err.message || 'Erro ao criar serviço');
      throw err;
    }
  };

  const updateService = async (id: string, updates: any) => {
    try {
      console.log('🔄 useServicesDebug: Atualizando serviço:', id, updates);
      
      await FirebaseService.updateService(id, updates);
      console.log('✅ useServicesDebug: Serviço atualizado');
      
      await fetchServices(); // Recarregar lista
    } catch (err: any) {
      console.error('❌ useServicesDebug: Erro ao atualizar serviço:', err);
      setError(err.message || 'Erro ao atualizar serviço');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      console.log('🔄 useServicesDebug: Deletando serviço:', id);
      
      await FirebaseService.deleteService(id);
      console.log('✅ useServicesDebug: Serviço deletado');
      
      await fetchServices(); // Recarregar lista
    } catch (err: any) {
      console.error('❌ useServicesDebug: Erro ao deletar serviço:', err);
      setError(err.message || 'Erro ao deletar serviço');
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService
  };
};
