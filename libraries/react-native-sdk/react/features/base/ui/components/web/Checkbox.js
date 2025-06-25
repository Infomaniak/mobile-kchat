"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../environment/utils");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const svg_1 = require("../../../icons/svg");
const functions_web_1 = require("../../../styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        formControl: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegular),
            color: theme.palette.text01,
            display: 'inline-flex',
            alignItems: 'center',
            '&.is-mobile': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegularLarge)
            }
        },
        disabled: {
            cursor: 'not-allowed'
        },
        activeArea: {
            display: 'grid',
            placeContent: 'center',
            width: '24px',
            height: '24px',
            backgroundColor: 'transparent',
            marginRight: '15px',
            position: 'relative',
            cursor: 'pointer',
            '& input[type="checkbox"]': {
                appearance: 'none',
                backgroundColor: 'transparent',
                margin: '3px',
                font: 'inherit',
                color: theme.palette.icon03,
                width: '18px',
                height: '18px',
                border: `2px solid ${theme.palette.icon03}`,
                borderRadius: '3px',
                display: 'grid',
                placeContent: 'center',
                '&::before': {
                    content: 'url("")',
                    width: '18px',
                    height: '18px',
                    opacity: 0,
                    backgroundColor: theme.palette.action01,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 0,
                    borderRadius: '3px',
                    transition: '.2s'
                },
                '&:checked::before': {
                    opacity: 1
                },
                '&:disabled': {
                    backgroundColor: theme.palette.ui03,
                    borderColor: theme.palette.ui04,
                    '&::before': {
                        backgroundColor: theme.palette.ui04
                    }
                },
                '&:checked+.checkmark': {
                    opacity: 1
                }
            },
            '& .checkmark': {
                position: 'absolute',
                left: '3px',
                top: '3px',
                opacity: 0,
                transition: '.2s'
            },
            '&.is-mobile': {
                width: '40px',
                height: '40px',
                '& input[type="checkbox"]': {
                    width: '24px',
                    height: '24px',
                    '&::before': {
                        width: '24px',
                        height: '24px'
                    }
                },
                '& .checkmark': {
                    left: '11px',
                    top: '10px'
                }
            }
        }
    };
});
const Checkbox = ({ checked, className, disabled, label, name, onChange }) => {
    const { classes: styles, cx, theme } = useStyles();
    const isMobile = (0, utils_1.isMobileBrowser)();
    return (react_1.default.createElement("label", { className: cx(styles.formControl, isMobile && 'is-mobile', className) },
        react_1.default.createElement("div", { className: cx(styles.activeArea, isMobile && 'is-mobile', disabled && styles.disabled) },
            react_1.default.createElement("input", { checked: checked, disabled: disabled, name: name, onChange: onChange, type: 'checkbox' }),
            react_1.default.createElement(Icon_1.default, { "aria-hidden": true, className: 'checkmark', color: disabled ? theme.palette.icon03 : theme.palette.icon01, size: 18, src: svg_1.IconCheck })),
        react_1.default.createElement("div", null, label)));
};
exports.default = Checkbox;
