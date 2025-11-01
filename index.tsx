/**
 * Configuração centralizada do aplicativo SENA
 * 
 * Este arquivo centraliza todas as configurações do app,
 * tornando mais fácil gerenciar variáveis de ambiente e configurações
 */

// Tipo para o ambiente
type Environment = 'development' | 'production' | 'staging' | 'test';

// Interface de configuração
interface AppConfig {
  // Informações do App
  app: {
    name: string;
    version: string;
    environment: Environment;
  };
  
  // API Configuration
  api: {
    baseURL: string;
    timeout: number;
    retryAttempts: number;
    retryDelay: number;
  };
  
  // Feature Flags
  features: {
    enableAnalytics: boolean;
    enableDebug: boolean;
    enableConsoleLogs: boolean;
  };
  
  // Analytics (opcional)
  analytics?: {
    googleAnalyticsId?: string;
    sentryDsn?: string;
  };
}

// Função helper para obter variável de ambiente
function getEnvVar(key: string, defaultValue: string = ''): string {
  // Vite expõe variáveis que começam com VITE_ via import.meta.env
  return import.meta.env[key] || defaultValue;
}

// Função helper para obter booleano de variável de ambiente
function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVar(key);
  if (value === '') return defaultValue;
  return value === 'true' || value === '1';
}

// Detectar ambiente
const environment: Environment = (import.meta.env.MODE as Environment) || 'development';
const isDevelopment = environment === 'development';
const isProduction = environment === 'production';
const isStaging = environment === 'staging';

// Configuração principal
const config: AppConfig = {
  app: {
    name: getEnvVar('VITE_APP_NAME', 'SENA'),
    version: getEnvVar('VITE_APP_VERSION', '1.0.0'),
    environment,
  },

  api: {
    baseURL: getEnvVar('VITE_API_URL', 'http://localhost:3001'),
    timeout: 30000, // 30 segundos
    retryAttempts: 3,
    retryDelay: 1000, // 1 segundo
  },

  features: {
    enableAnalytics: getEnvBoolean('VITE_ENABLE_ANALYTICS', false),
    enableDebug: getEnvBoolean('VITE_ENABLE_DEBUG', isDevelopment),
    enableConsoleLogs: getEnvBoolean('VITE_ENABLE_CONSOLE_LOGS', isDevelopment),
  },

  analytics: {
    googleAnalyticsId: getEnvVar('VITE_GA_TRACKING_ID'),
    sentryDsn: getEnvVar('VITE_SENTRY_DSN'),
  },
};

// Logger personalizado que respeita a configuração
export const logger = {
  log: (...args: any[]) => {
    if (config.features.enableConsoleLogs) {
      console.log('[SENA]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    // Sempre log errors
    console.error('[SENA ERROR]', ...args);
  },
  
  warn: (...args: any[]) => {
    if (config.features.enableConsoleLogs) {
      console.warn('[SENA WARN]', ...args);
    }
  },
  
  debug: (...args: any[]) => {
    if (config.features.enableDebug) {
      console.debug('[SENA DEBUG]', ...args);
    }
  },
  
  info: (...args: any[]) => {
    if (config.features.enableConsoleLogs) {
      console.info('[SENA INFO]', ...args);
    }
  },
};

// Validação de configuração em desenvolvimento
if (isDevelopment) {
  logger.debug('Configuração do App:', config);
  
  // Avisos importantes
  if (!config.api.baseURL) {
    logger.warn('⚠️ VITE_API_URL não está configurada!');
  }
}

// Validação de configuração em produção
if (isProduction) {
  // Verificar se variáveis críticas estão configuradas
  const criticalVars = ['VITE_API_URL'];
  
  criticalVars.forEach(varName => {
    if (!getEnvVar(varName)) {
      console.error(`❌ ERRO CRÍTICO: ${varName} não está configurada em produção!`);
    }
  });
  
  // Avisar se analytics está desabilitado em produção
  if (!config.features.enableAnalytics) {
    console.warn('⚠️ Analytics desabilitado em produção');
  }
}

// Exports
export default config;

export {
  isDevelopment,
  isProduction,
  isStaging,
  environment,
};

// Export tipos
export type { AppConfig, Environment };