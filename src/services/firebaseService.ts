import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { Project, Service, TeamMember, Testimonial, Brand, MediaAsset, SiteSettings, ContactForm, BlogPost, BlogCategory } from '../types';
import { AnalyticsEvent } from './analyticsService';

// Tipos para upload
export interface UploadProgress {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

// Coleções do Firestore
const COLLECTIONS = {
  PROJECTS: 'projects',
  SERVICES: 'services',
  TEAM: 'team',
  TESTIMONIALS: 'testimonials',
  BRANDS: 'brands',
  MEDIA: 'media',
  CONTACTS: 'contacts',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics',
  BLOG_POSTS: 'blog_posts',
  BLOG_CATEGORIES: 'blog_categories',
} as const;

// Classe principal do serviço Firebase
export class FirebaseService {
  // ==================== PROJETOS ====================

  static async getProjects(): Promise<Project[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.PROJECTS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Garantir que images e videos são arrays
          images: data.images || [],
          videos: data.videos || [],
          // Converter timestamps
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as Project;
      });
    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
      throw error;
    }
  }

  static async getProject(id: string): Promise<Project | null> {
    try {
      const docSnap = await getDoc(doc(db, COLLECTIONS.PROJECTS, id));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate?.() || new Date(),
          updatedAt: docSnap.data().updatedAt?.toDate?.() || new Date(),
        } as Project;
      }
      return null;
    } catch (error) {
      console.error('Erro ao buscar projeto:', error);
      throw error;
    }
  }

  static async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.PROJECTS), {
        ...project,
        // Garantir que images e videos são arrays
        images: project.images || [],
        videos: project.videos || [],
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      throw error;
    }
  }

  static async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = { // Using any properly here for dynamic updates or define a specific type
        ...updates,
        updatedAt: Timestamp.now(),
      };

      // Se images ou videos estão sendo atualizados, garantir que são arrays
      if (updates.images !== undefined) {
        updateData.images = updates.images || [];
      }
      if (updates.videos !== undefined) {
        updateData.videos = updates.videos || [];
      }

      await updateDoc(doc(db, COLLECTIONS.PROJECTS, id), updateData);
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      throw error;
    }
  }

  static async deleteProject(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PROJECTS, id));
    } catch (error) {
      console.error('Erro ao eliminar projeto:', error);
      throw error;
    }
  }

  // ==================== SERVIÇOS ====================

  static async getServices(): Promise<Service[]> {
    try {
      console.log('🔄 FirebaseService.getServices - Buscando serviços...');

      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.SERVICES), orderBy('order', 'asc'))
      );

      const services = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];

      console.log('✅ FirebaseService.getServices - Encontrados:', services.length, 'serviços');
      return services;
    } catch (error) {
      console.error('❌ FirebaseService.getServices - Erro:', error);
      throw error;
    }
  }

  static async createService(service: Omit<Service, 'id'>): Promise<string> {
    try {
      console.log('🔄 FirebaseService.createService - Dados recebidos:', service);
      console.log('🔄 FirebaseService.createService - Collection:', COLLECTIONS.SERVICES);

      const docRef = await addDoc(collection(db, COLLECTIONS.SERVICES), service);
      console.log('✅ FirebaseService.createService - Sucesso, ID:', docRef.id);

      return docRef.id;
    } catch (error) {
      console.error('❌ FirebaseService.createService - Erro:', error);
      console.error('❌ FirebaseService.createService - Dados que causaram erro:', service);
      throw error;
    }
  }

  static async updateService(id: string, updates: Partial<Service>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.SERVICES, id), updates);
    } catch (error) {
      console.error('Erro ao atualizar serviço:', error);
      throw error;
    }
  }

  static async deleteService(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SERVICES, id));
    } catch (error) {
      console.error('Erro ao eliminar serviço:', error);
      throw error;
    }
  }

  // ==================== EQUIPA ====================

  static async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.TEAM), orderBy('order', 'asc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as TeamMember[];
    } catch (error) {
      console.error('Erro ao buscar equipa:', error);
      throw error;
    }
  }

  static async createTeamMember(member: Omit<TeamMember, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TEAM), member);
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar membro da equipa:', error);
      throw error;
    }
  }

  static async updateTeamMember(id: string, updates: Partial<TeamMember>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.TEAM, id), updates);
    } catch (error) {
      console.error('Erro ao atualizar membro da equipa:', error);
      throw error;
    }
  }

  static async deleteTeamMember(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TEAM, id));
    } catch (error) {
      console.error('Erro ao eliminar membro da equipa:', error);
      throw error;
    }
  }

  // ==================== TESTEMUNHOS ====================

  static async getTestimonials(): Promise<Testimonial[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.TESTIMONIALS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as Testimonial[];
    } catch (error) {
      console.error('Erro ao buscar testemunhos:', error);
      throw error;
    }
  }

  static async createTestimonial(testimonial: Omit<Testimonial, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.TESTIMONIALS), {
        ...testimonial,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar testemunho:', error);
      throw error;
    }
  }

  static async updateTestimonial(id: string, updates: Partial<Testimonial>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.TESTIMONIALS, id), updates);
    } catch (error) {
      console.error('Erro ao atualizar testemunho:', error);
      throw error;
    }
  }

  static async deleteTestimonial(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.TESTIMONIALS, id));
    } catch (error) {
      console.error('Erro ao eliminar testemunho:', error);
      throw error;
    }
  }

  // ==================== MEDIA ====================

  static async uploadFile(
    file: File,
    path: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<string> {
    try {
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress?.({
              progress,
              status: 'uploading',
            });
          },
          (error) => {
            onProgress?.({
              progress: 0,
              status: 'error',
              error: error.message,
            });
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              onProgress?.({
                progress: 100,
                status: 'completed',
                url: downloadURL,
              });
              resolve(downloadURL);
            } catch (error) {
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      throw error;
    }
  }

  static async deleteFile(path: string): Promise<void> {
    try {
      const storageRef = ref(storage, path);
      await deleteObject(storageRef);
    } catch (error) {
      console.error('Erro ao eliminar ficheiro:', error);
      throw error;
    }
  }

  static async createMediaAsset(asset: Omit<MediaAsset, 'id' | 'createdAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTIONS.MEDIA), {
        ...asset,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar asset de media:', error);
      throw error;
    }
  }

  static async getMediaAssets(): Promise<MediaAsset[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.MEDIA), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
      })) as MediaAsset[];
    } catch (error) {
      console.error('Erro ao buscar assets de media:', error);
      throw error;
    }
  }

  static async deleteMediaAsset(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.MEDIA, id));
    } catch (error) {
      console.error('Erro ao eliminar asset de media:', error);
      throw error;
    }
  }



  // ==================== CONTACTOS ====================

  static async getContacts(): Promise<ContactForm[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.CONTACTS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate?.() || new Date(),
      })) as ContactForm[];
    } catch (error) {
      console.error('Erro ao buscar contactos:', error);
      throw error;
    }
  }

  static async createContact(contact: Omit<ContactForm, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.CONTACTS), {
        ...contact,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar contacto:', error);
      throw error;
    }
  }

  static async updateContact(id: string, updates: Partial<ContactForm>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.CONTACTS, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar contacto:', error);
      throw error;
    }
  }

  static async deleteContact(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CONTACTS, id));
    } catch (error) {
      console.error('Erro ao eliminar contacto:', error);
      throw error;
    }
  }

  // Configurações do Site
  static async getSettings(): Promise<SiteSettings[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTIONS.SETTINGS));
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
          updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        } as SiteSettings;
      });
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
      throw error;
    }
  }

  static async createSettings(settingsData: Omit<SiteSettings, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.SETTINGS), {
        ...settingsData,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar configurações:', error);
      throw error;
    }
  }

  static async updateSettings(id: string, updates: Partial<SiteSettings>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.SETTINGS, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  }

  static async deleteSettings(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.SETTINGS, id));
    } catch (error) {
      console.error('Erro ao eliminar configurações:', error);
      throw error;
    }
  }

  // ===== BRANDS METHODS =====
  static async getBrands(): Promise<Brand[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BRANDS), orderBy('order', 'asc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
      } as Brand));
    } catch (error) {
      console.error('Erro ao buscar marcas:', error);
      throw error;
    }
  }

  static async getPublishedBrands(): Promise<Brand[]> {
    try {
      const querySnapshot = await getDocs(
        query(
          collection(db, COLLECTIONS.BRANDS),
          where('published', '==', true)
        )
      );
      const brands = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString(),
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString(),
      } as Brand));

      // Ordenar no cliente para evitar índice composto
      return brands.sort((a, b) => (a.order || 0) - (b.order || 0));
    } catch (error) {
      console.error('Erro ao buscar marcas publicadas:', error);
      throw error;
    }
  }

  static async createBrand(brand: Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.BRANDS), {
        ...brand,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar marca:', error);
      throw error;
    }
  }

  static async updateBrand(id: string, updates: Partial<Brand>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.BRANDS, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar marca:', error);
      throw error;
    }
  }

  static async deleteBrand(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BRANDS, id));
    } catch (error) {
      console.error('Erro ao deletar marca:', error);
      throw error;
    }
  }

  // ==================== ANALYTICS ====================

  static async getAnalyticsEvents(startDate?: Date, endDate?: Date): Promise<AnalyticsEvent[]> {
    try {
      let q = query(collection(db, COLLECTIONS.ANALYTICS), orderBy('timestamp', 'desc'));

      if (startDate) {
        q = query(q, where('timestamp', '>=', startDate.toISOString()));
      }
      if (endDate) {
        q = query(q, where('timestamp', '<=', endDate.toISOString()));
      }

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as AnalyticsEvent[];
    } catch (error) {
      console.error('Erro ao buscar eventos de analytics:', error);
      throw error;
    }
  }

  static async createAnalyticsEvent(event: AnalyticsEvent): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.ANALYTICS), {
        ...event,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar evento de analytics:', error);
      throw error;
    }
  }
  // ==================== BLOG ====================

  static async getBlogPosts(): Promise<BlogPost[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BLOG_POSTS), orderBy('createdAt', 'desc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      })) as BlogPost[];
    } catch (error) {
      console.error('Erro ao buscar posts do blog:', error);
      throw error;
    }
  }

  static async createBlogPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_POSTS), {
        ...post,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar post do blog:', error);
      throw error;
    }
  }

  static async updateBlogPost(id: string, updates: Partial<BlogPost>): Promise<void> {
    try {
      await updateDoc(doc(db, COLLECTIONS.BLOG_POSTS, id), {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Erro ao atualizar post do blog:', error);
      throw error;
    }
  }

  static async deleteBlogPost(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BLOG_POSTS, id));
    } catch (error) {
      console.error('Erro ao eliminar post do blog:', error);
      throw error;
    }
  }

  static async getBlogCategories(): Promise<BlogCategory[]> {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, COLLECTIONS.BLOG_CATEGORIES), orderBy('name', 'asc'))
      );
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      })) as BlogCategory[];
    } catch (error) {
      console.error('Erro ao buscar categorias do blog:', error);
      throw error;
    }
  }

  static async createBlogCategory(category: Omit<BlogCategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTIONS.BLOG_CATEGORIES), {
        ...category,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar categoria do blog:', error);
      throw error;
    }
  }
}

export default FirebaseService;
