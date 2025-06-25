"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrivateNoticeMessage = exports.getCanReplyToMessage = exports.getMessageText = exports.getFormattedTimestamp = exports.areSmileysDisabled = exports.getUnreadCount = exports.replaceNonUnicodeEmojis = void 0;
// @ts-expect-error
const aliases_1 = __importDefault(require("react-emoji-render/data/aliases"));
// eslint-disable-next-line lines-around-comment
// @ts-expect-error
const asciiAliases_1 = __importDefault(require("react-emoji-render/data/asciiAliases"));
const dateUtil_1 = require("../base/i18n/dateUtil");
const i18next_1 = __importDefault(require("../base/i18n/i18next"));
const functions_1 = require("../base/participants/functions");
const helpers_1 = require("../base/util/helpers");
const constants_1 = require("./constants");
/**
 * An ASCII emoticon regexp array to find and replace old-style ASCII
 * emoticons (such as :O) with the new Unicode representation, so that
 * devices and browsers that support them can render these natively
 * without a 3rd party component.
 *
 * NOTE: this is currently only used on mobile, but it can be used
 * on web too once we drop support for browsers that don't support
 * unicode emoji rendering.
 */
const ASCII_EMOTICON_REGEXP_ARRAY = [];
/**
 * An emoji regexp array to find and replace alias emoticons
 * (such as :smiley:) with the new Unicode representation, so that
 * devices and browsers that support them can render these natively
 * without a 3rd party component.
 *
 * NOTE: this is currently only used on mobile, but it can be used
 * on web too once we drop support for browsers that don't support
 * unicode emoji rendering.
 */
const SLACK_EMOJI_REGEXP_ARRAY = [];
(function () {
    for (const [key, value] of Object.entries(aliases_1.default)) {
        // Add ASCII emoticons
        const asciiEmoticons = asciiAliases_1.default[key];
        if (asciiEmoticons) {
            const asciiEscapedValues = asciiEmoticons.map((v) => (0, helpers_1.escapeRegexp)(v));
            const asciiRegexp = `(${asciiEscapedValues.join('|')})`;
            // Escape urls
            const formattedAsciiRegexp = key === 'confused'
                ? `(?=(${asciiRegexp}))(:(?!//).)`
                : asciiRegexp;
            ASCII_EMOTICON_REGEXP_ARRAY.push([new RegExp(formattedAsciiRegexp, 'g'), value]);
        }
        // Add slack-type emojis
        const emojiRegexp = `\\B(${(0, helpers_1.escapeRegexp)(`:${key}:`)})\\B`;
        SLACK_EMOJI_REGEXP_ARRAY.push([new RegExp(emojiRegexp, 'g'), value]);
    }
})();
/**
 * Replaces ASCII and other non-unicode emoticons with unicode emojis to let the emojis be rendered
 * by the platform native renderer.
 *
 * @param {string} message - The message to parse and replace.
 * @returns {string}
 */
function replaceNonUnicodeEmojis(message) {
    let replacedMessage = message;
    for (const [regexp, replaceValue] of SLACK_EMOJI_REGEXP_ARRAY) {
        replacedMessage = replacedMessage.replace(regexp, replaceValue);
    }
    for (const [regexp, replaceValue] of ASCII_EMOTICON_REGEXP_ARRAY) {
        replacedMessage = replacedMessage.replace(regexp, replaceValue);
    }
    return replacedMessage;
}
exports.replaceNonUnicodeEmojis = replaceNonUnicodeEmojis;
/**
 * Selector for calculating the number of unread chat messages.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} The number of unread messages.
 */
function getUnreadCount(state) {
    const { lastReadMessage, messages } = state['features/chat'];
    const messagesCount = messages.length;
    if (!messagesCount) {
        return 0;
    }
    let reactionMessages = 0;
    let lastReadIndex;
    if (navigator.product === 'ReactNative') {
        // React native stores the messages in a reversed order.
        lastReadIndex = messages.indexOf(lastReadMessage);
        for (let i = 0; i < lastReadIndex; i++) {
            if (messages[i].isReaction) {
                reactionMessages++;
            }
        }
        return lastReadIndex - reactionMessages;
    }
    lastReadIndex = messages.lastIndexOf(lastReadMessage);
    for (let i = lastReadIndex + 1; i < messagesCount; i++) {
        if (messages[i].isReaction) {
            reactionMessages++;
        }
    }
    return messagesCount - (lastReadIndex + 1) - reactionMessages;
}
exports.getUnreadCount = getUnreadCount;
/**
 * Get whether the chat smileys are disabled or not.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} The disabled flag.
 */
function areSmileysDisabled(state) {
    const disableChatSmileys = state['features/base/config']?.disableChatSmileys === true;
    return disableChatSmileys;
}
exports.areSmileysDisabled = areSmileysDisabled;
/**
 * Returns the timestamp to display for the message.
 *
 * @param {IMessage} message - The message from which to get the timestamp.
 * @returns {string}
 */
function getFormattedTimestamp(message) {
    return (0, dateUtil_1.getLocalizedDateFormatter)(new Date(message.timestamp))
        .format(constants_1.TIMESTAMP_FORMAT);
}
exports.getFormattedTimestamp = getFormattedTimestamp;
/**
 * Generates the message text to be rendered in the component.
 *
 * @param {IMessage} message - The message from which to get the text.
 * @returns {string}
 */
function getMessageText(message) {
    return message.messageType === constants_1.MESSAGE_TYPE_ERROR
        ? i18next_1.default.t('chat.error', {
            error: message.message
        })
        : message.message;
}
exports.getMessageText = getMessageText;
/**
 * Returns whether a message can be replied to.
 *
 * @param {IReduxState} state - The redux state.
 * @param {IMessage} message - The message to be checked.
 * @returns {boolean}
 */
function getCanReplyToMessage(state, message) {
    const { knocking } = state['features/lobby'];
    const participant = (0, functions_1.getParticipantById)(state, message.id);
    return Boolean(participant)
        && (message.privateMessage || (message.lobbyChat && !knocking))
        && message.messageType !== constants_1.MESSAGE_TYPE_LOCAL;
}
exports.getCanReplyToMessage = getCanReplyToMessage;
/**
 * Returns the message that is displayed as a notice for private messages.
 *
 * @param {IMessage} message - The message to be checked.
 * @returns {string}
 */
function getPrivateNoticeMessage(message) {
    return i18next_1.default.t('chat.privateNotice', {
        recipient: message.messageType === constants_1.MESSAGE_TYPE_LOCAL ? message.recipient : i18next_1.default.t('chat.you')
    });
}
exports.getPrivateNoticeMessage = getPrivateNoticeMessage;
