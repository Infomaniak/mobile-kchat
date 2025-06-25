"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const CopyButton_web_1 = __importDefault(require("../../base/buttons/CopyButton.web"));
const functions_1 = require("../../base/connection/functions");
const functions_2 = require("../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../base/ui/components/web/Input"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            paddingTop: theme.spacing(1)
        },
        button: {
            marginTop: theme.spacing(3)
        }
    };
});
/**
 * Allow users to embed a jitsi meeting in an iframe.
 *
 * @returns {React$Element<any>}
 */
function EmbedMeeting({ t, url }) {
    const { classes } = useStyles();
    /**
     * Get the embed code for a jitsi meeting.
     *
     * @returns {string} The iframe embed code.
     */
    const getEmbedCode = () => `<iframe allow="camera; microphone; fullscreen; display-capture; autoplay" src="${url}"`
        + ' style="height: 100%; width: 100%; border: 0px;"></iframe>';
    return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, ok: { hidden: true }, titleKey: 'embedMeeting.title' },
        react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement(Input_1.default, { accessibilityLabel: t('dialog.embedMeeting'), id: 'embed-meeting-input', readOnly: true, textarea: true, value: getEmbedCode() }),
            react_1.default.createElement(CopyButton_web_1.default, { accessibilityText: t('addPeople.copyLink'), className: classes.button, displayedText: t('dialog.copy'), id: 'embed-meeting-copy-button', textOnCopySuccess: t('dialog.copied'), textOnHover: t('dialog.copy'), textToCopy: getEmbedCode() }))));
}
const mapStateToProps = (state) => {
    return {
        url: (0, functions_1.getInviteURL)(state)
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(EmbedMeeting));
