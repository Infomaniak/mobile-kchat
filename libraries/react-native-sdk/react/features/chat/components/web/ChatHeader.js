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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const actions_web_1 = require("../../actions.web");
/**
 * Custom header of the {@code ChatDialog}.
 *
 * @returns {React$Element<any>}
 */
function ChatHeader({ className, isPollsEnabled }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { t } = (0, react_i18next_1.useTranslation)();
    const onCancel = (0, react_1.useCallback)(() => {
        dispatch((0, actions_web_1.toggleChat)());
    }, []);
    const onKeyPressHandler = (0, react_1.useCallback)(e => {
        if (onCancel && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onCancel();
        }
    }, []);
    return (react_1.default.createElement("div", { className: className || 'chat-dialog-header' },
        react_1.default.createElement("span", { "aria-level": 1, role: 'heading' }, t(isPollsEnabled ? 'chat.titleWithPolls' : 'chat.title')),
        react_1.default.createElement(Icon_1.default, { ariaLabel: t('toolbar.closeChat'), onClick: onCancel, onKeyPress: onKeyPressHandler, role: 'button', src: svg_1.IconCloseLarge, tabIndex: 0 })));
}
exports.default = ChatHeader;
