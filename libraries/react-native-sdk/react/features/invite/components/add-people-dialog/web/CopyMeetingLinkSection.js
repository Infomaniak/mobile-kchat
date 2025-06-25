"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_i18next_1 = require("react-i18next");
const mui_1 = require("tss-react/mui");
const CopyButton_web_1 = __importDefault(require("../../../../base/buttons/CopyButton.web"));
const uri_1 = require("../../../../base/util/uri");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        label: {
            display: 'block',
            marginBottom: theme.spacing(2)
        }
    };
});
/**
 * Component meant to enable users to copy the conference URL.
 *
 * @returns {React$Element<any>}
 */
function CopyMeetingLinkSection({ url }) {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("p", { className: classes.label }, t('addPeople.shareLink')),
        react_1.default.createElement(CopyButton_web_1.default, { accessibilityText: t('addPeople.accessibilityLabel.meetingLink', { url: (0, uri_1.getDecodedURI)(url) }), className: 'invite-more-dialog-conference-url', displayedText: (0, uri_1.getDecodedURI)(url), id: 'add-people-copy-link-button', textOnCopySuccess: t('addPeople.linkCopied'), textOnHover: t('addPeople.copyLink'), textToCopy: url })));
}
exports.default = CopyMeetingLinkSection;
