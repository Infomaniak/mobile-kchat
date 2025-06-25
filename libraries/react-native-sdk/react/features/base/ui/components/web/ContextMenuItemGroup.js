"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const ContextMenuItem_1 = __importDefault(require("./ContextMenuItem"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        contextMenuItemGroup: {
            '&:not(:empty)': {
                padding: `${theme.spacing(2)} 0`
            },
            '& + &:not(:empty)': {
                borderTop: `1px solid ${theme.palette.ui03}`
            },
            '&:first-of-type': {
                paddingTop: 0
            },
            '&:last-of-type': {
                paddingBottom: 0
            }
        }
    };
});
const ContextMenuItemGroup = ({ actions, children }) => {
    const { classes: styles } = useStyles();
    return (react_1.default.createElement("div", { className: styles.contextMenuItemGroup },
        children,
        actions?.map(actionProps => (react_1.default.createElement(ContextMenuItem_1.default, { key: actionProps.text, ...actionProps })))));
};
exports.default = ContextMenuItemGroup;
