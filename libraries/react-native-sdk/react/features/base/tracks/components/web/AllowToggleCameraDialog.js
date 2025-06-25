"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../i18n/functions");
const functions_2 = require("../../../participants/functions");
const Dialog_1 = __importDefault(require("../../../ui/components/web/Dialog"));
/**
 * Dialog to allow toggling camera remotely.
 *
 * @returns {JSX.Element} - The allow toggle camera dialog.
 */
const AllowToggleCameraDialog = ({ onAllow, t, initiatorId }) => {
    const initiatorName = (0, react_redux_1.useSelector)((state) => (0, functions_2.getParticipantDisplayName)(state, initiatorId));
    return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.allow' }, onSubmit: onAllow, titleKey: 'dialog.allowToggleCameraTitle' },
        react_1.default.createElement("div", null, t('dialog.allowToggleCameraDialog', { initiatorName }))));
};
exports.default = (0, functions_1.translate)(AllowToggleCameraDialog);
