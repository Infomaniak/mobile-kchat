"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const Avatar_1 = __importDefault(require("../../../../base/avatar/components/Avatar"));
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const Label_1 = __importDefault(require("../Label"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        callingDialog: {
            padding: theme.spacing(3),
            textAlign: 'center',
            '& .prejoin-dialog-calling-header': {
                textAlign: 'right'
            },
            '& .prejoin-dialog-calling-label': {
                fontSize: '15px',
                margin: `${theme.spacing(2)} 0 ${theme.spacing(3)} 0`
            },
            '& .prejoin-dialog-calling-number': {
                fontSize: '19px',
                lineHeight: '28px',
                margin: `${theme.spacing(3)} 0`
            }
        }
    };
});
/**
 * Dialog displayed when the user gets called by the meeting.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
function CallingDialog(props) {
    const { number, onClose, status, t } = props;
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.callingDialog },
        react_1.default.createElement("div", { className: 'prejoin-dialog-calling-header' },
            react_1.default.createElement(Icon_1.default, { className: 'prejoin-dialog-icon', onClick: onClose, role: 'button', size: 24, src: svg_1.IconCloseLarge })),
        react_1.default.createElement(Label_1.default, { className: 'prejoin-dialog-calling-label' }, t(status)),
        react_1.default.createElement(Avatar_1.default, { size: 72 }),
        react_1.default.createElement("div", { className: 'prejoin-dialog-calling-number' }, number)));
}
exports.default = (0, functions_1.translate)(CallingDialog);
