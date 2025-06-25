"use strict";
/* eslint-disable arrow-body-style */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const functions_2 = require("../../base/participants/functions");
const actions_1 = require("../actions");
const functions_3 = require("../functions");
/**
 * Higher Order Component taking in a concrete PollCreate component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
const AbstractPollCreate = (Component) => (props) => {
    const { setCreateMode } = props;
    const pollState = (0, react_redux_1.useSelector)((state) => state['features/polls'].polls);
    const editingPoll = (0, react_1.useMemo)(() => {
        if (!pollState) {
            return null;
        }
        for (const key in pollState) {
            if (pollState.hasOwnProperty(key) && pollState[key].editing) {
                return [key, pollState[key]];
            }
        }
        return null;
    }, [pollState]);
    const answerResults = (0, react_1.useMemo)(() => {
        return editingPoll
            ? editingPoll[1].answers
            : [
                {
                    name: '',
                    voters: []
                },
                {
                    name: '',
                    voters: []
                }
            ];
    }, [editingPoll]);
    const questionResult = (0, react_1.useMemo)(() => {
        return editingPoll ? editingPoll[1].question : '';
    }, [editingPoll]);
    const [question, setQuestion] = (0, react_1.useState)(questionResult);
    const [answers, setAnswers] = (0, react_1.useState)(answerResults);
    const setAnswer = (0, react_1.useCallback)((i, answer) => {
        setAnswers(currentAnswers => {
            const newAnswers = [...currentAnswers];
            newAnswers[i] = answer;
            return newAnswers;
        });
    }, [answers]);
    const addAnswer = (0, react_1.useCallback)((i) => {
        const newAnswers = [...answers];
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('option.added'));
        newAnswers.splice(typeof i === 'number'
            ? i : answers.length, 0, {
            name: '',
            voters: []
        });
        setAnswers(newAnswers);
    }, [answers]);
    const removeAnswer = (0, react_1.useCallback)(i => {
        if (answers.length <= 2) {
            return;
        }
        const newAnswers = [...answers];
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('option.removed'));
        newAnswers.splice(i, 1);
        setAnswers(newAnswers);
    }, [answers]);
    const conference = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference);
    const dispatch = (0, react_redux_1.useDispatch)();
    const pollId = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER).toString(36);
    const localParticipant = (0, react_redux_1.useSelector)(functions_2.getLocalParticipant);
    const onSubmit = (0, react_1.useCallback)(ev => {
        if (ev) {
            ev.preventDefault();
        }
        const filteredAnswers = answers.filter(answer => answer.name.trim().length > 0);
        if (filteredAnswers.length < 2) {
            return;
        }
        const poll = {
            changingVote: false,
            senderId: localParticipant?.id,
            showResults: false,
            lastVote: null,
            question,
            answers: filteredAnswers,
            saved: false,
            editing: false
        };
        if (editingPoll) {
            dispatch((0, actions_1.savePoll)(editingPoll[0], poll, true));
        }
        else {
            dispatch((0, actions_1.savePoll)(pollId, poll, true));
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('created'));
        setCreateMode(false);
    }, [conference, question, answers]);
    // Check if the poll create form can be submitted i.e. if the send button should be disabled.
    const isSubmitDisabled = question.trim().length <= 0 // If no question is provided
        || answers.filter(answer => answer.name.trim().length > 0).length < 2 // If not enough options are provided
        || (0, functions_3.hasIdenticalAnswers)(answers); // If duplicate options are provided
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement(Component, { addAnswer: addAnswer, answers: answers, editingPoll: editingPoll?.[1], editingPollId: editingPoll?.[0], isSubmitDisabled: isSubmitDisabled, onSubmit: onSubmit, question: question, removeAnswer: removeAnswer, setAnswer: setAnswer, setCreateMode: setCreateMode, setQuestion: setQuestion, t: t }));
};
exports.default = AbstractPollCreate;
