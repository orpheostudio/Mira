
import React, { useState, useEffect } from 'react';
import { TabId } from '../types';
import { ChatIcon, HelpToolIcon, LearnIcon, SettingsIcon, VoiceTabIcon } from './icons';

interface BottomNavProps {
    activeTab: TabId;
    setActiveTab: (tabId: TabId) => void;
    chatTabFlash: number;
}

const navItems = [
    { id: 'learn', label: 'Sobre', icon: <LearnIcon /> },
    { id: 'help', label: 'Ajuda', icon: <HelpToolIcon /> },
    { id: 'chat', label: 'Conversar', icon: <ChatIcon /> },
    { id: 'voice', label: 'Voz', icon: <VoiceTabIcon /> },
    { id: 'settings', label: 'Configurações', icon: <SettingsIcon /> },
];

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab, chatTabFlash }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (chatTabFlash > 0) {
            setIsAnimating(true);
            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 500); // Animation duration
            return () => clearTimeout(timer);
        }
    }, [chatTabFlash]);

    return (
        <nav className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-2 flex justify-around shadow-[0_-2px_8px_rgba(0,0,0,0.05)] sticky bottom-0 z-20">
            {navItems.map((item) => {
                const isChatAndAnimating = item.id === 'chat' && isAnimating;
                return (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as TabId)}
                        className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[65px] transition-all duration-200 transform active:scale-95 ${activeTab === item.id ? 'text-purple-600 bg-purple-100' : 'text-gray-500 hover:bg-purple-50 active:bg-purple-100'} ${isChatAndAnimating ? 'animate-tab-pop' : ''}`}
                    >
                        <div className="text-xl">{item.icon}</div>
                        <span className="text-xs font-medium">{item.label}</span>
                    </button>
                );
            })}
        </nav>
    );
};

export default BottomNav;