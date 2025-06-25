"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = require("uuid");
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    isOpen: false,
    isPollsTabFocused: false,
    lastReadMessage: undefined,
    messages: [],
    nbUnreadMessages: 0,
    privateMessageRecipient: undefined,
    lobbyMessageRecipient: undefined,
    isLobbyChatActive: false
};
ReducerRegistry_1.default.register('features/chat', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.ADD_MESSAGE: {
            const newMessage = {
                displayName: action.displayName,
                error: action.error,
                id: action.id,
                isReaction: action.isReaction,
                messageId: (0, uuid_1.v4)(),
                messageType: action.messageType,
                message: action.message,
                privateMessage: action.privateMessage,
                lobbyChat: action.lobbyChat,
                recipient: action.recipient,
                timestamp: action.timestamp
            };
            // React native, unlike web, needs a reverse sorted message list.
            const messages = navigator.product === 'ReactNative'
                ? [
                    newMessage,
                    ...state.messages
                ]
                : [
                    ...state.messages,
                    newMessage
                ];
            return {
                ...state,
                lastReadMessage: action.hasRead ? newMessage : state.lastReadMessage,
                nbUnreadMessages: state.isPollsTabFocused ? state.nbUnreadMessages + 1 : state.nbUnreadMessages,
                messages
            };
        }
        case actionTypes_1.CLEAR_MESSAGES:
            return {
                ...state,
                lastReadMessage: undefined,
                messages: []
            };
        case actionTypes_1.EDIT_MESSAGE: {
            let found = false;
            const newMessage = action.message;
            const messages = state.messages.map(m => {
                if (m.messageId === newMessage.messageId) {
                    found = true;
                    return newMessage;
                }
                return m;
            });
            // no change
            if (!found) {
                return state;
            }
            return {
                ...state,
                messages
            };
        }
        case actionTypes_1.SET_PRIVATE_MESSAGE_RECIPIENT:
            return {
                ...state,
                privateMessageRecipient: action.participant
            };
        case actionTypes_1.OPEN_CHAT:
            return {
                ...state,
                isOpen: true,
                privateMessageRecipient: action.participant
            };
        case actionTypes_1.CLOSE_CHAT:
            return {
                ...state,
                isOpen: false,
                lastReadMessage: state.messages[navigator.product === 'ReactNative' ? 0 : state.messages.length - 1],
                privateMessageRecipient: action.participant,
                isLobbyChatActive: false
            };
        case actionTypes_1.SET_IS_POLL_TAB_FOCUSED: {
            return {
                ...state,
                isPollsTabFocused: action.isPollsTabFocused,
                nbUnreadMessages: 0
            };
        }
        case actionTypes_1.SET_LOBBY_CHAT_RECIPIENT:
            return {
                ...state,
                isLobbyChatActive: true,
                lobbyMessageRecipient: action.participant,
                privateMessageRecipient: undefined,
                isOpen: action.open
            };
        case actionTypes_1.SET_LOBBY_CHAT_ACTIVE_STATE:
            return {
                ...state,
                isLobbyChatActive: action.payload,
                isOpen: action.payload || state.isOpen,
                privateMessageRecipient: undefined
            };
        case actionTypes_1.REMOVE_LOBBY_CHAT_PARTICIPANT:
            return {
                ...state,
                messages: state.messages.filter(m => {
                    if (action.removeLobbyChatMessages) {
                        return !m.lobbyChat;
                    }
                    return true;
                }),
                isOpen: state.isOpen && state.isLobbyChatActive ? false : state.isOpen,
                isLobbyChatActive: false,
                lobbyMessageRecipient: undefined
            };
    }
    return state;
});
