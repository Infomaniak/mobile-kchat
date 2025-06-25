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
/* eslint-disable react/jsx-no-bind */
const react_1 = __importStar(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/conference/actions");
const functions_1 = require("../../../../base/participants/functions");
const copyText_web_1 = require("../../../../base/util/copyText.web");
const constants_1 = require("../../../../room-lock/constants");
const types_1 = require("../../../../toolbox/types");
const PasswordForm_1 = __importDefault(require("./PasswordForm"));
const DIGITS_ONLY = /^\d+$/;
const KEY = 'add-passcode';
/**
 * Component that handles the password manipulation from the invite dialog.
 *
 * @returns {React$Element<any>}
 */
function PasswordSection() {
    const { t } = (0, react_i18next_1.useTranslation)();
    const dispatch = (0, react_redux_1.useDispatch)();
    const canEditPassword = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const passwordNumberOfDigits = (0, react_redux_1.useSelector)((state) => state['features/base/config'].roomPasswordNumberOfDigits);
    const conference = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].conference);
    const locked = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].locked);
    const password = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].password);
    const formRef = (0, react_1.useRef)(null);
    const [passwordVisible, setPasswordVisible] = (0, react_1.useState)(false);
    const buttonsWithNotifyClick = (0, react_redux_1.useSelector)((state) => state['features/toolbox'].buttonsWithNotifyClick);
    const [passwordEditEnabled, setPasswordEditEnabled] = (0, react_1.useState)(false);
    if (passwordEditEnabled && (password || locked)) {
        setPasswordEditEnabled(false);
    }
    const onPasswordSubmit = (0, react_1.useCallback)((enteredPassword) => {
        if (enteredPassword && passwordNumberOfDigits && !DIGITS_ONLY.test(enteredPassword)) {
            // Don't set the password.
            return;
        }
        dispatch((0, actions_1.setPassword)(conference, conference?.lock, enteredPassword));
    }, [dispatch, passwordNumberOfDigits, conference?.lock]);
    const onTogglePasswordEditState = (0, react_1.useCallback)(() => {
        if (typeof APP === 'undefined' || !buttonsWithNotifyClick?.size) {
            setPasswordEditEnabled(!passwordEditEnabled);
            return;
        }
        const notifyMode = buttonsWithNotifyClick?.get(KEY);
        if (notifyMode) {
            APP.API.notifyToolbarButtonClicked(KEY, notifyMode === types_1.NOTIFY_CLICK_MODE.PREVENT_AND_NOTIFY);
        }
        if (!notifyMode || notifyMode === types_1.NOTIFY_CLICK_MODE.ONLY_NOTIFY) {
            setPasswordEditEnabled(!passwordEditEnabled);
        }
    }, [buttonsWithNotifyClick, setPasswordEditEnabled, passwordEditEnabled]);
    const onPasswordSave = (0, react_1.useCallback)(() => {
        if (formRef.current) {
            // @ts-ignore
            const { value } = formRef.current.querySelector('div > input');
            if (value) {
                onPasswordSubmit(value);
            }
        }
    }, [formRef.current, onPasswordSubmit]);
    const onPasswordRemove = (0, react_1.useCallback)(() => {
        onPasswordSubmit('');
    }, [onPasswordSubmit]);
    const onPasswordCopy = (0, react_1.useCallback)(() => {
        (0, copyText_web_1.copyText)(password ?? '');
    }, [password]);
    const onPasswordShow = (0, react_1.useCallback)(() => {
        setPasswordVisible(true);
    }, [setPasswordVisible]);
    const onPasswordHide = (0, react_1.useCallback)(() => {
        setPasswordVisible(false);
    }, [setPasswordVisible]);
    let actions = null;
    if (canEditPassword) {
        if (passwordEditEnabled) {
            actions = (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("button", { className: 'as-link', onClick: onTogglePasswordEditState, type: 'button' },
                    t('dialog.Cancel'),
                    react_1.default.createElement("span", { className: 'sr-only' },
                        "(",
                        t('dialog.password'),
                        ")")),
                react_1.default.createElement("button", { className: 'as-link', onClick: onPasswordSave, type: 'button' },
                    t('dialog.add'),
                    react_1.default.createElement("span", { className: 'sr-only' },
                        "(",
                        t('dialog.password'),
                        ")"))));
        }
        else if (locked) {
            actions = (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("button", { className: 'remove-password as-link', onClick: onPasswordRemove, type: 'button' },
                    t('dialog.Remove'),
                    react_1.default.createElement("span", { className: 'sr-only' },
                        "(",
                        t('dialog.password'),
                        ")")),
                // There are cases like lobby and grant moderator when password is not available
                password ? react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("button", { className: 'copy-password as-link', onClick: onPasswordCopy, type: 'button' },
                        t('dialog.copy'),
                        react_1.default.createElement("span", { className: 'sr-only' },
                            "(",
                            t('dialog.password'),
                            ")"))) : null,
                locked === constants_1.LOCKED_LOCALLY && (react_1.default.createElement("button", { className: 'as-link', onClick: passwordVisible ? onPasswordHide : onPasswordShow, type: 'button' },
                    t(passwordVisible ? 'dialog.hide' : 'dialog.show'),
                    react_1.default.createElement("span", { className: 'sr-only' },
                        "(",
                        t('dialog.password'),
                        ")")))));
        }
        else {
            actions = (react_1.default.createElement("button", { className: 'add-password as-link', onClick: onTogglePasswordEditState, type: 'button' }, t('info.addPassword')));
        }
    }
    return (react_1.default.createElement("div", { className: 'security-dialog password-section' },
        react_1.default.createElement("p", { className: 'description' }, t(canEditPassword ? 'security.about' : 'security.aboutReadOnly')),
        react_1.default.createElement("div", { className: 'security-dialog password' },
            react_1.default.createElement("div", { className: 'info-dialog info-dialog-column info-dialog-password', ref: formRef },
                react_1.default.createElement(PasswordForm_1.default, { editEnabled: passwordEditEnabled, locked: locked, onSubmit: onPasswordSubmit, password: password, passwordNumberOfDigits: passwordNumberOfDigits, visible: passwordVisible })),
            react_1.default.createElement("div", { className: 'security-dialog password-actions' }, actions))));
}
exports.default = PasswordSection;
