"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleLobbyMessageReceived = void 0;
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const actions_1 = require("../base/dialog/actions");
const i18next_1 = __importDefault(require("../base/i18n/i18next"));
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_2 = require("../base/sounds/actions");
const actions_3 = require("../gifs/actions");
const constants_1 = require("../gifs/constants");
const function_any_1 = require("../gifs/function.any");
const actions_4 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actions_5 = require("../polls/actions");
const actionTypes_3 = require("../reactions/actionTypes");
const actions_any_1 = require("../reactions/actions.any");
const constants_3 = require("../reactions/constants");
const functions_any_1 = require("../reactions/functions.any");
const actions_6 = require("../toolbox/actions");
const actionTypes_4 = require("./actionTypes");
const actions_any_2 = require("./actions.any");
const components_1 = require("./components");
const constants_4 = require("./constants");
const functions_3 = require("./functions");
const sounds_1 = require("./sounds");
/**
 * Timeout for when to show the privacy notice after a private message was received.
 *
 * E.g. If this value is 20 secs (20000ms), then we show the privacy notice when sending a non private
 * message after we have received a private message in the last 20 seconds.
 */
const PRIVACY_NOTICE_TIMEOUT = 20 * 1000;
/**
 * Implements the middleware of the chat feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch, getState } = store;
    const localParticipant = (0, functions_2.getLocalParticipant)(getState());
    let isOpen, unreadCount;
    switch (action.type) {
        case actionTypes_4.ADD_MESSAGE:
            unreadCount = (0, functions_3.getUnreadCount)(getState());
            if (action.isReaction) {
                action.hasRead = false;
            }
            else {
                unreadCount = action.hasRead ? 0 : unreadCount + 1;
            }
            isOpen = getState()['features/chat'].isOpen;
            if (typeof APP !== 'undefined') {
                APP.API.notifyChatUpdated(unreadCount, isOpen);
            }
            break;
        case actionTypes_1.APP_WILL_MOUNT:
            dispatch((0, actions_2.registerSound)(constants_4.INCOMING_MSG_SOUND_ID, sounds_1.INCOMING_MSG_SOUND_FILE));
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            dispatch((0, actions_2.unregisterSound)(constants_4.INCOMING_MSG_SOUND_ID));
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            _addChatMsgListener(action.conference, store);
            break;
        case actionTypes_4.CLOSE_CHAT: {
            const isPollTabOpen = getState()['features/chat'].isPollsTabFocused;
            unreadCount = 0;
            if (typeof APP !== 'undefined') {
                APP.API.notifyChatUpdated(unreadCount, false);
            }
            if (isPollTabOpen) {
                dispatch((0, actions_5.resetNbUnreadPollsMessages)());
            }
            break;
        }
        case actionTypes_2.ENDPOINT_MESSAGE_RECEIVED: {
            const state = store.getState();
            if (!(0, functions_any_1.isReactionsEnabled)(state)) {
                return next(action);
            }
            const { participant, data } = action;
            if (data?.name === constants_3.ENDPOINT_REACTION_NAME) {
                store.dispatch((0, actions_any_1.pushReactions)(data.reactions));
                _handleReceivedMessage(store, {
                    id: participant.getId(),
                    message: (0, functions_any_1.getReactionMessageFromBuffer)(data.reactions),
                    privateMessage: false,
                    lobbyChat: false,
                    timestamp: data.timestamp
                }, false, true);
            }
            break;
        }
        case actionTypes_2.NON_PARTICIPANT_MESSAGE_RECEIVED: {
            const { id, json: data } = action;
            if (data?.type === constants_4.MESSAGE_TYPE_SYSTEM && data.message) {
                _handleReceivedMessage(store, {
                    displayName: data.displayName ?? i18next_1.default.t('chat.systemDisplayName'),
                    id,
                    lobbyChat: false,
                    message: data.message,
                    privateMessage: true,
                    timestamp: Date.now()
                });
            }
            break;
        }
        case actionTypes_4.OPEN_CHAT:
            unreadCount = 0;
            if (typeof APP !== 'undefined') {
                APP.API.notifyChatUpdated(unreadCount, true);
            }
            break;
        case actionTypes_4.SET_IS_POLL_TAB_FOCUSED: {
            dispatch((0, actions_5.resetNbUnreadPollsMessages)());
            break;
        }
        case actionTypes_4.SEND_MESSAGE: {
            const state = store.getState();
            const conference = (0, functions_1.getCurrentConference)(state);
            if (conference) {
                // There may be cases when we intend to send a private message but we forget to set the
                // recipient. This logic tries to mitigate this risk.
                const shouldSendPrivateMessageTo = _shouldSendPrivateMessageTo(state, action);
                const participantExists = shouldSendPrivateMessageTo
                    && (0, functions_2.getParticipantById)(state, shouldSendPrivateMessageTo);
                if (shouldSendPrivateMessageTo && participantExists) {
                    dispatch((0, actions_1.openDialog)(components_1.ChatPrivacyDialog, {
                        message: action.message,
                        participantID: shouldSendPrivateMessageTo
                    }));
                }
                else {
                    // Sending the message if privacy notice doesn't need to be shown.
                    const { privateMessageRecipient, isLobbyChatActive, lobbyMessageRecipient } = state['features/chat'];
                    if (typeof APP !== 'undefined') {
                        APP.API.notifySendingChatMessage(action.message, Boolean(privateMessageRecipient));
                    }
                    if (isLobbyChatActive && lobbyMessageRecipient) {
                        conference.sendLobbyMessage({
                            type: constants_4.LOBBY_CHAT_MESSAGE,
                            message: action.message
                        }, lobbyMessageRecipient.id);
                        _persistSentPrivateMessage(store, lobbyMessageRecipient.id, action.message, true);
                    }
                    else if (privateMessageRecipient) {
                        conference.sendPrivateTextMessage(privateMessageRecipient.id, action.message);
                        _persistSentPrivateMessage(store, privateMessageRecipient.id, action.message);
                    }
                    else {
                        conference.sendTextMessage(action.message);
                    }
                }
            }
            break;
        }
        case actionTypes_3.ADD_REACTION_MESSAGE: {
            if (localParticipant?.id) {
                _handleReceivedMessage(store, {
                    id: localParticipant.id,
                    message: action.message,
                    privateMessage: false,
                    timestamp: Date.now(),
                    lobbyChat: false
                }, false, true);
            }
        }
    }
    return next(action);
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, e.g. Clear messages or close the chat modal if it's left
 * open.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch, getState }, previousConference) => {
    if (conference !== previousConference) {
        // conference changed, left or failed...
        if (getState()['features/chat'].isOpen) {
            // Closes the chat if it's left open.
            dispatch((0, actions_any_2.closeChat)());
        }
        // Clear chat messages.
        dispatch((0, actions_any_2.clearMessages)());
    }
});
StateListenerRegistry_1.default.register(state => state['features/chat'].isOpen, (isOpen, { dispatch }) => {
    if (typeof APP !== 'undefined' && isOpen) {
        dispatch((0, actions_6.showToolbox)());
    }
});
/**
 * Registers listener for {@link JitsiConferenceEvents.MESSAGE_RECEIVED} that
 * will perform various chat related activities.
 *
 * @param {JitsiConference} conference - The conference instance on which the
 * new event listener will be registered.
 * @param {Object} store - The redux store object.
 * @private
 * @returns {void}
 */
