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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const constants_web_1 = require("../../../base/ui/constants.web");
const actions_1 = require("../../actions");
const constants_1 = require("../../constants");
const AbstractPollCreate_1 = __importDefault(require("../AbstractPollCreate"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            height: '100%',
            position: 'relative'
        },
        createContainer: {
            padding: '0 24px',
            height: 'calc(100% - 88px)',
            overflowY: 'auto'
        },
        header: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            color: theme.palette.text01,
            margin: '24px 0 16px'
        },
        questionContainer: {
            paddingBottom: '24px',
            borderBottom: `1px solid ${theme.palette.ui03}`
        },
        answerList: {
            listStyleType: 'none',
            margin: 0,
            padding: 0
        },
        answer: {
            marginBottom: '24px'
        },
        removeOption: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.link01,
            marginTop: '8px',
            border: 0,
            background: 'transparent'
        },
        addButtonContainer: {
            display: 'flex'
        },
        footer: {
            position: 'absolute',
            bottom: 0,
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '24px',
            width: '100%',
            boxSizing: 'border-box'
        },
        buttonMargin: {
            marginRight: theme.spacing(3)
        }
    };
});
const PollCreate = ({ addAnswer, answers, editingPoll, editingPollId, isSubmitDisabled, onSubmit, question, removeAnswer, setAnswer, setCreateMode, setQuestion, t }) => {
    const { classes } = useStyles();
    const dispatch = (0, react_redux_1.useDispatch)();
    /*
     * This ref stores the Array of answer input fields, allowing us to focus on them.
     * This array is maintained by registerfieldRef and the useEffect below.
     */
    const answerInputs = (0, react_1.useRef)([]);
    const registerFieldRef = (0, react_1.useCallback)((i, r) => {
        if (r === null) {
            return;
        }
        answerInputs.current[i] = r;
    }, [answerInputs]);
    (0, react_1.useEffect)(() => {
        answerInputs.current = answerInputs.current.slice(0, answers.length);
    }, [answers]);
    /*
     * This state allows us to requestFocus asynchronously, without having to worry
     * about whether a newly created input field has been rendered yet or not.
     */
    const [lastFocus, requestFocus] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (lastFocus === null) {
            return;
        }
        const input = answerInputs.current[lastFocus];
        if (input === undefined) {
            return;
        }
        input.focus();
    }, [lastFocus]);
    const checkModifiers = (0, react_1.useCallback)(ev => {
        // Composition events used to add accents to characters
        // despite their absence from standard US keyboards,
        // to build up logograms of many Asian languages
        // from their base components or categories and so on.
        if (ev.isComposing || ev.keyCode === 229) {
            // keyCode 229 means that user pressed some button,
            // but input method is still processing that.
            // This is a standard behavior for some input methods
            // like entering japanese or сhinese hieroglyphs.
            return true;
        }
        // Because this isn't done automatically on MacOS
        if (ev.key === 'Enter' && ev.metaKey) {
            ev.preventDefault();
            onSubmit();
            return;
        }
        if (ev.ctrlKey || ev.metaKey || ev.altKey || ev.shiftKey) {
            return;
        }
    }, []);
    const onQuestionKeyDown = (0, react_1.useCallback)(ev => {
        if (checkModifiers(ev)) {
            return;
        }
        if (ev.key === 'Enter') {
            requestFocus(0);
            ev.preventDefault();
        }
    }, []);
    // Called on keypress in answer fields
    const onAnswerKeyDown = (0, react_1.useCallback)((i, ev) => {
        if (checkModifiers(ev)) {
            return;
        }
        if (ev.key === 'Enter') {
            // We add a new option input
            // only if we are on the last option input
            if (i === answers.length - 1) {
                addAnswer(i + 1);
            }
            requestFocus(i + 1);
            ev.preventDefault();
        }
        else if (ev.key === 'Backspace' && ev.target.value === '' && answers.length > 1) {
            removeAnswer(i);
            requestFocus(i > 0 ? i - 1 : 0);
            ev.preventDefault();
        }
        else if (ev.key === 'ArrowDown') {
            if (i === answers.length - 1) {
                addAnswer();
            }
            requestFocus(i + 1);
            ev.preventDefault();
        }
        else if (ev.key === 'ArrowUp') {
            if (i === 0) {
                addAnswer(0);
                requestFocus(0);
            }
            else {
                requestFocus(i - 1);
            }
            ev.preventDefault();
        }
    }, [answers, addAnswer, removeAnswer, requestFocus]);
    /* eslint-disable react/jsx-no-bind */
    return (react_1.default.createElement("form", { className: classes.container, onSubmit: onSubmit },
        react_1.default.createElement("div", { className: classes.createContainer },
            react_1.default.createElement("div", { className: classes.header }, t('polls.create.create')),
            react_1.default.createElement("div", { className: classes.questionContainer },
                react_1.default.createElement(Input_1.default, { autoFocus: true, id: 'polls-create-input', label: t('polls.create.pollQuestion'), maxLength: constants_1.CHAR_LIMIT, onChange: setQuestion, onKeyPress: onQuestionKeyDown, placeholder: t('polls.create.questionPlaceholder'), textarea: true, value: question })),
            react_1.default.createElement("ol", { className: classes.answerList }, answers.map((answer, i) => {
                const isIdenticalAnswer = answers.slice(0, i).length === 0 ? false
                    : answers.slice(0, i).some(prevAnswer => prevAnswer.name === answer.name
                        && prevAnswer.name !== '' && answer.name !== '');
                return (react_1.default.createElement("li", { className: classes.answer, key: i },
                    react_1.default.createElement(Input_1.default, { bottomLabel: (isIdenticalAnswer ? t('polls.errors.notUniqueOption', { index: i + 1 }) : ''), error: isIdenticalAnswer, id: `polls-answer-input-${i}`, label: t('polls.create.pollOption', { index: i + 1 }), maxLength: constants_1.CHAR_LIMIT, onChange: name => setAnswer(i, {
                            name,
                            voters: []
                        }), onKeyPress: ev => onAnswerKeyDown(i, ev), placeholder: t('polls.create.answerPlaceholder', { index: i + 1 }), ref: r => registerFieldRef(i, r), textarea: true, value: answer.name }),
                    answers.length > 2
                        && react_1.default.createElement("button", { className: classes.removeOption, onClick: () => removeAnswer(i), type: 'button' }, t('polls.create.removeOption'))));
            })),
            react_1.default.createElement("div", { className: classes.addButtonContainer },
                react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.create.addOption'), disabled: answers.length >= constants_1.ANSWERS_LIMIT, labelKey: 'polls.create.addOption', onClick: () => {
                        addAnswer();
                        requestFocus(answers.length);
                    }, type: constants_web_1.BUTTON_TYPES.SECONDARY }))),
        react_1.default.createElement("div", { className: classes.footer },
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.create.cancel'), className: classes.buttonMargin, labelKey: 'polls.create.cancel', onClick: () => {
                    setCreateMode(false);
                    editingPollId
                        && editingPoll?.editing
                        && dispatch((0, actions_1.editPoll)(editingPollId, false));
                }, type: constants_web_1.BUTTON_TYPES.SECONDARY }),
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.create.save'), disabled: isSubmitDisabled, isSubmit: true, labelKey: 'polls.create.save' }))));
};
/*
 * We apply AbstractPollCreate to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollCreate_1.default)(PollCreate);
