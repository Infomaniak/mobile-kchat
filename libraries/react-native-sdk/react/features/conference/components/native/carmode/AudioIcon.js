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
 * React component for Audio icon.
 *
 * @returns {JSX.Element} - The Audio icon.
 */
const AudioIcon = () => (<Icon_1.default color={BaseTheme_native_1.default.palette.ui02} size={20} src={svg_1.IconVolumeUp}/>);
exports.default = AudioIcon;
