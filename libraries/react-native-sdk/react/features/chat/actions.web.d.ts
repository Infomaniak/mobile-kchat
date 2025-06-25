import { IStore } from '../app/types';
export * from './actions.any';
/**
 * Displays the chat panel.
 *
 * @param {Object} participant - The recipient for the private chat.
 * @param {Object} _disablePolls - Used on native.
 * @returns {{
 *     participant: Participant,
 *     type: OPEN_CHAT
 * }}
 */
export declare function openChat(participant?: Object, _disablePolls?: boolean): (dispatch: IStore['dispatch']) => void;
/**
 * Toggles display of the chat panel.
 *
 * @returns {Function}
 */
export declare function toggleChat(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
