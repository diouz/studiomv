import { FirebaseService } from './firebaseService';

export interface AnalyticsEvent {
  id?: string;
  eventName: string;
  eventType: 'button_click' | 'form_submit' | 'page_view' | 'video_play' | 'download';
  metadata?: {
    buttonText?: string;
    page?: string;
    section?: string;
    url?: string;
    formType?: string;
    videoTitle?: string;
    downloadFile?: string;
    [key: string]: any;
  };
  timestamp: string;
  userAgent?: string;
  sessionId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyticsStats {
  totalEvents: number;
  eventsByType: Record<string, number>;
  eventsByName: Record<string, number>;
  topButtons: Array<{ name: string; count: number }>;
  recentEvents: AnalyticsEvent[];
}

export class AnalyticsService {
  private static sessionId: string = AnalyticsService.generateSessionId();

  private static generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Rastrear evento de clique em botão
   */
  static async trackButtonClick(
    buttonText: string, 
    metadata?: { page?: string; section?: string; url?: string; [key: string]: any }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        eventName: `button_click_${buttonText.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: 'button_click',
        metadata: {
          buttonText,
          page: window.location.pathname,
          section: metadata?.section,
          url: window.location.href,
          ...metadata
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };

      await FirebaseService.createAnalyticsEvent(event);
      console.log('Analytics: Button click tracked:', buttonText);
    } catch (error) {
      console.error('Erro ao rastrear clique do botão:', error);
    }
  }

  /**
   * Rastrear submissão de formulário
   */
  static async trackFormSubmit(
    formType: string,
    metadata?: { success?: boolean; [key: string]: any }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        eventName: `form_submit_${formType.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: 'form_submit',
        metadata: {
          formType,
          page: window.location.pathname,
          url: window.location.href,
          ...metadata
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };

      await FirebaseService.createAnalyticsEvent(event);
      console.log('Analytics: Form submit tracked:', formType);
    } catch (error) {
      console.error('Erro ao rastrear submissão do formulário:', error);
    }
  }

  /**
   * Rastrear reprodução de vídeo
   */
  static async trackVideoPlay(
    videoTitle: string,
    metadata?: { videoUrl?: string; duration?: number; [key: string]: any }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        eventName: `video_play_${videoTitle.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: 'video_play',
        metadata: {
          videoTitle,
          page: window.location.pathname,
          url: window.location.href,
          ...metadata
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };

      await FirebaseService.createAnalyticsEvent(event);
      console.log('Analytics: Video play tracked:', videoTitle);
    } catch (error) {
      console.error('Erro ao rastrear reprodução de vídeo:', error);
    }
  }

  /**
   * Rastrear visualização de página
   */
  static async trackPageView(
    pageName: string,
    metadata?: { [key: string]: any }
  ): Promise<void> {
    try {
      const event: AnalyticsEvent = {
        eventName: `page_view_${pageName.toLowerCase().replace(/\s+/g, '_')}`,
        eventType: 'page_view',
        metadata: {
          page: window.location.pathname,
          url: window.location.href,
          pageName,
          ...metadata
        },
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };

      await FirebaseService.createAnalyticsEvent(event);
      console.log('Analytics: Page view tracked:', pageName);
    } catch (error) {
      console.error('Erro ao rastrear visualização de página:', error);
    }
  }

  /**
   * Obter estatísticas de analytics
   */
  static async getAnalyticsStats(
    startDate?: Date,
    endDate?: Date
  ): Promise<AnalyticsStats> {
    try {
      const events = await FirebaseService.getAnalyticsEvents(startDate, endDate);
      
      const stats: AnalyticsStats = {
        totalEvents: events.length,
        eventsByType: {},
        eventsByName: {},
        topButtons: [],
        recentEvents: events.slice(0, 10)
      };

      // Contar eventos por tipo
      events.forEach(event => {
        stats.eventsByType[event.eventType] = (stats.eventsByType[event.eventType] || 0) + 1;
        stats.eventsByName[event.eventName] = (stats.eventsByName[event.eventName] || 0) + 1;
      });

      // Top botões clicados
      const buttonClicks = events.filter(e => e.eventType === 'button_click');
      const buttonCounts: Record<string, number> = {};
      
      buttonClicks.forEach(event => {
        const buttonText = event.metadata?.buttonText || event.eventName;
        buttonCounts[buttonText] = (buttonCounts[buttonText] || 0) + 1;
      });

      stats.topButtons = Object.entries(buttonCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      return stats;
    } catch (error) {
      console.error('Erro ao obter estatísticas de analytics:', error);
      throw error;
    }
  }
}
