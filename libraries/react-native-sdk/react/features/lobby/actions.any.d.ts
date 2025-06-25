import { IStore } from '../app/types';
import { IParticipant } from '../base/participants/types';
import { IKnockingParticipant } from './types';
/**
 * Tries to join with a preset password.
 *
 * @param {string} password - The password to join with.
 * @returns {Function}
 */
export declare function joinWithPassword(password: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action to be dispatched when a knocking poarticipant leaves before any response.
 *
 * @param {string} id - The ID of the participant.
 * @returns {{
 *     id: string,
 *     type: KNOCKING_PARTICIPANT_LEFT
 * }}
 */
export declare function knockingParticipantLeft(id: string): {
    id: string;
    type: string;
};
/**
 * Action to be executed when a participant starts knocking or an already knocking participant gets updated.
 *
 * @param {Object} participant - The knocking participant.
 * @returns {{
 *     participant: Object,
 *     type: KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED
 * }}
 */
export declare function participantIsKnockingOrUpdated(participant: IKnockingParticipant | Object): {
    participant: Object | IKnockingParticipant;
    type: string;
};
/**
 * Handles a knocking participant and dismisses the notification.
 *
 * @param {string} id - The id of the knocking participant.
 * @param {boolean} approved - True if the participant is approved, false otherwise.
 * @returns {Function}
 */
export declare function answerKnockingParticipant(id: string, approved: boolean): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Approves (lets in) or rejects a knocking participant.
 *
 * @param {string} id - The id of the knocking participant.
 * @param {boolean} approved - True if the participant is approved, false otherwise.
 * @returns {Function}
 */
export declare function setKnockingParticipantApproval(id: string, approved: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action used to admit multiple participants in the conference.
 *
 * @param {Array<Object>} participants - A list of knocking participants.
 * @returns {void}
 */
export declare function admitMultiple(participants: Array<IKnockingParticipant>): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Approves the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
export declare function approveKnockingParticipant(id: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Denies the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
export declare function rejectKnockingParticipant(id: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to set the knocking state of the participant.
 *
 * @param {boolean} knocking - The new state.
 * @returns {{
 *     state: boolean,
 *     type: SET_KNOCKING_STATE
 * }}
 */
export declare function setKnockingState(knocking: boolean): {
    knocking: boolean;
    type: string;
};
/**
 * Action to set the new state of the lobby mode.
 *
 * @param {boolean} enabled - The new state to set.
 * @returns {{
 *     enabled: boolean,
 *     type: SET_LOBBY_MODE_ENABLED
 * }}
 */
export declare function setLobbyModeEnabled(enabled: boolean): {
    enabled: boolean;
    type: string;
};
/**
 * Action to be dispatched when we failed to join with a password.
 *
 * @param {boolean} failed - True of recent password join failed.
 * @returns {{
 *     failed: boolean,
 *     type: SET_PASSWORD_JOIN_FAILED
 * }}
 */
export declare function setPasswordJoinFailed(failed: boolean): {
    failed: boolean;
    type: string;
};
/**
 * Starts knocking and waiting for approval.
 *
 * @returns {Function}
 */
export declare function startKnocking(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action to toggle lobby mode on or off.
 *
 * @param {boolean} enabled - The desired (new) state of the lobby mode.
 * @returns {Function}
 */
export declare function toggleLobbyMode(enabled: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action to open the lobby screen.
 *
 * @returns {openDialog}
 */
export declare function openLobbyScreen(): {
    type: string;
    visible: boolean;
};
/**
 * Action to hide the lobby screen.
 *
 * @returns {hideDialog}
 */
export declare function hideLobbyScreen(): {
    type: string;
    visible: boolean;
};
/**
 * Action to handle chat initialized in the lobby room.
 *
 * @param {Object} payload - The payload received,
 * contains the information about the two participants
 * that will chat with each other in the lobby room.
 *
 * @returns {Promise<void>}
 */
export declare function handleLobbyChatInitialized(payload: {
    attendee: IParticipant;
    moderator: IParticipant;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action to send message to the moderator.
 *
 * @param {string} message - The message to be sent.
 *
 * @returns {Promise<void>}
 */
export declare function onSendMessage(message: string): (dispatch: IStore['dispatch']) => Promise<void>;
/**
 * Action to send lobby message to every participant. Only allowed for moderators.
 *
 * @param {Object} message - The message to be sent.
 *
 * @returns {Promise<void>}
 */
export declare function sendLobbyChatMessage(message: Object): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Sets lobby listeners if lobby has been enabled.
 *
 * @returns {Function}
 */
export declare function maybeSetLobbyChatMessageListener(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Action to handle the event when a moderator leaves during lobby chat.
 *
 * @param {string} participantId - The participant id of the moderator who left.
 * @returns {Function}
 */
export declare function updateLobbyParticipantOnLeave(participantId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
    removeLobbyChatMessages: boolean | undefined;
} | undefined>;
/**
 * Handles all messages received in the lobby room.
 *
 * @returns {Function}
 */
export declare function setLobbyMessageListener(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
