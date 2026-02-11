import {
  Project,
  Service,
  TeamMember,
  ContactForm,
  SiteSettings,
  Testimonial,
  BlogPost,
  ApiResponse,
  PaginatedResponse,
  ProjectFilters,
  ServiceFilters,
  PaginationParams
} from '../types';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';
const API_TIMEOUT = 10000; // 10 seconds

// API Client class
class ApiClient {
  private baseURL: string;
  private timeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return {
        success: true,
        data,
        message: 'Request successful',
      };
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }

      throw new Error('Unknown error occurred');
    }
  }

  // GET request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = new URL(`${this.baseURL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return this.request<T>(endpoint + url.search, { method: 'GET' });
  }

  // POST request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Create API client instance
const apiClient = new ApiClient();

// Projects API
export const projectsApi = {
  // Get all projects with filters and pagination
  getAll: async (
    filters?: ProjectFilters,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<Project>> => {
    const params = { ...filters, ...pagination };
    const response = await apiClient.get<PaginatedResponse<Project>>('/projects', params);
    return response.data;
  },

  // Get project by ID
  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  // Get featured projects
  getFeatured: async (): Promise<Project[]> => {
    const response = await apiClient.get<Project[]>('/projects/featured');
    return response.data;
  },

  // Create new project (admin only)
  create: async (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> => {
    const response = await apiClient.post<Project>('/projects', project);
    return response.data;
  },

  // Update project (admin only)
  update: async (id: string, project: Partial<Project>): Promise<Project> => {
    const response = await apiClient.put<Project>(`/projects/${id}`, project);
    return response.data;
  },

  // Delete project (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },
};

// Services API
export const servicesApi = {
  // Get all services
  getAll: async (filters?: ServiceFilters): Promise<Service[]> => {
    const response = await apiClient.get<Service[]>('/services', filters);
    return response.data;
  },

  // Get service by ID
  getById: async (id: string): Promise<Service> => {
    const response = await apiClient.get<Service>(`/services/${id}`);
    return response.data;
  },

  // Create new service (admin only)
  create: async (service: Omit<Service, 'id'>): Promise<Service> => {
    const response = await apiClient.post<Service>('/services', service);
    return response.data;
  },

  // Update service (admin only)
  update: async (id: string, service: Partial<Service>): Promise<Service> => {
    const response = await apiClient.put<Service>(`/services/${id}`, service);
    return response.data;
  },

  // Delete service (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/services/${id}`);
  },
};

// Team API
export const teamApi = {
  // Get all team members
  getAll: async (): Promise<TeamMember[]> => {
    const response = await apiClient.get<TeamMember[]>('/team');
    return response.data;
  },

  // Get team member by ID
  getById: async (id: string): Promise<TeamMember> => {
    const response = await apiClient.get<TeamMember>(`/team/${id}`);
    return response.data;
  },

  // Create new team member (admin only)
  create: async (member: Omit<TeamMember, 'id'>): Promise<TeamMember> => {
    const response = await apiClient.post<TeamMember>('/team', member);
    return response.data;
  },

  // Update team member (admin only)
  update: async (id: string, member: Partial<TeamMember>): Promise<TeamMember> => {
    const response = await apiClient.put<TeamMember>(`/team/${id}`, member);
    return response.data;
  },

  // Delete team member (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/team/${id}`);
  },
};

// Contact API
export const contactApi = {
  // Submit contact form
  submit: async (formData: ContactForm): Promise<void> => {
    await apiClient.post('/contact', formData);
  },

  // Get all contact submissions (admin only)
  getAll: async (pagination?: PaginationParams): Promise<PaginatedResponse<ContactForm>> => {
    const response = await apiClient.get<PaginatedResponse<ContactForm>>('/contact', pagination);
    return response.data;
  },

  // Mark contact as read (admin only)
  markAsRead: async (id: string): Promise<void> => {
    await apiClient.put(`/contact/${id}/read`);
  },

  // Delete contact submission (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/contact/${id}`);
  },
};

// Settings API
export const settingsApi = {
  // Get site settings
  get: async (): Promise<SiteSettings> => {
    const response = await apiClient.get<SiteSettings>('/settings');
    return response.data;
  },

  // Update site settings (admin only)
  update: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const response = await apiClient.put<SiteSettings>('/settings', settings);
    return response.data;
  },
};

// Testimonials API
export const testimonialsApi = {
  // Get all testimonials
  getAll: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get<Testimonial[]>('/testimonials');
    return response.data;
  },

  // Get featured testimonials
  getFeatured: async (): Promise<Testimonial[]> => {
    const response = await apiClient.get<Testimonial[]>('/testimonials/featured');
    return response.data;
  },

  // Create new testimonial (admin only)
  create: async (testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<Testimonial> => {
    const response = await apiClient.post<Testimonial>('/testimonials', testimonial);
    return response.data;
  },

  // Update testimonial (admin only)
  update: async (id: string, testimonial: Partial<Testimonial>): Promise<Testimonial> => {
    const response = await apiClient.put<Testimonial>(`/testimonials/${id}`, testimonial);
    return response.data;
  },

  // Delete testimonial (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/testimonials/${id}`);
  },
};

// Blog API
export const blogApi = {
  // Get all blog posts
  getAll: async (pagination?: PaginationParams): Promise<PaginatedResponse<BlogPost>> => {
    const response = await apiClient.get<PaginatedResponse<BlogPost>>('/blog', pagination);
    return response.data;
  },

  // Get blog post by slug
  getBySlug: async (slug: string): Promise<BlogPost> => {
    const response = await apiClient.get<BlogPost>(`/blog/${slug}`);
    return response.data;
  },

  // Get featured blog posts
  getFeatured: async (): Promise<BlogPost[]> => {
    const response = await apiClient.get<BlogPost[]>('/blog/featured');
    return response.data;
  },

  // Create new blog post (admin only)
  create: async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<BlogPost> => {
    const response = await apiClient.post<BlogPost>('/blog', post);
    return response.data;
  },

  // Update blog post (admin only)
  update: async (id: string, post: Partial<BlogPost>): Promise<BlogPost> => {
    const response = await apiClient.put<BlogPost>(`/blog/${id}`, post);
    return response.data;
  },

  // Delete blog post (admin only)
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/blog/${id}`);
  },
};

// Media API for file uploads
export const mediaApi = {
  // Upload file
  upload: async (file: File, folder?: string): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    if (folder) formData.append('folder', folder);

    const response = await fetch(`${API_BASE_URL}/media/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  },

  // Delete file
  delete: async (filename: string): Promise<void> => {
    await apiClient.delete(`/media/${filename}`);
  },
};

// Export the API client for custom requests
export { apiClient };

// Development mode fallbacks
export const isDevelopmentMode = import.meta.env.DEV;

// Mock data for development
export const mockData = {
  projects: [] as Project[],
  services: [] as Service[],
  team: [] as TeamMember[],
  testimonials: [] as Testimonial[],
  settings: {} as SiteSettings,
};
