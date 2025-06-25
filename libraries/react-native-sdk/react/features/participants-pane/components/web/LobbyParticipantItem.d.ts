/// <reference types="react" />
import { IParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * Callback used to open a drawer with admit/reject actions.
     */
    openDrawerForParticipant: Function;
    /**
     * If an overflow drawer should be displayed.
     */
    overflowDrawer: boolean;
    /**
     * Participant reference.
     */
    participant: IParticipant;
}
export declare const LobbyParticipantItem: ({ overflowDrawer, participant: p, openDrawerForParticipant }: IProps) => JSX.Element;
