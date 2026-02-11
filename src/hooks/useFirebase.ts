import { useState, useEffect } from 'react';
import { FirebaseService } from '../services/firebaseService';
import { Project, Service, TeamMember, Testimonial, Brand, MediaAsset, SiteSettings, BlogPost, BlogCategory } from '../types';

// Hook para projetos
export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar projetos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createProject(project);
      await fetchProjects(); // Recarregar lista
      return id;
    } catch (err) {
      setError('Erro ao criar projeto');
      throw err;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    try {
      await FirebaseService.updateProject(id, updates);
      await fetchProjects(); // Recarregar lista
    } catch (err) {
      setError('Erro ao atualizar projeto');
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      await FirebaseService.deleteProject(id);
      await fetchProjects(); // Recarregar lista
    } catch (err) {
      setError('Erro ao eliminar projeto');
      throw err;
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
};

// Hook para configurações do site
export const useSettings = () => {
  const [settings, setSettings] = useState<SiteSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getSettings();
      setSettings(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar configurações');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSettings = async (settingsData: Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createSettings(settingsData);
      await fetchSettings(); // Recarregar lista
      return id;
    } catch (err) {
      setError('Erro ao criar configurações');
      throw err;
    }
  };

  const updateSettings = async (id: string, updates: Partial<SiteSettings>) => {
    try {
      await FirebaseService.updateSettings(id, updates);
      await fetchSettings(); // Recarregar lista
    } catch (err) {
      setError('Erro ao atualizar configurações');
      throw err;
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return {
    settings,
    loading,
    error,
    fetchSettings,
    createSettings,
    updateSettings,
  };
};

// Hook para serviços
export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getServices();
      setServices(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar serviços');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createService = async (service: Omit<Service, 'id'>) => {
    try {
      const id = await FirebaseService.createService(service);
      await fetchServices();
      return id;
    } catch (err) {
      setError('Erro ao criar serviço');
      throw err;
    }
  };

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      await FirebaseService.updateService(id, updates);
      await fetchServices();
    } catch (err) {
      setError('Erro ao atualizar serviço');
      throw err;
    }
  };

  const deleteService = async (id: string) => {
    try {
      await FirebaseService.deleteService(id);
      await fetchServices();
    } catch (err) {
      setError('Erro ao eliminar serviço');
      throw err;
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return {
    services,
    loading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  };
};

// Hook para equipa
export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getTeamMembers();
      setTeam(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar equipa');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTeamMember = async (member: Omit<TeamMember, 'id'>) => {
    try {
      const id = await FirebaseService.createTeamMember(member);
      await fetchTeam();
      return id;
    } catch (err) {
      setError('Erro ao criar membro da equipa');
      throw err;
    }
  };

  const updateTeamMember = async (id: string, updates: Partial<TeamMember>) => {
    try {
      await FirebaseService.updateTeamMember(id, updates);
      await fetchTeam();
    } catch (err) {
      setError('Erro ao atualizar membro da equipa');
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await FirebaseService.deleteTeamMember(id);
      await fetchTeam();
    } catch (err) {
      setError('Erro ao eliminar membro da equipa');
      throw err;
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return {
    team,
    loading,
    error,
    fetchTeam,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
  };
};

// Hook para testemunhos
export const useTestimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getTestimonials();
      setTestimonials(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar testemunhos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTestimonial = async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>) => {
    try {
      const id = await FirebaseService.createTestimonial(testimonial);
      await fetchTestimonials();
      return id;
    } catch (err) {
      setError('Erro ao criar testemunho');
      throw err;
    }
  };

  const updateTestimonial = async (id: string, updates: Partial<Testimonial>) => {
    try {
      await FirebaseService.updateTestimonial(id, updates);
      await fetchTestimonials();
    } catch (err) {
      setError('Erro ao atualizar testemunho');
      throw err;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      await FirebaseService.deleteTestimonial(id);
      await fetchTestimonials();
    } catch (err) {
      setError('Erro ao eliminar testemunho');
      throw err;
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return {
    testimonials,
    loading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  };
};

// Hook para media
export const useMedia = () => {
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getMediaAssets();
      setMedia(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar media');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createMediaAsset = async (asset: Omit<MediaAsset, 'id' | 'createdAt'>) => {
    try {
      const id = await FirebaseService.createMediaAsset(asset);
      await fetchMedia();
      return id;
    } catch (err) {
      setError('Erro ao criar asset de media');
      throw err;
    }
  };

  const deleteMediaAsset = async (id: string) => {
    try {
      await FirebaseService.deleteMediaAsset(id);
      await fetchMedia();
    } catch (err) {
      setError('Erro ao eliminar asset de media');
      throw err;
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  return {
    media,
    loading,
    error,
    fetchMedia,
    createMediaAsset,
    deleteMediaAsset,
  };
};



// Hook para contactos
export const useContacts = () => {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getContacts();
      setContacts(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar contactos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createContact = async (contact: any) => {
    try {
      const id = await FirebaseService.createContact(contact);
      await fetchContacts();
      return id;
    } catch (err) {
      setError('Erro ao criar contacto');
      throw err;
    }
  };

  const updateContact = async (id: string, updates: any) => {
    try {
      await FirebaseService.updateContact(id, updates);
      await fetchContacts();
    } catch (err) {
      setError('Erro ao atualizar contacto');
      throw err;
    }
  };

  const deleteContact = async (id: string) => {
    try {
      await FirebaseService.deleteContact(id);
      await fetchContacts();
    } catch (err) {
      setError('Erro ao eliminar contacto');
      throw err;
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
};

// Hook para marcas
export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getBrands();
      setBrands(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar marcas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async (brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createBrand(brand);
      await fetchBrands(); // Recarregar lista
      return id;
    } catch (err) {
      setError('Erro ao criar marca');
      throw err;
    }
  };

  const updateBrand = async (id: string, updates: Partial<Brand>) => {
    try {
      await FirebaseService.updateBrand(id, updates);
      await fetchBrands(); // Recarregar lista
    } catch (err) {
      setError('Erro ao atualizar marca');
      throw err;
    }
  };

  const deleteBrand = async (id: string) => {
    try {
      await FirebaseService.deleteBrand(id);
      await fetchBrands(); // Recarregar lista
    } catch (err) {
      setError('Erro ao deletar marca');
      throw err;
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return {
    brands,
    loading,
    error,
    fetchBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};
// Hook para blog posts
export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getBlogPosts();
      setPosts(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar posts do blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createBlogPost(post);
      await fetchPosts();
      return id;
    } catch (err) {
      setError('Erro ao criar post do blog');
      throw err;
    }
  };

  const updatePost = async (id: string, updates: Partial<BlogPost>) => {
    try {
      await FirebaseService.updateBlogPost(id, updates);
      await fetchPosts();
    } catch (err) {
      setError('Erro ao atualizar post do blog');
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await FirebaseService.deleteBlogPost(id);
      await fetchPosts();
    } catch (err) {
      setError('Erro ao eliminar post do blog');
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return {
    posts,
    loading,
    error,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};

// Hook para categorias do blog
export const useBlogCategories = () => {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await FirebaseService.getBlogCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar categorias do blog');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (category: Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await FirebaseService.createBlogCategory(category);
      await fetchCategories();
      return id;
    } catch (err) {
      setError('Erro ao criar categoria do blog');
      throw err;
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
  };
};
