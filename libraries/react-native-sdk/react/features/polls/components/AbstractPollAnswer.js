"use strict";
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
const hooks_1 = require("../../base/util/hooks");
const actions_1 = require("../actions");
const constants_1 = require("../constants");
/**
 * Higher Order Component taking in a concrete PollAnswer component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
const AbstractPollAnswer = (Component) => (props) => {
    const { pollId, setCreateMode } = props;
    const conference = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference);
    const poll = (0, react_redux_1.useSelector)((state) => state['features/polls'].polls[pollId]);
    const { answers, lastVote, question, senderId } = poll;
    const [checkBoxStates, setCheckBoxState] = (0, react_1.useState)(() => {
        if (lastVote !== null) {
            return [...lastVote];
        }
        return new Array(answers.length).fill(false);
    });
    const participantName = (0, hooks_1.useBoundSelector)(functions_2.getParticipantDisplayName, senderId);
    const setCheckbox = (0, react_1.useCallback)((index, state) => {
        const newCheckBoxStates = [...checkBoxStates];
        newCheckBoxStates[index] = state;
        setCheckBoxState(newCheckBoxStates);
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('vote.checked'));
    }, [checkBoxStates]);
    const dispatch = (0, react_redux_1.useDispatch)();
    const submitAnswer = (0, react_1.useCallback)(() => {
        conference.sendMessage({
            type: constants_1.COMMAND_ANSWER_POLL,
            pollId,
            answers: checkBoxStates
        });
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('vote.sent'));
        dispatch((0, actions_1.registerVote)(pollId, checkBoxStates));
        return false;
    }, [pollId, checkBoxStates, conference]);
    const sendPoll = (0, react_1.useCallback)(() => {
        conference?.sendMessage({
            type: constants_1.COMMAND_NEW_POLL,
            pollId,
            question,
            answers: answers.map(answer => answer.name)
        });
        dispatch((0, actions_1.editPoll)(pollId, false));
    }, [conference, question, answers]);
    const skipAnswer = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.registerVote)(pollId, null));
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('vote.skipped'));
    }, [pollId]);
    const skipChangeVote = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.setVoteChanging)(pollId, false));
    }, [dispatch, pollId]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement(Component, { checkBoxStates: checkBoxStates, creatorName: participantName, poll: poll, pollId: pollId, sendPoll: sendPoll, setCheckbox: setCheckbox, setCreateMode: setCreateMode, skipAnswer: skipAnswer, skipChangeVote: skipChangeVote, submitAnswer: submitAnswer, t: t }));
};
exports.default = AbstractPollAnswer;
