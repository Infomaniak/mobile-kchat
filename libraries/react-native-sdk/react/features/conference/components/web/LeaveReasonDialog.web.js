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
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialog: {
            marginBottom: theme.spacing(1)
        },
        text: {
            fontSize: '20px'
        }
    };
});
/**
 * A React {@code Component} for displaying a dialog with a reason that ended the conference.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
const LeaveReasonDialog = ({ onClose, title }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    (0, react_1.useEffect)(() => () => {
        onClose?.();
    }, []);
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, onSubmit: onClose, size: 'medium', testId: 'dialog.leaveReason' },
        react_1.default.createElement("div", { className: classes.dialog }, title ? react_1.default.createElement("div", { className: classes.text }, t(title)) : null)));
};
exports.default = LeaveReasonDialog;
