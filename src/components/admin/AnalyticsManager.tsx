import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  MousePointer, 
  FileText, 
  Play, 
  Eye,
  Calendar,
  BarChart3,
  Activity,
  Users,
  Clock
} from 'lucide-react';
import { AnalyticsService, AnalyticsStats, AnalyticsEvent } from '../../services/analyticsService';

const AnalyticsManager: React.FC = () => {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias atrás
    end: new Date().toISOString().split('T')[0] // hoje
  });

  const fetchStats = async () => {
    try {
      setLoading(true);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // fim do dia
      
      const data = await AnalyticsService.getAnalyticsStats(startDate, endDate);
      setStats(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar estatísticas de analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'button_click': return <MousePointer className="w-4 h-4" />;
      case 'form_submit': return <FileText className="w-4 h-4" />;
      case 'video_play': return <Play className="w-4 h-4" />;
      case 'page_view': return <Eye className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'button_click': return 'Cliques em Botões';
      case 'form_submit': return 'Formulários Enviados';
      case 'video_play': return 'Vídeos Reproduzidos';
      case 'page_view': return 'Visualizações de Página';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Analytics & Métricas</h1>
          <p className="text-stone-600">Acompanhe o desempenho e interações do site</p>
        </div>
        
        {/* Date Range Filter */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-500" />
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
            <span className="text-stone-500">até</span>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border border-stone-300 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Total de Eventos</p>
              <p className="text-2xl font-bold text-stone-900">{stats?.totalEvents || 0}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Cliques em Botões</p>
              <p className="text-2xl font-bold text-stone-900">{stats?.eventsByType?.button_click || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <MousePointer className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Formulários Enviados</p>
              <p className="text-2xl font-bold text-stone-900">{stats?.eventsByType?.form_submit || 0}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-stone-600">Vídeos Reproduzidos</p>
              <p className="text-2xl font-bold text-stone-900">{stats?.eventsByType?.video_play || 0}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Play className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Top Buttons & Events by Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Buttons Clicked */}
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-stone-700" />
            <h3 className="text-lg font-semibold text-stone-900">Top Botões Clicados</h3>
          </div>

          {stats?.topButtons && stats.topButtons.length > 0 ? (
            <div className="space-y-3">
              {stats.topButtons.map((button, index) => (
                <div key={button.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-stone-100 rounded-full flex items-center justify-center text-xs font-medium text-stone-600">
                      {index + 1}
                    </div>
                    <span className="text-stone-900 font-medium">{button.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (button.count / (stats.topButtons[0]?.count || 1)) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-stone-600 w-8 text-right">{button.count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">Nenhum clique registrado ainda</p>
          )}
        </div>

        {/* Events by Type */}
        <div className="bg-white rounded-xl p-6 border border-stone-200">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-stone-700" />
            <h3 className="text-lg font-semibold text-stone-900">Eventos por Tipo</h3>
          </div>

          {stats?.eventsByType && Object.keys(stats.eventsByType).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(stats.eventsByType).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getEventTypeIcon(type)}
                    <span className="text-stone-900 font-medium">{getEventTypeLabel(type)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-stone-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(100, (count / (stats.totalEvents || 1)) * 100)}%`
                        }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-stone-600 w-8 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-stone-500 text-center py-8">Nenhum evento registrado ainda</p>
          )}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-stone-700" />
          <h3 className="text-lg font-semibold text-stone-900">Eventos Recentes</h3>
        </div>

        {stats?.recentEvents && stats.recentEvents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Tipo</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Evento</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Página</th>
                  <th className="text-left py-3 px-4 font-medium text-stone-600">Data</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentEvents.map((event, index) => (
                  <tr key={event.id || index} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getEventTypeIcon(event.eventType)}
                        <span className="text-sm text-stone-600">{getEventTypeLabel(event.eventType)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm font-medium text-stone-900">
                        {event.metadata?.buttonText || event.metadata?.formType || event.metadata?.videoTitle || event.eventName}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-stone-600">{event.metadata?.page || '-'}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-stone-600">{formatDate(event.timestamp)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-stone-500 text-center py-8">Nenhum evento recente</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsManager;
