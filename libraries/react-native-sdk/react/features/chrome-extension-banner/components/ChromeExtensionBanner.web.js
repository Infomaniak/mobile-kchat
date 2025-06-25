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
// @ts-expect-error
const js_utils_1 = require("@jitsi/js-utils");
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
const functions_2 = require("../../base/conference/functions");
const checkChromeExtensionsInstalled_web_1 = __importDefault(require("../../base/environment/checkChromeExtensionsInstalled.web"));
const utils_1 = require("../../base/environment/utils");
const functions_3 = require("../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../base/icons/components/Icon"));
const svg_1 = require("../../base/icons/svg");
const lib_jitsi_meet_1 = require("../../base/lib-jitsi-meet");
const functions_4 = require("../../jaas/functions");
const logger_1 = __importDefault(require("../logger"));
const emptyObject = {};
/**
 * Local storage key name for flag telling if user checked 'Don't show again' checkbox on the banner
 * If the user checks this before closing the banner, next time he will access a jitsi domain
 * the banner will not be shown regardless of extensions being installed or not.
 */
const DONT_SHOW_AGAIN_CHECKED = 'hide_chrome_extension_banner';
/**
 * Implements a React {@link PureComponent} which displays a banner having a link to the chrome extension.
 *
 * @class ChromeExtensionBanner
 * @augments PureComponent
 */