function _addChatMsgListener(conference, store) {
    if (store.getState()['features/base/config'].iAmRecorder) {
        // We don't register anything on web if we are in iAmRecorder mode
        return;
    }
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.MESSAGE_RECEIVED, 
    // eslint-disable-next-line max-params
    (id, message, timestamp, displayName, isGuest) => {
        _onConferenceMessageReceived(store, {
            id: id || displayName,
            message,
            timestamp,
            displayName,
            isGuest,
            privateMessage: false
        });
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.PRIVATE_MESSAGE_RECEIVED, (id, message, timestamp) => {
        _onConferenceMessageReceived(store, {
            id,
            message,
            timestamp,
            privateMessage: true
        });
    });
    conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_ERROR, (errorType, error) => {
        errorType === lib_jitsi_meet_1.JitsiConferenceErrors.CHAT_ERROR && _handleChatError(store, error);
    });
}
/**
 * Handles a received message.
 *
 * @param {Object} store - Redux store.
 * @param {Object} message - The message object.
 * @returns {void}
 */
function _onConferenceMessageReceived(store, { displayName, id, isGuest, message, timestamp, privateMessage }) {
    const isGif = (0, function_any_1.isGifMessage)(message);
    if (isGif) {
        _handleGifMessageReceived(store, id, message);
        if ((0, function_any_1.getGifDisplayMode)(store.getState()) === 'tile') {
            return;
        }
    }
    _handleReceivedMessage(store, {
        displayName,
        id,
        isGuest,
        message,
        privateMessage,
        lobbyChat: false,
        timestamp
    }, true, isGif);
}
/**
 * Handles a received gif message.
 *
 * @param {Object} store - Redux store.
 * @param {string} id - Id of the participant that sent the message.
 * @param {string} message - The message sent.
 * @returns {void}
 */
