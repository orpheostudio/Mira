
import React, { useState } from 'react';
import { Message, TabId, ModalState } from './types';
import { getSenaResponse } from './services/geminiService';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ChatTab from './components/ChatTab';
import HelpTab from './components/HelpTab';
import LearnTab from './components/LearnTab';
import SettingsTab from './components/SettingsTab';
import VoiceTab from './components/VoiceTab';
import Modal from './components/Modal';
import WelcomeScreen from './components/WelcomeScreen';

const App: React.FC = () => {
    const [showWelcome, setShowWelcome] = useState(() => {
        // Mostra a tela de boas-vindas se os termos não foram aceitos
        return localStorage.getItem('sena_terms_accepted') !== 'true';
    });

    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Olá! Eu sou a Sena, sua amiga virtual. 😊 Estou aqui para ajudar você com o que precisar. Pode me perguntar qualquer coisa!' },
        { role: 'model', text: 'Sou especialmente criada para ser paciente e acolhedora. Se tiver dificuldade com tecnologia, fique à vontade que eu explico com calma.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('chat');
    const [modals, setModals] = useState<Omit<ModalState, 'help' | 'menu'>>({ about: false, privacy: false });
    const [chatTabFlash, setChatTabFlash] = useState(0);

    const handleAcceptTerms = () => {
        localStorage.setItem('sena_terms_accepted', 'true');
        setShowWelcome(false);
    };

    const handleSendMessage = async (userMessage: string) => {
        const newUserMessage: Message = { role: 'user', text: userMessage };
        
        // Don't switch tabs if the message comes from the voice tab
        if (activeTab !== 'chat' && activeTab !== 'voice') {
            setActiveTab('chat');
        }
        
        setMessages(prev => [...prev, newUserMessage]);
        setIsLoading(true);
        
        const senaResponse = await getSenaResponse(userMessage);
        
        setMessages(prev => [...prev, { role: 'model', text: senaResponse }]);
        setIsLoading(false);
    };
    
    const handleQuickAction = (userMessage: string) => {
        setActiveTab('chat');
        setChatTabFlash(prev => prev + 1);
        // Use a short timeout to let the UI update to the chat tab before sending the message
        setTimeout(() => {
            handleSendMessage(userMessage);
        }, 100);
    };

    const openModal = (modalId: keyof typeof modals) => setModals(prev => ({ ...prev, [modalId]: true }));
    const closeModal = (modalId: keyof typeof modals) => setModals(prev => ({ ...prev, [modalId]: false }));

    const renderTabContent = () => {
        const latestModelMessage = messages.length > 0 && messages[messages.length - 1].role === 'model' 
            ? messages[messages.length - 1] 
            : null;

        switch (activeTab) {
            case 'chat':
                return <ChatTab messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />;
            case 'voice':
                return <VoiceTab onSendMessage={handleSendMessage} latestModelMessage={latestModelMessage} isLoading={isLoading} />;
            case 'help':
                return <HelpTab onQuickAction={handleQuickAction} onOpenAboutModal={() => openModal('about')} />;
            case 'learn':
                return <LearnTab />;
            case 'settings':
                return <SettingsTab 
                    onOpenAbout={() => openModal('about')}
                    onOpenPrivacy={() => openModal('privacy')}
                    onReportBug={reportBug}
                    onSendFeedback={sendFeedback}
                />;
            default:
                return null;
        }
    };
    
    const reportBug = () => window.open('mailto:sac.studiotsukiyo@outlook.com?subject=Reportar Bug - SENA', '_blank');
    const sendFeedback = () => window.open('mailto:sac.studiotsukiyo@outlook.com?subject=Feedback - SENA', '_blank');

    if (showWelcome) {
        return <WelcomeScreen onAccept={handleAcceptTerms} />;
    }

    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col max-w-2xl mx-auto shadow-2xl animate-fade-in">
            <Header />
            <div key={activeTab} className="flex-1 flex flex-col overflow-hidden bg-white animate-fade-in">
                {renderTabContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} chatTabFlash={chatTabFlash} />
            
             <Modal isOpen={modals.about} onClose={() => closeModal('about')} title="Sobre a Sena">
                <div className="space-y-4 text-gray-600">
                    <p>Olá! Sou a Sena, uma assistente virtual criada com muito carinho pela AmplaAI.</p>
                    <p><strong>Minha missão:</strong> Tornar a tecnologia acessível e amigável para todos, especialmente para quem está começando agora.</p>
                    <p><strong>Como trabalho:</strong> Uso inteligência artificial para conversar naturalmente, sempre com paciência e compreensão.</p>
                    <p><strong>Valores:</strong> Respeito, privacidade, acessibilidade e, acima de tudo, alma gentil.</p>
                    <p>Estou em constante aprendizado para melhor atendê-lo. Se cometer algum erro, por favor, me avise!</p>
                </div>
            </Modal>
            
            <Modal isOpen={modals.privacy} onClose={() => closeModal('privacy')} title="Privacidade">
                 <div className="space-y-4 text-gray-600">
                    <p>Sua privacidade é muito importante para mim.</p>
                    <p><strong>Coleta de Dados:</strong> Suas conversas são processadas para que eu possa responder, mas não são usadas para identificá-lo pessoalmente.</p>
                    <p><strong>Armazenamento:</strong> O histórico da nossa conversa atual é mantido apenas para que eu possa entender o contexto. Ao fechar a página, o histórico é reiniciado.</p>
                    <p><strong>Compromisso:</strong> Não compartilho suas conversas com terceiros. Meu objetivo é apenas ajudar e aprender com nossas interações de forma anônima.</p>
                </div>
            </Modal>
        </div>
    );
};

export default App;