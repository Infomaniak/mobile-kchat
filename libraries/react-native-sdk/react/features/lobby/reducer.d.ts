import { IKnockingParticipant } from './types';
export interface ILobbyState {
    /**
     * A conference error when we tried to join into a room with no display name
     * when lobby is enabled in the room.
     */
    isDisplayNameRequiredError: boolean;
    knocking: boolean;
    knockingParticipants: IKnockingParticipant[];
    lobbyEnabled: boolean;
    lobbyVisible: boolean;
    passwordJoinFailed: boolean;
}
