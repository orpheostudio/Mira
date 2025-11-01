import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

const app = express();
const port = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// --- Validação de Variáveis de Ambiente ---
const requiredEnvVars = ['MISTRAL_API_KEY', 'FRONTEND_URL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ ERRO FATAL: Variáveis de ambiente obrigatórias não configuradas:');
  missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nCrie um arquivo .env com todas as variáveis necessárias.');
  process.exit(1);
}

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL;
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';

// --- Segurança: Helmet ---
app.use(helmet({
  contentSecurityPolicy: false, // Ajuste conforme necessário
  crossOriginEmbedderPolicy: false,
}));

// --- CORS Configuração de Produção ---
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = FRONTEND_URL.split(',').map(url => url.trim());
    
    // Permitir requisições sem origin (mobile apps, Postman, etc)
    if (!origin && !isProduction) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || !isProduction) {
      callback(null, true);
    } else {
      console.warn(`⚠️  Origem bloqueada por CORS: ${origin}`);
      callback(new Error('Não permitido por CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400, // 24 horas de cache de preflight
};

app.use(cors(corsOptions));

// --- Rate Limiting ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: isProduction ? 100 : 1000, // 100 requisições por 15min em produção
  message: { 
    error: 'Muitas requisições deste IP, tente novamente mais tarde.',
    retryAfter: '15 minutos'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.warn(`⚠️  Rate limit excedido para IP: ${req.ip}`);
    res.status(429).json({
      error: 'Muitas requisições',
      message: 'Limite de requisições excedido. Tente novamente em 15 minutos.',
    });
  },
});

app.use('/api/', limiter);

// --- Middlewares ---
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// --- Logging Middleware ---
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// --- Health Check ---
app.get('/health', (req, res) => {
  res.json({ 
    status: 'operational', 
    timestamp: new Date().toISOString(),
    service: 'SENA Mistral Proxy API',
    version: '1.0.0',
    environment: NODE_ENV,
  });
});

// --- Validação de Mensagens ---
function validateMessages(messages) {
  if (!Array.isArray(messages)) {
    return { valid: false, error: 'messages deve ser um array' };
  }

  if (messages.length === 0) {
    return { valid: false, error: 'messages não pode estar vazio' };
  }

  if (messages.length > 50) {
    return { valid: false, error: 'Máximo de 50 mensagens permitido' };
  }

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    
    if (!msg.role || !msg.content) {
      return { 
        valid: false, 
        error: `Mensagem ${i + 1} deve ter 'role' e 'content'` 
      };
    }

    if (!['system', 'user', 'assistant'].includes(msg.role)) {
      return { 
        valid: false, 
        error: `Role inválido na mensagem ${i + 1}: ${msg.role}` 
      };
    }

    if (typeof msg.content !== 'string' || msg.content.length > 10000) {
      return { 
        valid: false, 
        error: `Conteúdo da mensagem ${i + 1} inválido ou muito longo (max: 10000 chars)` 
      };
    }
  }

  return { valid: true };
}

// --- Rota Principal da API ---
app.post('/api/chat', async (req, res) => {
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  console.log(`📩 [${requestId}] Nova requisição em /api/chat`);
  
  const { messages, model, temperature, max_tokens } = req.body;

  // Validação das mensagens
  const validation = validateMessages(messages);
  if (!validation.valid) {
    console.warn(`⚠️  [${requestId}] Validação falhou: ${validation.error}`);
    return res.status(400).json({ 
      error: 'Requisição inválida',
      details: validation.error,
    });
  }

  // Validação de parâmetros opcionais
  const validModel = model || 'mistral-large-latest';
  const validTemperature = typeof temperature === 'number' && temperature >= 0 && temperature <= 2 
    ? temperature 
    : 0.7;
  const validMaxTokens = typeof max_tokens === 'number' && max_tokens > 0 && max_tokens <= 8000
    ? max_tokens 
    : 1000;

  try {
    console.log(`🚀 [${requestId}] Enviando para Mistral API - Model: ${validModel}, Messages: ${messages.length}`);
    
    const requestBody = {
      model: validModel,
      messages: messages,
      temperature: validTemperature,
      max_tokens: validMaxTokens,
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const mistralResponse = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!mistralResponse.ok) {
      let errorData;
      const contentType = mistralResponse.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        errorData = await mistralResponse.json();
      } else {
        errorData = { message: await mistralResponse.text() };
      }
      
      console.error(`❌ [${requestId}] Erro Mistral API: ${mistralResponse.status}`, errorData);
      
      // Mapear erros específicos
      const statusMessages = {
        400: 'Requisição inválida para a API Mistral',
        401: 'Chave de API inválida',
        429: 'Limite de taxa excedido na API Mistral',
        500: 'Erro interno da API Mistral',
        503: 'API Mistral temporariamente indisponível',
      };

      return res.status(mistralResponse.status).json({ 
        error: statusMessages[mistralResponse.status] || 'Erro ao comunicar com a API Mistral',
        details: isProduction ? undefined : errorData,
        requestId,
      });
    }

    const data = await mistralResponse.json();
    console.log(`✅ [${requestId}] Resposta bem-sucedida - Tokens: ${data.usage?.total_tokens || 'N/A'}`);
    
    res.json({
      ...data,
      requestId,
    });

  } catch (error) {
    console.error(`❌ [${requestId}] Erro no servidor:`, error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ 
        error: 'Timeout ao conectar com a API Mistral',
        message: 'A requisição demorou muito tempo. Tente novamente.',
        requestId,
      });
    }
    
    if (error.message?.includes('fetch failed')) {
      return res.status(502).json({ 
        error: 'Erro de conexão com a API Mistral',
        message: 'Não foi possível conectar à API. Verifique sua conexão.',
        requestId,
      });
    }
    
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      message: isProduction ? 'Ocorreu um erro inesperado.' : error.message,
      requestId,
    });
  }
});

// --- Tratamento de Rotas Não Encontradas ---
app.use((req, res) => {
  console.warn(`⚠️  Rota não encontrada: ${req.method} ${req.path}`);
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    availableEndpoints: {
      health: 'GET /health',
      chat: 'POST /api/chat'
    }
  });
});

// --- Tratamento Global de Erros ---
app.use((err, req, res, next) => {
  const requestId = `err_${Date.now()}`;
  console.error(`❌ [${requestId}] Erro não tratado:`, err);
  
  // Erro de CORS
  if (err.message === 'Não permitido por CORS') {
    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Origem não permitida',
    });
  }
  
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: isProduction ? 'Ocorreu um erro inesperado.' : err.message,
    requestId,
  });
});

// --- Graceful Shutdown ---
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT recebido. Encerrando servidor graciosamente...');
  server.close(() => {
    console.log('✅ Servidor encerrado.');
    process.exit(0);
  });
});

// --- Inicialização do Servidor ---
const server = app.listen(port, () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║         🚀 SENA Mistral Proxy API - PRODUÇÃO         ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║  Environment: ${NODE_ENV.padEnd(39)} ║`);
  console.log(`║  Port: ${port.toString().padEnd(46)} ║`);
  console.log(`║  Health Check: http://localhost:${port}/health`.padEnd(55) + '║');
  console.log(`║  Chat Endpoint: http://localhost:${port}/api/chat`.padEnd(55) + '║');
  console.log(`║  CORS Origins: ${FRONTEND_URL.substring(0, 35).padEnd(35)} ║`);
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log('║  ✅ Servidor operacional e aguardando requisições     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
});