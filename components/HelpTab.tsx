import React from 'react';

interface HelpTabProps {
    onQuickAction: (question: string) => void;
    onOpenAboutModal: () => void;
}

const QuickAction: React.FC<{ icon: string; title: string; desc: string; onClick: () => void; }> = ({ icon, title, desc, onClick }) => (
    <button onClick={onClick} className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all border border-transparent hover:border-purple-300 active:scale-95 active:bg-gray-50 transform duration-150">
        <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center text-2xl">{icon}</div>
        <div className="font-semibold text-gray-800">{title}</div>
        <p className="text-sm text-gray-500">{desc}</p>
    </button>
);

const HelpTab: React.FC<HelpTabProps> = ({ onQuickAction, onOpenAboutModal }) => {
    return (
        <div className="p-6 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Central de Ajuda</h2>
            <p className="text-gray-600 mb-6">
                Precisa de um ponto de partida? Use estas ações rápidas para iniciar uma conversa ou saber mais sobre mim.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <QuickAction icon="💡" title="Ajuda Diária" desc="Tarefas do cotidiano" onClick={() => onQuickAction('Como você pode me ajudar no dia a dia?')} />
                <QuickAction icon="📱" title="Tecnologia" desc="Explicações simples" onClick={() => onQuickAction('Explique sobre tecnologia de forma simples')} />
                <QuickAction icon="🔒" title="Privacidade" desc="Dicas de segurança" onClick={() => onQuickAction('Como manter minha privacidade online?')} />
                <QuickAction icon="ℹ️" title="Sobre a Sena" desc="Conheça mais" onClick={onOpenAboutModal} />
            </div>
        </div>
    );
};

export default HelpTab;
