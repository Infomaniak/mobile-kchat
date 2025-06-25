"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_paper_1 = require("react-native-paper");
const switchStyles_1 = require("./switchStyles");
const Switch = ({ checked, disabled, onChange, thumbColor = switchStyles_1.THUMB_COLOR, trackColor = {
    true: switchStyles_1.ENABLED_TRACK_COLOR,
    false: switchStyles_1.DISABLED_TRACK_COLOR
}, style }) => (<react_native_paper_1.Switch disabled={disabled} ios_backgroundColor={switchStyles_1.DISABLED_TRACK_COLOR} onValueChange={onChange} style={style} thumbColor={thumbColor} trackColor={trackColor} value={checked}/>);
exports.default = Switch;
