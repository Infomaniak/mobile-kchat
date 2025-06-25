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
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const environment_1 = require("../../base/environment/environment");
const functions_2 = require("../../base/i18n/functions");
const Platform_web_1 = __importDefault(require("../../base/react/Platform.web"));
const functions_web_1 = require("../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../base/ui/components/web/Button"));
const DialInSummary_1 = __importDefault(require("../../invite/components/dial-in-summary/web/DialInSummary"));
const actions_1 = require("../actions");
const constants_1 = require("../constants");
const functions_3 = require("../functions");
const PADDINGS = {
    topBottom: 24,
    leftRight: 40
};
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        container: {
            background: '#1E1E1E',
            width: '100vw',
            height: '100dvh',
            overflowX: 'hidden',
            overflowY: 'auto',
            justifyContent: 'center',
            display: 'flex',
            '& a': {
                textDecoration: 'none'
            }
        },
        contentPane: {
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column',
            padding: `${PADDINGS.topBottom}px ${PADDINGS.leftRight}px`,
            maxWidth: 410,
            color: theme.palette.text01
        },
        launchingMeetingLabel: {
            marginTop: 24,
            textAlign: 'center',
            marginBottom: 32,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading5)
        },
        roomNameLabel: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegularLarge)
        },
        joinMeetWrapper: {
            marginTop: 24,
            width: '100%'
        },
        labelDescription: {
            textAlign: 'center',
            marginTop: 16,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
        },
        linkWrapper: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 8,
            width: '100%'
        },
        linkLabel: {
            color: theme.palette.link01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongBoldLarge)
        },
        supportedBrowserContent: {
            marginTop: 16,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        },
        labelOr: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegularLarge)
        },
        separator: {
            marginTop: '32px',
            height: 1,
            width: `calc(100% + ${2 * PADDINGS.leftRight}px)`,
            background: theme.palette.ui03
        }
    };
});
const DeepLinkingMobilePage = ({ t }) => {
    const deeplinkingCfg = (0, react_redux_1.useSelector)((state) => state['features/base/config']?.deeplinking || {});
    const { hideLogo } = deeplinkingCfg;
    const deepLinkingUrl = (0, react_redux_1.useSelector)(functions_3.generateDeepLinkingURL);
    const room = (0, react_redux_1.useSelector)((state) => decodeURIComponent(state['features/base/conference'].room || ''));
    const url = (0, react_redux_1.useSelector)((state) => state['features/base/connection'] || {});
    const dispatch = (0, react_redux_1.useDispatch)();
    const { classes: styles } = useStyles();
    const generateDownloadURL = (0, react_1.useCallback)(() => {
        const { downloadLink, dynamicLink, appScheme } = (deeplinkingCfg?.[Platform_web_1.default.OS] || {});
        if (downloadLink && typeof dynamicLink === 'undefined') {
            return downloadLink;
        }
        const { apn, appCode, customDomain, ibi, isi } = dynamicLink || {};
        const domain = customDomain ?? `https://${appCode}.app.goo.gl`;
        return `${domain}/?link=${encodeURIComponent(window.location.href)}&apn=${apn}&ibi=${ibi}&isi=${isi}&ius=${appScheme}&efr=1`;
    }, [deeplinkingCfg]);
    const onDownloadApp = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('clicked', 'downloadAppButton', { isMobileBrowser: true }));
    }, []);
    const onLaunchWeb = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('clicked', 'launchWebButton', { isMobileBrowser: true }));
        dispatch((0, actions_1.openWebApp)());
    }, []);
    const onOpenApp = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('clicked', 'openAppButton', { isMobileBrowser: true }));
    }, []);
    const onOpenLinkProperties = (0, react_1.useMemo)(() => {
        const { downloadLink } = (deeplinkingCfg?.[Platform_web_1.default.OS] || {});
        if (downloadLink) {
            return {
            // When opening a link to the download page, we want to let the
            // OS itself handle intercepting and opening the appropriate
            // app store. This avoids potential issues with browsers, such
            // as iOS Chrome, not opening the store properly.
            };
        }
        return {
            // When falling back to another URL (Firebase) let the page be
            // opened in a new window. This helps prevent the user getting
            // trapped in an app-open-cycle where going back to the mobile
            // browser re-triggers the app-open behavior.
            target: '_blank',
            rel: 'noopener noreferrer'
        };
    }, [deeplinkingCfg]);
    (0, react_1.useEffect)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('displayed', 'DeepLinkingMobile', { isMobileBrowser: true }));
    }, []);
    return (react_1.default.createElement("div", { className: styles.container },
        react_1.default.createElement("div", { className: styles.contentPane },
            !hideLogo && (react_1.default.createElement("img", { alt: t('welcomepage.logo.logoDeepLinking'), src: 'images/logo-deep-linking-mobile.png' })),
            react_1.default.createElement("div", { className: styles.launchingMeetingLabel }, t(`${constants_1._TNS}.launchMeetingLabel`)),
            react_1.default.createElement("div", { className: '' }, room),
            react_1.default.createElement("a", { ...onOpenLinkProperties, className: styles.joinMeetWrapper, href: deepLinkingUrl, onClick: onOpenApp, target: '_top' },
                react_1.default.createElement(Button_1.default, { fullWidth: true, label: t(`${constants_1._TNS}.joinInAppNew`) })),
            react_1.default.createElement("div", { className: styles.labelDescription }, t(`${constants_1._TNS}.noMobileApp`)),
            react_1.default.createElement("a", { ...onOpenLinkProperties, className: styles.linkWrapper, href: generateDownloadURL(), onClick: onDownloadApp, target: '_top' },
                react_1.default.createElement("div", { className: styles.linkLabel }, t(`${constants_1._TNS}.downloadMobileApp`))),
            (0, environment_1.isSupportedMobileBrowser)() ? (react_1.default.createElement("div", { className: styles.supportedBrowserContent },
                react_1.default.createElement("div", { className: styles.labelOr }, t(`${constants_1._TNS}.or`)),
                react_1.default.createElement("a", { className: styles.linkWrapper, onClick: onLaunchWeb, target: '_top' },
                    react_1.default.createElement("div", { className: styles.linkLabel }, t(`${constants_1._TNS}.joinInBrowser`))))) : (react_1.default.createElement("div", { className: styles.labelDescription }, t(`${constants_1._TNS}.unsupportedBrowser`))),
            react_1.default.createElement("div", { className: styles.separator }),
            react_1.default.createElement(DialInSummary_1.default, { className: 'deep-linking-dial-in', clickableNumbers: true, hideError: true, room: room, url: url }))));
};
exports.default = (0, functions_2.translate)(DeepLinkingMobilePage);
