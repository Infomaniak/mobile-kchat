"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const INITIAL_STATE = {
    polls: {},
    // Number of not read message
    nbUnreadPolls: 0
};
ReducerRegistry_1.default.register('features/polls', (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CHANGE_VOTE: {
            const { pollId, value } = action;
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [pollId]: {
                        ...state.polls[pollId],
                        changingVote: value,
                        showResults: !value
                    }
                }
            };
        }
        case actionTypes_1.CLEAR_POLLS: {
            return {
                ...state,
                ...INITIAL_STATE
            };
        }
        // Reducer triggered when a poll is received or saved.
        case actionTypes_1.RECEIVE_POLL:
        case actionTypes_1.SAVE_POLL: {
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.pollId]: action.poll
                },
                nbUnreadPolls: state.nbUnreadPolls + 1
            };
        }
        // Reducer triggered when an answer is received
        // The answer is added  to an existing poll
        case actionTypes_1.RECEIVE_ANSWER: {
            const { pollId, answer } = action;
            // if the poll doesn't exist
            if (!(pollId in state.polls)) {
                console.warn('requested poll does not exist: pollId ', pollId);
                return state;
            }
            // if the poll exists, we update it with the incoming answer
            const newAnswers = state.polls[pollId].answers
                .map(_answer => {
                // checking if the voters is an array for supporting old structure model
                const answerVoters = _answer.voters
                    ? _answer.voters.length
                        ? [..._answer.voters] : Object.keys(_answer.voters) : [];
                return {
                    name: _answer.name,
                    voters: answerVoters
                };
            });
            for (let i = 0; i < newAnswers.length; i++) {
                // if the answer was chosen, we add the senderId to the array of voters of this answer
                const voters = newAnswers[i].voters;
                const index = voters.indexOf(answer.voterId);
                if (answer.answers[i]) {
                    if (index === -1) {
                        voters.push(answer.voterId);
                    }
                }
                else if (index > -1) {
                    voters.splice(index, 1);
                }
            }
            // finally we update the state by returning the updated poll
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [pollId]: {
                        ...state.polls[pollId],
                        answers: newAnswers
                    }
                }
            };
        }
        case actionTypes_1.REGISTER_VOTE: {
            const { answers, pollId } = action;
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [pollId]: {
                        ...state.polls[pollId],
                        changingVote: false,
                        lastVote: answers,
                        showResults: true
                    }
                }
            };
        }
        case actionTypes_1.RETRACT_VOTE: {
            const { pollId } = action;
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [pollId]: {
                        ...state.polls[pollId],
                        showResults: false
                    }
                }
            };
        }
        case actionTypes_1.RESET_NB_UNREAD_POLLS: {
            return {
                ...state,
                nbUnreadPolls: 0
            };
        }
        case actionTypes_1.EDIT_POLL: {
            return {
                ...state,
                polls: {
                    ...state.polls,
                    [action.pollId]: {
                        ...state.polls[action.pollId],
                        editing: action.editing
                    }
                }
            };
        }
        default:
            return state;
    }
});
