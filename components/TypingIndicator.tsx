
import React from 'react';

const TypingIndicator: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 self-start">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow border-2 border-white/30 overflow-hidden flex-shrink-0">
                <img src="https://i.imgur.com/lbi4vra.png" alt="Sena Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-200 text-gray-700 px-4 py-3 rounded-2xl rounded-bl-lg">
                <div className="flex items-center justify-center space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
            </div>
        </div>
    );
};

export default TypingIndicator;
