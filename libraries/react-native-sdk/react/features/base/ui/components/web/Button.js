"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_web_1 = require("../../../styles/functions.web");
const constants_web_1 = require("../../constants.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        button: {
            backgroundColor: theme.palette.action01,
            color: theme.palette.text01,
            borderRadius: theme.shape.borderRadius,
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 0,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBold),
            transition: 'background .2s',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: theme.palette.action01Hover
            },
            '&:active': {
                backgroundColor: theme.palette.action01Active
            },
            '&.focus-visible': {
                outline: 0,
                boxShadow: `0px 0px 0px 2px ${theme.palette.focus01}`
            },
            '& div > svg': {
                fill: theme.palette.icon01
            }
        },
        primary: {},
        secondary: {
            backgroundColor: theme.palette.action02,
            color: theme.palette.text04,
            '&:hover': {
                backgroundColor: theme.palette.action02Hover
            },
            '&:active': {
                backgroundColor: theme.palette.action02Active
            },
            '& div > svg': {
                fill: theme.palette.icon04
            }
        },
        tertiary: {
            backgroundColor: theme.palette.action03,
            '&:hover': {
                backgroundColor: theme.palette.action03Hover
            },
            '&:active': {
                backgroundColor: theme.palette.action03Active
            }
        },
        destructive: {
            backgroundColor: theme.palette.actionDanger,
            '&:hover': {
                backgroundColor: theme.palette.actionDangerHover
            },
            '&:active': {
                backgroundColor: theme.palette.actionDangerActive
            }
        },
        disabled: {
            backgroundColor: theme.palette.disabled01,
            color: theme.palette.text03,
            '&:hover': {
                backgroundColor: theme.palette.disabled01,
                color: theme.palette.text03
            },
            '&:active': {
                backgroundColor: theme.palette.disabled01,
                color: theme.palette.text03
            },
            '& div > svg': {
                fill: theme.palette.icon03
            }
        },
        iconButton: {
            padding: theme.spacing(2)
        },
        textWithIcon: {
            marginLeft: theme.spacing(2)
        },
        small: {
            padding: '8px 16px',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            '&.iconButton': {
                padding: theme.spacing(1)
            }
        },
        medium: {},
        large: {
            padding: '13px 16px',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortBoldLarge),
            '&.iconButton': {
                padding: '12px'
            }
        },
        fullWidth: {
            width: '100%'
        }
    };
});
const Button = react_1.default.forwardRef(({ accessibilityLabel, autoFocus = false, className, disabled, fullWidth, icon, id, isSubmit, label, labelKey, onClick = () => null, onKeyPress = () => null, size = 'medium', testId, type = constants_web_1.BUTTON_TYPES.PRIMARY }, ref) => {
    const { classes: styles, cx } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement("button", { "aria-label": accessibilityLabel, autoFocus: autoFocus, className: cx(styles.button, styles[type], disabled && styles.disabled, icon && !(labelKey || label) && `${styles.iconButton} iconButton`, styles[size], fullWidth && styles.fullWidth, className), "data-testid": testId, disabled: disabled, ...(id ? { id } : {}), onClick: onClick, onKeyPress: onKeyPress, ref: ref, title: accessibilityLabel, type: isSubmit ? 'submit' : 'button' },
        icon && react_1.default.createElement(Icon_1.default, { size: 24, src: icon }),
        (labelKey || label) && react_1.default.createElement("span", { className: icon ? styles.textWithIcon : '' }, labelKey ? t(labelKey) : label)));
});
exports.default = Button;
