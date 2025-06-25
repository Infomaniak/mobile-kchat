"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasIdenticalAnswers = exports.isSubmitAnswerDisabled = exports.getUnreadPollCount = exports.getPoll = exports.shouldShowResults = void 0;
/**
 * Selector creator for determining if poll results should be displayed or not.
 *
 * @param {string} id - Id of the poll.
 * @returns {Function}
 */
function shouldShowResults(id) {
    return function (state) {
        return Boolean(state['features/polls']?.polls[id].showResults);
    };
}
exports.shouldShowResults = shouldShowResults;
/**
 * Selector creator for polls.
 *
 * @param {string} pollId - Id of the poll to get.
 * @returns {Function}
 */
function getPoll(pollId) {
    return function (state) {
        return state['features/polls'].polls[pollId];
    };
}
exports.getPoll = getPoll;
/**
 * Selector for calculating the number of unread poll messages.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} The number of unread messages.
 */
function getUnreadPollCount(state) {
    const { nbUnreadPolls } = state['features/polls'];
    return nbUnreadPolls;
}
exports.getUnreadPollCount = getUnreadPollCount;
/**
 * Determines if the submit poll answer button should be disabled.
 *
 * @param {Array<boolean>} checkBoxStates - The states of the checkboxes.
 * @returns {boolean}
 */
function isSubmitAnswerDisabled(checkBoxStates) {
    return !checkBoxStates.find(checked => checked);
}
exports.isSubmitAnswerDisabled = isSubmitAnswerDisabled;
/**
 * Check if the input array has identical answers.
 *
 * @param {Array<IAnswerData>} currentAnswers - The array of current answers to compare.
 * @returns {boolean} - Returns true if the answers are identical.
 */
function hasIdenticalAnswers(currentAnswers) {
    const nonEmptyCurrentAnswers = currentAnswers.filter((answer) => answer.name !== '');
    const currentAnswersSet = new Set(nonEmptyCurrentAnswers.map(answer => answer.name));
    return currentAnswersSet.size !== nonEmptyCurrentAnswers.length;
}
exports.hasIdenticalAnswers = hasIdenticalAnswers;
