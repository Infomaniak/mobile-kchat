"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_1 = require("../base/sounds/actions");
const constants_1 = require("../chat/constants");
const functions_any_1 = require("../conference/functions.any");
const actions_2 = require("../notifications/actions");
const constants_2 = require("../notifications/constants");
const actionTypes_2 = require("./actionTypes");
const actions_3 = require("./actions");
const constants_3 = require("./constants");
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed, e.g. Clear messages or close the chat modal if it's left
 * open.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (conference !== previousConference) {
        // conference changed, left or failed...
        // clean old polls
        dispatch((0, actions_3.clearPolls)());
    }
});
const parsePollData = (pollData) => {
    if (typeof pollData !== 'object' || pollData === null) {
        return null;
    }
    const { id, senderId, question, answers } = pollData;
    if (typeof id !== 'string' || typeof senderId !== 'string'
        || typeof question !== 'string' || !(answers instanceof Array)) {
        return null;
    }
    return {
        changingVote: false,
        senderId,
        question,
        showResults: true,
        lastVote: null,
        answers,
        saved: false,
        editing: false
    };
};
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.ENDPOINT_MESSAGE_RECEIVED: {
            const { participant, data } = action;
            const isNewPoll = data.type === constants_3.COMMAND_NEW_POLL;
            _handleReceivePollsMessage({
                ...data,
                senderId: isNewPoll ? participant.getId() : undefined,
                voterId: isNewPoll ? undefined : participant.getId()
            }, dispatch, getState);
            break;
        }
        case actionTypes_1.NON_PARTICIPANT_MESSAGE_RECEIVED: {
            const { id, json: data } = action;
            const isNewPoll = data.type === constants_3.COMMAND_NEW_POLL;
            _handleReceivePollsMessage({
                ...data,
                senderId: isNewPoll ? id : undefined,
                voterId: isNewPoll ? undefined : id
            }, dispatch, getState);
            break;
        }
        case actionTypes_2.RECEIVE_POLL: {
            const state = getState();
            if ((0, functions_any_1.arePollsDisabled)(state)) {
                break;
            }
            const isChatOpen = state['features/chat'].isOpen;
            const isPollsTabFocused = state['features/chat'].isPollsTabFocused;
            // Finally, we notify user they received a new poll if their pane is not opened
            if (action.notify && (!isChatOpen || !isPollsTabFocused)) {
                dispatch((0, actions_1.playSound)(constants_1.INCOMING_MSG_SOUND_ID));
            }
            break;
        }
    }
    return result;
});
/**
 * Handles receiving of polls message command.
 *
 * @param {Object} data - The json data carried by the polls message.
 * @param {Function} dispatch - The dispatch function.
 * @param {Function} getState - The getState function.
 *
 * @returns {void}
 */
function _handleReceivePollsMessage(data, dispatch, getState) {
    if ((0, functions_any_1.arePollsDisabled)(getState())) {
        return;
    }
    switch (data.type) {
        case constants_3.COMMAND_NEW_POLL: {
            const { pollId, answers, senderId, question } = data;
            const poll = {
                changingVote: false,
                senderId,
                showResults: false,
                lastVote: null,
                question,
                answers: answers.map((answer) => {
                    return {
                        name: answer,
                        voters: []
                    };
                }),
                saved: false,
                editing: false
            };
            dispatch((0, actions_3.receivePoll)(pollId, poll, true));
            dispatch((0, actions_2.showNotification)({
                appearance: constants_2.NOTIFICATION_TYPE.NORMAL,
                titleKey: 'polls.notification.title',
                descriptionKey: 'polls.notification.description'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            break;
        }
        case constants_3.COMMAND_ANSWER_POLL: {
            const { pollId, answers, voterId } = data;
            const receivedAnswer = {
                voterId,
                pollId,
                answers
            };
            dispatch((0, actions_3.receiveAnswer)(pollId, receivedAnswer));
            break;
        }
        case constants_3.COMMAND_OLD_POLLS: {
            const { polls } = data;
            for (const pollData of polls) {
                const poll = parsePollData(pollData);
                if (poll === null) {
                    console.warn('[features/polls] Invalid old poll data');
                }
                else {
                    dispatch((0, actions_3.receivePoll)(pollData.id, poll, false));
                }
            }
            break;
        }
    }
}
