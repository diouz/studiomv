import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Mail,
  Phone,
  Linkedin,
  Instagram,
  Globe,
  User
} from 'lucide-react';
import { TeamMember } from '../../types';
import { useTeam } from '../../hooks/useFirebase';



const TeamManager: React.FC = () => {
  const {
    team: teamMembers,
    loading,
    error,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
  } = useTeam();

  const [filteredMembers, setFilteredMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Filtrar membros baseado na pesquisa
  useEffect(() => {
    let filtered = teamMembers;

    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredMembers(filtered);
  }, [teamMembers, searchTerm]);





  const handleToggleFeatured = async (id: string) => {
    try {
      const member = teamMembers.find(m => m.id === id);
      if (member) {
        await updateTeamMember(id, { ...member, featured: !member.featured });
      }
    } catch (error) {
      console.error('Erro ao atualizar status de destaque:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este membro da equipa?')) {
      try {
        await deleteTeamMember(id);
      } catch (error) {
        console.error('Erro ao eliminar membro da equipa:', error);
      }
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Linkedin className="w-4 h-4" />;
      case 'instagram':
        return <Instagram className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
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
          <h1 className="text-2xl font-bold text-stone-900">Gestão de Equipa</h1>
          <p className="text-stone-600">Gerencie todos os membros da equipa</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Novo Membro
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Pesquisar membros da equipa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out">
            {/* Header with Avatar */}
            <div className="relative p-6 pb-4">
              <div className="flex items-start justify-between mb-4">
                <div className="relative">
                  <img
                    src={member.avatar.url}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {/* Status Badges */}
                  <div className="absolute -top-2 -right-2 flex flex-col gap-1">
                    {member.featured && (
                      <span className="bg-yellow-500 text-white text-xs p-1 rounded-full">
                        <Star className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-1">
                  <button
                    onClick={() => handleToggleFeatured(member.id)}
                    className={`p-1 rounded ${member.featured
                      ? 'text-yellow-600 hover:bg-yellow-50'
                      : 'text-stone-400 hover:bg-stone-50'
                      }`}
                    title={member.featured ? 'Remover destaque' : 'Destacar'}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-stone-900 text-lg">{member.name}</h3>
                <p className="text-stone-600 text-sm mb-3">{member.role}</p>
                <p className="text-stone-600 text-sm line-clamp-3">{member.bio}</p>
              </div>
            </div>

            {/* Contact Info */}
            <div className="px-6 pb-4">
              <div className="space-y-2">
                {member.email && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{member.email}</span>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Phone className="w-4 h-4" />
                    <span>{member.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Skills removed as not in type */}

            {/* Social Links */}
            {Object.keys(member.socialLinks).length > 0 && (
              <div className="px-6 pb-4">
                <h4 className="text-sm font-medium text-stone-900 mb-2">Redes Sociais</h4>
                <div className="flex gap-2">
                  {Object.entries(member.socialLinks).map(([platform, url]) => (
                    url && (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
                        title={platform}
                      >
                        {getSocialIcon(platform)}
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="px-6 py-4 bg-stone-50 border-t border-stone-100">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500">
                  Ordem: {member.order}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingMember(member)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(member.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">Nenhum membro encontrado</h3>
          <p className="text-stone-600 mb-4">
            {searchTerm
              ? 'Tente ajustar o termo de pesquisa'
              : 'Comece adicionando o primeiro membro da equipa'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
            >
              Adicionar Primeiro Membro
            </button>
          )}
        </div>
      )}

      {/* Modal de Edição */}
      {editingMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Editar Membro da Equipa</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={editingMember.bio}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={editingMember.avatar.url}
                  onChange={(e) => setEditingMember({
                    ...editingMember,
                    avatar: {
                      ...editingMember.avatar,
                      url: e.target.value,
                      thumbnailUrl: e.target.value
                    }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingMember(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  try {
                    await updateTeamMember(editingMember.id, editingMember);
                    setEditingMember(null);
                  } catch (error) {
                    console.error('Erro ao atualizar membro:', error);
                    alert('Erro ao atualizar membro. Tente novamente.');
                  }
                }}
                className="flex-1 px-4 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManager;
