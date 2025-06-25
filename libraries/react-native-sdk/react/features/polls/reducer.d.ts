import { IPoll } from './types';
export interface IPollsState {
    nbUnreadPolls: number;
    polls: {
        [pollId: string]: IPoll;
    };
}
