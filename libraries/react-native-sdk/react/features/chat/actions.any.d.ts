import { IStore } from '../app/types';
import { IParticipant } from '../base/participants/types';
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
export declare function addMessage(messageDetails: Object): {
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
    type: string;
};
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
export declare function editMessage(message: Object): {
    type: string;
    message: Object;
};
/**
 * Clears the chat messages in Redux.
 *
 * @returns {{
 *     type: CLEAR_MESSAGES
 * }}
 */
export declare function clearMessages(): {
    type: string;
};
/**
 * Action to signal the closing of the chat dialog.
 *
 * @returns {{
 *     type: CLOSE_CHAT
 * }}
 */
export declare function closeChat(): {
    type: string;
};
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
export declare function sendMessage(message: string, ignorePrivacy?: boolean): {
    type: string;
    ignorePrivacy: boolean;
    message: string;
};
/**
 * Initiates the sending of a private message to the supplied participant.
 *
 * @param {IParticipant} participant - The participant to set the recipient to.
 * @returns {{
 *     participant: IParticipant,
 *     type: SET_PRIVATE_MESSAGE_RECIPIENT
 * }}
 */
export declare function setPrivateMessageRecipient(participant?: Object): {
    participant: Object | undefined;
    type: string;
};
/**
 * Set the value of _isPollsTabFocused.
 *
 * @param {boolean} isPollsTabFocused - The new value for _isPollsTabFocused.
 * @returns {Function}
 */
export declare function setIsPollsTabFocused(isPollsTabFocused: boolean): {
    isPollsTabFocused: boolean;
    type: string;
};
/**
 * Initiates the sending of messages between a moderator and a lobby attendee.
 *
 * @param {Object} lobbyChatInitializedInfo - The information about the attendee and the moderator
 * that is going to chat.
 *
 * @returns {Function}
 */
export declare function onLobbyChatInitialized(lobbyChatInitializedInfo: {
    attendee: IParticipant;
    moderator: IParticipant;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<{
    type: string;
    participant: IParticipant;
    open: boolean;
} | undefined>;
/**
 * Sets the lobby room's chat active state.
 *
 * @param {boolean} value - The active state.
 *
 * @returns {Object}
 */
export declare function setLobbyChatActiveState(value: boolean): {
    type: string;
    payload: boolean;
};
/**
 * Removes lobby type messages.
 *
 *  @param {boolean} removeLobbyChatMessages - Should remove messages from chat  (works only for accepted users).
 * If not specified, it will delete all lobby messages.
 *
 * @returns {Object}
 */
export declare function removeLobbyChatParticipant(removeLobbyChatMessages?: boolean): {
    type: string;
    removeLobbyChatMessages: boolean | undefined;
};
/**
 * Handles initial setup of lobby message between
 * Moderator and participant.
 *
 * @param {string} participantId - The participant id.
 *
 * @returns {Object}
 */
export declare function handleLobbyChatInitialized(participantId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<any>;
