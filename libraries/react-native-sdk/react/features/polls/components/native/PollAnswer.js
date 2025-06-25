"use strict";
/* eslint-disable react/jsx-no-bind */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Switch_1 = __importDefault(require("../../../base/ui/components/native/Switch"));
const constants_native_1 = require("../../../base/ui/constants.native");
const actions_1 = require("../../actions");
const functions_2 = require("../../functions");
const AbstractPollAnswer_1 = __importDefault(require("../AbstractPollAnswer"));
const styles_1 = require("./styles");
const PollAnswer = (props) => {
    const { checkBoxStates, poll, pollId, sendPoll, setCheckbox, setCreateMode, skipAnswer, skipChangeVote, submitAnswer, t } = props;
    const { changingVote, saved: pollSaved } = poll;
    const dispatch = (0, react_redux_1.useDispatch)();
    const localParticipant = (0, react_redux_1.useSelector)(functions_1.getLocalParticipant);
    const { PRIMARY, SECONDARY } = constants_native_1.BUTTON_TYPES;
    return (<>
            <react_native_1.Text style={styles_1.dialogStyles.questionText}>{poll.question}</react_native_1.Text>
            <react_native_1.Text style={styles_1.dialogStyles.questionOwnerText}>{t('polls.by', { name: localParticipant?.name })}
            </react_native_1.Text>
            <react_native_1.View style={styles_1.chatStyles.answerContent}>
                {poll.answers.map((answer, index) => (<react_native_1.View key={index} style={styles_1.chatStyles.switchRow}>
                            <Switch_1.default checked={checkBoxStates[index]} disabled={poll.saved} onChange={state => setCheckbox(index, state)}/>
                            <react_native_1.Text style={styles_1.chatStyles.switchLabel}>
                                {answer.name}
                            </react_native_1.Text>
                        </react_native_1.View>))}
            </react_native_1.View>
            {pollSaved
            ? <react_native_1.View style={styles_1.chatStyles.buttonRow}>
                        <Button_1.default accessibilityLabel='polls.answer.edit' labelKey='polls.answer.edit' onClick={() => {
                    setCreateMode(true);
                    dispatch((0, actions_1.editPoll)(pollId, true));
                }} style={styles_1.chatStyles.pollCreateButton} type={SECONDARY}/>
                        <Button_1.default accessibilityLabel='polls.answer.send' labelKey='polls.answer.send' onClick={sendPoll} style={styles_1.chatStyles.pollCreateButton} type={PRIMARY}/>
                    </react_native_1.View>
            : <react_native_1.View style={styles_1.chatStyles.buttonRow}>
                        <Button_1.default accessibilityLabel='polls.answer.skip' labelKey='polls.answer.skip' onClick={changingVote ? skipChangeVote : skipAnswer} style={styles_1.chatStyles.pollCreateButton} type={SECONDARY}/>
                        <Button_1.default accessibilityLabel='polls.answer.submit' disabled={(0, functions_2.isSubmitAnswerDisabled)(checkBoxStates)} labelKey='polls.answer.submit' onClick={submitAnswer} style={styles_1.chatStyles.pollCreateButton} type={PRIMARY}/>
                    </react_native_1.View>}
        </>);
};
/*
 * We apply AbstractPollAnswer to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollAnswer_1.default)(PollAnswer);
