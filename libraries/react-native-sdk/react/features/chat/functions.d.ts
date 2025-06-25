import { IReduxState } from '../app/types';
import { IMessage } from './types';
/**
 * Replaces ASCII and other non-unicode emoticons with unicode emojis to let the emojis be rendered
 * by the platform native renderer.
 *
 * @param {string} message - The message to parse and replace.
 * @returns {string}
 */
export declare function replaceNonUnicodeEmojis(message: string): string;
/**
 * Selector for calculating the number of unread chat messages.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} The number of unread messages.
 */
export declare function getUnreadCount(state: IReduxState): number;
/**
 * Get whether the chat smileys are disabled or not.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} The disabled flag.
 */
export declare function areSmileysDisabled(state: IReduxState): boolean;
/**
 * Returns the timestamp to display for the message.
 *
 * @param {IMessage} message - The message from which to get the timestamp.
 * @returns {string}
 */
export declare function getFormattedTimestamp(message: IMessage): any;
/**
 * Generates the message text to be rendered in the component.
 *
 * @param {IMessage} message - The message from which to get the text.
 * @returns {string}
 */
export declare function getMessageText(message: IMessage): string;
/**
 * Returns whether a message can be replied to.
 *
 * @param {IReduxState} state - The redux state.
 * @param {IMessage} message - The message to be checked.
 * @returns {boolean}
 */
export declare function getCanReplyToMessage(state: IReduxState, message: IMessage): boolean;
/**
 * Returns the message that is displayed as a notice for private messages.
 *
 * @param {IMessage} message - The message to be checked.
 * @returns {string}
 */
export declare function getPrivateNoticeMessage(message: IMessage): string;
