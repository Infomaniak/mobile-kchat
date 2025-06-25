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
        container: {
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
        selectContainer: {
            position: 'relative'
        },
        select: {
            backgroundColor: theme.palette.ui03,
            borderRadius: `${theme.shape.borderRadius}px`,
            width: '100%',
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01,
            padding: '10px 16px',
            paddingRight: '42px',
            border: 0,
            appearance: 'none',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            '&:focus': {
                outline: 0,
                boxShadow: `0px 0px 0px 2px ${theme.palette.focus01}`
            },
            '&:disabled': {
                color: theme.palette.text03
            },
            '&.is-mobile': {
                ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge),
                padding: '12px 16px',
                paddingRight: '46px'
            },
            '&.error': {
                boxShadow: `0px 0px 0px 2px ${theme.palette.textError}`
            }
        },
        icon: {
            position: 'absolute',
            top: '8px',
            right: '8px',
            pointerEvents: 'none',
            '&.is-mobile': {
                top: '12px',
                right: '12px'
            }
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
const Select = ({ bottomLabel, className, disabled, error, id, label, onChange, options, value }) => {
    const { classes, cx, theme } = useStyles();
    const isMobile = (0, utils_1.isMobileBrowser)();
    return (react_1.default.createElement("div", { className: classes.container },
        label && react_1.default.createElement("label", { className: cx(classes.label, isMobile && 'is-mobile'), htmlFor: id }, label),
        react_1.default.createElement("div", { className: classes.selectContainer },
            react_1.default.createElement("select", { "aria-describedby": bottomLabel ? `${id}-description` : undefined, className: cx(classes.select, isMobile && 'is-mobile', className, error && 'error'), disabled: disabled, id: id, onChange: onChange, value: value }, options.map(option => (react_1.default.createElement("option", { key: option.value, value: option.value }, option.label)))),
            react_1.default.createElement(Icon_1.default, { className: cx(classes.icon, isMobile && 'is-mobile'), color: disabled ? theme.palette.icon03 : theme.palette.icon01, size: 22, src: svg_1.IconArrowDown })),
        bottomLabel && (react_1.default.createElement("span", { className: cx(classes.bottomLabel, isMobile && 'is-mobile', error && 'error'), id: `${id}-description` }, bottomLabel))));
};
exports.default = Select;
