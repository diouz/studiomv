import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  User,
  Building,
  Quote,
  X
} from 'lucide-react';
import { Testimonial } from '../../types';
import { useTestimonials } from '../../hooks/useFirebase';

const TestimonialsManager: React.FC = () => {
  const { testimonials, loading, error, createTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
  const [filteredTestimonials, setFilteredTestimonials] = useState<Testimonial[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientRole: '',
    clientCompany: '',
    clientAvatar: '',
    content: '',
    rating: 5,
    featured: false,
    published: false,
    order: 0
  });

  const resetForm = () => {
    setFormData({
      clientName: '',
      clientRole: '',
      clientCompany: '',
      clientAvatar: '',
      content: '',
      rating: 5,
      featured: false,
      published: false,
      order: 0
    });
    setEditingTestimonial(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const testimonialData = {
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, testimonialData);
      } else {
        await createTestimonial(testimonialData);
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar testemunho:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      clientName: testimonial.clientName,
      clientRole: testimonial.clientRole,
      clientCompany: testimonial.clientCompany || '',
      clientAvatar: testimonial.clientAvatar || '',
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      published: testimonial.published,
      order: testimonial.order
    });
    setShowForm(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-stone-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Filtrar testemunhos
  useEffect(() => {
    let filtered = testimonials;

    if (searchTerm) {
      filtered = filtered.filter(testimonial =>
        testimonial.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.clientCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTestimonials(filtered);
  }, [testimonials, searchTerm]);

  const handleTogglePublished = async (id: string) => {
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (testimonial) {
        await updateTestimonial(id, { ...testimonial, published: !testimonial.published });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de publicação:', error);
    }
  };

  const handleToggleFeatured = async (id: string) => {
    try {
      const testimonial = testimonials.find(t => t.id === id);
      if (testimonial) {
        await updateTestimonial(id, { ...testimonial, featured: !testimonial.featured });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de destaque:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este testemunho?')) {
      try {
        await deleteTestimonial(id);
      } catch (error) {
        console.error('Erro ao eliminar testemunho:', error);
      }
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-stone-300'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT');
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
          <h1 className="text-2xl font-bold text-stone-900">Gestão de Testemunhos</h1>
          <p className="text-stone-600">Gerencie todos os testemunhos de clientes</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Testemunho
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar testemunhos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Testimonials List */}
      <div className="space-y-4">
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white rounded-xl border border-stone-200 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {testimonial.clientAvatar ? (
                    <img
                      src={testimonial.clientAvatar}
                      alt={testimonial.clientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-stone-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-stone-500" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-stone-900">{testimonial.clientName}</h3>
                    
                    {/* Status Badges */}
                    {testimonial.featured && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Destaque
                      </span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      testimonial.published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {testimonial.published ? 'Publicado' : 'Rascunho'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mb-3 text-sm text-stone-600">
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      <span>{testimonial.clientRole}</span>
                    </div>
                    {testimonial.clientCompany && (
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        <span>{testimonial.clientCompany}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>

                  <div className="relative">
                    <Quote className="absolute -top-2 -left-2 w-6 h-6 text-stone-300" />
                    <p className="text-stone-700 pl-4 italic">"{testimonial.content}"</p>
                  </div>

                  <div className="mt-3 text-xs text-stone-500">
                    Criado em {formatDate(testimonial.createdAt)}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublished(testimonial.id)}
                  className={`p-2 rounded ${
                    testimonial.published 
                      ? 'text-green-600 hover:bg-green-50' 
                      : 'text-stone-400 hover:bg-stone-50'
                  }`}
                  title={testimonial.published ? 'Despublicar' : 'Publicar'}
                >
                  {testimonial.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
                
                <button
                  onClick={() => handleToggleFeatured(testimonial.id)}
                  className={`p-2 rounded ${
                    testimonial.featured 
                      ? 'text-yellow-600 hover:bg-yellow-50' 
                      : 'text-stone-400 hover:bg-stone-50'
                  }`}
                  title={testimonial.featured ? 'Remover destaque' : 'Destacar'}
                >
                  <Star className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredTestimonials.length === 0 && (
        <div className="text-center py-12">
          <Quote className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">Nenhum testemunho encontrado</h3>
          <p className="text-stone-600 mb-4">
            {searchTerm 
              ? 'Tente ajustar o termo de pesquisa'
              : 'Comece adicionando o primeiro testemunho'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Adicionar Primeiro Testemunho
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
                  {editingTestimonial ? 'Editar Testemunho' : 'Novo Testemunho'}
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
              {/* Nome do Cliente */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Nome do Cliente *
                </label>
                <input
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Cargo */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Cargo *
                </label>
                <input
                  type="text"
                  value={formData.clientRole}
                  onChange={(e) => setFormData({ ...formData, clientRole: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Empresa */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.clientCompany}
                  onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  URL do Avatar
                </label>
                <input
                  type="url"
                  value={formData.clientAvatar}
                  onChange={(e) => setFormData({ ...formData, clientAvatar: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  placeholder="https://exemplo.com/avatar.jpg"
                />
              </div>

              {/* Conteúdo do Testemunho */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Testemunho *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  required
                />
              </div>

              {/* Avaliação */}
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Avaliação (1-5 estrelas)
                </label>
                <select
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                >
                  <option value={1}>1 Estrela</option>
                  <option value={2}>2 Estrelas</option>
                  <option value={3}>3 Estrelas</option>
                  <option value={4}>4 Estrelas</option>
                  <option value={5}>5 Estrelas</option>
                </select>
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
                  {editingTestimonial ? 'Atualizar' : 'Criar'} Testemunho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsManager;
