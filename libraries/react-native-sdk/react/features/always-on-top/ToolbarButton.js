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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Icon_1 = __importDefault(require("../base/icons/components/Icon"));
const ToolbarButton = ({ accessibilityLabel, customClass, disabled = false, onClick, icon, toggled = false }) => {
    const onKeyPress = (0, react_1.useCallback)(event => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    }, [onClick]);
    return (react_1.default.createElement("div", { "aria-disabled": disabled, "aria-label": accessibilityLabel, "aria-pressed": toggled, className: `toolbox-button ${disabled ? ' disabled' : ''}`, onClick: disabled ? undefined : onClick, onKeyPress: disabled ? undefined : onKeyPress, role: 'button', tabIndex: 0 },
        react_1.default.createElement("div", { className: `toolbox-icon ${disabled ? 'disabled' : ''} ${customClass ?? ''}` },
            react_1.default.createElement(Icon_1.default, { src: icon }))));
};
exports.default = ToolbarButton;
