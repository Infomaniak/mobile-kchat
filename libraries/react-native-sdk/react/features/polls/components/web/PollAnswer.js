"use strict";
/* eslint-disable react/jsx-no-bind */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Checkbox_1 = __importDefault(require("../../../base/ui/components/web/Checkbox"));
const constants_web_1 = require("../../../base/ui/constants.web");
const actions_1 = require("../../actions");
const functions_1 = require("../../functions");
const AbstractPollAnswer_1 = __importDefault(require("../AbstractPollAnswer"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            margin: '24px',
            padding: '16px',
            backgroundColor: theme.palette.ui02,
            borderRadius: '8px',
            wordBreak: 'break-word'
        },
        header: {
            marginBottom: '24px'
        },
        question: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            color: theme.palette.text01,
            marginBottom: '8px'
        },
        creator: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text02
        },
        answerList: {
            listStyleType: 'none',
            margin: 0,
            padding: 0,
            marginBottom: '24px'
        },
        answer: {
            display: 'flex',
            marginBottom: '16px'
        },
        footer: {
            display: 'flex',
            justifyContent: 'flex-end'
        },
        buttonMargin: {
            marginRight: theme.spacing(3)
        }
    };
});
const PollAnswer = ({ creatorName, checkBoxStates, poll, pollId, setCheckbox, setCreateMode, skipAnswer, skipChangeVote, sendPoll, submitAnswer, t }) => {
    const { changingVote, saved: pollSaved } = poll;
    const dispatch = (0, react_redux_1.useDispatch)();
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.container },
        react_1.default.createElement("div", { className: classes.header },
            react_1.default.createElement("div", { className: classes.question }, poll.question),
            react_1.default.createElement("div", { className: classes.creator }, t('polls.by', { name: creatorName }))),
        react_1.default.createElement("ul", { className: classes.answerList }, poll.answers.map((answer, index) => (react_1.default.createElement("li", { className: classes.answer, key: index },
            react_1.default.createElement(Checkbox_1.default, { checked: checkBoxStates[index], disabled: poll.saved, key: index, label: answer.name, onChange: ev => setCheckbox(index, ev.target.checked) }))))),
        react_1.default.createElement("div", { className: classes.footer }, pollSaved ? react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.answer.edit'), className: classes.buttonMargin, labelKey: 'polls.answer.edit', onClick: () => {
                    setCreateMode(true);
                    dispatch((0, actions_1.editPoll)(pollId, true));
                }, type: constants_web_1.BUTTON_TYPES.SECONDARY }),
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.answer.send'), labelKey: 'polls.answer.send', onClick: sendPoll })) : react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.answer.skip'), className: classes.buttonMargin, labelKey: 'polls.answer.skip', onClick: changingVote ? skipChangeVote : skipAnswer, type: constants_web_1.BUTTON_TYPES.SECONDARY }),
            react_1.default.createElement(Button_1.default, { accessibilityLabel: t('polls.answer.submit'), disabled: (0, functions_1.isSubmitAnswerDisabled)(checkBoxStates), labelKey: 'polls.answer.submit', onClick: submitAnswer })))));
};
/*
 * We apply AbstractPollAnswer to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollAnswer_1.default)(PollAnswer);
