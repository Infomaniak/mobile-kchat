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
const functions_any_1 = require("../../base/config/functions.any");
const environment_1 = require("../../base/environment/environment");
const functions_2 = require("../../base/i18n/functions");
const Platform_web_1 = __importDefault(require("../../base/react/Platform.web"));
const functions_web_1 = require("../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../base/ui/components/web/Button"));
const constants_any_1 = require("../../base/ui/constants.any");
const actions_1 = require("../actions");
const constants_1 = require("../constants");
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        container: {
            background: '#1E1E1E',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            display: 'flex'
        },
        contentPane: {
            display: 'flex',
            flexDirection: 'column',
            background: theme.palette.ui01,
            border: `1px solid ${theme.palette.ui03}`,
            padding: 40,
            borderRadius: 16,
            maxWidth: 410,
            color: theme.palette.text01
        },
        logo: {
            marginBottom: 32
        },
        launchingMeetingLabel: {
            marginBottom: 16,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading4)
        },
        roomName: {
            marginBottom: 32,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading5)
        },
        descriptionLabel: {
            marginBottom: 32,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyLongRegular)
        },
        buttonsContainer: {
            display: 'flex',
            justifyContent: 'flex-start',
            '& > *:not(:last-child)': {
                marginRight: 16
            }
        },
        separator: {
            marginTop: 40,
            height: 1,
            maxWidth: 390,
            background: theme.palette.ui03
        },
        label: {
            marginTop: 40,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text02,
            '& a': {
                color: theme.palette.link01
            }
        }
    };
});
const DeepLinkingDesktopPage = ({ t }) => {
    const dispatch = (0, react_redux_1.useDispatch)();
    const room = (0, react_redux_1.useSelector)((state) => decodeURIComponent(state['features/base/conference'].room || ''));
    const deeplinkingCfg = (0, react_redux_1.useSelector)((state) => state['features/base/config']?.deeplinking || {});
    const generateDownloadURL = (0, react_1.useCallback)(() => {
        const downloadCfg = deeplinkingCfg.desktop?.download;
        if (downloadCfg) {
            return downloadCfg[Platform_web_1.default.OS];
        }
    }, [deeplinkingCfg]);
    const legalUrls = (0, react_redux_1.useSelector)(functions_any_1.getLegalUrls);
    const { hideLogo, desktop } = deeplinkingCfg;
    const { classes: styles } = useStyles();
    const onLaunchWeb = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('clicked', 'launchWebButton', { isMobileBrowser: false }));
        dispatch((0, actions_1.openWebApp)());
    }, []);
    const onTryAgain = (0, react_1.useCallback)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('clicked', 'tryAgainButton', { isMobileBrowser: false }));
        dispatch((0, actions_1.openDesktopApp)());
    }, []);
    (0, react_1.useEffect)(() => {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('displayed', 'DeepLinkingDesktop', { isMobileBrowser: false }));
    }, []);
    return (react_1.default.createElement("div", { className: styles.container },
        react_1.default.createElement("div", { className: styles.contentPane },
            react_1.default.createElement("div", { className: 'header' }, !hideLogo
                && react_1.default.createElement("img", { alt: t('welcomepage.logo.logoDeepLinking'), className: styles.logo, src: 'images/logo-deep-linking.png' })),
            react_1.default.createElement("div", { className: styles.launchingMeetingLabel }, t(`${constants_1._TNS}.titleNew`)),
            react_1.default.createElement("div", { className: styles.roomName }, room),
            react_1.default.createElement("div", { className: styles.descriptionLabel }, (0, environment_1.isSupportedBrowser)()
                ? (0, functions_2.translateToHTML)(t, `${constants_1._TNS}.descriptionNew`, { app: desktop?.appName })
                : t(`${constants_1._TNS}.descriptionWithoutWeb`, { app: desktop?.appName })),
            react_1.default.createElement("div", { className: styles.descriptionLabel },
                t(`${constants_1._TNS}.noDesktopApp`),
                " \u00A0",
                react_1.default.createElement("a", { href: generateDownloadURL() }, t(`${constants_1._TNS}.downloadApp`))),
            react_1.default.createElement("div", { className: styles.buttonsContainer },
                react_1.default.createElement(Button_1.default, { label: t(`${constants_1._TNS}.tryAgainButton`), onClick: onTryAgain }),
                (0, environment_1.isSupportedBrowser)() && (react_1.default.createElement(Button_1.default, { label: t(`${constants_1._TNS}.launchWebButton`), onClick: onLaunchWeb, type: constants_any_1.BUTTON_TYPES.SECONDARY }))),
            react_1.default.createElement("div", { className: styles.separator }),
            react_1.default.createElement("div", { className: styles.label },
                " ",
                (0, functions_2.translateToHTML)(t, 'deepLinking.termsAndConditions', {
                    termsAndConditionsLink: legalUrls.terms
                })))));
};
exports.default = (0, functions_2.translate)(DeepLinkingDesktopPage);
