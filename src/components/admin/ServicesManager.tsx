import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  DollarSign,
  Clock,
  Settings,
  Camera,
  Video,
  Palette,
  Lightbulb,
  Scissors,
  Monitor,
  Zap,
  X
} from 'lucide-react';
import { Service } from '../../types';
import { useServices } from '../../hooks/useFirebase';

const ServicesManager: React.FC = () => {
  const { services, loading, error, createService, updateService, deleteService } = useServices();
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    shortDescription: '',
    icon: 'lightbulb',
    featured: false,
    published: false,
    order: 0,
    priceFromKz: 0,
    priceType: 'from' as 'fixed' | 'from' | 'quote',
    priceDisplay: '',
    deliverables: [''],
    process: [''],
    features: [''],
    metaTitle: '',
    metaDescription: ''
  });

  const iconMap: { [key: string]: React.ReactNode } = {
    'lightbulb': <Lightbulb className="w-5 h-5" />,
    'camera': <Camera className="w-5 h-5" />,
    'scissors': <Scissors className="w-5 h-5" />,
    'monitor': <Monitor className="w-5 h-5" />,
    'zap': <Zap className="w-5 h-5" />,
    'video': <Video className="w-5 h-5" />,
    'palette': <Palette className="w-5 h-5" />,
    'settings': <Settings className="w-5 h-5" />,
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      shortDescription: '',
      icon: 'lightbulb',
      featured: false,
      published: false,
      order: 0,
      priceFromKz: 0,
      priceType: 'from' as 'fixed' | 'from' | 'quote',
      priceDisplay: '',
      deliverables: [''],
      process: [''],
      features: [''],
      metaTitle: '',
      metaDescription: ''
    });
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const serviceData = {
        ...formData,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-'),
        deliverables: formData.deliverables.filter(d => d.trim() !== ''),
        process: formData.process.filter(p => p.trim() !== ''),
        features: formData.features.filter(f => f.trim() !== ''),
        gallery: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingService) {
        await updateService(editingService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar serviço:', error);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      slug: service.slug,
      description: service.description,
      shortDescription: service.shortDescription,
      icon: service.icon,
      featured: service.featured,
      published: service.published,
      order: service.order,
      priceFromKz: service.priceFromKz || 0,
      priceType: service.priceType,
      priceDisplay: service.priceDisplay || '',
      deliverables: service.deliverables.length > 0 ? service.deliverables : [''],
      process: service.process.length > 0 ? service.process : [''],
      features: service.features.length > 0 ? service.features : [''],
      metaTitle: service.metaTitle || '',
      metaDescription: service.metaDescription || ''
    });
    setShowForm(true);
  };

  // Filtrar serviços
  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredServices(filtered);
  }, [services, searchTerm]);

  const handleTogglePublished = async (id: string) => {
    try {
      const service = services.find(s => s.id === id);
      if (service) {
        await updateService(id, { ...service, published: !service.published });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de publicação:', error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const service = services.find(s => s.id === id);
      if (service) {
        await updateService(id, { ...service, featured: !service.featured });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de destaque:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este serviço?')) {
      try {
        await deleteService(id);
      } catch (error) {
        console.error('Erro ao eliminar serviço:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Gestão de Serviços</h1>
          <p className="text-stone-600">Gerencie todos os serviços oferecidos</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Serviço
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl border border-stone-200 p-6 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Icon */}
                <div className="p-3 bg-stone-100 rounded-lg group-hover:bg-stone-200 transition-colors duration-300">
                  {iconMap[service.icon] || <Settings className="w-5 h-5" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-stone-900">{service.title}</h3>


                    {/* Status Badges */}
                    {service.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Destaque
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${service.published
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                      }`}>
                      {service.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>

                  <p className="text-stone-600 mb-3">{service.description}</p>

                  <div className="flex items-center gap-6 text-sm text-stone-500">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{service.priceDisplay || (service.priceFromKz ? `${service.priceFromKz.toLocaleString()} Kz` : 'Sob Consulta')}</span>
                    </div>
                    <div>
                      <span>{service.features.length} características</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublished(service.id)}
                  className={`p-2 rounded ${service.published
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-stone-400 hover:bg-stone-50'
                    }`}
                  title={service.published ? 'Despublicar' : 'Publicar'}
                >
                  {service.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => handleToggleFeatured(service.id)}
                  className={`p-2 rounded ${service.featured
                    ? 'text-yellow-600 hover:bg-yellow-50'
                    : 'text-stone-400 hover:bg-stone-50'
                    }`}
                  title={service.featured ? 'Remover destaque' : 'Destacar'}
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleEdit(service)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleDelete(service.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Expandable Details */}
            <div className="mt-4 pt-4 border-t border-stone-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-stone-900 mb-2">Características</h4>
                  <ul className="text-stone-600 space-y-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                    {service.features.length > 3 && (
                      <li className="text-stone-500">+ {service.features.length - 3} mais...</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-stone-900 mb-2">Processo</h4>
                  <ul className="text-stone-600 space-y-1">
                    {service.process.slice(0, 3).map((step, index) => (
                      <li key={index}>{index + 1}. {step}</li>
                    ))}
                    {service.process.length > 3 && (
                      <li className="text-stone-500">+ {service.process.length - 3} mais...</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-stone-900 mb-2">Entregáveis</h4>
                  <ul className="text-stone-600 space-y-1">
                    {service.deliverables.slice(0, 3).map((deliverable, index) => (
                      <li key={index}>• {deliverable}</li>
                    ))}
                    {service.deliverables.length > 3 && (
                      <li className="text-stone-500">+ {service.deliverables.length - 3} mais...</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Settings className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">Nenhum serviço encontrado</h3>
          <p className="text-stone-600 mb-4">
            {searchTerm
              ? 'Tente ajustar o termo de pesquisa'
              : 'Comece criando o seu primeiro serviço'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Criar Primeiro Serviço
            </button>
          )}
        </div>
      )}

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-stone-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-stone-900">
                  {editingService ? 'Editar Serviço' : 'Novo Serviço'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-stone-400 hover:text-stone-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Título */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Descrição Curta */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Descrição Curta *
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Descrição Completa */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Descrição Completa *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Ícone */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Ícone
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                >
                  <option value="lightbulb">Lâmpada</option>
                  <option value="camera">Câmera</option>
                  <option value="video">Vídeo</option>
                  <option value="scissors">Tesoura</option>
                  <option value="monitor">Monitor</option>
                  <option value="palette">Paleta</option>
                  <option value="zap">Raio</option>
                </select>
              </div>

              {/* Preço */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Preço (Kz)
                  </label>
                  <input
                    type="number"
                    value={formData.priceFromKz}
                    onChange={(e) => setFormData({ ...formData, priceFromKz: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Tipo de Preço
                  </label>
                  <select
                    value={formData.priceType}
                    onChange={(e) => setFormData({ ...formData, priceType: e.target.value as 'fixed' | 'from' | 'quote' })}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    <option value="from">A partir de</option>
                    <option value="fixed">Preço fixo</option>
                    <option value="quote">Sob consulta</option>
                  </select>
                </div>
              </div>

              {/* Características */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Características
                </label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => {
                        const newFeatures = [...formData.features];
                        newFeatures[index] = e.target.value;
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="flex-1 px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                      placeholder="Característica do serviço"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newFeatures = formData.features.filter((_, i) => i !== index);
                        setFormData({ ...formData, features: newFeatures });
                      }}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, features: [...formData.features, ''] })}
                  className="text-stone-600 hover:text-stone-800 text-sm"
                >
                  + Adicionar característica
                </button>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  Destacar
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="mr-2"
                  />
                  Publicar
                </label>
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="flex-1 px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
                >
                  {editingService ? 'Atualizar' : 'Criar'} Serviço
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;
