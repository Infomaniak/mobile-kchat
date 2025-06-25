"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const AbstractPollResults_1 = __importDefault(require("../AbstractPollResults"));
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
            marginBottom: '16px'
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
        resultList: {
            listStyleType: 'none',
            margin: 0,
            padding: 0,
            '& li': {
                marginBottom: '16px'
            }
        },
        answerName: {
            display: 'flex',
            flexShrink: 1,
            overflowWrap: 'anywhere',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01,
            marginBottom: '4px'
        },
        answerResultContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            minWidth: '10em'
        },
        barContainer: {
            backgroundColor: theme.palette.ui03,
            borderRadius: '4px',
            height: '6px',
            maxWidth: '160px',
            width: '158px',
            flexGrow: 1,
            marginTop: '2px'
        },
        bar: {
            height: '6px',
            borderRadius: '4px',
            backgroundColor: theme.palette.action01
        },
        voteCount: {
            flex: 1,
            textAlign: 'right',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            color: theme.palette.text01
        },
        voters: {
            margin: 0,
            marginTop: '4px',
            listStyleType: 'none',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: theme.palette.ui03,
            borderRadius: theme.shape.borderRadius,
            padding: '8px 16px',
            '& li': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
                color: theme.palette.text01,
                margin: 0,
                marginBottom: '2px',
                '&:last-of-type': {
                    marginBottom: 0
                }
            }
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'space-between',
            '& button': {
                border: 0,
                backgroundColor: 'transparent',
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
                color: theme.palette.link01
            }
        }
    };
});
/**
 * Component that renders the poll results.
 *
 * @param {Props} props - The passed props.
 * @returns {React.Node}
 */
const PollResults = ({ answers, changeVote, creatorName, haveVoted, showDetails, question, t, toggleIsDetailed }) => {
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.container },
        react_1.default.createElement("div", { className: classes.header },
            react_1.default.createElement("div", { className: classes.question }, question),
            react_1.default.createElement("div", { className: classes.creator }, t('polls.by', { name: creatorName }))),
        react_1.default.createElement("ul", { className: classes.resultList }, answers.map(({ name, percentage, voters, voterCount }, index) => (react_1.default.createElement("li", { key: index },
            react_1.default.createElement("div", { className: classes.answerName }, name),
            react_1.default.createElement("div", { className: classes.answerResultContainer },
                react_1.default.createElement("span", { className: classes.barContainer },
                    react_1.default.createElement("div", { className: classes.bar, style: { width: `${percentage}%` } })),
                react_1.default.createElement("div", { className: classes.voteCount },
                    voterCount,
                    " (",
                    percentage,
                    "%)")),
            showDetails && voters && voterCount > 0
                && react_1.default.createElement("ul", { className: classes.voters }, voters.map(voter => react_1.default.createElement("li", { key: voter?.id }, voter?.name))))))),
        react_1.default.createElement("div", { className: classes.buttonsContainer },
            react_1.default.createElement("button", { onClick: toggleIsDetailed }, showDetails ? t('polls.results.hideDetailedResults') : t('polls.results.showDetailedResults')),
            react_1.default.createElement("button", { onClick: changeVote }, haveVoted ? t('polls.results.changeVote') : t('polls.results.vote')))));
};
/*
 * We apply AbstractPollResults to fill in the AbstractProps common
 * to both the web and native implementations.
 */
// eslint-disable-next-line new-cap
exports.default = (0, AbstractPollResults_1.default)(PollResults);
