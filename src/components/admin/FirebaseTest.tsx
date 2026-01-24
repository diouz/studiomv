import React, { useState, useEffect } from 'react';
import { FirebaseService } from '../../services/firebaseService';

const FirebaseTest: React.FC = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      addLog('🔄 Iniciando teste de conexão Firebase...');
      
      // Teste 1: Buscar projetos
      try {
        const projects = await FirebaseService.getProjects();
        addLog(`✅ Projetos carregados: ${projects.length} encontrados`);
      } catch (error) {
        addLog(`❌ Erro ao carregar projetos: ${error}`);
      }

      // Teste 2: Buscar serviços
      try {
        const services = await FirebaseService.getServices();
        addLog(`✅ Serviços carregados: ${services.length} encontrados`);
      } catch (error) {
        addLog(`❌ Erro ao carregar serviços: ${error}`);
      }

      // Teste 3: Buscar configurações
      try {
        const settings = await FirebaseService.getSettings();
        addLog(`✅ Configurações carregadas: ${settings.length} encontradas`);
      } catch (error) {
        addLog(`❌ Erro ao carregar configurações: ${error}`);
      }

      // Teste 4: Buscar contactos
      try {
        const contacts = await FirebaseService.getContacts();
        addLog(`✅ Contactos carregados: ${contacts.length} encontrados`);
      } catch (error) {
        addLog(`❌ Erro ao carregar contactos: ${error}`);
      }

      // Teste 5: Buscar marcas
      try {
        const brands = await FirebaseService.getBrands();
        addLog(`✅ Marcas carregadas: ${brands.length} encontradas`);
      } catch (error) {
        addLog(`❌ Erro ao carregar marcas: ${error}`);
      }

      // Teste 6: Buscar testemunhos
      try {
        const testimonials = await FirebaseService.getTestimonials();
        addLog(`✅ Testemunhos carregados: ${testimonials.length} encontrados`);
      } catch (error) {
        addLog(`❌ Erro ao carregar testemunhos: ${error}`);
      }

      addLog('🎉 Teste de conexão Firebase concluído!');
      
    } catch (error) {
      addLog(`💥 Erro geral: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCreateService = async () => {
    try {
      addLog('🔄 Testando criação de serviço...');
      
      const testService = {
        title: 'Teste de Serviço',
        description: 'Descrição de teste',
        category: 'Teste',
        price: 'Sob consulta',
        duration: '1 hora',
        features: ['Feature 1', 'Feature 2'],
        icon: 'lightbulb',
        published: true,
        featured: false,
        order: 999
      };

      const id = await FirebaseService.createService(testService);
      addLog(`✅ Serviço criado com ID: ${id}`);
      
      // Deletar o serviço de teste
      await FirebaseService.deleteService(id);
      addLog(`✅ Serviço de teste removido`);
      
    } catch (error) {
      addLog(`❌ Erro ao testar criação: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Teste de Conexão Firebase</h2>
        
        <div className="flex gap-4 mb-6">
          <button
            onClick={testFirebaseConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testando...' : 'Testar Conexão'}
          </button>
          
          <button
            onClick={testCreateService}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            Testar Criação
          </button>
        </div>

        <div className="bg-stone-50 rounded-lg p-4 max-h-96 overflow-y-auto">
          <h3 className="font-medium text-stone-900 mb-2">Resultados:</h3>
          {testResults.length === 0 ? (
            <p className="text-stone-500">Clique em "Testar Conexão" para começar</p>
          ) : (
            <div className="space-y-1">
              {testResults.map((result, index) => (
                <div key={index} className="text-sm font-mono text-stone-700">
                  {result}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FirebaseTest;
