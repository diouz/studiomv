import React, { useState, useEffect } from 'react';
import {
  Settings,
  Users,
  Image,
  BarChart3,
  LogOut,
  Menu,
  X,
  Home,
  Briefcase,
  Star,
  Mail,
  PenTool
} from 'lucide-react';
import Dashboard from '../components/admin/Dashboard';
import ProjectsManagerFirebase from '../components/admin/ProjectsManagerFirebase';
import ServicesManager from '../components/admin/ServicesManager';
import TeamManager from '../components/admin/TeamManager';
import MediaManager from '../components/admin/MediaManager';
import ContactManager from '../components/admin/ContactManager';
import SettingsManagerNew from '../components/admin/SettingsManagerNew';
import TestButton from '../components/admin/TestButton';
import TestimonialsManager from '../components/admin/TestimonialsManager';
import BrandsManager from '../components/admin/BrandsManager';
import BlogManager from '../components/admin/BlogManager';
import AnalyticsManager from '../components/admin/AnalyticsManager';

interface AdminPageProps { }

const AdminPage: React.FC<AdminPageProps> = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Simulação de autenticação simples
  useEffect(() => {
    const authToken = localStorage.getItem('admin_token');
    if (authToken === 'mv_studio_admin_2024') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Credenciais simples para demonstração
    if (loginForm.username === 'admin' && loginForm.password === 'mvstudio2024') {
      localStorage.setItem('admin_token', 'mv_studio_admin_2024');
      setIsAuthenticated(true);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
    setActiveSection('dashboard');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'projects', label: 'Projetos', icon: Briefcase },
    { id: 'services', label: 'Serviços', icon: Settings },
    { id: 'blog', label: 'Blog', icon: PenTool },
    { id: 'team', label: 'Equipa', icon: Users },
    { id: 'testimonials', label: 'Testemunhos', icon: Star },
    { id: 'brands', label: 'Marcas', icon: Image },
    { id: 'media', label: 'Media', icon: Image },
    { id: 'contacts', label: 'Contactos', icon: Mail },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'analytics':
        return <AnalyticsManager />;
      case 'projects':
        return <ProjectsManagerFirebase />;
      case 'services':
        return <ServicesManager />;
      case 'blog':
        return <BlogManager />;
      case 'team':
        return <TeamManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'brands':
        return <BrandsManager />;
      case 'media':
        return <MediaManager />;
      case 'contacts':
        return <ContactManager />;
      case 'settings':
        return <SettingsManagerNew />;
      case 'test':
        return <TestButton />;
      default:
        return <Dashboard />;
    }
  };

  // Tela de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
        <div className="bg-stone-800/50 backdrop-blur-xl border border-stone-700/50 rounded-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">MV Studio</h1>
            <p className="text-stone-400">Painel Administrativo</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">
                Utilizador
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/50 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="Digite o seu utilizador"
                required
              />
            </div>

            <div>
              <label className="block text-stone-300 text-sm font-medium mb-2">
                Palavra-passe
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-stone-900/50 border border-stone-600/50 rounded-xl text-white placeholder-stone-400 focus:outline-none focus:border-stone-500 transition-colors"
                placeholder="Digite a sua palavra-passe"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-stone-600 to-stone-700 text-white py-3 rounded-xl font-medium hover:from-stone-500 hover:to-stone-600 transition-all duration-300 transform hover:scale-105"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 p-4 bg-stone-700/30 rounded-xl">
            <p className="text-stone-400 text-sm text-center">
              <strong>Demo:</strong> admin / mvstudio2024
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-stone-900 transition-all duration-300 flex flex-col`}>
        {/* Header */}
        <div className="p-4 border-b border-stone-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h1 className="text-white font-bold text-lg">MV Studio</h1>
                <p className="text-stone-400 text-sm">Admin Panel</p>
              </div>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-stone-400 hover:text-white transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${activeSection === item.id
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-400 hover:text-white hover:bg-stone-800'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-stone-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Sair</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-stone-900 capitalize">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h2>
            <div className="flex items-center gap-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
              >
                <Home className="w-4 h-4" />
                Ver Site
              </a>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
