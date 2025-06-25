import { IReduxState } from '../app/types';
import { IReactionEmojiProps, ReactionThreshold } from './constants';
/**
 * Returns the queue of reactions.
 *
 * @param {Object} state - The state of the application.
 * @returns {Array}
 */
export declare function getReactionsQueue(state: IReduxState): Array<IReactionEmojiProps>;
/**
 * Returns chat message from reactions buffer.
 *
 * @param {Array} buffer - The reactions buffer.
 * @returns {string}
 */
export declare function getReactionMessageFromBuffer(buffer: Array<string>): string;
/**
 * Returns reactions array with uid.
 *
 * @param {Array} buffer - The reactions buffer.
 * @returns {Array}
 */
export declare function getReactionsWithId(buffer: Array<string>): Array<IReactionEmojiProps>;
/**
 * Sends reactions to the backend.
 *
 * @param {Object} state - The redux state object.
 * @param {Array} reactions - Reactions array to be sent.
 * @returns {void}
 */
export declare function sendReactionsWebhook(state: IReduxState, reactions: Array<string>): Promise<void>;
/**
 * Returns unique reactions with threshold.
 *
 * @param {Array} reactions - The reactions buffer.
 * @returns {Array}
 */
export declare function getReactionsSoundsThresholds(reactions: Array<string>): Array<ReactionThreshold>;
/**
 * Whether or not the reactions are enabled.
 *
 * @param {Object} state - The Redux state object.
 * @returns {boolean}
 */
export declare function isReactionsEnabled(state: IReduxState): boolean;
/**
 * Returns true if the reactions buttons should be displayed anywhere on the page and false otherwise.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean}
 */
export declare function shouldDisplayReactionsButtons(state: IReduxState): boolean;
