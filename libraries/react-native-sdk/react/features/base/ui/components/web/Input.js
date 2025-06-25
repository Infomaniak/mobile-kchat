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
const react_textarea_autosize_1 = __importDefault(require("react-textarea-autosize"));
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../environment/utils");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const svg_1 = require("../../../icons/svg");
const functions_web_1 = require("../../../styles/functions.web");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        inputContainer: {
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            marginBottom: theme.spacing(2),
            '&.is-mobile': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
            }
        },
        fieldContainer: {
            position: 'relative',
            display: 'flex'
        },
        input: {
            backgroundColor: theme.palette.ui03,
            background: theme.palette.ui03,
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            padding: '10px 16px',
            borderRadius: theme.shape.borderRadius,
            border: 0,
            height: '40px',
            boxSizing: 'border-box',
            width: '100%',
            '&::placeholder': {
                color: theme.palette.text02
            },
            '&:focus': {
                outline: 0,
                boxShadow: `0px 0px 0px 2px ${theme.palette.focus01}`
            },
            '&:disabled': {
                color: theme.palette.text03
            },
            '&.is-mobile': {
                height: '48px',
                padding: '13px 16px',
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
            },
            '&.icon-input': {
                paddingLeft: '46px'
            },
            '&.error': {
                boxShadow: `0px 0px 0px 2px ${theme.palette.textError}`
            }
        },
        'input::-webkit-outer-spin-button, input::-webkit-inner-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0
        },
        'input[type=number]': {
            '-moz-appearance': 'textfield'
        },
        icon: {
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            left: '16px'
        },
        iconClickable: {
            cursor: 'pointer'
        },
        clearableInput: {
            paddingRight: '46px'
        },
        clearButton: {
            position: 'absolute',
            right: '16px',
            top: '10px',
            cursor: 'pointer',
            backgroundColor: theme.palette.action03,
            border: 0,
            padding: 0
        },
        bottomLabel: {
            marginTop: theme.spacing(2),
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text02,
            '&.is-mobile': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
            },
            '&.error': {
                color: theme.palette.textError
            }
        }
    };
});
const Input = react_1.default.forwardRef(({ accessibilityLabel, autoComplete, autoFocus, bottomLabel, className, clearable = false, disabled, error, icon, iconClick, id, label, maxValue, maxLength, maxRows, minValue, minRows, mode, name, onBlur, onChange, onFocus, onKeyPress, placeholder, readOnly = false, required, testId, textarea = false, type = 'text', value }, ref) => {
    const { classes: styles, cx } = useStyles();
    const isMobile = (0, utils_1.isMobileBrowser)();
    const handleChange = (0, react_1.useCallback)((e) => onChange?.(e.target.value), []);
    const clearInput = (0, react_1.useCallback)(() => onChange?.(''), []);
    return (react_1.default.createElement("div", { className: cx(styles.inputContainer, className) },
        label && react_1.default.createElement("label", { className: cx(styles.label, isMobile && 'is-mobile'), htmlFor: id }, label),
        react_1.default.createElement("div", { className: styles.fieldContainer },
            icon && react_1.default.createElement(Icon_1.default, { ...(iconClick ? { tabIndex: 0 } : {}), className: cx(styles.icon, iconClick && styles.iconClickable), onClick: iconClick, size: 20, src: icon }),
            textarea ? (react_1.default.createElement(react_textarea_autosize_1.default, { "aria-label": accessibilityLabel, autoComplete: autoComplete, autoFocus: autoFocus, className: cx(styles.input, isMobile && 'is-mobile', error && 'error', clearable && styles.clearableInput, icon && 'icon-input'), disabled: disabled, id: id, maxLength: maxLength, maxRows: maxRows, minRows: minRows, name: name, onChange: handleChange, onKeyPress: onKeyPress, placeholder: placeholder, readOnly: readOnly, ref: ref, required: required, value: value })) : (react_1.default.createElement("input", { "aria-describedby": bottomLabel ? `${id}-description` : undefined, "aria-label": accessibilityLabel, autoComplete: autoComplete, autoFocus: autoFocus, className: cx(styles.input, isMobile && 'is-mobile', error && 'error', clearable && styles.clearableInput, icon && 'icon-input'), "data-testid": testId, disabled: disabled, id: id, ...(mode ? { inputmode: mode } : {}), ...(type === 'number' ? { max: maxValue } : {}), maxLength: maxLength, ...(type === 'number' ? { min: minValue } : {}), name: name, onBlur: onBlur, onChange: handleChange, onFocus: onFocus, onKeyPress: onKeyPress, placeholder: placeholder, readOnly: readOnly, ref: ref, required: required, type: type, value: value })),
            clearable && !disabled && value !== '' && react_1.default.createElement("button", { className: styles.clearButton },
                react_1.default.createElement(Icon_1.default, { onClick: clearInput, size: 20, src: svg_1.IconCloseCircle }))),
        bottomLabel && (react_1.default.createElement("span", { className: cx(styles.bottomLabel, isMobile && 'is-mobile', error && 'error'), id: `${id}-description` }, bottomLabel))));
});
exports.default = Input;
