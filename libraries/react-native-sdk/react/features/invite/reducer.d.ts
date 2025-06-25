import { IInvitee } from './types';
export interface IInviteState {
    calleeInfoVisible?: boolean;
    conferenceID?: string | number;
    error?: {
        status: number;
    };
    initialCalleeInfo?: {
        id: string;
        name: string;
        status: string;
    };
    numbers?: string[];
    numbersEnabled: boolean;
    numbersFetched: boolean;
    pendingInviteRequests: Array<{
        callback: Function;
        invitees: IInvitee[];
    }>;
    sipUri?: string;
}
