// WARNING: Storing API keys in frontend code is highly insecure.
// This key will be visible to anyone who inspects your website's code.
// For production, always use a backend proxy to protect your API key.
const MISTRAL_API_KEY = 'NFuAj8PYUPcaf6tA1BjbyXuIeSjSA4sW'; // <-- Replace with your actual key
const API_URL = 'https://api.mistral.ai/v1/chat/completions';

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

// Define the shape for Mistral API messages
interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// History is maintained internally in the format Mistral expects.
const conversationHistory: MistralMessage[] = [
    { role: 'system', content: systemInstruction },
    { role: 'assistant', content: 'Olá! Eu sou a Sena, sua amiga virtual. 😊 Estou aqui para ajudar você com o que precisar. Pode me perguntar qualquer coisa!' },
    { role: 'assistant', content: 'Sou especialmente criada para ser paciente e acolhedora. Se tiver dificuldade com tecnologia, fique à vontade que eu explico com calma.' }
];

export const getSenaResponse = async (userMessage: string): Promise<string> => {
    if (!MISTRAL_API_KEY || MISTRAL_API_KEY === 'NFuAj8PYUPcaf6tA1BjbyXuIeSjSA4sW') {
        return "Olá! Parece que a chave da API da Mistral ainda não foi configurada. Por favor, adicione sua chave no arquivo `services/geminiService.ts` para que eu possa conversar com você. 😊";
    }

    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        // IMPORTANT: This direct API call from the browser is likely to be blocked by CORS.
        // This is a security feature by Mistral to protect your API key.
        // The recommended solution is to use a backend proxy.
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                model: 'mistral-large-latest', // A capable model for chat
                messages: conversationHistory,
            }),
        });

        if (!response.ok) {
            console.error("Error from Mistral API:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            if (errorText.includes("invalid_api_key")) {
                 return "A chave da API que você configurou parece ser inválida. Poderia verificar, por favor? 🙏";
            }
            throw new Error(`A API retornou um erro: ${response.statusText}`);
        }

        const data = await response.json();
        const senaResponseText = data.choices?.[0]?.message?.content;

        if (!senaResponseText) {
            throw new Error("A resposta da API não continha o texto esperado.");
        }

        conversationHistory.push({ role: 'assistant', content: senaResponseText });
        
        return senaResponseText.trim();

    } catch (error) {
        console.error("Failed to fetch from Mistral API:", error);
        conversationHistory.pop(); // Remove user message on failure
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return "Desculpe, não consegui me conectar. Isso geralmente acontece por causa de uma restrição de segurança do navegador (CORS). Para que eu funcione corretamente em um site público como o GitHub Pages, a chamada para a API precisa ser feita através de um servidor intermediário (proxy).";
        }
        
        return "Desculpe, parece que estou com um pequeno problema técnico no momento. Poderia tentar novamente em alguns instantes? 🙏";
    }
};
