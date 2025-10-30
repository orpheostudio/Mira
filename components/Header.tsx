
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-br from-purple-500 to-purple-800 text-white p-4 sm:p-5 flex items-center justify-between shadow-md sticky top-0 z-20">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-lg border-2 border-white/30 overflow-hidden">
                    <img src="https://i.imgur.com/lbi4vra.png" alt="Sena" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold">SENA</h1>
                    <div className="flex items-center gap-2 text-xs sm:text-sm opacity-90">
                        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                        <span>Sua amiga virtual</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
