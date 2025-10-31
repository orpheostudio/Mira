
import React, { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { MicIcon } from './icons';

// Add SpeechRecognition to the window type for TypeScript
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

interface VoiceTabProps {
    onSendMessage: (message: string) => void;
    latestModelMessage: Message | null;
    isLoading: boolean;
}

type VoiceStatus = 'idle' | 'listening' | 'processing' | 'speaking';

const VoiceTab: React.FC<VoiceTabProps> = ({ onSendMessage, latestModelMessage, isLoading }) => {
    const [status, setStatus] = useState<VoiceStatus>('idle');
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef<any>(null);
    const lastSpokenMessageRef = useRef<string | null>(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.warn("Speech Recognition API not supported.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after a pause for a conversational feel
        recognition.interimResults = true;
        recognition.lang = 'pt-BR';

        let finalTranscript = '';

        recognition.onstart = () => {
            setTranscript('');
            finalTranscript = '';
            setStatus('listening');
        };

        recognition.onresult = (event: any) => {
            let interimTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            setTranscript(finalTranscript + interimTranscript);
        };
        
        recognition.onend = () => {
             if (finalTranscript.trim()) {
                onSendMessage(finalTranscript.trim());
            }
            setStatus('idle');
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error:', event.error);
            setStatus('idle');
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            window.speechSynthesis.cancel();
        };
    }, [onSendMessage]);


    // Effect to handle TTS for new messages
    useEffect(() => {
        if (latestModelMessage && latestModelMessage.text !== lastSpokenMessageRef.current && !isLoading) {
            lastSpokenMessageRef.current = latestModelMessage.text;
            
            const utterance = new SpeechSynthesisUtterance(latestModelMessage.text);
            utterance.lang = 'pt-BR';
            utterance.onstart = () => setStatus('speaking');
            utterance.onend = () => setStatus('idle');
            utterance.onerror = (e) => {
                console.error("Speech synthesis error", e);
                setStatus('idle');
            };
            
            window.speechSynthesis.cancel(); // Cancel any previous speech
            window.speechSynthesis.speak(utterance);
        }
    }, [latestModelMessage, isLoading]);
    
    // Effect to update status when API call is loading
    useEffect(() => {
        if (isLoading) {
            setStatus('processing');
        }
    }, [isLoading]);


    const handleMicClick = () => {
        const recognition = recognitionRef.current;
        if (!recognition) {
            alert('O reconhecimento de voz não é suportado neste navegador.');
            return;
        }

        if (status === 'listening') {
            recognition.stop();
        } else if (status === 'idle') {
            try {
                recognition.start();
            } catch (e) {
                console.error("Could not start recognition", e);
            }
        } else if (status === 'speaking') {
            window.speechSynthesis.cancel();
            setStatus('idle');
        }
    };
    
    const getStatusInfo = () => {
        switch (status) {
            case 'listening': return { text: 'Ouvindo...', color: 'text-red-500', pulse: true };
            case 'processing': return { text: 'Processando...', color: 'text-purple-500', pulse: true };
            case 'speaking': return { text: 'Sena está falando...', color: 'text-blue-500', pulse: false };
            case 'idle':
            default: return { text: 'Toque no microfone para falar', color: 'text-gray-500', pulse: false };
        }
    };

    const { text: statusText, color: statusColor, pulse } = getStatusInfo();

    const micButtonClasses = `w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 transform active:scale-95 shadow-lg border-4 disabled:opacity-50
        ${status === 'listening' ? 'bg-red-500 border-red-300' :
          status === 'speaking' ? 'bg-blue-500 border-blue-300' :
          'bg-purple-600 hover:bg-purple-700 border-purple-300/50'}`;

    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-gray-50">
            <div className={`w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-lg border-4 overflow-hidden mb-6 transition-all duration-300 ${status === 'speaking' ? 'border-blue-400' : 'border-white/30'}`}>
                <img src="https://i.imgur.com/lbi4vra.png" alt="Sena" className="w-full h-full object-cover" />
            </div>

            <p className={`text-lg font-medium mb-8 h-8 ${statusColor} ${pulse ? 'animate-pulse' : ''}`}>{statusText}</p>
            
            <button
                onClick={handleMicClick}
                disabled={status === 'processing'}
                className={micButtonClasses}
                aria-label={status === 'listening' ? 'Parar de ouvir' : 'Começar a ouvir'}
            >
                <MicIcon className={`w-10 h-10 text-white ${status === 'listening' ? 'animate-icon-pulse' : ''}`} />
            </button>
            
            <p className="mt-8 text-gray-700 min-h-[3em] max-w-prose px-4">{transcript || (status === 'idle' ? '...' : '')}</p>
        </div>
    );
};

export default VoiceTab;