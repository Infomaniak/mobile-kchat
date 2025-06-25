"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_web_1 = require("../../../../toolbox/functions.web");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_web_2 = require("../../../styles/functions.web");
const TextWithOverflow_1 = __importDefault(require("./TextWithOverflow"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        contextMenuItem: {
            alignItems: 'center',
            cursor: 'pointer',
            display: 'flex',
            minHeight: '40px',
            padding: '10px 16px',
            boxSizing: 'border-box',
            '& > *:not(:last-child)': {
                marginRight: theme.spacing(3)
            },
            '&:hover': {
                backgroundColor: theme.palette.ui02
            },
            '&:active': {
                backgroundColor: theme.palette.ui03
            },
            '&.focus-visible': {
                boxShadow: `inset 0 0 0 2px ${theme.palette.action01Hover}`
            }
        },
        selected: {
            borderLeft: `3px solid ${theme.palette.action01Hover}`,
            paddingLeft: '13px',
            backgroundColor: theme.palette.ui02
        },
        contextMenuItemDisabled: {
            pointerEvents: 'none'
        },
        contextMenuItemIconDisabled: {
            '& svg': {
                fill: `${theme.palette.text03} !important`
            }
        },
        contextMenuItemLabelDisabled: {
            color: theme.palette.text03,
            '&:hover': {
                background: 'none'
            },
            '& svg': {
                fill: theme.palette.text03
            }
        },
        contextMenuItemDrawer: {
            padding: '13px 16px'
        },
        contextMenuItemIcon: {
            '& svg': {
                fill: theme.palette.icon01
            }
        },
        text: {
            ...(0, functions_web_2.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01
        },
        drawerText: {
            ...(0, functions_web_2.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
        }
    };
});
const ContextMenuItem = ({ accessibilityLabel, backgroundColor, children, className, controls, customIcon, disabled, id, icon, onClick, onKeyDown, onKeyPress, overflowType, role = 'button', selected, testId, text, textClassName }) => {
    const { classes: styles, cx } = useStyles();
    const _overflowDrawer = (0, react_redux_1.useSelector)(functions_web_1.showOverflowDrawer);
    const style = backgroundColor ? { backgroundColor } : {};
    const onKeyPressHandler = (0, react_1.useCallback)(e => {
        // only trigger the fallback behavior (onClick) if we dont have any explicit keyboard event handler
        if (onClick && !onKeyPress && !onKeyDown && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick(e);
        }
        if (onKeyPress) {
            onKeyPress(e);
        }
    }, [onClick, onKeyPress, onKeyDown]);
    let tabIndex;
    if (role === 'tab') {
        tabIndex = selected ? 0 : -1;
    }
    if (role === 'button' && !disabled) {
        tabIndex = 0;
    }
    return (react_1.default.createElement("div", { "aria-controls": controls, "aria-disabled": disabled, "aria-label": accessibilityLabel, "aria-selected": role === 'tab' ? selected : undefined, className: cx(styles.contextMenuItem, _overflowDrawer && styles.contextMenuItemDrawer, disabled && styles.contextMenuItemDisabled, selected && styles.selected, className), "data-testid": testId, id: id, key: text, onClick: disabled ? undefined : onClick, onKeyDown: disabled ? undefined : onKeyDown, onKeyPress: disabled ? undefined : onKeyPressHandler, role: onClick ? role : undefined, style: style, tabIndex: onClick ? tabIndex : undefined },
        customIcon ? customIcon
            : icon && react_1.default.createElement(Icon_1.default, { className: cx(styles.contextMenuItemIcon, disabled && styles.contextMenuItemIconDisabled), size: 20, src: icon }),
        text && (react_1.default.createElement(TextWithOverflow_1.default, { className: cx(styles.text, _overflowDrawer && styles.drawerText, disabled && styles.contextMenuItemLabelDisabled, textClassName), overflowType: overflowType }, text)),
        children));
};
exports.default = ContextMenuItem;
