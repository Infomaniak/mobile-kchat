"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const DialogPortal_1 = __importDefault(require("./DialogPortal"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        portal: {
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 351,
            borderRadius: '16px 16px 0 0',
            '&.notification-portal': {
                zIndex: 901
            },
            '&::after': {
                content: '',
                backgroundColor: theme.palette.ui01,
                marginBottom: 'env(safe-area-inset-bottom, 0)'
            }
        }
    };
});
/**
 * Component meant to render a drawer at the bottom of the screen,
 * by creating a portal containing the component's children.
 *
 * @returns {ReactElement}
 */
function JitsiPortal({ children, className }) {
    const { classes, cx } = useStyles();
    return (react_1.default.createElement(DialogPortal_1.default, { className: cx(classes.portal, className) }, children));
}
exports.default = JitsiPortal;
