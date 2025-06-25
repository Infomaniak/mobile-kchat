/// <reference types="react" />
import { IParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * Participant reference.
     */
    participant: IParticipant;
}
export declare const LobbyParticipantItem: ({ participant: p }: IProps) => JSX.Element;
