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
const functions_3 = require("../functions");
/**
 * Higher Order Component taking in a concrete PollResult component and
 * augmenting it with state/behavior common to both web and native implementations.
 *
 * @param {React.AbstractComponent} Component - The concrete component.
 * @returns {React.AbstractComponent}
 */
const AbstractPollResults = (Component) => (props) => {
    const { pollId } = props;
    const pollDetails = (0, react_redux_1.useSelector)((0, functions_3.getPoll)(pollId));
    const participant = (0, hooks_1.useBoundSelector)(functions_2.getParticipantById, pollDetails.senderId);
    const reduxState = (0, react_redux_1.useSelector)((state) => state);
    const [showDetails, setShowDetails] = (0, react_1.useState)(false);
    const toggleIsDetailed = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('vote.detailsViewed'));
        setShowDetails(details => !details);
    }, []);
    const answers = (0, react_1.useMemo)(() => {
        const allVoters = new Set();
        // Getting every voters ID that participates to the poll
        for (const answer of pollDetails.answers) {
            // checking if the voters is an array for supporting old structure model
            const voters = answer.voters.length ? answer.voters : Object.keys(answer.voters);
            voters.forEach((voter) => allVoters.add(voter));
        }
        return pollDetails.answers.map(answer => {
            const nrOfVotersPerAnswer = answer.voters ? Object.keys(answer.voters).length : 0;
            const percentage = allVoters.size > 0 ? Math.round(nrOfVotersPerAnswer / allVoters.size * 100) : 0;
            let voters;
            if (showDetails && answer.voters) {
                const answerVoters = answer.voters?.length ? [...answer.voters] : Object.keys({ ...answer.voters });
                voters = answerVoters.map(id => {
                    return {
                        id,
                        name: (0, functions_2.getParticipantDisplayName)(reduxState, id)
                    };
                });
            }
            return {
                name: answer.name,
                percentage,
                voters,
                voterCount: nrOfVotersPerAnswer
            };
        });
    }, [pollDetails.answers, showDetails]);
    const dispatch = (0, react_redux_1.useDispatch)();
    const changeVote = (0, react_1.useCallback)(() => {
        dispatch((0, actions_1.setVoteChanging)(pollId, true));
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createPollEvent)('vote.changed'));
    }, [dispatch, pollId]);
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement(Component, { answers: answers, changeVote: changeVote, creatorName: participant ? participant.name : '', haveVoted: pollDetails.lastVote !== null, question: pollDetails.question, showDetails: showDetails, t: t, toggleIsDetailed: toggleIsDetailed }));
};
exports.default = AbstractPollResults;
