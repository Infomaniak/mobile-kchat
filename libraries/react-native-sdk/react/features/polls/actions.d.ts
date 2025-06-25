import { IAnswer, IPoll } from './types';
/**
 * Action to signal that existing polls needs to be cleared from state.
 *
 * @returns {{
 *     type: CLEAR_POLLS
 * }}
 */
export declare const clearPolls: () => {
    type: string;
};
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
export declare const setVoteChanging: (pollId: string, value: boolean) => {
    type: string;
    pollId: string;
    value: boolean;
};
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
export declare const receivePoll: (pollId: string, poll: IPoll, notify: boolean) => {
    type: string;
    poll: IPoll;
    pollId: string;
    notify: boolean;
};
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
export declare const receiveAnswer: (pollId: string, answer: IAnswer) => {
    type: string;
    answer: IAnswer;
    pollId: string;
};
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
export declare const registerVote: (pollId: string, answers: Array<boolean> | null) => {
    type: string;
    answers: boolean[] | null;
    pollId: string;
};
/**
 * Action to retract a vote on a poll.
 *
 * @param {string} pollId - The id of the poll.
 * @returns {{
 *     type: RETRACT_VOTE,
 *     pollId: string
 * }}
 */
export declare const retractVote: (pollId: string) => {
    type: string;
    pollId: string;
};
/**
 * Action to signal the closing of the polls tab.
 *
 * @returns {{
 *     type: POLL_TAB_CLOSED
 * }}
 */
export declare function resetNbUnreadPollsMessages(): {
    type: string;
};
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
export declare function savePoll(pollId: string, poll: IPoll, saved: boolean): {
    type: string;
    pollId: string;
    poll: {
        saved: boolean;
        answers: import("./types").IAnswerData[];
        changingVote: boolean;
        editing: boolean;
        lastVote: boolean[] | null;
        question: string;
        senderId: string | undefined;
        showResults: boolean;
    };
};
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
export declare function editPoll(pollId: string, editing: boolean): {
    type: string;
    pollId: string;
    editing: boolean;
};
