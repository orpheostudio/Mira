import React, { useState } from 'react';

interface WelcomeScreenProps {
    onAccept: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onAccept }) => {
    const [termsChecked, setTermsChecked] = useState(false);

    return (
        <div className="fixed inset-0 bg-gray-100 flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-lg flex flex-col items-center p-8 text-center animate-slide-up">
                <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center shadow-lg border-4 border-purple-200 overflow-hidden mb-4">
                    <img src="https://i.imgur.com/lbi4vra.png" alt="Sena" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Bem-vindo(a) à SENA</h1>
                <p className="text-gray-600 mt-2 mb-6">Sua amiga virtual, pronta para ajudar com um toque de carinho.</p>

                <div className="bg-gray-50 p-4 rounded-lg w-full mb-6 space-y-4">
                    <label htmlFor="terms" className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={termsChecked}
                            onChange={() => setTermsChecked(!termsChecked)}
                            className="mt-1 h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 shrink-0"
                        />
                        <span className="text-sm text-gray-700 text-left">
                            Eu li e concordo com os{' '}
                            <a href="https://termos.orpheostudio.com.br" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-semibold hover:underline">
                                Termos de Uso
                            </a>{' '}
                            e a{' '}
                            <a href="https://termos.orpheostudio.com.br" target="_blank" rel="noopener noreferrer" className="text-purple-600 font-semibold hover:underline">
                                Política de Privacidade
                            </a>.
                        </span>
                    </label>
                </div>

                <button
                    onClick={onAccept}
                    disabled={!termsChecked}
                    className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 disabled:scale-100"
                >
                    Começar a conversar
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;