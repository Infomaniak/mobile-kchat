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
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const Button_1 = __importDefault(require("../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const styles_1 = __importDefault(require("../../../settings/components/native/styles"));
const actions_1 = require("../../actions");
const constants_1 = require("../../constants");
const AbstractPollCreate_1 = __importDefault(require("../AbstractPollCreate"));
const styles_2 = require("./styles");
const PollCreate = (props) => {
    const { addAnswer, answers, editingPoll, editingPollId, isSubmitDisabled, onSubmit, question, removeAnswer, setAnswer, setCreateMode, setQuestion, t } = props;
    const answerListRef = (0, react_1.useRef)(null);
    const dispatch = (0, react_redux_1.useDispatch)();
    /*
     * This ref stores the Array of answer input fields, allowing us to focus on them.
     * This array is maintained by registerFieldRef and the useEffect below.
     */
    const answerInputs = (0, react_1.useRef)([]);
    const registerFieldRef = (0, react_1.useCallback)((i, input) => {
        if (input === null) {
            return;
        }
        answerInputs.current[i] = input;
    }, [answerInputs]);
    (0, react_1.useEffect)(() => {
        answerInputs.current = answerInputs.current.slice(0, answers.length);
    }, [answers]);
    /*
     * This state allows us to requestFocus asynchronously, without having to worry
     * about whether a newly created input field has been rendered yet or not.
     */
    const [lastFocus, requestFocus] = (0, react_1.useState)(null);
    const { PRIMARY, SECONDARY, TERTIARY } = constants_native_1.BUTTON_TYPES;
    (0, react_1.useEffect)(() => {
        if (lastFocus === null) {
            return;
        }
        const input = answerInputs.current[lastFocus];
        if (input === undefined) {
            return;
        }
        input.focus();
    }, [answerInputs, lastFocus]);
    const onQuestionKeyDown = (0, react_1.useCallback)(() => {
        answerInputs.current[0].focus();
    }, []);
    // Called on keypress in answer fields
    const onAnswerKeyDown = (0, react_1.useCallback)((index, ev) => {
        const { key } = ev.nativeEvent;
        const currentText = answers[index].name;
        if (key === 'Backspace' && currentText === '' && answers.length > 1) {
            removeAnswer(index);
            requestFocus(index > 0 ? index - 1 : 0);
        }
    }, [answers, addAnswer, removeAnswer, requestFocus]);
    /* eslint-disable react/no-multi-comp */
    const createRemoveOptionButton = (onPress) => (<Button_1.default labelKey='polls.create.removeOption' labelStyle={styles_2.dialogStyles.optionRemoveButtonText} onClick={onPress} style={styles_2.dialogStyles.optionRemoveButton} type={TERTIARY}/>);
    const pollCreateButtonsContainerStyles = react_native_1.Platform.OS === 'android'
        ? styles_2.chatStyles.pollCreateButtonsContainerAndroid : styles_2.chatStyles.pollCreateButtonsContainerIos;
    /* eslint-disable react/jsx-no-bind */
    const renderListItem = ({ index }) => {
        const isIdenticalAnswer = answers.slice(0, index).length === 0 ? false : answers.slice(0, index).some(prevAnswer => prevAnswer.name === answers[index].name
            && prevAnswer.name !== '' && answers[index].name !== '');
        return (<react_native_1.View style={styles_2.dialogStyles.optionContainer}>
                <Input_1.default blurOnSubmit={false} bottomLabel={(isIdenticalAnswer ? t('polls.errors.notUniqueOption', { index: index + 1 }) : '')} error={isIdenticalAnswer} id={`polls-answer-input-${index}`} label={t('polls.create.pollOption', { index: index + 1 })} maxLength={constants_1.CHAR_LIMIT} multiline={true} onChange={name => setAnswer(index, {
                name,
                voters: []
            })} onKeyPress={ev => onAnswerKeyDown(index, ev)} placeholder={t('polls.create.answerPlaceholder', { index: index + 1 })} 
        // This is set to help the touch event not be propagated to any subviews.
        pointerEvents={'auto'} ref={input => registerFieldRef(index, input)} value={answers[index].name}/>
                {answers.length > 2
                && createRemoveOptionButton(() => removeAnswer(index))}
            </react_native_1.View>);
    };
    return (<react_native_1.View style={styles_2.chatStyles.pollCreateContainer}>
            <react_native_1.View style={styles_2.chatStyles.pollCreateSubContainer}>
                <Input_1.default autoFocus={true} blurOnSubmit={false} customStyles={{ container: styles_2.dialogStyles.customContainer }} label={t('polls.create.pollQuestion')} maxLength={constants_1.CHAR_LIMIT} multiline={true} onChange={setQuestion} onSubmitEditing={onQuestionKeyDown} placeholder={t('polls.create.questionPlaceholder')} 
    // This is set to help the touch event not be propagated to any subviews.
    pointerEvents={'auto'} value={question}/>
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_1.default.fieldSeparator}/>
                <react_native_1.FlatList data={answers} extraData={answers} keyExtractor={(item, index) => index.toString()} ref={answerListRef} renderItem={renderListItem}/>
                <react_native_1.View style={pollCreateButtonsContainerStyles}>
                    <Button_1.default accessibilityLabel='polls.create.addOption' disabled={answers.length >= constants_1.ANSWERS_LIMIT} labelKey='polls.create.addOption' onClick={() => {
            // adding and answer
            addAnswer();
            requestFocus(answers.length);
        }} style={styles_2.chatStyles.pollCreateAddButton} type={SECONDARY}/>
                    <react_native_1.View style={styles_2.chatStyles.buttonRow}>
                        <Button_1.default accessibilityLabel='polls.create.cancel' labelKey='polls.create.cancel' onClick={() => {
            setCreateMode(false);
            editingPollId
                && editingPoll?.editing
                && dispatch((0, actions_1.editPoll)(editingPollId, false));
        }} style={styles_2.chatStyles.pollCreateButton} type={SECONDARY}/>
                        <Button_1.default accessibilityLabel='polls.create.save' disabled={isSubmitDisabled} labelKey='polls.create.save' onClick={onSubmit} style={styles_2.chatStyles.pollCreateButton} type={PRIMARY}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>
        </react_native_1.View>);
};
/*
 * We apply AbstractPollCreate to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollCreate_1.default)(PollCreate);
