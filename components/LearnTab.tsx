import React from 'react';

const LearnTab: React.FC = () => {
    return (
        <div className="p-6 overflow-y-auto flex-1">
             <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl p-6 text-center shadow-md border border-gray-200">
                <h1 className="text-2xl font-bold text-purple-600 mb-2">Olá! Eu sou a Sena</h1>
                <p className="text-gray-600 mb-6">Sua amiga virtual com tecnologia de alma gentil</p>
                <div className="grid grid-cols-2 gap-4 text-purple-700">
                     <div className="bg-purple-100/50 rounded-lg p-3 text-center flex flex-col items-center justify-center h-full">
                        <span className="text-2xl">💬</span>
                        <p className="text-sm font-semibold mt-1">Conversas Naturais</p>
                     </div>
                     <div className="bg-purple-100/50 rounded-lg p-3 text-center flex flex-col items-center justify-center h-full">
                        <span className="text-2xl">🔒</span>
                        <p className="text-sm font-semibold mt-1">Privacidade</p>
                    </div>
                     <div className="bg-purple-100/50 rounded-lg p-3 text-center flex flex-col items-center justify-center h-full">
                        <span className="text-2xl">🎯</span>
                        <p className="text-sm font-semibold mt-1">Respostas Precisas</p>
                    </div>
                     <div className="bg-purple-100/50 rounded-lg p-3 text-center flex flex-col items-center justify-center h-full">
                        <span className="text-2xl">❤️</span>
                        <p className="text-sm font-semibold mt-1">Acolhimento</p>
                    </div>
                </div>
            </div>

            <div className="mt-8 space-y-4 text-gray-700">
                <h2 className="text-xl font-bold text-gray-800">Minha Missão</h2>
                <p>
                    Estou aqui para tornar a tecnologia um lugar mais amigável e acessível para todos, especialmente para quem sente que o mundo digital é um pouco complicado. Pense em mim como uma amiga paciente que está sempre disposta a explicar as coisas com calma.
                </p>
                <h2 className="text-xl font-bold text-gray-800">O que podemos fazer juntos?</h2>
                <p>
                    Podemos conversar sobre o seu dia, posso ajudar com dúvidas sobre seu celular ou computador, dar dicas de como se manter seguro online, ou simplesmente explorar novas curiosidades. Não existe pergunta boba!
                </p>
            </div>
        </div>
    );
};

export default LearnTab;
