"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../base/styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        timer: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text01,
            padding: '6px 8px',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            boxSizing: 'border-box',
            height: '28px',
            borderRadius: `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
            marginRight: '2px',
            '@media (max-width: 300px)': {
                display: 'none'
            }
        }
    };
});
/**
 * Returns web element to be rendered.
 *
 * @returns {ReactElement}
 */
function ConferenceTimerDisplay({ timerValue, textStyle: _textStyle }) {
    const { classes } = useStyles();
    return (react_1.default.createElement("span", { className: classes.timer }, timerValue));
}
exports.default = ConferenceTimerDisplay;
