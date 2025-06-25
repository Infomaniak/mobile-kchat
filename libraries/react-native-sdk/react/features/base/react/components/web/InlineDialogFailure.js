"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../styles/functions.web");
const Button_1 = __importDefault(require("../../../ui/components/web/Button"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialog: {
            backgroundColor: theme.palette.ui01,
            border: `1px solid ${theme.palette.ui04}`,
            borderRadius: `${Number(theme.shape.borderRadius)}px`,
            boxShadow: '0px 1px 2px rgba(41, 41, 41, 0.25)',
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            padding: `${theme.spacing(3)} 10`,
            '& .retry-button': {
                margin: '16px auto 0 auto'
            }
        }
    };
});
/**
 * Inline dialog that represents a failure and allows a retry.
 *
 * @returns {Element}
 */
const InlineDialogFailure = ({ onRetry, showSupportLink }) => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { classes } = useStyles();
    const supportLink = interfaceConfig.SUPPORT_URL;
    const supportString = t('inlineDialogFailure.supportMsg');
    const supportLinkElem = supportLink && showSupportLink
        ? (react_1.default.createElement("div", null,
            react_1.default.createElement("span", null, supportString.padEnd(supportString.length + 1)),
            react_1.default.createElement("span", null,
                react_1.default.createElement("a", { href: supportLink, rel: 'noopener noreferrer', target: '_blank' }, t('inlineDialogFailure.support'))),
            react_1.default.createElement("span", null, ".")))
        : null;
    return (react_1.default.createElement("div", { className: classes.dialog },
        react_1.default.createElement("div", null, t('inlineDialogFailure.msg')),
        supportLinkElem,
        react_1.default.createElement(Button_1.default, { className: 'retry-button', label: t('inlineDialogFailure.retry'), onClick: onRetry })));
};
exports.default = InlineDialogFailure;
