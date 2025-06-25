"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const timeFunctions_1 = require("../timeFunctions");
/**
 * React component for displaying total time elapsed. Converts a total count of
 * milliseconds into a more humanized form: "# hours, # minutes, # seconds".
 * With a time of 0, "0s" will be displayed.
 *
 * @augments Component
 */
const TimeElapsed = ({ time }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const timeElapsed = (0, timeFunctions_1.createLocalizedTime)(time, t);
    return (react_1.default.createElement("span", null, timeElapsed));
};
exports.default = TimeElapsed;
