"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLobbyChatInitialized = exports.removeLobbyChatParticipant = exports.setLobbyChatActiveState = exports.onLobbyChatInitialized = exports.setIsPollsTabFocused = exports.setPrivateMessageRecipient = exports.sendMessage = exports.closeChat = exports.clearMessages = exports.editMessage = exports.addMessage = void 0;
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/participants/functions");
const constants_1 = require("../lobby/constants");
const actionTypes_1 = require("./actionTypes");
/**
 * Adds a chat message to the collection of messages.
 *
 * @param {Object} messageDetails - The chat message to save.
 * @param {string} messageDetails.displayName - The displayName of the
 * participant that authored the message.
 * @param {boolean} messageDetails.hasRead - Whether or not to immediately mark
 * the message as read.
 * @param {string} messageDetails.message - The received message to display.
 * @param {string} messageDetails.messageType - The kind of message, such as
 * "error" or "local" or "remote".
 * @param {string} messageDetails.timestamp - A timestamp to display for when
 * the message was received.
 * @param {string} messageDetails.isReaction - Whether or not the
 * message is a reaction message.
 * @returns {{
 *     type: ADD_MESSAGE,
 *     displayName: string,
 *     hasRead: boolean,
 *     message: string,
 *     messageType: string,
 *     timestamp: string,
 *     isReaction: boolean
 * }}
 */
function addMessage(messageDetails) {
    return {
        type: actionTypes_1.ADD_MESSAGE,
        ...messageDetails
    };
}
exports.addMessage = addMessage;
/**
 * Edits an existing chat message.
 *
 * @param {Object} message - The chat message to edit/override. The messages will be matched from the state
 * comparing the messageId.
 * @returns {{
 *     type: EDIT_MESSAGE,
 *     message: Object
 * }}
 */
function editMessage(message) {
    return {
        type: actionTypes_1.EDIT_MESSAGE,
        message
    };
}
exports.editMessage = editMessage;
/**
 * Clears the chat messages in Redux.
 *
 * @returns {{
 *     type: CLEAR_MESSAGES
 * }}
 */
function clearMessages() {
    return {
        type: actionTypes_1.CLEAR_MESSAGES
    };
}
exports.clearMessages = clearMessages;
/**
 * Action to signal the closing of the chat dialog.
 *
 * @returns {{
 *     type: CLOSE_CHAT
 * }}
 */
function closeChat() {
    return {
        type: actionTypes_1.CLOSE_CHAT
    };
}
exports.closeChat = closeChat;
/**
 * Sends a chat message to everyone in the conference.
 *
 * @param {string} message - The chat message to send out.
 * @param {boolean} ignorePrivacy - True if the privacy notification should be ignored.
 * @returns {{
 *     type: SEND_MESSAGE,
 *     ignorePrivacy: boolean,
 *     message: string
 * }}
 */
function sendMessage(message, ignorePrivacy = false) {
    return {
        type: actionTypes_1.SEND_MESSAGE,
        ignorePrivacy,
        message
    };
}
exports.sendMessage = sendMessage;
/**
 * Initiates the sending of a private message to the supplied participant.
 *
 * @param {IParticipant} participant - The participant to set the recipient to.
 * @returns {{
 *     participant: IParticipant,
 *     type: SET_PRIVATE_MESSAGE_RECIPIENT
 * }}
 */
function setPrivateMessageRecipient(participant) {
    return {
        participant,
        type: actionTypes_1.SET_PRIVATE_MESSAGE_RECIPIENT
    };
}
exports.setPrivateMessageRecipient = setPrivateMessageRecipient;
/**
 * Set the value of _isPollsTabFocused.
 *
 * @param {boolean} isPollsTabFocused - The new value for _isPollsTabFocused.
 * @returns {Function}
 */
function setIsPollsTabFocused(isPollsTabFocused) {
    return {
        isPollsTabFocused,
        type: actionTypes_1.SET_IS_POLL_TAB_FOCUSED
    };
}
exports.setIsPollsTabFocused = setIsPollsTabFocused;
/**
 * Initiates the sending of messages between a moderator and a lobby attendee.
 *
 * @param {Object} lobbyChatInitializedInfo - The information about the attendee and the moderator
 * that is going to chat.
 *
 * @returns {Function}
 */
function onLobbyChatInitialized(lobbyChatInitializedInfo) {
    return async (dispatch, getState) => {
        const state = getState();
        const conference = (0, functions_1.getCurrentConference)(state);
        const lobbyLocalId = conference?.myLobbyUserId();
        if (!lobbyLocalId) {
            return;
        }
        if (lobbyChatInitializedInfo.moderator.id === lobbyLocalId) {
            dispatch({
                type: actionTypes_1.SET_LOBBY_CHAT_RECIPIENT,
                participant: lobbyChatInitializedInfo.attendee,
                open: true
            });
        }
        if (lobbyChatInitializedInfo.attendee.id === lobbyLocalId) {
            return dispatch({
                type: actionTypes_1.SET_LOBBY_CHAT_RECIPIENT,
                participant: lobbyChatInitializedInfo.moderator,
                open: false
            });
        }
    };
}
exports.onLobbyChatInitialized = onLobbyChatInitialized;
/**
 * Sets the lobby room's chat active state.
 *
 * @param {boolean} value - The active state.
 *
 * @returns {Object}
 */
function setLobbyChatActiveState(value) {
    return {
        type: actionTypes_1.SET_LOBBY_CHAT_ACTIVE_STATE,
        payload: value
    };
}
exports.setLobbyChatActiveState = setLobbyChatActiveState;
/**
 * Removes lobby type messages.
 *
 *  @param {boolean} removeLobbyChatMessages - Should remove messages from chat  (works only for accepted users).
 * If not specified, it will delete all lobby messages.
 *
 * @returns {Object}
 */
function removeLobbyChatParticipant(removeLobbyChatMessages) {
    return {
        type: actionTypes_1.REMOVE_LOBBY_CHAT_PARTICIPANT,
        removeLobbyChatMessages
    };
}
exports.removeLobbyChatParticipant = removeLobbyChatParticipant;
/**
 * Handles initial setup of lobby message between
 * Moderator and participant.
 *
 * @param {string} participantId - The participant id.
 *
 * @returns {Object}
 */
function handleLobbyChatInitialized(participantId) {
    return async (dispatch, getState) => {
        if (!participantId) {
            return;
        }
        const state = getState();
        const conference = state['features/base/conference'].conference;
        const { knockingParticipants } = state['features/lobby'];
        const { lobbyMessageRecipient } = state['features/chat'];
        const me = (0, functions_2.getLocalParticipant)(state);
        const lobbyLocalId = conference?.myLobbyUserId();
        if (lobbyMessageRecipient && lobbyMessageRecipient.id === participantId) {
            return dispatch(setLobbyChatActiveState(true));
        }
        const attendee = knockingParticipants.find(p => p.id === participantId);
        if (attendee && attendee.chattingWithModerator === lobbyLocalId) {
            return dispatch({
                type: actionTypes_1.SET_LOBBY_CHAT_RECIPIENT,
                participant: attendee,
                open: true
            });
        }
        if (!attendee) {
            return;
        }
        const payload = { type: constants_1.LOBBY_CHAT_INITIALIZED,
            moderator: {
                ...me,
                name: 'Moderator',
                id: lobbyLocalId
            },
            attendee };
        // notify attendee privately.
        conference?.sendLobbyMessage(payload, attendee.id);
        // notify other moderators.
        return conference?.sendLobbyMessage(payload);
    };
}
exports.handleLobbyChatInitialized = handleLobbyChatInitialized;
