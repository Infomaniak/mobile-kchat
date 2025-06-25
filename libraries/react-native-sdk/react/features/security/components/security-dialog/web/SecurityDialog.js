"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_any_1 = require("../../../../base/config/functions.any");
const functions_1 = require("../../../../base/participants/functions");
const Dialog_1 = __importDefault(require("../../../../base/ui/components/web/Dialog"));
const E2EESection_1 = __importDefault(require("../../../../e2ee/components/E2EESection"));
const LobbySection_1 = __importDefault(require("../../../../lobby/components/web/LobbySection"));
const functions_2 = require("../../../../lobby/functions");
const PasswordSection_1 = __importDefault(require("./PasswordSection"));
/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
function SecurityDialog() {
    const e2eeSupported = (0, react_redux_1.useSelector)((state) => state['features/base/conference'].e2eeSupported);
    const disableLobbyPassword = (0, react_redux_1.useSelector)((state) => (0, functions_any_1.getSecurityUiConfig)(state)?.disableLobbyPassword);
    const _isEnablingLobbyAllowed = (0, react_redux_1.useSelector)(functions_2.isEnablingLobbyAllowed);
    const isModerator = (0, react_redux_1.useSelector)(functions_1.isLocalParticipantModerator);
    const showE2ee = Boolean(e2eeSupported) && isModerator;
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { hidden: true }, titleKey: 'security.title' },
        react_1.default.createElement("div", { className: 'security-dialog' },
            _isEnablingLobbyAllowed && react_1.default.createElement(LobbySection_1.default, null),
            !disableLobbyPassword && (react_1.default.createElement(react_1.default.Fragment, null,
                _isEnablingLobbyAllowed && react_1.default.createElement("div", { className: 'separator-line' }),
                react_1.default.createElement(PasswordSection_1.default, null))),
            showE2ee ? react_1.default.createElement(react_1.default.Fragment, null,
                (_isEnablingLobbyAllowed || !disableLobbyPassword) && react_1.default.createElement("div", { className: 'separator-line' }),
                react_1.default.createElement(E2EESection_1.default, null)) : null)));
}
exports.default = SecurityDialog;
