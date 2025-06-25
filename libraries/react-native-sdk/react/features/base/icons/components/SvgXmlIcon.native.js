"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_svg_1 = require("react-native-svg");
/**
 * SVG rendering component.
 *
 * @returns {JSX.Element}
 */
const SvgXmlIcon = ({ src, ...rest }) => (<react_native_svg_1.SvgFromXml override={rest} xml={src}/>);
exports.default = SvgXmlIcon;
