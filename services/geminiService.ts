// This file is now configured to use the Mistral API
MISTRAL_API_KEY = 'NFuAj8PYUPcaf6tA1BjbyXuIeSjSA4sW'

// Interface for Mistral API messages
interface MistralMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
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

// Chat history is maintained in this module to provide context to the model
const chatHistory: MistralMessage[] = [
    {
        role: 'system',
        content: systemInstruction,
    },
];

export const getSenaResponse = async (userMessage: string): Promise<string> => {
    if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not set.");
        return "Desculpe, o serviço não está configurado corretamente. A chave da API não foi encontrada.";
    }

    // Add the new user message to the history
    chatHistory.push({ role: 'user', content: userMessage });

    try {
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`,
            },
            body: JSON.stringify({
                model: 'mistral-large-latest',
                messages: chatHistory,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Mistral API error: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const senaResponseText = data.choices[0]?.message?.content;

        if (!senaResponseText) {
            throw new Error("Invalid response structure from Mistral API");
        }

        // Add Sena's response to the history
        chatHistory.push({ role: 'assistant', content: senaResponseText });
        
        return senaResponseText;

    } catch (error) {
        console.error("Error getting response from Mistral API:", error);
        
        // If the API call fails, remove the user's message to prevent a broken conversation state
        chatHistory.pop();
        
        return "Desculpe, parece que estou com um pequeno problema técnico no momento. Poderia tentar novamente em alguns instantes? 🙏";
    }
};
