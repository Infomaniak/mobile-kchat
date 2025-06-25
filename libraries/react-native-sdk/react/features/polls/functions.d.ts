import { IReduxState } from '../app/types';
import { IAnswerData } from './types';
/**
 * Selector creator for determining if poll results should be displayed or not.
 *
 * @param {string} id - Id of the poll.
 * @returns {Function}
 */
export declare function shouldShowResults(id: string): (state: IReduxState) => boolean;
/**
 * Selector creator for polls.
 *
 * @param {string} pollId - Id of the poll to get.
 * @returns {Function}
 */
export declare function getPoll(pollId: string): (state: IReduxState) => import("./types").IPoll;
/**
 * Selector for calculating the number of unread poll messages.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {number} The number of unread messages.
 */
export declare function getUnreadPollCount(state: IReduxState): number;
/**
 * Determines if the submit poll answer button should be disabled.
 *
 * @param {Array<boolean>} checkBoxStates - The states of the checkboxes.
 * @returns {boolean}
 */
export declare function isSubmitAnswerDisabled(checkBoxStates: Array<boolean>): boolean;
/**
 * Check if the input array has identical answers.
 *
 * @param {Array<IAnswerData>} currentAnswers - The array of current answers to compare.
 * @returns {boolean} - Returns true if the answers are identical.
 */
export declare function hasIdenticalAnswers(currentAnswers: Array<IAnswerData>): boolean;
