"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/conference/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Tooltip_1 = __importDefault(require("../../../base/tooltip/components/Tooltip"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegular),
            color: theme.palette.text01,
            padding: '2px 16px',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            maxWidth: '324px',
            boxSizing: 'border-box',
            height: '28px',
            borderRadius: `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px`,
            marginLeft: '2px',
            '@media (max-width: 300px)': {
                display: 'none'
            }
        },
        content: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
});
/**
 * Label for the conference name.
 *
 * @returns {ReactElement}
 */
const SubjectText = () => {
    const subject = (0, react_redux_1.useSelector)(functions_1.getConferenceName);
    const { classes } = useStyles();
    return (react_1.default.createElement(Tooltip_1.default, { content: subject, position: 'bottom' },
        react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement("div", { className: (0, clsx_1.default)('subject-text--content', classes.content) }, subject))));
};
exports.default = SubjectText;
