"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const functions_web_1 = require("../../../base/styles/functions.web");
const BaseTheme_web_1 = __importDefault(require("../../../base/ui/components/BaseTheme.web"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            position: 'absolute',
            left: 'calc(50% - 72px)',
            bottom: '15px'
        },
        newMessagesButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '32px',
            padding: '8px',
            border: 'none',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.action02,
            boxShadow: '0px 3px 16px rgba(0, 0, 0, 0.6), 0px 0px 4px 1px rgba(0, 0, 0, 0.25)',
            '&:hover': {
                backgroundColor: theme.palette.action02Hover
            },
            '&:active': {
                backgroundColor: theme.palette.action02Active
            }
        },
        arrowDownIconContainer: {
            height: '20px',
            width: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        textContainer: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text04,
            paddingLeft: '8px'
        }
    };
});
/** NewMessagesButton.
 *
 * @param {Function} onGoToFirstUnreadMessage - Function for lifting up onClick event.
 * @returns {JSX.Element}
 */
function NewMessagesButton({ onGoToFirstUnreadMessage, t }) {
    const { classes: styles } = useStyles();
    return (react_1.default.createElement("div", { className: styles.container },
        react_1.default.createElement("button", { "aria-label": t('chat.newMessages'), className: styles.newMessagesButton, onClick: onGoToFirstUnreadMessage, type: 'button' },
            react_1.default.createElement(Icon_1.default, { className: styles.arrowDownIconContainer, color: BaseTheme_web_1.default.palette.icon04, size: 14, src: svg_1.IconArrowDown }),
            react_1.default.createElement("div", { className: styles.textContainer },
                " ",
                t('chat.newMessages')))));
}
exports.default = (0, functions_1.translate)(NewMessagesButton);
