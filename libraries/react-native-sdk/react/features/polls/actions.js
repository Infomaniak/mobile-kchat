"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPoll = exports.savePoll = exports.resetNbUnreadPollsMessages = exports.retractVote = exports.registerVote = exports.receiveAnswer = exports.receivePoll = exports.setVoteChanging = exports.clearPolls = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Action to signal that existing polls needs to be cleared from state.
 *
 * @returns {{
 *     type: CLEAR_POLLS
 * }}
 */
const clearPolls = () => {
    return { type: actionTypes_1.CLEAR_POLLS };
};
exports.clearPolls = clearPolls;
/**
 * Action to signal that a poll's vote will be changed.
 *
 * @param {string} pollId - The id of the incoming poll.
 * @param {boolean} value - The value of the 'changing' state.

 * @returns {{
 *     type: CHANGE_VOTE,
 *     pollId: string,
 *     value: boolean
 * }}
 */
const setVoteChanging = (pollId, value) => {
    return {
        type: actionTypes_1.CHANGE_VOTE,
        pollId,
        value
    };
};
exports.setVoteChanging = setVoteChanging;
/**
 * Action to signal that a new poll was received.
 *
 * @param {string} pollId - The id of the incoming poll.
 * @param {IPoll} poll - The incoming Poll object.
 * @param {boolean} notify - Whether to send or not a notification.
 * @returns {{
 *     type: RECEIVE_POLL,
 *     poll: IPoll,
 *     pollId: string,
 *     notify: boolean
 * }}
 */
const receivePoll = (pollId, poll, notify) => {
    return {
        type: actionTypes_1.RECEIVE_POLL,
        poll,
        pollId,
        notify
    };
};
exports.receivePoll = receivePoll;
/**
 * Action to signal that a new answer was received.
 *
 * @param {string} pollId - The id of the incoming poll.
 * @param {IAnswer} answer - The incoming Answer object.
 * @returns {{
 *     type: RECEIVE_ANSWER,
 *     answer: IAnswer,
 *     pollId: string
 * }}
 */
const receiveAnswer = (pollId, answer) => {
    return {
        type: actionTypes_1.RECEIVE_ANSWER,
        answer,
        pollId
    };
};
exports.receiveAnswer = receiveAnswer;
/**
 * Action to register a vote on a poll.
 *
 * @param {string} pollId - The id of the poll.
 * @param {?Array<boolean>} answers - The new answers.
 * @returns {{
 *     type: REGISTER_VOTE,
 *     answers: ?Array<boolean>,
 *     pollId: string
 * }}
 */
const registerVote = (pollId, answers) => {
    return {
        type: actionTypes_1.REGISTER_VOTE,
        answers,
        pollId
    };
};
exports.registerVote = registerVote;
/**
 * Action to retract a vote on a poll.
 *
 * @param {string} pollId - The id of the poll.
 * @returns {{
 *     type: RETRACT_VOTE,
 *     pollId: string
 * }}
 */
const retractVote = (pollId) => {
    return {
        type: actionTypes_1.RETRACT_VOTE,
        pollId
    };
};
exports.retractVote = retractVote;
/**
 * Action to signal the closing of the polls tab.
 *
 * @returns {{
 *     type: POLL_TAB_CLOSED
 * }}
 */
function resetNbUnreadPollsMessages() {
    return {
        type: actionTypes_1.RESET_NB_UNREAD_POLLS
    };
}
exports.resetNbUnreadPollsMessages = resetNbUnreadPollsMessages;
/**
 * Action to signal saving a poll.
 *
 * @param {string} pollId - The id of the poll that gets to be saved.
 * @param {IPoll} poll - The Poll object that gets to be saved.
 * @param {boolean} saved - Whether the poll is saved or not.
 * @returns {{
 *     type: RECEIVE_POLL,
 *     poll: IPoll,
 *     pollId: string,
 *     saved: boolean
 * }}
 */
function savePoll(pollId, poll, saved) {
    return {
        type: actionTypes_1.SAVE_POLL,
        pollId,
        poll: {
            ...poll,
            saved
        }
    };
}
exports.savePoll = savePoll;
/**
 * Action to signal editing a poll.
 *
 * @param {string} pollId - The id of the poll that gets to be edited.
 * @param {boolean} editing - Whether the poll is in edit mode or not.
 * @returns {{
 *     type: RECEIVE_POLL,
 *     pollId: string,
 *     editing: boolean
 * }}
 */
function editPoll(pollId, editing) {
    return {
        type: actionTypes_1.EDIT_POLL,
        pollId,
        editing
    };
}
exports.editPoll = editPoll;
