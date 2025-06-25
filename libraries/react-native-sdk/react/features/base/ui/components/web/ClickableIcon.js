"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../environment/utils");
const Icon_1 = __importDefault(require("../../../icons/components/Icon"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        button: {
            padding: '2px',
            backgroundColor: theme.palette.action03,
            border: 0,
            outline: 0,
            borderRadius: `${theme.shape.borderRadius}px`,
            '&:hover': {
                backgroundColor: theme.palette.ui02
            },
            '&.focus-visible': {
                outline: 0,
                boxShadow: `0px 0px 0px 2px ${theme.palette.focus01}`
            },
            '&:active': {
                backgroundColor: theme.palette.ui03
            },
            '&.is-mobile': {
                padding: '10px'
            }
        }
    };
});
const ClickableIcon = ({ accessibilityLabel, className, icon, id, onClick }) => {
    const { classes: styles, cx } = useStyles();
    const isMobile = (0, utils_1.isMobileBrowser)();
    return (react_1.default.createElement("button", { "aria-label": accessibilityLabel, className: cx(styles.button, isMobile && 'is-mobile', className), id: id, onClick: onClick },
        react_1.default.createElement(Icon_1.default, { size: 24, src: icon })));
};
exports.default = ClickableIcon;
