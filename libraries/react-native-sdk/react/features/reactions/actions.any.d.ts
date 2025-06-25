import { IReactionEmojiProps } from './constants';
import { IReactionsAction } from './reducer';
/**
 * Sets the reaction queue.
 *
 * @param {Array} queue - The new queue.
 * @returns {IReactionsAction}
 */
export declare function setReactionQueue(queue: Array<IReactionEmojiProps>): IReactionsAction;
/**
 * Removes a reaction from the queue.
 *
 * @param {string} uid - Id of the reaction to be removed.
 * @returns {Function}
 */
export declare function removeReaction(uid: string): any;
/**
 * Sends the reactions buffer to everyone in the conference.
 *
 * @returns {IReactionsAction}
 */
export declare function sendReactions(): IReactionsAction;
/**
 * Adds a reaction to the local buffer.
 *
 * @param {string} reaction - The reaction to be added.
 * @returns {IReactionsAction}
 */
export declare function addReactionToBuffer(reaction: string): IReactionsAction;
/**
 * Clears the reaction buffer.
 *
 * @returns {IReactionsAction}
 */
export declare function flushReactionBuffer(): IReactionsAction;
/**
 * Adds a reaction message to the chat.
 *
 * @param {string} message - The reaction message.
 * @returns {IReactionsAction}
 */
export declare function addReactionsToChat(message: string): IReactionsAction;
/**
 * Adds reactions to the animation queue.
 *
 * @param {Array} reactions - The reactions to be animated.
 * @returns {IReactionsAction}
 */
export declare function pushReactions(reactions: Array<string>): IReactionsAction;
/**
 * Displays the disable sounds notification.
 *
 * @returns {void}
 */
export declare function displayReactionSoundsNotification(): IReactionsAction;
