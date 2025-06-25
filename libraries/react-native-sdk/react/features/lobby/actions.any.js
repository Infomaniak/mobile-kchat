"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLobbyMessageListener = exports.updateLobbyParticipantOnLeave = exports.maybeSetLobbyChatMessageListener = exports.sendLobbyChatMessage = exports.onSendMessage = exports.handleLobbyChatInitialized = exports.hideLobbyScreen = exports.openLobbyScreen = exports.toggleLobbyMode = exports.startKnocking = exports.setPasswordJoinFailed = exports.setLobbyModeEnabled = exports.setKnockingState = exports.rejectKnockingParticipant = exports.approveKnockingParticipant = exports.admitMultiple = exports.setKnockingParticipantApproval = exports.answerKnockingParticipant = exports.participantIsKnockingOrUpdated = exports.knockingParticipantLeft = exports.joinWithPassword = void 0;
const actions_1 = require("../base/conference/actions");
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/participants/functions");
const actions_any_1 = require("../chat/actions.any");
const constants_1 = require("../chat/constants");
const middleware_1 = require("../chat/middleware");
const actions_2 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actions_3 = require("../prejoin/actions");
const actionTypes_1 = require("./actionTypes");
const constants_3 = require("./constants");
const functions_3 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Tries to join with a preset password.
 *
 * @param {string} password - The password to join with.
 * @returns {Function}
 */
function joinWithPassword(password) {
    return async (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        dispatch((0, actions_1.setPassword)(conference, conference?.join, password));
    };
}
exports.joinWithPassword = joinWithPassword;
/**
 * Action to be dispatched when a knocking poarticipant leaves before any response.
 *
 * @param {string} id - The ID of the participant.
 * @returns {{
 *     id: string,
 *     type: KNOCKING_PARTICIPANT_LEFT
 * }}
 */
function knockingParticipantLeft(id) {
    return {
        id,
        type: actionTypes_1.KNOCKING_PARTICIPANT_LEFT
    };
}
exports.knockingParticipantLeft = knockingParticipantLeft;
/**
 * Action to be executed when a participant starts knocking or an already knocking participant gets updated.
 *
 * @param {Object} participant - The knocking participant.
 * @returns {{
 *     participant: Object,
 *     type: KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED
 * }}
 */
function participantIsKnockingOrUpdated(participant) {
    return {
        participant,
        type: actionTypes_1.KNOCKING_PARTICIPANT_ARRIVED_OR_UPDATED
    };
}
exports.participantIsKnockingOrUpdated = participantIsKnockingOrUpdated;
/**
 * Handles a knocking participant and dismisses the notification.
 *
 * @param {string} id - The id of the knocking participant.
 * @param {boolean} approved - True if the participant is approved, false otherwise.
 * @returns {Function}
 */
function answerKnockingParticipant(id, approved) {
    return async (dispatch) => {
        dispatch(setKnockingParticipantApproval(id, approved));
        dispatch((0, actions_2.hideNotification)(constants_2.LOBBY_NOTIFICATION_ID));
    };
}
exports.answerKnockingParticipant = answerKnockingParticipant;
/**
 * Approves (lets in) or rejects a knocking participant.
 *
 * @param {string} id - The id of the knocking participant.
 * @param {boolean} approved - True if the participant is approved, false otherwise.
 * @returns {Function}
 */
function setKnockingParticipantApproval(id, approved) {
    return async (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        if (conference) {
            if (approved) {
                conference.lobbyApproveAccess(id);
            }
            else {
                conference.lobbyDenyAccess(id);
            }
        }
    };
}
exports.setKnockingParticipantApproval = setKnockingParticipantApproval;
/**
 * Action used to admit multiple participants in the conference.
 *
 * @param {Array<Object>} participants - A list of knocking participants.
 * @returns {void}
 */
function admitMultiple(participants) {
    return (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        conference?.lobbyApproveAccess(participants.map(p => p.id));
    };
}
exports.admitMultiple = admitMultiple;
/**
 * Approves the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
function approveKnockingParticipant(id) {
    return (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        conference?.lobbyApproveAccess(id);
    };
}
exports.approveKnockingParticipant = approveKnockingParticipant;
/**
 * Denies the request of a knocking participant to join the meeting.
 *
 * @param {string} id - The id of the knocking participant.
 * @returns {Function}
 */
