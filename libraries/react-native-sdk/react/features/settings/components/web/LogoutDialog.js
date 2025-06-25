"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
/**
 * Implements the Logout dialog.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
function LogoutDialog({ onLogout, t }) {
    return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.Yes' }, onSubmit: onLogout, titleKey: t('dialog.logoutTitle') },
        react_1.default.createElement("div", null, t('dialog.logoutQuestion'))));
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(LogoutDialog));
