import { IReduxState } from '../app/types';
import { IKnockingParticipant } from './types';
/**
* Selector to return lobby enable state.
*
* @param {IReduxState} state - State object.
* @returns {boolean}
*/
export declare function getLobbyEnabled(state: IReduxState): boolean;
/**
* Selector to return a list of knocking participants.
*
* @param {IReduxState} state - State object.
* @returns {Array<Object>}
*/
export declare function getKnockingParticipants(state: IReduxState): IKnockingParticipant[];
/**
 * Selector to return lobby visibility.
 *
 * @param {IReduxState} state - State object.
 * @returns {any}
 */
export declare function getIsLobbyVisible(state: IReduxState): boolean;
/**
 * Selector to return array with knocking participant ids.
 *
 * @param {IReduxState} state - State object.
 * @returns {Array}
 */
export declare function getKnockingParticipantsById(state: IReduxState): string[];
/**
 * Selector to return the lobby config.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
export declare function getLobbyConfig(state: IReduxState): {
    autoKnock?: boolean | undefined;
    enableChat?: boolean | undefined;
};
/**
 * Function that handles the visibility of the lobby chat message.
 *
 * @param {Object} participant - Lobby Participant.
 * @returns {Function}
 */
export declare function showLobbyChatButton(participant: IKnockingParticipant): (state: IReduxState) => boolean;
/**
 * Returns true if enabling lobby is allowed and false otherwise.
 *
 * @param {IReduxState} state - State object.
 * @returns {boolean}
 */
export declare function isEnablingLobbyAllowed(state: IReduxState): boolean;
