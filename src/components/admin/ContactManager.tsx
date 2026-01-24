import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Eye,
  Trash2,
  Reply,
  Archive,
  User,
  Clock
} from 'lucide-react';
import { useContacts } from '../../hooks/useFirebase';

interface ContactForm {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  budget?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  updatedAt: string;
}

const ContactManager: React.FC = () => {
  const {
    contacts,
    loading,
    error,
    updateContact,
    deleteContact
  } = useContacts();

  const [filteredContacts, setFilteredContacts] = useState<ContactForm[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactForm | null>(null);

  const statusOptions = [
    { value: 'all', label: 'Todos os Estados' },
    { value: 'new', label: 'Novos' },
    { value: 'read', label: 'Lidos' },
    { value: 'replied', label: 'Respondidos' },
    { value: 'archived', label: 'Arquivados' },
  ];

  const projectTypes = [
    'Vídeo Corporativo',
    'Casamento',
    'Evento',
    'Comercial',
    'Documentário',
    'Fotografia',
    'Outro'
  ];

  // Carregar contactos do Firebase quando disponível
  useEffect(() => {
    setFilteredContacts(contacts);
  }, [contacts]);

  // Filtrar contactos
  useEffect(() => {
    let filtered = contacts;

    if (searchTerm) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(contact => contact.status === selectedStatus);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, selectedStatus]);

  const handleStatusChange = async (id: string, newStatus: ContactForm['status']) => {
    try {
      await updateContact(id, { status: newStatus });
    } catch (error) {
      console.error('Erro ao atualizar status do contacto:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja eliminar este contacto?')) {
      try {
        await deleteContact(id);
        if (selectedContact?.id === id) {
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Erro ao eliminar contacto:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-yellow-100 text-yellow-800';
      case 'replied':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-stone-100 text-stone-800';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'new':
        return 'Novo';
      case 'read':
        return 'Lido';
      case 'replied':
        return 'Respondido';
      case 'archived':
        return 'Arquivado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateRelative = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Há menos de 1 hora';
    if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`;
    
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-900 mx-auto mb-4"></div>
          <p className="text-stone-600">Carregando contactos...</p>
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
          <h1 className="text-2xl font-bold text-stone-900">Gestão de Contactos</h1>
          <p className="text-stone-600">Gerencie todas as mensagens de contacto</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-600">
            {contacts.filter(c => c.status === 'new').length} novos contactos
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-stone-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Pesquisar contactos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contacts List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-xl border border-stone-200 p-6 cursor-pointer hover:shadow-lg transition-shadow ${
                selectedContact?.id === contact.id ? 'ring-2 ring-stone-500' : ''
              }`}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-200 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-stone-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900">{contact.name}</h3>
                    <p className="text-stone-600 text-sm">{contact.email}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(contact.status)}`}>
                  {getStatusLabel(contact.status)}
                </span>
              </div>

              <div className="space-y-2 text-sm text-stone-600 mb-3">
                {contact.company && (
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    <span>{contact.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{contact.projectType}</span>
                </div>
                {contact.budget && (
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 text-center">€</span>
                    <span>{contact.budget}</span>
                  </div>
                )}
              </div>

              <p className="text-stone-700 text-sm line-clamp-2 mb-3">{contact.message}</p>

              <div className="flex items-center justify-between text-xs text-stone-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDateRelative(contact.createdAt)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusChange(contact.id, contact.status === 'archived' ? 'read' : 'archived');
                    }}
                    className="p-1 text-stone-400 hover:text-stone-600"
                    title={contact.status === 'archived' ? 'Desarquivar' : 'Arquivar'}
                  >
                    <Archive className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detail View */}
        <div className="lg:sticky lg:top-6">
          {selectedContact ? (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900 mb-2">{selectedContact.name}</h2>
                  <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedContact.status)}`}>
                    {getStatusLabel(selectedContact.status)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value as ContactForm['status'])}
                    className="text-sm px-3 py-1 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                  >
                    <option value="new">Novo</option>
                    <option value="read">Lido</option>
                    <option value="replied">Respondido</option>
                    <option value="archived">Arquivado</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-stone-400" />
                  <a href={`mailto:${selectedContact.email}`} className="text-blue-600 hover:underline">
                    {selectedContact.email}
                  </a>
                </div>
                
                {selectedContact.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-stone-400" />
                    <a href={`tel:${selectedContact.phone}`} className="text-blue-600 hover:underline">
                      {selectedContact.phone}
                    </a>
                  </div>
                )}
                
                {selectedContact.company && (
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-stone-400" />
                    <span className="text-stone-700">{selectedContact.company}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-stone-400" />
                  <span className="text-stone-700">{selectedContact.projectType}</span>
                </div>
                
                {selectedContact.budget && (
                  <div className="flex items-center gap-3">
                    <span className="w-5 h-5 text-stone-400 text-center">€</span>
                    <span className="text-stone-700">{selectedContact.budget}</span>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-stone-900 mb-3">Mensagem</h3>
                <div className="bg-stone-50 rounded-lg p-4">
                  <p className="text-stone-700 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              <div className="text-sm text-stone-500 mb-6">
                <p>Recebido em: {formatDate(selectedContact.createdAt)}</p>
                {selectedContact.updatedAt !== selectedContact.createdAt && (
                  <p>Atualizado em: {formatDate(selectedContact.updatedAt)}</p>
                )}
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.projectType}&body=Olá ${selectedContact.name},%0D%0A%0D%0AObrigado pelo seu contacto...`}
                  className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
                >
                  <Reply className="w-4 h-4" />
                  Responder
                </a>
                <button
                  onClick={() => handleStatusChange(selectedContact.id, selectedContact.status === 'archived' ? 'read' : 'archived')}
                  className="flex items-center gap-2 bg-stone-100 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors"
                >
                  <Archive className="w-4 h-4" />
                  {selectedContact.status === 'archived' ? 'Desarquivar' : 'Arquivar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
              <Mail className="w-12 h-12 text-stone-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-stone-900 mb-2">Selecione um contacto</h3>
              <p className="text-stone-600">Clique num contacto da lista para ver os detalhes</p>
            </div>
          )}
        </div>
      </div>

      {/* Empty State */}
      {filteredContacts.length === 0 && (
        <div className="text-center py-12">
          <Mail className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-stone-900 mb-2">Nenhum contacto encontrado</h3>
          <p className="text-stone-600">
            {searchTerm || selectedStatus !== 'all'
              ? 'Tente ajustar os filtros de pesquisa'
              : 'Ainda não recebeu nenhuma mensagem de contacto'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default ContactManager;