function _handleGifMessageReceived(store, id, message) {
    const url = message.substring(constants_1.GIF_PREFIX.length, message.length - 1);
    store.dispatch((0, actions_3.addGif)(id, url));
}
/**
 * Handles a chat error received from the xmpp server.
 *
 * @param {Store} store - The Redux store.
 * @param  {string} error - The error message.
 * @returns {void}
 */
function _handleChatError({ dispatch }, error) {
    dispatch((0, actions_any_2.addMessage)({
        hasRead: true,
        messageType: constants_4.MESSAGE_TYPE_ERROR,
        message: error,
        privateMessage: false,
        timestamp: Date.now()
    }));
}
/**
 * Function to handle an incoming chat message from lobby room.
 *
 * @param {string} message - The message received.
 * @param {string} participantId - The participant id.
 * @returns {Function}
 */
function handleLobbyMessageReceived(message, participantId) {
    return async (dispatch, getState) => {
        _handleReceivedMessage({ dispatch,
            getState }, { id: participantId,
            message,
            privateMessage: false,
            lobbyChat: true,
            timestamp: Date.now() });
    };
}
exports.handleLobbyMessageReceived = handleLobbyMessageReceived;
/**
 * Function to get lobby chat user display name.
 *
 * @param {Store} state - The Redux store.
 * @param {string} id - The knocking participant id.
 * @returns {string}
 */
function getLobbyChatDisplayName(state, id) {
    const { knockingParticipants } = state['features/lobby'];
    const { lobbyMessageRecipient } = state['features/chat'];
    if (id === lobbyMessageRecipient?.id) {
        return lobbyMessageRecipient.name;
    }
    const knockingParticipant = knockingParticipants.find(p => p.id === id);
    if (knockingParticipant) {
        return knockingParticipant.name;
    }
}
/**
 * Function to handle an incoming chat message.
 *
 * @param {Store} store - The Redux store.
 * @param {Object} message - The message object.
 * @param {boolean} shouldPlaySound - Whether to play the incoming message sound.
 * @param {boolean} isReaction - Whether the message is a reaction message.
 * @returns {void}
 */
