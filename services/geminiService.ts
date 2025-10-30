// This file is now configured to use the Mistral API

// Interface for Mistral API messages
interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Interface for the API response
interface MistralApiResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: MistralMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// Configuration interface
interface MistralConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  safeMode: boolean;
  randomSeed?: number;
}

const systemInstruction = `Você é a Sena, uma assistente virtual criada pela AmplaAI com "alma gentil". Sua personalidade é:
- Extremamente amigável, paciente e acolhedora, especialmente com idosos e pessoas com dificuldades tecnológicas
- Usa linguagem simples, clara e acessível, evitando jargões técnicos
- Mostra empatia genuína nas respostas
- É humilde e reconhece quando não sabe algo, oferecendo alternativas
- Adapta seu tom conforme a conversa evolui, tornando-se mais pessoal ao longo do diálogo
- Usa emojis moderadamente para transmitir calor humano (😊,💡,❤️,👍)
- Intercala respostas úteis com pequenas expressões de cuidado
- Nunca tenta "saber tudo", mas sim ajudar dentro de suas capacidades

Diretrizes importantes:
- Sempre trate o usuário com respeito e paciência
- Se não souber algo, diga gentilmente e sugira onde possam encontrar a informação
- Mantenha um tom conversacional, como uma amiga que está ajudando
- Evite respostas muito longas, divida informações complexas em partes
- Mostre interesse genuíno pelo bem-estar do usuário`;

// Configuration for Mistral API
const mistralConfig: MistralConfig = {
  model: 'mistral-large-latest',
  temperature: 0.7,
  maxTokens: 1024,
  topP: 0.9,
  safeMode: false,
  randomSeed: 42
};

// Chat history is maintained in this module to provide context to the model
const chatHistory: MistralMessage[] = [
  {
    role: 'system',
    content: systemInstruction,
  },
];

// Function to manage chat history length
const manageHistoryLength = (history: MistralMessage[], maxLength: number = 20): MistralMessage[] => {
  if (history.length <= maxLength) {
    return history;
  }
  
  // Keep system message and recent messages
  const systemMessage = history[0];
  const recentMessages = history.slice(-maxLength + 1); // +1 to keep space for system message
  
  return [systemMessage, ...recentMessages];
};

export const getSenaResponse = async (userMessage: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
    return "Desculpe, o serviço não está configurado corretamente. A chave da API não foi encontrada. 😔";
  }

  // Validate user message
  if (!userMessage || userMessage.trim().length === 0) {
    return "Olá! 😊 Notei que você não digitou nenhuma mensagem. Como posso ajudá-lo hoje?";
  }

  // Add the new user message to the history
  chatHistory.push({ role: 'user', content: userMessage.trim() });

  try {
    const requestBody = {
      model: mistralConfig.model,
      messages: chatHistory,
      temperature: mistralConfig.temperature,
      max_tokens: mistralConfig.maxTokens,
      top_p: mistralConfig.topP,
      safe_mode: mistralConfig.safeMode,
      random_seed: mistralConfig.randomSeed,
      stream: false
    };

    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${process.env.API_KEY}`,
      },
      body: JSON.stringify(requestBody),
      timeout: 30000 // 30 seconds timeout
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Mistral API error: ${response.status} ${response.statusText}`, errorText);
      
      // Handle specific HTTP errors
      if (response.status === 401) {
        throw new Error("Chave de API inválida ou não autorizada");
      } else if (response.status === 429) {
        throw new Error("Limite de requisições excedido. Por favor, aguarde um momento.");
      } else if (response.status >= 500) {
        throw new Error("Erro interno do servidor da API");
      } else {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
    }

    const data: MistralApiResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new Error("Resposta vazia da API");
    }

    const senaResponseText = data.choices[0]?.message?.content;

    if (!senaResponseText) {
      throw new Error("Estrutura de resposta inválida da API Mistral");
    }

    // Add Sena's response to the history
    chatHistory.push({ role: 'assistant', content: senaResponseText });

    // Manage history length to prevent excessive token usage
    const updatedHistory = manageHistoryLength(chatHistory);
    chatHistory.length = 0;
    chatHistory.push(...updatedHistory);

    // Log usage for monitoring
    console.log(`Tokens utilizados: Prompt=${data.usage.prompt_tokens}, Completion=${data.usage.completion_tokens}, Total=${data.usage.total_tokens}`);

    return senaResponseText;

  } catch (error) {
    console.error("Error getting response from Mistral API:", error);

    // If the API call fails, remove the user's message to prevent a broken conversation state
    if (chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'user') {
      chatHistory.pop();
    }

    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    
    return `Desculpe, parece que estou com um pequeno problema técnico no momento. ${errorMessage} Poderia tentar novamente em alguns instantes? 🙏`;
  }
};

// Additional utility functions
export const clearChatHistory = (): void => {
  chatHistory.length = 0;
  // Re-add system instruction
  chatHistory.push({
    role: 'system',
    content: systemInstruction,
  });
};

export const getChatHistoryLength = (): number => {
  return chatHistory.length;
};

export const updateMistralConfig = (newConfig: Partial<MistralConfig>): void => {
  Object.assign(mistralConfig, newConfig);
};