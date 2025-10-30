
import React, { ReactNode } from 'react';

const InfoIcon = () => <span>ℹ️</span>;
const PrivacyIcon = () => <span>🔒</span>;
const BugIcon = () => <span>🐞</span>;
const FeedbackIcon = () => <span>💬</span>;
const TermsIcon = () => <span>📄</span>;

interface SettingsTabProps {
    onOpenAbout: () => void;
    onOpenPrivacy: () => void;
    onReportBug: () => void;
    onSendFeedback: () => void;
}

interface SettingsItemProps {
    icon: ReactNode;
    title: string;
    description: string;
    onClick?: () => void;
    href?: string;
}

const SettingsItem: React.FC<SettingsItemProps> = ({ icon, title, description, onClick, href }) => {
    const commonClasses = "w-full text-left p-4 rounded-lg flex items-center gap-4 transition-all duration-150 transform active:scale-[0.98] hover:bg-gray-100 active:bg-gray-200";

    const content = (
        <>
            <div className="text-2xl w-8 text-center">{icon}</div>
            <div>
                <h3 className="font-semibold text-gray-800">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </>
    );

    if (href) {
        return (
            <a href={href} target="_blank" rel="noopener noreferrer" className={commonClasses}>
                {content}
            </a>
        );
    }

    return (
        <button onClick={onClick} className={commonClasses}>
            {content}
        </button>
    );
};


const SettingsTab: React.FC<SettingsTabProps> = ({ onOpenAbout, onOpenPrivacy, onReportBug, onSendFeedback }) => {
    return (
        <div className="p-4 flex-1 overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 px-2">Configurações</h2>
            <div className="space-y-2">
                <SettingsItem
                    icon={<InfoIcon />}
                    title="Sobre a Sena"
                    description="Conheça minha missão e valores"
                    onClick={onOpenAbout}
                />
                <SettingsItem
                    icon={<PrivacyIcon />}
                    title="Privacidade"
                    description="Veja como seus dados são tratados"
                    onClick={onOpenPrivacy}
                />
                 <SettingsItem
                    icon={<BugIcon />}
                    title="Reportar Problema"
                    description="Ajude a me tornar melhor"
                    onClick={onReportBug}
                />
                 <SettingsItem
                    icon={<FeedbackIcon />}
                    title="Enviar Feedback"
                    description="Sua opinião é muito importante"
                    onClick={onSendFeedback}
                />
                <SettingsItem
                    icon={<TermsIcon />}
                    title="Termos de Uso"
                    description="Leia os termos do serviço"
                    href="https://termos.orpheostudio.com.br"
                />
            </div>
        </div>
    );
};

export default SettingsTab;
