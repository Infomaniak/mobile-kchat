"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    const { text01 } = theme.palette;
    return {
        badge: {
            background: 'rgba(0, 0, 0, 0.6)',
            borderRadius: '3px',
            color: text01,
            maxWidth: '50%',
            overflow: 'hidden',
            padding: '2px 16px',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        }
    };
});
/**
 * Component that displays a name badge.
 *
 * @param {Props} props - The props of the component.
 * @returns {ReactElement}
 */
const DisplayNameBadge = ({ name }) => {
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.badge }, name));
};
exports.default = DisplayNameBadge;
