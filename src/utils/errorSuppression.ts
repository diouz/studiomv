/**
 * Error Suppression Utility
 * Suprime erros conhecidos de serviços externos que não afetam a funcionalidade
 */

// Lista de erros conhecidos que devem ser suprimidos
const SUPPRESSED_ERRORS = [
  // Spline viewer errors
  'relayserver.spline.design',
  'Failed to execute \'setRemoteDescription\' on \'RTCPeerConnection\'',
  'Failed to parse SessionDescription',
  'spline-viewer.js',
  
  // OpenAI API errors (se não estiver configurado)
  'api.openai.com/v1/realtime',
  '401 (Unauthorized)',
  
  // WebGL errors relacionados ao Spline
  'GL_INVALID_FRAMEBUFFER_OPERATION',
  'GL_INVALID_VALUE',
  'Framebuffer is incomplete',
  'Texture dimensions must all be greater than zero',
  
  // Autoplay errors (comportamento normal)
  'AbortError: The play() request was interrupted',
  'NotAllowedError: play() failed because the user didn\'t interact'
];

// Função para verificar se um erro deve ser suprimido
const shouldSuppressError = (message: string): boolean => {
  return SUPPRESSED_ERRORS.some(pattern => 
    message.toLowerCase().includes(pattern.toLowerCase())
  );
};

// Backup das funções originais do console
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

// Função para inicializar a supressão de erros
export const initializeErrorSuppression = () => {
  // Interceptar console.error
  console.error = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppressError(message)) {
      originalConsoleError.apply(console, args);
    }
  };

  // Interceptar console.warn
  console.warn = (...args: any[]) => {
    const message = args.join(' ');
    if (!shouldSuppressError(message)) {
      originalConsoleWarn.apply(console, args);
    }
  };

  // Interceptar erros não capturados
  window.addEventListener('error', (event) => {
    if (shouldSuppressError(event.message)) {
      event.preventDefault();
      return false;
    }
  });

  // Interceptar promises rejeitadas
  window.addEventListener('unhandledrejection', (event) => {
    const message = event.reason?.message || event.reason?.toString() || '';
    if (shouldSuppressError(message)) {
      event.preventDefault();
      return false;
    }
  });

  console.log('🔇 Error suppression initialized - External service errors will be filtered');
};

// Função para restaurar o comportamento original do console
export const disableErrorSuppression = () => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
  console.log('🔊 Error suppression disabled - All errors will be shown');
};

// Função para adicionar novos padrões de erro para suprimir
export const addErrorPattern = (pattern: string) => {
  SUPPRESSED_ERRORS.push(pattern);
};

// Função para remover padrões de erro
export const removeErrorPattern = (pattern: string) => {
  const index = SUPPRESSED_ERRORS.indexOf(pattern);
  if (index > -1) {
    SUPPRESSED_ERRORS.splice(index, 1);
  }
};

export default {
  initializeErrorSuppression,
  disableErrorSuppression,
  addErrorPattern,
  removeErrorPattern,
  shouldSuppressError
};
