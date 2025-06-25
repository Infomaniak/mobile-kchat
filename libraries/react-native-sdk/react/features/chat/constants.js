"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGE_TYPE_SYSTEM = exports.TIMESTAMP_FORMAT = exports.CHAT_TABS = exports.LOBBY_CHAT_MESSAGE = exports.SMALL_WIDTH_THRESHOLD = exports.MESSAGE_TYPE_REMOTE = exports.MESSAGE_TYPE_LOCAL = exports.MESSAGE_TYPE_ERROR = exports.INCOMING_MSG_SOUND_ID = exports.CHAT_SIZE = void 0;
/**
 * The size of the chat. Equal to $sidebarWidth SCSS variable.
 */
exports.CHAT_SIZE = 315;
/**
 * The audio ID of the audio element for which the {@link playAudio} action is
 * triggered when new chat message is received.
 *
 * @type {string}
 */
exports.INCOMING_MSG_SOUND_ID = 'INCOMING_MSG_SOUND';
/**
 * The {@code messageType} of error (system) messages.
 */
exports.MESSAGE_TYPE_ERROR = 'error';
/**
 * The {@code messageType} of local messages.
 */
exports.MESSAGE_TYPE_LOCAL = 'local';
/**
 * The {@code messageType} of remote messages.
 */
exports.MESSAGE_TYPE_REMOTE = 'remote';
exports.SMALL_WIDTH_THRESHOLD = 580;
/**
 * Lobby message type.
 */
exports.LOBBY_CHAT_MESSAGE = 'LOBBY_CHAT_MESSAGE';
exports.CHAT_TABS = {
    POLLS: 'polls-tab',
    CHAT: 'chat-tab'
};
/**
 * Formatter string to display the message timestamp.
 */
exports.TIMESTAMP_FORMAT = 'H:mm';
/**
 * The namespace for system messages.
 */
exports.MESSAGE_TYPE_SYSTEM = 'system_chat_message';
