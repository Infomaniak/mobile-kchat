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
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const utils_1 = require("../../../../base/environment/utils");
const functions_1 = require("../../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../../base/icons/components/Icon"));
const svg_1 = require("../../../../base/icons/svg");
const Tooltip_1 = __importDefault(require("../../../../base/tooltip/components/Tooltip"));
const copyText_web_1 = require("../../../../base/util/copyText.web");
const actions_1 = require("../../../../notifications/actions");
const constants_1 = require("../../../../notifications/constants");
let mounted;
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            marginTop: theme.spacing(4)
        },
        label: {
            marginBottom: theme.spacing(2)
        },
        iconRow: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        },
        iconContainer: {
            display: 'block',
            padding: theme.spacing(2),
            cursor: 'pointer'
        }
    };
});
/**
 * Component that renders email invite options.
 *
 * @returns {ReactNode}
 */
function InviteByEmailSection({ inviteSubject, inviteText, inviteTextiOS, t }) {
    const dispatch = (0, react_redux_1.useDispatch)();
    const { classes } = useStyles();
    const [isClicked, setIsClicked] = (0, react_1.useState)(false);
    const encodedInviteSubject = encodeURIComponent(inviteSubject);
    const encodedInviteText = encodeURIComponent(inviteText);
    const encodedInviteTextiOS = encodeURIComponent(inviteTextiOS);
    const encodedDefaultEmailText = (0, utils_1.isIosMobileBrowser)() ? encodedInviteTextiOS : encodedInviteText;
    (0, react_1.useEffect)(() => {
        mounted = true;
        return () => {
            mounted = false;
        };
    }, []);
    /**
     * Copies the conference invitation to the clipboard.
     *
     * @returns {void}
     */
    function _onCopyText() {
        (0, copyText_web_1.copyText)(inviteText);
        dispatch((0, actions_1.showSuccessNotification)({
            titleKey: 'dialog.copied'
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.SHORT));
        setIsClicked(true);
        setTimeout(() => {
            // avoid: Can't perform a React state update on an unmounted component
            if (mounted) {
                setIsClicked(false);
            }
        }, 2500);
    }
    /**
     * Copies the conference invitation to the clipboard.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    function _onCopyTextKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            _onCopyText();
        }
    }
    /**
     * Renders clickable elements that each open an email client
     * containing a conference invite.
     *
     * @returns {ReactNode}
     */
    function renderEmailIcons() {
        const PROVIDER_MAPPING = [
            {
                icon: svg_1.IconEnvelope,
                tooltipKey: 'addPeople.defaultEmail',
                url: `mailto:?subject=${encodedInviteSubject}&body=${encodedDefaultEmailText}`
            },
            {
                icon: svg_1.IconGoogle,
                tooltipKey: 'addPeople.googleEmail',
                url: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedInviteSubject}&body=${encodedInviteText}`
            },
            {
                icon: svg_1.IconOffice365,
                tooltipKey: 'addPeople.outlookEmail',
                // eslint-disable-next-line max-len
                url: `https://outlook.office.com/mail/deeplink/compose?subject=${encodedInviteSubject}&body=${encodedInviteText}`
            },
            {
                icon: svg_1.IconYahoo,
                tooltipKey: 'addPeople.yahooEmail',
                url: `https://compose.mail.yahoo.com/?To=&Subj=${encodedInviteSubject}&Body=${encodedInviteText}`
            }
        ];
        return (react_1.default.createElement(react_1.default.Fragment, null, PROVIDER_MAPPING.map(({ icon, tooltipKey, url }, idx) => (react_1.default.createElement(Tooltip_1.default, { content: t(tooltipKey), key: idx, position: 'top' },
            react_1.default.createElement("a", { "aria-label": t(tooltipKey), className: classes.iconContainer, href: url, rel: 'noopener noreferrer', target: '_blank' },
                react_1.default.createElement(Icon_1.default, { src: icon })))))));
    }
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement("p", { className: classes.label }, t('addPeople.shareInvite')),
            react_1.default.createElement("div", { className: classes.iconRow },
                react_1.default.createElement(Tooltip_1.default, { content: t('addPeople.copyInvite'), position: 'top' },
                    react_1.default.createElement("div", { "aria-label": t('addPeople.copyInvite'), className: classes.iconContainer, 
                        // eslint-disable-next-line react/jsx-no-bind
                        onClick: _onCopyText, 
                        // eslint-disable-next-line react/jsx-no-bind
                        onKeyPress: _onCopyTextKeyPress, role: 'button', tabIndex: 0 },
                        react_1.default.createElement(Icon_1.default, { src: isClicked ? svg_1.IconCheck : svg_1.IconCopy }))),
                renderEmailIcons()))));
}
exports.default = (0, functions_1.translate)(InviteByEmailSection);
