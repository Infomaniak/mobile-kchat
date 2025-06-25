import { ILocalParticipant, IParticipant } from '../base/participants/types';
import { IMessage } from './types';
export interface IChatState {
    isLobbyChatActive: boolean;
    isOpen: boolean;
    isPollsTabFocused: boolean;
    lastReadMessage?: IMessage;
    lobbyMessageRecipient?: {
        id: string;
        name: string;
    } | ILocalParticipant;
    messages: IMessage[];
    nbUnreadMessages: number;
    privateMessageRecipient?: IParticipant;
}
