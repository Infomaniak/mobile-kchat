"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
/**
 * Returns native element to be rendered.
 *
 * @param {Object} props - Component props.
 *
 * @returns {ReactElement}
 */
function ConferenceTimerDisplay({ timerValue, textStyle }) {
    return (<react_native_1.Text numberOfLines={1} style={textStyle}>
            {timerValue}
        </react_native_1.Text>);
}
exports.default = ConferenceTimerDisplay;
