import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Users,
  FolderOpen,
  Star,
  Eye,
  EyeOff,
  Calendar,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useProjects, useServices, useTeam, useTestimonials, useBrands } from '../../hooks/useFirebase';

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  featuredProjects: number;
  totalServices: number;
  totalTeamMembers: number;
  totalTestimonials: number;
  totalBrands: number;
  recentActivity: ActivityItem[];
}

interface ActivityItem {
  id: string;
  type: 'project' | 'service' | 'team' | 'testimonial' | 'brand';
  action: 'created' | 'updated' | 'published' | 'unpublished';
  title: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { projects } = useProjects();
  const { services } = useServices();
  const { team: teamMembers } = useTeam();
  const { testimonials } = useTestimonials();
  const { brands } = useBrands();

  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    publishedProjects: 0,
    featuredProjects: 0,
    totalServices: 0,
    totalTeamMembers: 0,
    totalTestimonials: 0,
    totalBrands: 0,
    recentActivity: []
  });

  useEffect(() => {
    // Calcular estatísticas
    const publishedProjects = projects.filter(p => p.published).length;
    const featuredProjects = projects.filter(p => p.featured).length;

    // Simular atividade recente (em uma implementação real, isso viria do Firebase)
    const recentActivity: ActivityItem[] = [
      ...projects.slice(0, 3).map(p => ({
        id: p.id,
        type: 'project' as const,
        action: p.published ? 'published' as const : 'created' as const,
        title: p.title,
        timestamp: p.updatedAt || p.createdAt
      })),
      ...services.slice(0, 2).map(s => ({
        id: s.id,
        type: 'service' as const,
        action: 'updated' as const,
        title: s.title,
        timestamp: s.updatedAt || s.createdAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);

    setStats({
      totalProjects: projects.length,
      publishedProjects,
      featuredProjects,
      totalServices: services.length,
      totalTeamMembers: teamMembers.length,
      totalTestimonials: testimonials.length,
      totalBrands: brands.length,
      recentActivity
    });
  }, [projects, services, teamMembers, testimonials, brands]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActivityIcon = (type: string, action: string) => {
    switch (type) {
      case 'project':
        return action === 'published' ? <Eye className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />;
      case 'service':
        return <Activity className="w-4 h-4" />;
      case 'team':
        return <Users className="w-4 h-4" />;
      case 'testimonial':
        return <Star className="w-4 h-4" />;
      case 'brand':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'text-green-600';
      case 'updated':
        return 'text-blue-600';
      case 'published':
        return 'text-purple-600';
      case 'unpublished':
        return 'text-orange-600';
      default:
        return 'text-stone-600';
    }
  };

  const StatCard: React.FC<{
    title: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    description?: string;
  }> = ({ title, value, icon, color, description }) => (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 p-6 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-stone-600">{title}</p>
          <p className="text-3xl font-bold text-stone-900">{value}</p>
          {description && (
            <p className="text-xs text-stone-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-600">Visão geral do back office MV Studio</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Projetos"
          value={stats.totalProjects}
          icon={<FolderOpen className="w-6 h-6 text-white" />}
          color="bg-blue-500"
          description={`${stats.publishedProjects} publicados`}
        />

        <StatCard
          title="Projetos em Destaque"
          value={stats.featuredProjects}
          icon={<Star className="w-6 h-6 text-white" />}
          color="bg-yellow-500"
        />

        <StatCard
          title="Serviços"
          value={stats.totalServices}
          icon={<Activity className="w-6 h-6 text-white" />}
          color="bg-green-500"
        />

        <StatCard
          title="Equipa"
          value={stats.totalTeamMembers}
          icon={<Users className="w-6 h-6 text-white" />}
          color="bg-purple-500"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Testemunhos"
          value={stats.totalTestimonials}
          icon={<Star className="w-6 h-6 text-white" />}
          color="bg-orange-500"
        />

        <StatCard
          title="Marcas/Clientes"
          value={stats.totalBrands}
          icon={<CheckCircle className="w-6 h-6 text-white" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200">
        <div className="p-6 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-stone-500" />
            <h2 className="text-lg font-semibold text-stone-900">Atividade Recente</h2>
          </div>
        </div>

        <div className="p-6">
          {stats.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {stats.recentActivity.map((activity) => (
                <div key={`${activity.type}-${activity.id}`} className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className={`${getActivityColor(activity.action)}`}>
                    {getActivityIcon(activity.type, activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-stone-900">
                      {activity.title}
                    </p>
                    <p className="text-xs text-stone-500">
                      {activity.type === 'project' ? 'Projeto' :
                        activity.type === 'service' ? 'Serviço' :
                          activity.type === 'team' ? 'Membro da Equipa' :
                            activity.type === 'testimonial' ? 'Testemunho' : 'Marca'} {activity.action === 'created' ? 'criado' :
                              activity.action === 'updated' ? 'atualizado' :
                                activity.action === 'published' ? 'publicado' : 'despublicado'}
                    </p>
                  </div>
                  <div className="text-xs text-stone-400">
                    {formatDate(activity.timestamp)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-stone-500">Nenhuma atividade recente</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-6">
        <h2 className="text-lg font-semibold text-stone-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <FolderOpen className="w-5 h-5 text-blue-500" />
            <span className="text-sm font-medium text-stone-700">Novo Projeto</span>
          </button>

          <button className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <Activity className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-stone-700">Novo Serviço</span>
          </button>

          <button className="flex items-center gap-3 p-4 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors">
            <Users className="w-5 h-5 text-purple-500" />
            <span className="text-sm font-medium text-stone-700">Novo Membro</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
