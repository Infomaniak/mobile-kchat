"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const Button_1 = __importDefault(require("../../../../base/ui/components/web/Button"));
const Label_1 = __importDefault(require("../Label"));
const CountryPicker_1 = __importDefault(require("../country-picker/CountryPicker"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialOutDialog: {
            padding: theme.spacing(3)
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: theme.spacing(4)
        },
        picker: {
            margin: `${theme.spacing(2)} 0 ${theme.spacing(3)} 0`
        }
    };
});
/**
 * This component displays the dialog from which the user can enter the
 * phone number in order to be called by the meeting.
 *
 * @param {IProps} props - The props of the component.
 * @returns {React$Element}
 */
function DialOutDialog(props) {
    const { onClose, onTextButtonClick, onSubmit, t } = props;
    const { classes } = useStyles();
    return (react_1.default.createElement("div", { className: classes.dialOutDialog },
        react_1.default.createElement("div", { className: classes.header },
            react_1.default.createElement("div", { className: 'prejoin-dialog-title' }, t('prejoin.startWithPhone')),
            react_1.default.createElement(Icon_1.default, { className: 'prejoin-dialog-icon', onClick: onClose, role: 'button', size: 24, src: svg_1.IconCloseLarge })),
        react_1.default.createElement(Label_1.default, null, t('prejoin.callMeAtNumber')),
        react_1.default.createElement("div", { className: classes.picker },
            react_1.default.createElement(CountryPicker_1.default, { onSubmit: onSubmit })),
        react_1.default.createElement(Button_1.default, { className: 'prejoin-dialog-btn', fullWidth: true, labelKey: 'prejoin.callMe', onClick: onSubmit, type: 'primary' }),
        react_1.default.createElement("div", { className: 'prejoin-dialog-delimiter-container' },
            react_1.default.createElement("div", { className: 'prejoin-dialog-delimiter' }),
            react_1.default.createElement("div", { className: 'prejoin-dialog-delimiter-txt-container' },
                react_1.default.createElement("span", { className: 'prejoin-dialog-delimiter-txt' }, t('prejoin.or')))),
        react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-container' },
            react_1.default.createElement(Button_1.default, { className: 'prejoin-dialog-btn', fullWidth: true, labelKey: 'prejoin.iWantToDialIn', onClick: onTextButtonClick, type: 'tertiary' }))));
}
exports.default = (0, functions_1.translate)(DialOutDialog);
