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
const utils_1 = require("../../../utils");
const Label_1 = __importDefault(require("../Label"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        dialInDialog: {
            textAlign: 'center',
            '& .prejoin-dialog-dialin-header': {
                alignItems: 'center',
                margin: `${theme.spacing(3)} 0 ${theme.spacing(5)} ${theme.spacing(3)}`,
                display: 'flex'
            },
            '& .prejoin-dialog-dialin-icon': {
                marginRight: theme.spacing(3)
            },
            '& .prejoin-dialog-dialin-num': {
                background: '#3e474f',
                borderRadius: '4px',
                display: 'inline-block',
                fontSize: '15px',
                lineHeight: '24px',
                margin: theme.spacing(1),
                padding: theme.spacing(2),
                userSelect: 'text',
                '& .prejoin-dialog-dialin-num-container': {
                    minHeight: '48px',
                    margin: `${theme.spacing(2)} 0`
                },
                '& span': {
                    userSelect: 'text'
                }
            },
            '& .prejoin-dialog-dialin-link': {
                color: '#6FB1EA',
                cursor: 'pointer',
                display: 'inline-block',
                fontSize: '13px',
                lineHeight: '20px',
                marginBottom: theme.spacing(4)
            },
            '& .prejoin-dialog-dialin-spaced-label': {
                marginBottom: theme.spacing(3),
                marginTop: '28px'
            },
            '& .prejoin-dialog-dialin-btns > div': {
                marginBottom: theme.spacing(3)
            }
        }
    };
});
/**
 * This component displays the dialog with all the information
 * to join a meeting by calling it.
 *
 * @param {IProps} props - The props of the component.
 * @returns {React$Element}
 */
function DialinDialog(props) {
    const { number, onBack, onPrimaryButtonClick, onSmallTextClick, onTextButtonClick, passCode, t } = props;
    const { classes } = useStyles();
    const flagClassName = `prejoin-dialog-flag iti-flag ${(0, utils_1.getCountryCodeFromPhone)(number ?? '')}`;
    return (react_1.default.createElement("div", { className: classes.dialInDialog },
        react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-header' },
            react_1.default.createElement(Icon_1.default, { className: 'prejoin-dialog-icon prejoin-dialog-dialin-icon', onClick: onBack, role: 'button', size: 24, src: svg_1.IconArrowLeft }),
            react_1.default.createElement("div", { className: 'prejoin-dialog-title' }, t('prejoin.dialInMeeting'))),
        react_1.default.createElement(Label_1.default, { number: 1 }, t('prejoin.dialInPin')),
        react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-num-container' },
            react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-num' },
                react_1.default.createElement("div", { className: flagClassName }),
                react_1.default.createElement("span", null, number)),
            react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-num' }, passCode)),
        react_1.default.createElement("div", null,
            react_1.default.createElement("span", { className: 'prejoin-dialog-dialin-link', onClick: onSmallTextClick }, t('prejoin.viewAllNumbers'))),
        react_1.default.createElement("div", { className: 'prejoin-dialog-delimiter' }),
        react_1.default.createElement(Label_1.default, { className: 'prejoin-dialog-dialin-spaced-label', number: 2 }, t('prejoin.connectedWithAudioQ')),
        react_1.default.createElement("div", { className: 'prejoin-dialog-dialin-btns' },
            react_1.default.createElement(Button_1.default, { className: 'prejoin-dialog-btn', fullWidth: true, labelKey: 'prejoin.joinMeeting', onClick: onPrimaryButtonClick, type: 'primary' }),
            react_1.default.createElement(Button_1.default, { className: 'prejoin-dialog-btn', fullWidth: true, labelKey: 'dialog.Cancel', onClick: onTextButtonClick, type: 'tertiary' }))));
}
exports.default = (0, functions_1.translate)(DialinDialog);
