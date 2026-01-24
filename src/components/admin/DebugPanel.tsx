import React from 'react';
import { useFirebaseDebug, useServicesDebug } from '../../hooks/useFirebaseDebug';

const DebugPanel: React.FC = () => {
  const { debugInfo, loading: debugLoading, error: debugError, testConnection, testCreateService } = useFirebaseDebug();
  const { services, loading: servicesLoading, error: servicesError, createService } = useServicesDebug();

  const handleTestCreate = async () => {
    try {
      const testService = {
        title: 'Serviço de Teste',
        description: 'Este é um serviço de teste criado pelo debug panel',
        category: 'Teste',
        price: 'Grátis',
        duration: '5 minutos',
        features: ['Teste 1', 'Teste 2'],
        icon: 'lightbulb',
        published: false,
        featured: false,
        order: 999
      };

      await createService(testService);
      alert('Serviço criado com sucesso!');
    } catch (error) {
      alert(`Erro ao criar serviço: ${error}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <h2 className="text-xl font-bold text-stone-900 mb-4">Debug Panel - Firebase</h2>
        
        {/* Teste de Conexão */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Teste de Conexão</h3>
          <button
            onClick={testConnection}
            disabled={debugLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mr-4"
          >
            {debugLoading ? 'Testando...' : 'Testar Conexão'}
          </button>
          
          <button
            onClick={testCreateService}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Testar Criação (FirebaseService)
          </button>
          
          {debugError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
              Erro: {debugError}
            </div>
          )}
          
          {Object.keys(debugInfo).length > 0 && (
            <div className="mt-2 p-2 bg-green-100 border border-green-300 rounded">
              <pre className="text-sm">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Teste de Hook de Serviços */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Hook de Serviços</h3>
          <button
            onClick={handleTestCreate}
            disabled={servicesLoading}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {servicesLoading ? 'Criando...' : 'Testar Criação (Hook)'}
          </button>
          
          {servicesError && (
            <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded text-red-700">
              Erro Hook: {servicesError}
            </div>
          )}
          
          <div className="mt-4">
            <h4 className="font-medium mb-2">Serviços Carregados ({services.length}):</h4>
            <div className="max-h-40 overflow-y-auto bg-stone-50 p-2 rounded">
              {servicesLoading ? (
                <p>Carregando...</p>
              ) : services.length === 0 ? (
                <p>Nenhum serviço encontrado</p>
              ) : (
                <ul className="space-y-1">
                  {services.map((service: any) => (
                    <li key={service.id} className="text-sm">
                      <strong>{service.title}</strong> - {service.category}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Informações do Console */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Console Logs</h3>
          <p className="text-sm text-stone-600">
            Abra o console do browser (F12) para ver logs detalhados dos testes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
