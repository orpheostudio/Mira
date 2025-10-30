import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import TypingIndicator from './TypingIndicator';
import { SendIcon, MicIcon, PaperclipIcon } from './icons';

interface ChatTabProps {
    messages: Message[];
    isLoading: boolean;
    onSendMessage: (message: string) => void;
}

const ChatTab: React.FC<ChatTabProps> = ({ messages, isLoading, onSendMessage }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    useEffect(() => {
        const textarea = textAreaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [inputValue]);
    
    const handleSendMessage = () => {
        if (inputValue.trim() && !isLoading) {
            onSendMessage(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="flex flex-col flex-1">
            <main className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && (
                                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow border-2 border-white/30 overflow-hidden flex-shrink-0">
                                    <img src="https://i.imgur.com/lbi4vra.png" alt="Sena Avatar" className="w-full h-full object-cover"/>
                                </div>
                            )}
                            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm animate-message-appear ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-lg' : 'bg-gray-200 text-gray-800 rounded-bl-lg'}`}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <div className="p-4 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                <div className="flex items-end gap-2 bg-gray-100 rounded-2xl p-2 border border-gray-200 focus-within:border-purple-400 transition-colors">
                     <textarea
                        ref={textAreaRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                            }
                        }}
                        placeholder="Digite sua mensagem..."
                        rows={1}
                        className="flex-1 bg-transparent border-none outline-none resize-none text-base text-gray-800 placeholder-gray-500 px-2 max-h-32"
                    />
                    <button onClick={() => alert('Recurso de voz em desenvolvimento!')} className="p-2 text-gray-500 hover:text-purple-600 transition-all duration-150 rounded-full hover:bg-purple-100 active:bg-purple-200 transform active:scale-95">
                        <MicIcon />
                    </button>
                    <button onClick={() => alert('Anexar arquivos em desenvolvimento!')} className="p-2 text-gray-500 hover:text-purple-600 transition-all duration-150 rounded-full hover:bg-purple-100 active:bg-purple-200 transform active:scale-95">
                        <PaperclipIcon />
                    </button>
                    <button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()} className="w-11 h-11 bg-purple-600 text-white rounded-full flex items-center justify-center transition-all duration-300 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95">
                        <SendIcon />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatTab;
