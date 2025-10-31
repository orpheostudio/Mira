// ===================================================================================
// SENA API Service
// ===================================================================================
// This service now communicates with a local backend proxy server, which securely
// handles the connection to the Mistral AI API.
//
// To run this application, you must also start the backend server located in the
// `/api` directory. See `/api/README.md` for instructions.
// ===================================================================================

// Use a relative path. This allows the app to work seamlessly in both
// local development and deployed environments without code changes.
const API_URL = '/api/chat';

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

// History is maintained in the frontend to provide context for the conversation.
const conversationHistory: MistralMessage[] = [
    { role: 'system', content: systemInstruction },
    { role: 'assistant', content: 'Olá! Eu sou a Sena, sua amiga virtual. 😊 Estou aqui para ajudar você com o que precisar. Pode me perguntar qualquer coisa!' },
    { role: 'assistant', content: 'Sou especialmente criada para ser paciente e acolhedora. Se tiver dificuldade com tecnologia, fique à vontade que eu explico com calma.' }
];

export const getSenaResponse = async (userMessage: string): Promise<string> => {
    conversationHistory.push({ role: 'user', content: userMessage });

    try {
        // This fetch call now goes to our secure backend proxy
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            // The backend expects an object with a 'messages' property
            body: JSON.stringify({
                messages: conversationHistory,
            }),
        });

        if (!response.ok) {
            console.error("Error from backend proxy:", response.status, response.statusText);
            const errorText = await response.text();
            console.error("Error details:", errorText);
            // Check for specific Mistral errors that might be forwarded by the proxy
            if (errorText.includes("invalid_api_key")) {
                 return "Olá! Parece que a chave da API configurada no servidor (backend) é inválida. Por favor, peça ao administrador para verificar. 🙏";
            }
            throw new Error(`O servidor retornou um erro: ${response.statusText}`);
        }

        const data = await response.json();
        const senaResponseText = data.choices?.[0]?.message?.content;

        if (!senaResponseText) {
            throw new Error("A resposta da API não continha o texto esperado.");
        }

        conversationHistory.push({ role: 'assistant', content: senaResponseText });
        
        return senaResponseText.trim();

    } catch (error) {
        console.error("Failed to fetch from backend proxy:", error);
        conversationHistory.pop(); // Remove user message on failure
        
        if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
            return "Não consegui me conectar ao servidor. 😥\n\nPor favor, verifique se o servidor de backend está rodando e sua conexão com a internet. Se o problema persistir, pode ser um problema de configuração.";
        }
        
        return "Desculpe, parece que estou com um problema técnico no momento. Poderia tentar novamente em alguns instantes? 🙏";
    }
};