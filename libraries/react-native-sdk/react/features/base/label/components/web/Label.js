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
const mui_1 = require("tss-react/mui");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const functions_web_1 = require("../../../styles/functions.web");
const constants_1 = require("../../constants");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        label: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            alignItems: 'center',
            background: theme.palette.ui04,
            borderRadius: '4px',
            color: theme.palette.text01,
            display: 'flex',
            margin: '0 2px',
            padding: '6px',
            height: 28,
            boxSizing: 'border-box'
        },
        withIcon: {
            marginLeft: 8
        },
        clickable: {
            cursor: 'pointer'
        },
        [constants_1.COLORS.white]: {
            background: theme.palette.ui09,
            color: theme.palette.text04,
            '& svg': {
                fill: theme.palette.icon04
            }
        },
        [constants_1.COLORS.green]: {
            background: theme.palette.success02
        },
        [constants_1.COLORS.red]: {
            background: theme.palette.actionDanger
        }
    };
});
const Label = ({ accessibilityText, className, color, icon, iconColor, id, onClick, text }) => {
    const { classes, cx } = useStyles();
    const onKeyPress = (0, react_1.useCallback)(event => {
        if (!onClick) {
            return;
        }
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
        }
    }, [onClick]);
    return (react_1.default.createElement("div", { className: cx(classes.label, onClick && classes.clickable, color && classes[color], className), id: id, onClick: onClick, onKeyPress: onKeyPress, role: onClick ? 'button' : undefined, tabIndex: onClick ? 0 : undefined },
        icon && react_1.default.createElement(Icon_1.default, { color: iconColor, size: '16', src: icon }),
        accessibilityText && react_1.default.createElement("span", { className: 'sr-only' }, accessibilityText),
        text && react_1.default.createElement("span", { className: icon && classes.withIcon }, text)));
};
exports.default = Label;
