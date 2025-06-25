"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const functions_1 = require("../../functions");
/**
 * Component that renders the whiteboard user limit dialog.
 *
 * @returns {JSX.Element}
 */
const WhiteboardLimitDialog = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { limitUrl } = (0, react_redux_1.useSelector)(functions_1.getWhiteboardConfig);
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { hidden: true }, titleKey: t('dialog.whiteboardLimitTitle') },
        react_1.default.createElement("span", null, t('dialog.whiteboardLimitContent')),
        limitUrl && (react_1.default.createElement("span", null,
            ` ${t('dialog.whiteboardLimitReference')} `,
            react_1.default.createElement("a", { href: limitUrl, rel: 'noopener noreferrer', target: '_blank' }, t('dialog.whiteboardLimitReferenceUrl')),
            "."))));
};
exports.default = WhiteboardLimitDialog;
