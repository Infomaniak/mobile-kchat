"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const functions_web_1 = require("../../../../base/styles/functions.web");
const constants_1 = require("../../../constants");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        limitContainer: {
            backgroundColor: theme.palette.warning01,
            borderRadius: '6px',
            padding: '8px 16px'
        },
        limitInfo: {
            color: theme.palette.text.primary,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
        },
        link: {
            color: `${theme.palette.text.primary} !important`,
            fontWeight: 'bold',
            textDecoration: 'underline'
        }
    };
});
/**
 * Component that displays a message when the dial in limit is reached.
 * * @param {Function} t - Function which translate strings.
 *
 * @returns {ReactElement}
 */
const DialInLimit = ({ t }) => {
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.limitContainer },
        react_1.default.createElement("span", { className: classes.limitInfo },
            react_1.default.createElement("b", null, `${t('info.dialInNumber')} `),
            `${t('info.reachedLimit')} `,
            `${t('info.upgradeOptions')} `,
            react_1.default.createElement("a", { className: classes.link, href: constants_1.UPGRADE_OPTIONS_LINK, rel: 'noopener noreferrer', target: '_blank' }, `${constants_1.UPGRADE_OPTIONS_TEXT}`),
            ".")));
};
exports.default = (0, functions_1.translate)(DialInLimit);
