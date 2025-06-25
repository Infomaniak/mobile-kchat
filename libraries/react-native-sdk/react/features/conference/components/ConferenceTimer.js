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
const react_redux_1 = require("react-redux");
const functions_1 = require("../../base/conference/functions");
const dateUtil_1 = require("../../base/i18n/dateUtil");
const index_1 = require("./index");
const ConferenceTimer = ({ textStyle }) => {
    const startTimestamp = (0, react_redux_1.useSelector)(functions_1.getConferenceTimestamp);
    const [timerValue, setTimerValue] = (0, react_1.useState)((0, dateUtil_1.getLocalizedDurationFormatter)(0));
    const interval = (0, react_1.useRef)();
    /**
     * Sets the current state values that will be used to render the timer.
     *
     * @param {number} refValueUTC - The initial UTC timestamp value.
     * @param {number} currentValueUTC - The current UTC timestamp value.
     *
     * @returns {void}
     */
    const setStateFromUTC = (0, react_1.useCallback)((refValueUTC, currentValueUTC) => {
        if (!refValueUTC || !currentValueUTC) {
            return;
        }
        if (currentValueUTC < refValueUTC) {
            return;
        }
        const timerMsValue = currentValueUTC - refValueUTC;
        const localizedTime = (0, dateUtil_1.getLocalizedDurationFormatter)(timerMsValue);
        setTimerValue(localizedTime);
    }, []);
    /**
     * Start conference timer.
     *
     * @returns {void}
     */
    const startTimer = (0, react_1.useCallback)(() => {
        if (!interval.current && startTimestamp) {
            setStateFromUTC(startTimestamp, new Date().getTime());
            interval.current = window.setInterval(() => {
                setStateFromUTC(startTimestamp, new Date().getTime());
            }, 1000);
        }
    }, [startTimestamp, interval]);
    /**
     * Stop conference timer.
     *
     * @returns {void}
     */
    const stopTimer = (0, react_1.useCallback)(() => {
        if (interval.current) {
            clearInterval(interval.current);
            interval.current = undefined;
        }
        setTimerValue((0, dateUtil_1.getLocalizedDurationFormatter)(0));
    }, [interval]);
    (0, react_1.useEffect)(() => {
        startTimer();
        return () => stopTimer();
    }, [startTimestamp]);
    if (!startTimestamp) {
        return null;
    }
    return (react_1.default.createElement(index_1.ConferenceTimerDisplay, { textStyle: textStyle, timerValue: timerValue }));
};
exports.default = ConferenceTimer;
