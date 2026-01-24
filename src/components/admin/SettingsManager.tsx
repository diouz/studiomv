import React, { useState, useEffect } from 'react';
import {
  Save,
  Globe,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Eye,
  Search,
  Palette,
  Shield,
  Bell,
  Video,
  Type,
  Image as ImageIcon,
  Play,
  Link,
  MessageSquare
} from 'lucide-react';
import { SiteSettings } from '../../types';
import { useSettings } from '../../hooks/useFirebase';
import VideoUploader, { VideoData } from './VideoUploader';

const SettingsManager: React.FC = () => {
  const {
    settings: firebaseSettings,
    loading,
    error,
    createSettings,
    updateSettings
  } = useSettings();

  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'MV Studio',
    tagline: 'Não é como começa, É como termina',
    description: 'Estúdio de produção audiovisual especializado em filmmaking, fotografia e edição criativa.',
    email: 'contato@mvstudio.pt',
    phone: '+351 912 345 678',
    address: 'Lisboa, Portugal',
    socialLinks: {
      instagram: 'https://instagram.com/mvstudio',
      facebook: 'https://facebook.com/mvstudio',
      linkedin: 'https://linkedin.com/company/mvstudio',
      youtube: 'https://youtube.com/mvstudio',
    },
    metaTitle: 'MV Studio - Produção Audiovisual em Lisboa',
    metaDescription: 'Estúdio de produção audiovisual em Lisboa especializado em filmmaking, fotografia e edição criativa. Transformamos ideias em realidade cinematográfica.',
    metaKeywords: 'produção audiovisual, filmmaking, fotografia, Lisboa, Portugal',
    googleAnalyticsId: '',
    facebookPixelId: '',
    maintenanceMode: false,
    maintenanceMessage: '',
  });

  const [activeTab, setActiveTab] = useState('general');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Carregar configurações do Firebase quando disponível
  useEffect(() => {
    if (firebaseSettings && firebaseSettings.length > 0) {
      setSettings(firebaseSettings[0]);
    }
  }, [firebaseSettings]);

  const tabs = [
    { id: 'general', label: 'Geral', icon: Globe },
    { id: 'contact', label: 'Contacto', icon: Mail },
    { id: 'social', label: 'Redes Sociais', icon: Instagram },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: Eye },
    { id: 'maintenance', label: 'Manutenção', icon: Shield },
  ];

  const handleSave = async () => {
    setSaving(true);

    try {
      if (firebaseSettings && firebaseSettings.length > 0) {
        // Atualizar configurações existentes
        await updateSettings(firebaseSettings[0].id, settings);
      } else {
        // Criar novas configurações
        await createSettings(settings);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const renderGeneralTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Nome do Site
        </label>
        <input
          type="text"
          value={settings.siteName}
          onChange={(e) => handleInputChange('siteName', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Tagline
        </label>
        <input
          type="text"
          value={settings.tagline}
          onChange={(e) => handleInputChange('tagline', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Descrição
        </label>
        <textarea
          value={settings.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderContactTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="email"
            value={settings.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Telefone
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="tel"
            value={settings.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Morada
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            value={settings.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Instagram
        </label>
        <div className="relative">
          <Instagram className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="url"
            value={settings.socialLinks.instagram || ''}
            onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
            placeholder="https://instagram.com/mvstudio"
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Facebook
        </label>
        <div className="relative">
          <Facebook className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="url"
            value={settings.socialLinks.facebook || ''}
            onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
            placeholder="https://facebook.com/mvstudio"
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          LinkedIn
        </label>
        <div className="relative">
          <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="url"
            value={settings.socialLinks.linkedin || ''}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/company/mvstudio"
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          YouTube
        </label>
        <div className="relative">
          <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="url"
            value={settings.socialLinks.youtube || ''}
            onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
            placeholder="https://youtube.com/mvstudio"
            className="w-full pl-10 pr-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );

  const renderSEOTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Meta Título
        </label>
        <input
          type="text"
          value={settings.metaTitle}
          onChange={(e) => handleInputChange('metaTitle', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
        <p className="text-xs text-stone-500 mt-1">Recomendado: 50-60 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Meta Descrição
        </label>
        <textarea
          value={settings.metaDescription}
          onChange={(e) => handleInputChange('metaDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
        <p className="text-xs text-stone-500 mt-1">Recomendado: 150-160 caracteres</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Palavras-chave
        </label>
        <input
          type="text"
          value={settings.metaKeywords}
          onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
          placeholder="palavra1, palavra2, palavra3"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
        <p className="text-xs text-stone-500 mt-1">Separe as palavras-chave com vírgulas</p>
      </div>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Google Analytics ID
        </label>
        <input
          type="text"
          value={settings.googleAnalyticsId || ''}
          onChange={(e) => handleInputChange('googleAnalyticsId', e.target.value)}
          placeholder="G-XXXXXXXXXX"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-900 mb-2">
          Facebook Pixel ID
        </label>
        <input
          type="text"
          value={settings.facebookPixelId || ''}
          onChange={(e) => handleInputChange('facebookPixelId', e.target.value)}
          placeholder="123456789012345"
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
        />
      </div>
    </div>
  );

  const renderMaintenanceTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-900">Modo de Manutenção</h3>
            <p className="text-sm text-yellow-700">
              Quando ativo, o site mostrará uma página de manutenção para visitantes
            </p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintenanceMode}
            onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-stone-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-stone-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-stone-600"></div>
        </label>
      </div>

      {settings.maintenanceMode && (
        <div>
          <label className="block text-sm font-medium text-stone-900 mb-2">
            Mensagem de Manutenção
          </label>
          <textarea
            value={settings.maintenanceMessage || ''}
            onChange={(e) => handleInputChange('maintenanceMessage', e.target.value)}
            rows={4}
            placeholder="Estamos a trabalhar para melhorar a sua experiência. Voltamos em breve!"
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralTab();
      case 'contact':
        return renderContactTab();
      case 'social':
        return renderSocialTab();
      case 'seo':
        return renderSEOTab();
      case 'analytics':
        return renderAnalyticsTab();
      case 'maintenance':
        return renderMaintenanceTab();
      default:
        return renderGeneralTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Configurações do Site</h1>
          <p className="text-stone-600">Gerencie as configurações gerais do website</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            saved
              ? 'bg-green-600 text-white'
              : saving
              ? 'bg-stone-400 text-white cursor-not-allowed'
              : 'bg-stone-800 text-white hover:bg-stone-700'
          }`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'A guardar...' : saved ? 'Guardado!' : 'Guardar Alterações'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-stone-100 text-stone-900 border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsManager;
