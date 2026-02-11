import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    Calendar,
    User,
    X,
    Save,
    FileText
} from 'lucide-react';
import { BlogPost, ProjectMedia } from '../../types';
import { useBlogPosts, useBlogCategories, useTeam } from '../../hooks/useFirebase';
import MediaLinkUploader from './MediaLinkUploader';

const BlogManager: React.FC = () => {
    const {
        posts,
        loading,
        error,
        createPost,
        updatePost,
        deletePost
    } = useBlogPosts();

    const { categories: blogCategories, createCategory } = useBlogCategories();
    const { team: teamMembers } = useTeam();

    const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');

    // Post Modal State
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        categoryId: '',
        authorId: '',
        tags: [] as string[],
        featured: false,
        published: true,
        images: [] as ProjectMedia[],
    });

    // Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Filter posts
    useEffect(() => {
        let filtered = posts;

        if (searchTerm) {
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(post => post.category?.id === selectedCategory);
        }

        setFilteredPosts(filtered);
    }, [posts, searchTerm, selectedCategory]);

    const handleTogglePublished = async (id: string) => {
        const post = posts.find(p => p.id === id);
        if (post) {
            try {
                await updatePost(id, { published: !post.published });
            } catch (error) {
                console.error('Erro ao atualizar post:', error);
            }
        }
    };

    const handleToggleFeatured = async (id: string) => {
        const post = posts.find(p => p.id === id);
        if (post) {
            try {
                await updatePost(id, { featured: !post.featured });
            } catch (error) {
                console.error('Erro ao atualizar post:', error);
            }
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Tem certeza que deseja eliminar este post?')) {
            try {
                await deletePost(id);
            } catch (error) {
                console.error('Erro ao eliminar post:', error);
            }
        }
    };

    const handleCreateCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        try {
            await createCategory({
                name: newCategoryName,
                slug: newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                published: true
            });
            setShowCategoryModal(false);
            setNewCategoryName('');
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            alert('Erro ao criar categoria.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim()) {
            alert('O título do post é obrigatório.');
            return;
        }

        if (!formData.content.trim()) {
            alert('O conteúdo do post é obrigatório.');
            return;
        }

        if (!formData.categoryId) {
            alert('A categoria do post é obrigatória.');
            return;
        }

        if (!formData.authorId) {
            alert('O autor do post é obrigatório.');
            return;
        }

        try {
            const selectedCategory = blogCategories.find(c => c.id === formData.categoryId);
            const selectedAuthor = teamMembers.find(t => t.id === formData.authorId);

            const featuredImageMedia = formData.images[0];
            const featuredImage = featuredImageMedia ? {
                id: featuredImageMedia.id,
                url: featuredImageMedia.url,
                thumbnailUrl: featuredImageMedia.thumbnailUrl || featuredImageMedia.url,
                type: featuredImageMedia.type,
                alt: featuredImageMedia.alt || '',
                title: featuredImageMedia.title,
                description: featuredImageMedia.description || '',
                fileSize: 0,
                mimeType: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            } : null;

            const postData = {
                title: formData.title,
                slug: formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
                excerpt: formData.excerpt,
                content: formData.content,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                category: selectedCategory as any,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                author: selectedAuthor as any,
                tags: formData.tags,
                featured: formData.featured,
                published: formData.published,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                featuredImage: featuredImage as any,
                gallery: []
            };

            if (editingPost) {
                await updatePost(editingPost.id, postData);
            } else {
                await createPost(postData as any);
            }

            setShowCreateModal(false);
            setEditingPost(null);
            resetForm();
        } catch (error) {
            console.error('Erro ao salvar post:', error);
            alert('Erro ao salvar post. Tente novamente.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            slug: '',
            excerpt: '',
            content: '',
            categoryId: '',
            authorId: '',
            tags: [],
            featured: false,
            published: true,
            images: [],
        });
    };

    const handleEdit = (post: BlogPost) => {
        setEditingPost(post);
        setFormData({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content,
            categoryId: post.category?.id || '',
            authorId: post.author?.id || '',
            tags: post.tags || [],
            featured: post.featured,
            published: post.published,
            images: post.featuredImage ? [{
                id: post.featuredImage.id,
                type: post.featuredImage.type,
                url: post.featuredImage.url,
                thumbnailUrl: post.featuredImage.thumbnailUrl,
                title: post.featuredImage.title,
                description: post.featuredImage.description,
                order: 0,
                uploadedAt: post.featuredImage.createdAt,
                source: 'link'
            }] : [],
        });
        setShowCreateModal(true);
    };

    const formatDate = (dateString: string) => {
        // Check if dateString is valid
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            });
        } catch (error) {
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-stone-600"></div>
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
                    <h1 className="text-2xl font-bold text-stone-900">Gestão do Blog</h1>
                    <p className="text-stone-600">Gerencie posts e artigos</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Novo Post
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl p-6 border border-stone-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Pesquisar posts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                    <div className="sm:w-48">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                        >
                            <option value="all">Todas as Categorias</option>
                            {blogCategories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPosts.map((post) => (
                    <div key={post.id} className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
                        {/* Thumbnail */}
                        <div className="relative h-48 bg-stone-100">
                            {post.featuredImage ? (
                                <img
                                    src={post.featuredImage.url}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FileText className="w-12 h-12 text-stone-400" />
                                </div>
                            )}

                            {/* Status Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                {post.featured && (
                                    <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Star className="w-3 h-3" />
                                        Destaque
                                    </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded-full ${post.published
                                        ? 'bg-green-500 text-white'
                                        : 'bg-stone-500 text-white'
                                    }`}>
                                    {post.published ? 'Publicado' : 'Rascunho'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1 block">
                                        {post.category?.name}
                                    </span>
                                    <h3 className="font-semibold text-stone-900 mb-1">{post.title}</h3>
                                    <p className="text-stone-600 text-sm line-clamp-2">{post.excerpt}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-stone-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span>{post.author?.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleTogglePublished(post.id)}
                                        className={`p-2 rounded-lg transition-colors ${post.published
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-stone-400 hover:bg-stone-50'
                                            }`}
                                        title={post.published ? 'Despublicar' : 'Publicar'}
                                    >
                                        {post.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => handleToggleFeatured(post.id)}
                                        className={`p-2 rounded-lg transition-colors ${post.featured
                                                ? 'text-yellow-600 hover:bg-yellow-50'
                                                : 'text-stone-400 hover:bg-stone-50'
                                            }`}
                                        title={post.featured ? 'Remover destaque' : 'Destacar'}
                                    >
                                        <Star className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            {filteredPosts.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-stone-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-stone-900 mb-2">Nenhum post encontrado</h3>
                    <p className="text-stone-600 mb-4">
                        {searchTerm || selectedCategory !== 'all'
                            ? 'Tente ajustar os filtros de pesquisa'
                            : 'Comece criando o seu primeiro post'
                        }
                    </p>
                    {!searchTerm && selectedCategory === 'all' && (
                        <button
                            onClick={() => setShowCreateModal(true)}
                            className="bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
                        >
                            Criar Primeiro Post
                        </button>
                    )}
                </div>
            )}

            {/* Create/Edit Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-stone-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-stone-900">
                                    {editingPost ? 'Editar Post' : 'Novo Post'}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingPost(null);
                                        resetForm();
                                    }}
                                    className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Coluna Principal */}
                                <div className="md:col-span-2 space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Título *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Resumo (Excerpt) *
                                        </label>
                                        <textarea
                                            required
                                            rows={3}
                                            value={formData.excerpt}
                                            onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Conteúdo *
                                        </label>
                                        <textarea
                                            required
                                            rows={12}
                                            value={formData.content}
                                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent font-mono text-sm"
                                            placeholder="Use Markdown para formatar o conteúdo..."
                                        />
                                    </div>
                                </div>

                                {/* Coluna Lateral */}
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Imagem de Destaque
                                        </label>
                                        <MediaLinkUploader
                                            images={formData.images}
                                            videos={[]}
                                            onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))}
                                            onVideosChange={() => { }}
                                            maxImages={1}
                                            maxVideos={0}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Categoria *
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                required
                                                value={formData.categoryId}
                                                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                            >
                                                <option value="">Selecione uma categoria</option>
                                                {blogCategories.map(category => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                type="button"
                                                onClick={() => setShowCategoryModal(true)}
                                                className="px-3 py-2 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-colors"
                                                title="Nova Categoria"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-stone-900 mb-2">
                                            Autor *
                                        </label>
                                        <select
                                            required
                                            value={formData.authorId}
                                            onChange={(e) => setFormData(prev => ({ ...prev, authorId: e.target.value }))}
                                            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent"
                                        >
                                            <option value="">Selecione um autor</option>
                                            {teamMembers.map(member => (
                                                <option key={member.id} value={member.id}>
                                                    {member.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="border-t border-stone-200 pt-4 space-y-3">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.featured}
                                                onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                                            />
                                            <span className="text-sm text-stone-700">Post em destaque</span>
                                        </label>

                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.published}
                                                onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                                className="rounded border-stone-300 text-stone-600 focus:ring-stone-500"
                                            />
                                            <span className="text-sm text-stone-700">Publicar post</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setEditingPost(null);
                                        resetForm();
                                    }}
                                    className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 bg-stone-800 text-white px-4 py-2 rounded-lg hover:bg-stone-700 transition-colors"
                                >
                                    <Save className="w-4 h-4" />
                                    {editingPost ? 'Atualizar' : 'Criar'} Post
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6">
                        <h3 className="text-lg font-bold text-stone-900 mb-4">Nova Categoria</h3>
                        <form onSubmit={handleCreateCategory}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-stone-900 mb-2">
                                    Nome da Categoria
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-500"
                                    placeholder="Ex: Notícias, Tutoriais"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCategoryModal(false)}
                                    className="px-4 py-2 text-stone-600 hover:text-stone-800"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-stone-800 text-white rounded-lg hover:bg-stone-700"
                                >
                                    Criar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogManager;
