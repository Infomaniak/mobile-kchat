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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const constants_native_1 = require("../../../base/ui/constants.native");
const AbstractPollResults_1 = __importDefault(require("../AbstractPollResults"));
const styles_1 = require("./styles");
/**
 * Component that renders the poll results.
 *
 * @param {Props} props - The passed props.
 * @returns {React.Node}
 */
const PollResults = (props) => {
    const { answers, changeVote, creatorName, haveVoted, question, showDetails, t, toggleIsDetailed } = props;
    /**
     * Render a header summing up answer information.
     *
     * @param {string} answer - The name of the answer.
     * @param {number} percentage - The percentage of voters.
     * @param {number} nbVotes - The number of collected votes.
     * @returns {React.Node}
     */
    const renderHeader = (answer, percentage, nbVotes) => (<react_native_1.View style={styles_1.resultsStyles.answerHeader}>
            <react_native_1.Text style={styles_1.resultsStyles.answer}>{answer}</react_native_1.Text>
            <react_native_1.View>
                <react_native_1.Text style={styles_1.resultsStyles.answer}>({nbVotes}) {percentage}%</react_native_1.Text>
            </react_native_1.View>
        </react_native_1.View>);
    /**
     * Render voters of and answer.
     *
     * @param {AnswerInfo} answer - The answer info.
     * @returns {React.Node}
     */
    const renderRow = (0, react_1.useCallback)((answer) => {
        const { name, percentage, voters, voterCount } = answer;
        if (showDetails) {
            return (<react_native_1.View style={styles_1.resultsStyles.answerContainer}>
                    {renderHeader(name, percentage, voterCount)}
                    <react_native_1.View style={styles_1.resultsStyles.barContainer}>
                        <react_native_1.View style={[styles_1.resultsStyles.bar, { width: `${percentage}%` }]}/>
                    </react_native_1.View>
                    {voters && voterCount > 0
                    && <react_native_1.View style={styles_1.resultsStyles.voters}>
                            {/* @ts-ignore */}
                            {voters.map(({ id, name: voterName }) => (<react_native_1.Text key={id} style={styles_1.resultsStyles.voter}>
                                    {voterName}
                                </react_native_1.Text>))}
                        </react_native_1.View>}
                </react_native_1.View>);
        }
        // else, we display a simple list
        // We add a progress bar by creating an empty view of width equal to percentage.
        return (<react_native_1.View style={styles_1.resultsStyles.answerContainer}>
                {renderHeader(answer.name, percentage, voterCount)}
                <react_native_1.View style={styles_1.resultsStyles.barContainer}>
                    <react_native_1.View style={[styles_1.resultsStyles.bar, { width: `${percentage}%` }]}/>
                </react_native_1.View>
            </react_native_1.View>);
    }, [showDetails]);
    /* eslint-disable react/jsx-no-bind */
    return (<react_native_1.View>
            <react_native_1.Text style={styles_1.dialogStyles.questionText}>{question}</react_native_1.Text>
            <react_native_1.Text style={styles_1.dialogStyles.questionOwnerText}>
                {t('polls.by', { name: creatorName })}
            </react_native_1.Text>
            <react_native_1.FlatList data={answers} keyExtractor={(item, index) => index.toString()} renderItem={answer => renderRow(answer.item)}/>
            <react_native_1.View style={styles_1.chatStyles.bottomLinks}>
                <Button_1.default labelKey={showDetails
            ? 'polls.results.hideDetailedResults'
            : 'polls.results.showDetailedResults'} labelStyle={styles_1.chatStyles.toggleText} onClick={toggleIsDetailed} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                <Button_1.default labelKey={haveVoted
            ? 'polls.results.changeVote'
            : 'polls.results.vote'} labelStyle={styles_1.chatStyles.toggleText} onClick={changeVote} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
            </react_native_1.View>
        </react_native_1.View>);
};
/*
 * We apply AbstractPollResults to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollResults_1.default)(PollResults);
