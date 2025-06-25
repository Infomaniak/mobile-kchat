"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        notice: {
            position: 'absolute',
            left: '50%',
            zIndex: 3,
            marginTop: theme.spacing(2),
            transform: 'translateX(-50%)'
        },
        message: {
            backgroundColor: theme.palette.uiBackground,
            color: theme.palette.text01,
            padding: '3px',
            borderRadius: '5px'
        }
    };
});
const Notice = () => {
    const message = (0, react_redux_1.useSelector)((state) => state['features/base/config'].noticeMessage);
    const { classes } = useStyles();
    if (!message) {
        return null;
    }
    return (react_1.default.createElement("div", { className: classes.notice },
        react_1.default.createElement("span", { className: classes.message }, message)));
};
exports.default = Notice;
