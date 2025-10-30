
export interface Message {
  role: 'user' | 'model';
  text: string;
}

export type TabId = 'chat' | 'help' | 'learn' | 'settings';

export interface ModalState {
  help: boolean;
  menu: boolean;
  about: boolean;
  privacy: boolean;
}
