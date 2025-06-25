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
const Input_1 = __importDefault(require("../../../../base/ui/components/web/Input"));
const constants_1 = require("../../../../room-lock/constants");
/**
 * React {@code Component} for displaying and editing the conference password.
 *
 * @returns {ReactElement}
 */
function PasswordForm({ editEnabled, locked, onSubmit, password, passwordNumberOfDigits, visible }) {
    const { t } = (0, react_i18next_1.useTranslation)();
    const [enteredPassword, setEnteredPassword] = (0, react_1.useState)('');
    const onKeyPress = (0, react_1.useCallback)(event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onSubmit(enteredPassword);
        }
    }, [onSubmit, enteredPassword]);
    if (!editEnabled && enteredPassword && enteredPassword !== '') {
        setEnteredPassword('');
    }
    const placeHolderText = passwordNumberOfDigits ? t('passwordDigitsOnly', { number: passwordNumberOfDigits }) : t('dialog.password');
    return (react_1.default.createElement("div", { className: 'info-password' },
        locked && react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("span", { className: 'info-label' }, t('info.password')),
            react_1.default.createElement("span", { className: 'spacer' }, "\u00A0"),
            react_1.default.createElement("span", { className: 'info-password-field info-value' }, locked === constants_1.LOCKED_LOCALLY ? (react_1.default.createElement("div", { className: 'info-password-local' }, visible ? password : '******')) : (react_1.default.createElement("div", { className: 'info-password-remote' }, t('passwordSetRemotely'))))),
        editEnabled && react_1.default.createElement("div", { className: 'info-password-form' },
            react_1.default.createElement(Input_1.default, { accessibilityLabel: t('info.addPassword'), autoFocus: true, id: 'info-password-input', maxLength: passwordNumberOfDigits, mode: passwordNumberOfDigits ? 'numeric' : undefined, onChange: setEnteredPassword, onKeyPress: onKeyPress, placeholder: placeHolderText, type: 'password', value: enteredPassword }))));
}
exports.default = PasswordForm;
