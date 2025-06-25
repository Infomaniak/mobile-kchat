"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const BaseTheme_native_1 = __importDefault(require("../../../../base/ui/components/BaseTheme.native"));
/**
 * Implements an end meeting icon.
 *
 * @returns {JSX.Element} - The end meeting icon.
 */
const EndMeetingIcon = () => (<Icon_1.default color={BaseTheme_native_1.default.palette.icon01} size={20} src={svg_1.IconHangup}/>);
exports.default = EndMeetingIcon;
