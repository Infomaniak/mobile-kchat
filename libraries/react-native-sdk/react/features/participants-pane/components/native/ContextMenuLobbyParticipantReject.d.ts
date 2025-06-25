/// <reference types="react" />
import { IParticipant } from '../../../base/participants/types';
export interface IProps {
    /**
     * Participant reference.
     */
    participant: IParticipant;
}
declare const ContextMenuLobbyParticipantReject: ({ participant: p }: IProps) => JSX.Element;
export default ContextMenuLobbyParticipantReject;