function _handleReceivedMessage({ dispatch, getState }, { displayName, id, isGuest, message, privateMessage, timestamp, lobbyChat }, shouldPlaySound = true, isReaction = false) {
    // Logic for all platforms:
    const state = getState();
    const { isOpen: isChatOpen } = state['features/chat'];
    const { soundsIncomingMessage: soundEnabled, userSelectedNotifications } = state['features/base/settings'];
    if (soundEnabled && shouldPlaySound && !isChatOpen) {
        dispatch((0, actions_2.playSound)(constants_4.INCOMING_MSG_SOUND_ID));
    }
    // Provide a default for the case when a message is being
    // backfilled for a participant that has left the conference.
    const participant = (0, functions_2.getParticipantById)(state, id) || { local: undefined };
    const localParticipant = (0, functions_2.getLocalParticipant)(getState);
    let displayNameToShow = lobbyChat
        ? getLobbyChatDisplayName(state, id)
        : displayName || (0, functions_2.getParticipantDisplayName)(state, id);
    const hasRead = participant.local || isChatOpen;
    const timestampToDate = timestamp ? new Date(timestamp) : new Date();
    const millisecondsTimestamp = timestampToDate.getTime();
    // skip message notifications on join (the messages having timestamp - coming from the history)
    const shouldShowNotification = userSelectedNotifications?.['notify.chatMessages']
        && !hasRead && !isReaction && !timestamp;
    if (isGuest) {
        displayNameToShow = `${displayNameToShow} ${i18next_1.default.t('visitors.chatIndicator')}`;
    }
    dispatch((0, actions_any_2.addMessage)({
        displayName: displayNameToShow,
        hasRead,
        id,
        messageType: participant.local ? constants_4.MESSAGE_TYPE_LOCAL : constants_4.MESSAGE_TYPE_REMOTE,
        message,
        privateMessage,
        lobbyChat,
        recipient: (0, functions_2.getParticipantDisplayName)(state, localParticipant?.id ?? ''),
        timestamp: millisecondsTimestamp,
        isReaction
    }));
    if (shouldShowNotification) {
        dispatch((0, actions_4.showMessageNotification)({
            title: displayNameToShow,
            description: message
        }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
    }
    if (typeof APP !== 'undefined') {
        // Logic for web only:
        APP.API.notifyReceivedChatMessage({
            body: message,
            id,
            nick: displayNameToShow,
            privateMessage,
            ts: timestamp
        });
    }
}
/**
 * Persists the sent private messages as if they were received over the muc.
 *
 * This is required as we rely on the fact that we receive all messages from the muc that we send
 * (as they are sent to everybody), but we don't receive the private messages we send to another participant.
 * But those messages should be in the store as well, otherwise they don't appear in the chat window.
 *
 * @param {Store} store - The Redux store.
 * @param {string} recipientID - The ID of the recipient the private message was sent to.
 * @param {string} message - The sent message.
 * @param {boolean} isLobbyPrivateMessage - Is a lobby message.
 * @returns {void}
 */
function _persistSentPrivateMessage({ dispatch, getState }, recipientID, message, isLobbyPrivateMessage = false) {
    const state = getState();
    const localParticipant = (0, functions_2.getLocalParticipant)(state);
    if (!localParticipant?.id) {
        return;
    }
    const displayName = (0, functions_2.getParticipantDisplayName)(state, localParticipant.id);
    const { lobbyMessageRecipient } = state['features/chat'];
    dispatch((0, actions_any_2.addMessage)({
        displayName,
        hasRead: true,
        id: localParticipant.id,
        messageType: constants_4.MESSAGE_TYPE_LOCAL,
        message,
        privateMessage: !isLobbyPrivateMessage,
        lobbyChat: isLobbyPrivateMessage,
        recipient: isLobbyPrivateMessage
            ? lobbyMessageRecipient?.name
            : (0, functions_2.getParticipantDisplayName)(getState, recipientID),
        timestamp: Date.now()
    }));
}
/**
 * Returns the ID of the participant who we may have wanted to send the message
 * that we're about to send.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} action - The action being dispatched now.
 * @returns {string?}
 */
function _shouldSendPrivateMessageTo(state, action) {
    if (action.ignorePrivacy) {
        // Shortcut: this is only true, if we already displayed the notice, so no need to show it again.
        return undefined;
    }
    const { messages, privateMessageRecipient } = state['features/chat'];
    if (privateMessageRecipient) {
        // We're already sending a private message, no need to warn about privacy.
        return undefined;
    }
    if (!messages.length) {
        // No messages yet, no need to warn for privacy.
        return undefined;
    }
    // Platforms sort messages differently
    const lastMessage = navigator.product === 'ReactNative'
        ? messages[0] : messages[messages.length - 1];
    if (lastMessage.messageType === constants_4.MESSAGE_TYPE_LOCAL) {
        // The sender is probably aware of any private messages as already sent
        // a message since then. Doesn't make sense to display the notice now.
        return undefined;
    }
    if (lastMessage.privateMessage) {
        // We show the notice if the last received message was private.
        return lastMessage.id;
    }
    // But messages may come rapidly, we want to protect our users from mis-sending a message
    // even when there was a reasonable recently received private message.
    const now = Date.now();
    const recentPrivateMessages = messages.filter(message => message.messageType !== constants_4.MESSAGE_TYPE_LOCAL
        && message.privateMessage
        && message.timestamp + PRIVACY_NOTICE_TIMEOUT > now);
    const recentPrivateMessage = navigator.product === 'ReactNative'
        ? recentPrivateMessages[0] : recentPrivateMessages[recentPrivateMessages.length - 1];
    if (recentPrivateMessage) {
        return recentPrivateMessage.id;
    }
    return undefined;
}
