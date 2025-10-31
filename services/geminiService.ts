import { Message } from '../types';

const API_PROXY_ENDPOINT = '/api/proxy'; // Endpoint do seu servidor que chamará a Mistral

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

// Mantemos o histórico da conversa no frontend para enviar ao backend
let conversationHistory: Message[] = [
    { 
        role: 'model', 
        text: 'Olá! Eu sou a Sena, sua amiga virtual. 😊 Estou aqui para ajudar você com o que precisar. Pode me perguntar qualquer coisa!' 
    },
    { 
        role: 'model', 
        text: 'Sou especialmente criada para ser paciente e acolhedora. Se tiver dificuldade com tecnologia, fique à vontade que eu explico com calma.'
    }
];

export const getSenaResponse = async (userMessage: string): Promise<string> => {
    // Adiciona a nova mensagem do usuário ao histórico
    conversationHistory.push({ role: 'user', text: userMessage });

    try {
        // O frontend envia a mensagem do usuário e o histórico para o seu backend
        const response = await fetch(API_PROXY_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                systemPrompt: systemInstruction,
                history: conversationHistory
            }),
        });

        if (!response.ok) {
            console.error("Error from backend proxy:", response.statusText);
            throw new Error('Falha na comunicação com o servidor.');
        }

        const data = await response.json();
        const senaResponseText = data.text;

        if (!senaResponseText) {
             throw new Error("Resposta do servidor está em um formato inválido.");
        }

        // Adiciona a resposta da Sena ao histórico
        conversationHistory.push({ role: 'model', text: senaResponseText });
        
        return senaResponseText;

    } catch (error) {
        console.error("Error calling backend proxy:", error);
        // Remove a última mensagem do usuário do histórico se a chamada falhar
        conversationHistory.pop();
        return "Desculpe, parece que estou com um pequeno problema técnico no momento. Poderia tentar novamente em alguns instantes? 🙏";
    }
};