function rejectKnockingParticipant(id) {
    return (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        conference?.lobbyDenyAccess(id);
    };
}
exports.rejectKnockingParticipant = rejectKnockingParticipant;
/**
 * Action to set the knocking state of the participant.
 *
 * @param {boolean} knocking - The new state.
 * @returns {{
 *     state: boolean,
 *     type: SET_KNOCKING_STATE
 * }}
 */
function setKnockingState(knocking) {
    return {
        knocking,
        type: actionTypes_1.SET_KNOCKING_STATE
    };
}
exports.setKnockingState = setKnockingState;
/**
 * Action to set the new state of the lobby mode.
 *
 * @param {boolean} enabled - The new state to set.
 * @returns {{
 *     enabled: boolean,
 *     type: SET_LOBBY_MODE_ENABLED
 * }}
 */
function setLobbyModeEnabled(enabled) {
    return {
        enabled,
        type: actionTypes_1.SET_LOBBY_MODE_ENABLED
    };
}
exports.setLobbyModeEnabled = setLobbyModeEnabled;
/**
 * Action to be dispatched when we failed to join with a password.
 *
 * @param {boolean} failed - True of recent password join failed.
 * @returns {{
 *     failed: boolean,
 *     type: SET_PASSWORD_JOIN_FAILED
 * }}
 */
function setPasswordJoinFailed(failed) {
    return {
        failed,
        type: actionTypes_1.SET_PASSWORD_JOIN_FAILED
    };
}
exports.setPasswordJoinFailed = setPasswordJoinFailed;
/**
 * Starts knocking and waiting for approval.
 *
 * @returns {Function}
 */
function startKnocking() {
    return async (dispatch, getState) => {
        const state = getState();
        const { membersOnly } = state['features/base/conference'];
        if (!membersOnly) {
            // no membersOnly, this means we got lobby screen shown as someone
            // tried to join a conference that has lobby enabled without setting display name
            // join conference should trigger the lobby/member_only path after setting the display name
            // this is possible only for web, where we can join without a prejoin screen
            dispatch((0, actions_3.joinConference)());
            return;
        }
        const localParticipant = (0, functions_2.getLocalParticipant)(state);
        dispatch((0, actions_1.conferenceWillJoin)(membersOnly));
        // We need to update the conference object with the current display name, if approved
        // we want to send that display name, it was not updated in case when pre-join is disabled
        (0, functions_1.sendLocalParticipant)(state, membersOnly);
        membersOnly?.joinLobby(localParticipant?.name, localParticipant?.email);
        dispatch(setLobbyMessageListener());
        dispatch(setKnockingState(true));
    };
}
exports.startKnocking = startKnocking;
/**
 * Action to toggle lobby mode on or off.
 *
 * @param {boolean} enabled - The desired (new) state of the lobby mode.
 * @returns {Function}
 */
function toggleLobbyMode(enabled) {
    return async (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        if (enabled) {
            if ((0, functions_3.isEnablingLobbyAllowed)(getState())) {
                conference?.enableLobby();
            }
            else {
                logger_1.default.info('Ignoring enable lobby request because there are visitors in the call already.');
            }
        }
        else {
            conference?.disableLobby();
        }
    };
}
exports.toggleLobbyMode = toggleLobbyMode;
/**
 * Action to open the lobby screen.
 *
 * @returns {openDialog}
 */
function openLobbyScreen() {
    return {
        type: actionTypes_1.SET_LOBBY_VISIBILITY,
        visible: true
    };
}
exports.openLobbyScreen = openLobbyScreen;
/**
 * Action to hide the lobby screen.
 *
 * @returns {hideDialog}
 */
function hideLobbyScreen() {
    return {
        type: actionTypes_1.SET_LOBBY_VISIBILITY,
        visible: false
    };
}
exports.hideLobbyScreen = hideLobbyScreen;
/**
 * Action to handle chat initialized in the lobby room.
 *
 * @param {Object} payload - The payload received,
 * contains the information about the two participants
 * that will chat with each other in the lobby room.
 *
 * @returns {Promise<void>}
 */
