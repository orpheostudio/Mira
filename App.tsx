import React, { useState } from 'react';
import { Message, TabId, ModalState } from './types';
import { getSenaResponse } from './services/geminiService';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import ChatTab from './components/ChatTab';
import HelpTab from './components/HelpTab';
import LearnTab from './components/LearnTab';
import SettingsTab from './components/SettingsTab';
import Modal from './components/Modal';

const App: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: 'Olá! Eu sou a Sena, sua amiga virtual. 😊 Estou aqui para ajudar você com o que precisar. Pode me perguntar qualquer coisa!' },
        { role: 'model', text: 'Sou especialmente criada para ser paciente e acolhedora. Se tiver dificuldade com tecnologia, fique à vontade que eu explico com calma.' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<TabId>('chat');
    const [modals, setModals] = useState<ModalState>({ help: false, menu: false, about: false, privacy: false });

    const handleSendMessage = async (userMessage: string) => {
        if (activeTab !== 'chat') {
            setActiveTab('chat');
        }
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);
        const senaResponse = await getSenaResponse(userMessage);
        setMessages(prev => [...prev, { role: 'model', text: senaResponse }]);
        setIsLoading(false);
    };
    
    const handleQuickAction = (userMessage: string) => {
        setActiveTab('chat');
        // Use a short timeout to let the UI update to the chat tab before sending the message
        setTimeout(() => {
            handleSendMessage(userMessage);
        }, 100);
    };

    const openModal = (modalId: keyof ModalState) => setModals(prev => ({ ...prev, [modalId]: true }));
    const closeModal = (modalId: keyof ModalState) => setModals(prev => ({ ...prev, [modalId]: false }));

    const renderTabContent = () => {
        switch (activeTab) {
            case 'chat':
                return <ChatTab messages={messages} isLoading={isLoading} onSendMessage={handleSendMessage} />;
            case 'help':
                return <HelpTab onQuickAction={handleQuickAction} onOpenAboutModal={() => openModal('about')} />;
            case 'learn':
                return <LearnTab />;
            case 'settings':
                return <SettingsTab />;
            default:
                return null;
        }
    };
    
    const reportBug = () => window.open('mailto:sac.studiotsukiyo@outlook.com?subject=Reportar Bug - SENA', '_blank');
    const sendFeedback = () => window.open('mailto:sac.studiotsukiyo@outlook.com?subject=Feedback - SENA', '_blank');


    return (
        <div className="h-screen w-screen bg-gray-100 flex flex-col max-w-2xl mx-auto shadow-2xl">
            <Header onHelpClick={() => openModal('help')} onMenuClick={() => openModal('menu')} />
            <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {renderTabContent()}
            </div>
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <Modal isOpen={modals.help} onClose={() => closeModal('help')} title="Como posso ajudar?">
                 <p className="text-gray-600">Estou aqui para tornar a tecnologia mais acessível para você! Posso ajudar com:</p>
                <ul className="list-disc list-inside my-4 space-y-2 text-gray-600">
                    <li>Explicações sobre aplicativos e sites</li>
                    <li>Ajuda com configurações do celular</li>
                    <li>Dicas de segurança online</li>
                    <li>Respostas para curiosidades</li>
                    <li>Acompanhamento em tarefas diárias</li>
                </ul>
                <p className="text-gray-600">Não se preocupe se não entender algo - eu repito quantas vezes for necessário! 😊</p>
            </Modal>
            
            <Modal isOpen={modals.menu} onClose={() => closeModal('menu')} title="Menu">
                <div className="flex flex-col gap-2">
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { openModal('about'); closeModal('menu'); }}><span>ℹ️</span> Sobre a Sena</button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { openModal('privacy'); closeModal('menu'); }}><span>🔒</span> Privacidade</button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { reportBug(); closeModal('menu'); }}><span>🐞</span> Reportar Problema</button>
                    <button className="w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => { sendFeedback(); closeModal('menu'); }}><span>💬</span> Enviar Feedback</button>
                    <a href="https://termos.orpheostudio.com.br" target="_blank" rel="noopener noreferrer" className="block w-full text-left p-3 rounded-lg hover:bg-gray-100 transition-colors"><span>📄</span> Termos de Uso</a>
                </div>
            </Modal>

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
