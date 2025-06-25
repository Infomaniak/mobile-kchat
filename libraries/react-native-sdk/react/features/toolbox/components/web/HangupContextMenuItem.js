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
exports.HangupContextMenuItem = void 0;
const react_1 = __importStar(require("react"));
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const types_1 = require("../../types");
/**
 * Implementation of a button to be rendered within Hangup context menu.
 *
 * @param {Object} props - Component's props.
 * @returns {JSX.Element} - Button that would trigger the hangup action.
 */
const HangupContextMenuItem = (props) => {
    const shouldNotify = props.notifyMode !== undefined;
    const shouldPreventExecution = props.notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY;
    const _onClick = (0, react_1.useCallback)(() => {
        if (shouldNotify) {
            APP.API.notifyToolbarButtonClicked(props.buttonKey, shouldPreventExecution);
        }
        if (!shouldPreventExecution) {
            props.onClick();
        }
    }, []);
    return (react_1.default.createElement(Button_1.default, { accessibilityLabel: props.accessibilityLabel, fullWidth: true, label: props.label, onClick: _onClick, type: props.buttonType }));
};
exports.HangupContextMenuItem = HangupContextMenuItem;