function handleLobbyChatInitialized(payload) {
    return async (dispatch, getState) => {
        const state = getState();
        const conference = (0, functions_1.getCurrentConference)(state);
        const id = conference?.myLobbyUserId();
        dispatch({
            type: actionTypes_1.SET_LOBBY_PARTICIPANT_CHAT_STATE,
            participant: payload.attendee,
            moderator: payload.moderator
        });
        dispatch((0, actions_any_1.onLobbyChatInitialized)(payload));
        const attendeeIsKnocking = (0, functions_3.getKnockingParticipants)(state).some(p => p.id === payload.attendee.id);
        if (attendeeIsKnocking && conference?.getRole() === 'moderator' && payload.moderator.id !== id) {
            dispatch((0, actions_2.showNotification)({
                titleKey: 'lobby.lobbyChatStartedNotification',
                titleArguments: {
                    moderator: payload.moderator.name ?? '',
                    attendee: payload.attendee.name ?? ''
                }
            }));
        }
    };
}
exports.handleLobbyChatInitialized = handleLobbyChatInitialized;
/**
 * Action to send message to the moderator.
 *
 * @param {string} message - The message to be sent.
 *
 * @returns {Promise<void>}
 */
function onSendMessage(message) {
    return async (dispatch) => {
        dispatch((0, actions_any_1.sendMessage)(message));
    };
}
exports.onSendMessage = onSendMessage;
/**
 * Action to send lobby message to every participant. Only allowed for moderators.
 *
 * @param {Object} message - The message to be sent.
 *
 * @returns {Promise<void>}
 */
function sendLobbyChatMessage(message) {
    return async (dispatch, getState) => {
        const conference = (0, functions_1.getCurrentConference)(getState);
        conference?.sendLobbyMessage(message);
    };
}
exports.sendLobbyChatMessage = sendLobbyChatMessage;
/**
 * Sets lobby listeners if lobby has been enabled.
 *
 * @returns {Function}
 */
function maybeSetLobbyChatMessageListener() {
    return async (dispatch, getState) => {
        const state = getState();
        const lobbyEnabled = (0, functions_3.getLobbyEnabled)(state);
        if (lobbyEnabled) {
            dispatch(setLobbyMessageListener());
        }
    };
}
exports.maybeSetLobbyChatMessageListener = maybeSetLobbyChatMessageListener;
/**
 * Action to handle the event when a moderator leaves during lobby chat.
 *
 * @param {string} participantId - The participant id of the moderator who left.
 * @returns {Function}
 */
function updateLobbyParticipantOnLeave(participantId) {
    return async (dispatch, getState) => {
        const state = getState();
        const { knocking, knockingParticipants } = state['features/lobby'];
        const { lobbyMessageRecipient } = state['features/chat'];
        const { conference } = state['features/base/conference'];
        if (knocking && lobbyMessageRecipient && lobbyMessageRecipient.id === participantId) {
            return dispatch((0, actions_any_1.removeLobbyChatParticipant)(true));
        }
        if (!knocking) {
            // inform knocking participant when their moderator leaves
            const participantToNotify = knockingParticipants.find(p => p.chattingWithModerator === participantId);
            if (participantToNotify) {
                conference?.sendLobbyMessage({
                    type: constants_3.MODERATOR_IN_CHAT_WITH_LEFT,
                    moderatorId: participantToNotify.chattingWithModerator
                }, participantToNotify.id);
            }
            dispatch({
                type: actionTypes_1.REMOVE_LOBBY_CHAT_WITH_MODERATOR,
                moderatorId: participantId
            });
        }
    };
}
exports.updateLobbyParticipantOnLeave = updateLobbyParticipantOnLeave;
/**
 * Handles all messages received in the lobby room.
 *
 * @returns {Function}
 */
function setLobbyMessageListener() {
    return async (dispatch, getState) => {
        const state = getState();
        const conference = (0, functions_1.getCurrentConference)(state);
        const { enableChat = true } = (0, functions_3.getLobbyConfig)(state);
        if (!enableChat) {
            return;
        }
        conference?.addLobbyMessageListener((message, participantId) => {
            if (message.type === constants_1.LOBBY_CHAT_MESSAGE) {
                return dispatch((0, middleware_1.handleLobbyMessageReceived)(message.message, participantId));
            }
            if (message.type === constants_3.LOBBY_CHAT_INITIALIZED) {
                return dispatch(handleLobbyChatInitialized(message));
            }
            if (message.type === constants_3.MODERATOR_IN_CHAT_WITH_LEFT) {
                return dispatch(updateLobbyParticipantOnLeave(message.moderatorId));
            }
        });
    };
}
exports.setLobbyMessageListener = setLobbyMessageListener;
