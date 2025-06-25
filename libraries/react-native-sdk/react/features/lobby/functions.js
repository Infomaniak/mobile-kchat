"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEnablingLobbyAllowed = exports.showLobbyChatButton = exports.getLobbyConfig = exports.getKnockingParticipantsById = exports.getIsLobbyVisible = exports.getKnockingParticipants = exports.getLobbyEnabled = void 0;
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../visitors/functions");
/**
* Selector to return lobby enable state.
*
* @param {IReduxState} state - State object.
* @returns {boolean}
*/
function getLobbyEnabled(state) {
    return state['features/lobby'].lobbyEnabled;
}
exports.getLobbyEnabled = getLobbyEnabled;
/**
* Selector to return a list of knocking participants.
*
* @param {IReduxState} state - State object.
* @returns {Array<Object>}
*/
function getKnockingParticipants(state) {
    return state['features/lobby'].knockingParticipants;
}
exports.getKnockingParticipants = getKnockingParticipants;
/**
 * Selector to return lobby visibility.
 *
 * @param {IReduxState} state - State object.
 * @returns {any}
 */
function getIsLobbyVisible(state) {
    return state['features/lobby'].lobbyVisible;
}
exports.getIsLobbyVisible = getIsLobbyVisible;
/**
 * Selector to return array with knocking participant ids.
 *
 * @param {IReduxState} state - State object.
 * @returns {Array}
 */
function getKnockingParticipantsById(state) {
    return getKnockingParticipants(state).map(participant => participant.id);
}
exports.getKnockingParticipantsById = getKnockingParticipantsById;
/**
 * Selector to return the lobby config.
 *
 * @param {IReduxState} state - State object.
 * @returns {Object}
 */
function getLobbyConfig(state) {
    return state['features/base/config']?.lobby || {};
}
exports.getLobbyConfig = getLobbyConfig;
/**
 * Function that handles the visibility of the lobby chat message.
 *
 * @param {Object} participant - Lobby Participant.
 * @returns {Function}
 */
function showLobbyChatButton(participant) {
    return function (state) {
        const { enableChat = true } = getLobbyConfig(state);
        const { lobbyMessageRecipient, isLobbyChatActive } = state['features/chat'];
        const conference = (0, functions_1.getCurrentConference)(state);
        const lobbyLocalId = conference?.myLobbyUserId();
        if (!enableChat) {
            return false;
        }
        if (!isLobbyChatActive
            && (!participant.chattingWithModerator
                || participant.chattingWithModerator === lobbyLocalId)) {
            return true;
        }
        if (isLobbyChatActive && lobbyMessageRecipient
            && participant.id !== lobbyMessageRecipient.id
            && (!participant.chattingWithModerator
                || participant.chattingWithModerator === lobbyLocalId)) {
            return true;
        }
        return false;
    };
}
exports.showLobbyChatButton = showLobbyChatButton;
/**
 * Returns true if enabling lobby is allowed and false otherwise.
 *
 * @param {IReduxState} state - State object.
 * @returns {boolean}
 */
function isEnablingLobbyAllowed(state) {
    return (0, functions_2.getVisitorsCount)(state) <= 0;
}
exports.isEnablingLobbyAllowed = isEnablingLobbyAllowed;
