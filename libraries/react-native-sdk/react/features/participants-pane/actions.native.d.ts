/// <reference types="react" />
import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Displays the connection status for the local meeting participant.
 *
 * @param {string} participantID - The selected meeting participant id.
 * @returns {Function}
 */
export declare function showConnectionStatus(participantID: string): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Displays the context menu for the selected meeting participant.
 *
 * @param {string} participantId - The ID of the selected meeting participant.
 * @param {boolean} local - Whether the participant is local or not.
 * @returns {Function}
 */
export declare function showContextMenuDetails(participantId: string, local?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Displays the shared video menu.
 *
 * @param {string} participantId - The ID of the selected meeting participant.
 * @returns {Function}
 */
export declare function showSharedVideoMenu(participantId: string): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Sets the volume.
 *
 * @param {string} participantId - The participant ID associated with the audio.
 * @param {string} volume - The volume level.
 * @returns {{
 *     type: SET_VOLUME,
 *     participantId: string,
 *     volume: number
 * }}
 */
export declare function setVolume(participantId: string, volume: number): {
    type: string;
    participantId: string;
    volume: number;
};
/**
 * Displays the breakout room participant menu.
 *
 * @param {Object} room - The room the participant is in.
 * @param {string} participantJid - The jid of the participant.
 * @param {string} participantName - The display name of the participant.
 * @returns {Function}
 */
export declare function showRoomParticipantMenu(room: Object, participantJid: string, participantName: string): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Action to open the participants pane.
 *
 * @returns {Object}
 */
export declare const open: () => {
    type: string;
};
