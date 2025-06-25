"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
/**
 * Implements the dialog that warns the user that the login will leave the conference.
 *
 * @param {Object} props - The props of the component.
 * @returns {React$Element}
 */
const LoginQuestionDialog = ({ handler }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.Yes' }, onSubmit: handler, titleKey: t('dialog.login') },
        react_1.default.createElement("div", null, t('dialog.loginQuestion'))));
};
exports.default = LoginQuestionDialog;
