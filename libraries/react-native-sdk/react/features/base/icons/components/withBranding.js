"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const SvgXmlIcon_1 = __importDefault(require("./SvgXmlIcon"));
/**
 * Icon wrapper that checks for branding before returning the SVG component.
 *
 * @returns {JSX.Element}
 */
const withBranding = ({ DefaultIcon, iconName }) => (props) => {
    const src = (0, react_redux_1.useSelector)((state) => state['features/dynamic-branding']?.brandedIcons?.[iconName]);
    if (src) {
        return (react_1.default.createElement(SvgXmlIcon_1.default, { src: src, ...props }));
    }
    return react_1.default.createElement(DefaultIcon, { ...props });
};
exports.default = withBranding;
