import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carrega variáveis de ambiente baseado no mode (development, production, etc)
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // Configuração do servidor de desenvolvimento
    server: {
      port: 3000,
      host: '0.0.0.0', // Permite acesso externo
      strictPort: false, // Se a porta estiver ocupada, tenta a próxima
      open: false, // Não abre o browser automaticamente
      cors: true, // Habilita CORS
      // Proxy para API local (desenvolvimento)
      proxy: mode === 'development' ? {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        }
      } : undefined
    },

    // Configuração de preview (após build)
    preview: {
      port: 3000,
      host: '0.0.0.0',
      strictPort: false,
      open: false,
    },

    // Plugins
    plugins: [
      react({
        // Fast Refresh
        fastRefresh: true,
        // Babel config (opcional)
        babel: {
          plugins: [],
        },
      }),
    ],

    // Definir variáveis de ambiente globais
    // ATENÇÃO: Nunca exponha chaves secretas no frontend!
    define: {
      // Para compatibilidade com código antigo (se necessário)
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      
      // Variáveis do Mistral (se usar)
      'process.env.MISTRAL_API_URL': JSON.stringify(env.VITE_API_URL),
      
      // Informações do app
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },

    // Alias de paths
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@services': path.resolve(__dirname, './src/services'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@config': path.resolve(__dirname, './src/config'),
      },
    },

    // Configuração de build para produção
    build: {
      // Diretório de saída
      outDir: 'dist',
      
      // Assets directory
      assetsDir: 'assets',
      
      // Sourcemaps (desabilitar em produção para segurança)
      sourcemap: mode === 'development',
      
      // Minificação
      minify: 'terser',
      
      // Target (browsers suportados)
      target: 'esnext',
      
      // Chunk size warnings
      chunkSizeWarningLimit: 1000,
      
      // Terser options (otimização JS)
      terserOptions: {
        compress: {
          drop_console: mode === 'production', // Remove console.log em produção
          drop_debugger: mode === 'production',
          pure_funcs: mode === 'production' ? ['console.log', 'console.info'] : [],
        },
        format: {
          comments: false, // Remove comentários
        },
      },

      // Rollup options
      rollupOptions: {
        output: {
          // Estratégia de code splitting
          manualChunks: {
            // Separar vendor chunks
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            
            // Se usar outras libs grandes, separe também
            // 'ui-vendor': ['@radix-ui/...', 'lucide-react'],
          },
          
          // Naming pattern para chunks
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `assets/images/[name]-[hash][extname]`;
            } else if (/woff|woff2|eot|ttf|otf/i.test(ext)) {
              return `assets/fonts/[name]-[hash][extname]`;
            } else if (/css/i.test(ext)) {
              return `assets/css/[name]-[hash][extname]`;
            }
            
            return `assets/[name]-[hash][extname]`;
          },
        },
      },

      // Reportar tamanho dos chunks comprimidos
      reportCompressedSize: true,

      // CSS code splitting
      cssCodeSplit: true,
    },

    // Otimizações
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
      ],
      exclude: [],
    },

    // Base URL (se seu app não estiver na raiz)
    // base: '/sena/', // Se estiver em sena.orpheostudio.com.br/sena/
    base: '/', // Para domínio raiz

    // Configuração de CSS
    css: {
      modules: {
        localsConvention: 'camelCase',
      },
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`,
        },
      },
    },

    // Variables de ambiente que começam com VITE_ são expostas automaticamente
    envPrefix: 'VITE_',

    // Log level
    logLevel: mode === 'production' ? 'warn' : 'info',

    // Clear screen on rebuild
    clearScreen: true,
  };
});