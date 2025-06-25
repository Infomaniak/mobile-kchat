"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayReactionSoundsNotification = exports.pushReactions = exports.addReactionsToChat = exports.flushReactionBuffer = exports.addReactionToBuffer = exports.sendReactions = exports.removeReaction = exports.setReactionQueue = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Sets the reaction queue.
 *
 * @param {Array} queue - The new queue.
 * @returns {IReactionsAction}
 */
function setReactionQueue(queue) {
    return {
        type: actionTypes_1.SET_REACTION_QUEUE,
        queue
    };
}
exports.setReactionQueue = setReactionQueue;
/**
 * Removes a reaction from the queue.
 *
 * @param {string} uid - Id of the reaction to be removed.
 * @returns {Function}
 */
function removeReaction(uid) {
    return (dispatch, getState) => {
        const queue = getState()['features/reactions'].queue;
        dispatch(setReactionQueue(queue.filter((reaction) => reaction.uid !== uid)));
    };
}
exports.removeReaction = removeReaction;
/**
 * Sends the reactions buffer to everyone in the conference.
 *
 * @returns {IReactionsAction}
 */
function sendReactions() {
    return {
        type: actionTypes_1.SEND_REACTIONS
    };
}
exports.sendReactions = sendReactions;
/**
 * Adds a reaction to the local buffer.
 *
 * @param {string} reaction - The reaction to be added.
 * @returns {IReactionsAction}
 */
function addReactionToBuffer(reaction) {
    return {
        type: actionTypes_1.ADD_REACTION_BUFFER,
        reaction
    };
}
exports.addReactionToBuffer = addReactionToBuffer;
/**
 * Clears the reaction buffer.
 *
 * @returns {IReactionsAction}
 */
function flushReactionBuffer() {
    return {
        type: actionTypes_1.FLUSH_REACTION_BUFFER
    };
}
exports.flushReactionBuffer = flushReactionBuffer;
/**
 * Adds a reaction message to the chat.
 *
 * @param {string} message - The reaction message.
 * @returns {IReactionsAction}
 */
function addReactionsToChat(message) {
    return {
        type: actionTypes_1.ADD_REACTION_MESSAGE,
        message
    };
}
exports.addReactionsToChat = addReactionsToChat;
/**
 * Adds reactions to the animation queue.
 *
 * @param {Array} reactions - The reactions to be animated.
 * @returns {IReactionsAction}
 */
function pushReactions(reactions) {
    return {
        type: actionTypes_1.PUSH_REACTIONS,
        reactions
    };
}
exports.pushReactions = pushReactions;
/**
 * Displays the disable sounds notification.
 *
 * @returns {void}
 */
function displayReactionSoundsNotification() {
    return {
        type: actionTypes_1.SHOW_SOUNDS_NOTIFICATION
    };
}
exports.displayReactionSoundsNotification = displayReactionSoundsNotification;
