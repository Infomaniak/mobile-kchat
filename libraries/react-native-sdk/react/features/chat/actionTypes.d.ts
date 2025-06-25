/**
 * The type of the action which signals to add a new chat message.
 *
 * {
 *     type: ADD_MESSAGE,
 *     displayName: string
 *     hasRead: boolean,
 *     id: string,
 *     messageType: string,
 *     message: string,
 *     timestamp: string,
 * }
 */
export declare const ADD_MESSAGE = "ADD_MESSAGE";
/**
 * The type of the action which signals to clear messages in Redux.
 *
 * {
 *     type: CLEAR_MESSAGES
 * }
 */
export declare const CLEAR_MESSAGES = "CLEAR_MESSAGES";
/**
 * The type of the action which signals the cancellation the chat panel.
 *
 * {
 *     type: CLOSE_CHAT
 * }
 */
export declare const CLOSE_CHAT = "CLOSE_CHAT";
/**
 * The type of the action which signals to edit chat message.
 *
 * {
 *     type: EDIT_MESSAGE,
 *     message: Object
 * }
 */
export declare const EDIT_MESSAGE = "EDIT_MESSAGE";
/**
 * The type of the action which signals to display the chat panel.
 *
 * {
 *     type: OPEN_CHAT
 * }
 */
export declare const OPEN_CHAT = "OPEN_CHAT";
/**
 * The type of the action which signals a send a chat message to everyone in the
 * conference.
 *
 * {
 *     type: SEND_MESSAGE,
 *     ignorePrivacy: boolean,
 *     message: string
 * }
 */
export declare const SEND_MESSAGE = "SEND_MESSAGE";
/**
 * The type of action which signals the initiation of sending of as private message to the
 * supplied recipient.
 *
 * {
 *     participant: Participant,
 *     type: SET_PRIVATE_MESSAGE_RECIPIENT
 * }
 */
export declare const SET_PRIVATE_MESSAGE_RECIPIENT = "SET_PRIVATE_MESSAGE_RECIPIENT";
/**
 * The type of action which signals the update a _isPollsTabFocused.
 *
 * {
 *     isPollsTabFocused: boolean,
 *     type: SET_PRIVATE_MESSAGE_RECIPIENT
 * }
 */
export declare const SET_IS_POLL_TAB_FOCUSED = "SET_IS_POLL_TAB_FOCUSED";
/**
 * The type of action which sets the current recipient for lobby messages.
 *
 * {
 *     participant: Object,
 *     type: SET_LOBBY_CHAT_RECIPIENT
 * }
 */
export declare const SET_LOBBY_CHAT_RECIPIENT = "SET_LOBBY_CHAT_RECIPIENT";
/**
 * The type of action sets the state of lobby messaging status.
 *
 * {
 *     type: SET_LOBBY_CHAT_ACTIVE_STATE
 *     payload: boolean
 * }
 */
export declare const SET_LOBBY_CHAT_ACTIVE_STATE = "SET_LOBBY_CHAT_ACTIVE_STATE";
/**
 * The type of action removes the lobby messaging from participant.
 *
 * {
 *     type: REMOVE_LOBBY_CHAT_PARTICIPANT
 * }
 */
export declare const REMOVE_LOBBY_CHAT_PARTICIPANT = "REMOVE_LOBBY_CHAT_PARTICIPANT";