class ChromeExtensionBanner extends react_1.PureComponent {
    /**
     * Initializes a new {@code ChromeExtensionBanner} instance.
     *
     * @param {Object} props - The read-only React {@code PureComponent} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            dontShowAgainChecked: false,
            closePressed: false,
            shouldShow: false
        };
        this.isEdge = /Edg(e)?/.test(navigator.userAgent);
        this._onClosePressed = this._onClosePressed.bind(this);
        this._onInstallExtensionClick = this._onInstallExtensionClick.bind(this);
        this._shouldNotRender = this._shouldNotRender.bind(this);
        this._onDontShowAgainChange = this._onDontShowAgainChange.bind(this);
        this._onCloseKeyPress = this._onCloseKeyPress.bind(this);
        this._onInstallExtensionKeyPress = this._onInstallExtensionKeyPress.bind(this);
    }
    /**
     * Executed on component update.
     * Checks whether any chrome extension from the config is installed.
     *
     * @inheritdoc
     */
    async componentDidUpdate(prevProps) {
        if (!this._isSupportedEnvironment()) {
            return;
        }
        const { bannerCfg } = this.props;
        const prevBannerCfg = prevProps.bannerCfg;
        if (bannerCfg.url && !prevBannerCfg.url) {
            logger_1.default.info('Chrome extension URL found.');
        }
        if ((bannerCfg.chromeExtensionsInfo || []).length && !(prevBannerCfg.chromeExtensionsInfo || []).length) {
            logger_1.default.info('Chrome extension(s) info found.');
        }
        const hasExtensions = await (0, checkChromeExtensionsInstalled_web_1.default)(this.props.bannerCfg);
        if (hasExtensions?.length
            && hasExtensions.every(ext => !ext)
            && !this.state.shouldShow) {
            this.setState({ shouldShow: true }); // eslint-disable-line
        }
    }
    /**
     * Checks whether the feature is enabled and whether the environment(browser/os)
     * supports it.
     *
     * @returns {boolean}
     */
    _isSupportedEnvironment() {
        return interfaceConfig.SHOW_CHROME_EXTENSION_BANNER
            && lib_jitsi_meet_1.browser.isChromiumBased()
            && !lib_jitsi_meet_1.browser.isTwa()
            && !(0, utils_1.isMobileBrowser)()
            && !this.props.isVpaas;
    }
    /**
     * Closes the banner for the current session.
     *
     * @returns {void}
     */
    _onClosePressed() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createChromeExtensionBannerEvent)(false));
        this.setState({ closePressed: true });
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onCloseKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onClosePressed();
        }
    }
    /**
     * Opens the chrome extension page.
     *
     * @returns {void}
     */
    _onInstallExtensionClick() {
        const { edgeUrl, url } = this.props.bannerCfg;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createChromeExtensionBannerEvent)(true));
        window.open(this.isEdge && edgeUrl ? edgeUrl : url);
        this.setState({ closePressed: true });
    }
    /**
     * KeyPress handler for accessibility.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onInstallExtensionKeyPress(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            this._onClosePressed();
        }
    }
    /**
     * Checks whether the banner should not be rendered.
     *
     * @returns {boolean} Whether to show the banner or not.
     */
    _shouldNotRender() {
        if (!this._isSupportedEnvironment()) {
            return true;
        }
        const dontShowAgain = js_utils_1.jitsiLocalStorage.getItem(DONT_SHOW_AGAIN_CHECKED) === 'true';
        return !this.props.bannerCfg.url
            || dontShowAgain
            || this.state.closePressed
            || !this.state.shouldShow
            || this.props.iAmRecorder;
    }
    /**
    * Handles the current `don't show again` checkbox state.
    *
    * @param {Object} event - Input change event.
    * @returns {void}
    */
    _onDontShowAgainChange(event) {
        this.setState({ dontShowAgainChecked: event.target.checked });
    }
    /**
     * Implements React's {@link PureComponent#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        if (this._shouldNotRender()) {
            if (this.state.dontShowAgainChecked) {
                js_utils_1.jitsiLocalStorage.setItem(DONT_SHOW_AGAIN_CHECKED, 'true');
            }
            return null;
        }
        const { bannerCfg, t } = this.props;
        const mainClassNames = this.props.conference
            ? 'chrome-extension-banner chrome-extension-banner__pos_in_meeting'
            : 'chrome-extension-banner';
        return (react_1.default.createElement("div", { className: mainClassNames },
            react_1.default.createElement("div", { "aria-describedby": 'chrome-extension-banner__text-container', className: 'chrome-extension-banner__container', role: 'banner' },
                react_1.default.createElement("div", { className: 'chrome-extension-banner__icon-container' }),
                react_1.default.createElement("div", { className: 'chrome-extension-banner__text-container', id: 'chrome-extension-banner__text-container' }, t('chromeExtensionBanner.installExtensionText')),
                react_1.default.createElement("div", { "aria-label": t('chromeExtensionBanner.close'), className: 'chrome-extension-banner__close-container', onClick: this._onClosePressed, onKeyPress: this._onCloseKeyPress, role: 'button', tabIndex: 0 },
                    react_1.default.createElement(Icon_1.default, { className: 'gray', size: 12, src: svg_1.IconCloseLarge }))),
            react_1.default.createElement("div", { className: 'chrome-extension-banner__button-container' },
                react_1.default.createElement("div", { "aria-labelledby": 'chrome-extension-banner__button-text', className: 'chrome-extension-banner__button-open-url', onClick: this._onInstallExtensionClick, onKeyPress: this._onInstallExtensionKeyPress, role: 'button', tabIndex: 0 },
                    react_1.default.createElement("div", { className: 'chrome-extension-banner__button-text', id: 'chrome-extension-banner__button-text' }, t(this.isEdge && bannerCfg.edgeUrl
                        ? 'chromeExtensionBanner.buttonTextEdge'
                        : 'chromeExtensionBanner.buttonText')))),
            react_1.default.createElement("div", { className: 'chrome-extension-banner__checkbox-container' },
                react_1.default.createElement("label", { className: 'chrome-extension-banner__checkbox-label', htmlFor: 'chrome-extension-banner__checkbox', id: 'chrome-extension-banner__checkbox-label' },
                    react_1.default.createElement("input", { "aria-labelledby": 'chrome-extension-banner__checkbox-label', checked: this.state.dontShowAgainChecked, id: 'chrome-extension-banner__checkbox', onChange: this._onDontShowAgainChange, type: 'checkbox' }),
                    "\u00A0",
                    t('chromeExtensionBanner.dontShowAgain')))));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const _mapStateToProps = (state) => {
    return {
        // Using emptyObject so that we don't change the reference every time when _mapStateToProps is called.
        bannerCfg: state['features/base/config'].chromeExtensionBanner || emptyObject,
        conference: (0, functions_2.getCurrentConference)(state),
        iAmRecorder: Boolean(state['features/base/config'].iAmRecorder),
        isVpaas: (0, functions_4.isVpaasMeeting)(state)
    };
};
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(ChromeExtensionBanner));
