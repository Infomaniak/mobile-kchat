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
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../jaas/functions");
const functions_2 = require("../../../i18n/functions");
/**
 * The CSS style of the element with CSS class {@code rightwatermark}.
 *
 * @private
 */
const _RIGHT_WATERMARK_STYLE = {
    backgroundImage: 'url(images/rightwatermark.png)'
};
/**
 * A Web Component which renders watermarks such as Jits, brand, powered by,
 * etc.
 */
class Watermarks extends react_1.Component {
    /**
     * Initializes a new Watermarks instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        const showBrandWatermark = interfaceConfig.SHOW_BRAND_WATERMARK;
        this.state = {
            brandWatermarkLink: showBrandWatermark ? interfaceConfig.BRAND_WATERMARK_LINK : '',
            showBrandWatermark,
            showPoweredBy: interfaceConfig.SHOW_POWERED_BY
        };
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement("div", null,
            this._renderJitsiWatermark(),
            this._renderBrandWatermark(),
            this._renderPoweredBy()));
    }
    /**
     * Renders a brand watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null} Watermark element or null.
     */
    _renderBrandWatermark() {
        let reactElement = null;
        if (this.state.showBrandWatermark) {
            reactElement = (react_1.default.createElement("div", { className: 'watermark rightwatermark', style: _RIGHT_WATERMARK_STYLE }));
            const { brandWatermarkLink } = this.state;
            if (brandWatermarkLink) {
                reactElement = (react_1.default.createElement("a", { href: brandWatermarkLink, target: '_new' }, reactElement));
            }
        }
        return reactElement;
    }
    /**
     * Renders a Jitsi watermark if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderJitsiWatermark() {
        const { _logoLink, _logoUrl, _showJitsiWatermark } = this.props;
        const { noMargins, t } = this.props;
        const className = `watermark leftwatermark ${noMargins ? 'no-margin' : ''}`;
        let reactElement = null;
        if (_showJitsiWatermark) {
            const style = {
                backgroundImage: `url(${_logoUrl})`,
                position: _logoLink ? 'static' : 'absolute'
            };
            reactElement = (react_1.default.createElement("div", { className: className, style: style }));
            if (_logoLink) {
                reactElement = (react_1.default.createElement("a", { "aria-label": t('jitsiHome', { logo: interfaceConfig.APP_NAME }), className: className, href: _logoLink, target: '_new' }, reactElement));
            }
        }
        return reactElement;
    }
    /**
     * Renders a powered by block if it is enabled.
     *
     * @private
     * @returns {ReactElement|null}
     */
    _renderPoweredBy() {
        if (this.state.showPoweredBy) {
            const { t } = this.props;
            return (react_1.default.createElement("a", { className: 'poweredby', href: 'http://jitsi.org', target: '_new' },
                react_1.default.createElement("span", null,
                    t('poweredby'),
                    " jitsi.org")));
        }
        return null;
    }
}
/**
 * Maps parts of Redux store to component prop types.
 *
 * @param {Object} state - Snapshot of Redux store.
 * @param {Object} ownProps - Component's own props.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { customizationReady, customizationFailed, defaultBranding, useDynamicBrandingData, logoClickUrl, logoImageUrl } = state['features/dynamic-branding'];
    const isValidRoom = state['features/base/conference'].room;
    const { defaultLogoUrl } = state['features/base/config'];
    const { JITSI_WATERMARK_LINK, SHOW_JITSI_WATERMARK } = interfaceConfig;
    let _showJitsiWatermark = (customizationReady && !customizationFailed
        && SHOW_JITSI_WATERMARK)
        || !isValidRoom;
    let _logoUrl = logoImageUrl;
    let _logoLink = logoClickUrl;
    if (useDynamicBrandingData) {
        if ((0, functions_1.isVpaasMeeting)(state)) {
            // don't show logo if request fails or no logo set for vpaas meetings
            _showJitsiWatermark = !customizationFailed && Boolean(logoImageUrl);
        }
        else if (defaultBranding) {
            _logoUrl = defaultLogoUrl;
            _logoLink = JITSI_WATERMARK_LINK;
        }
    }
    else {
        // When there is no custom branding data use defaults
        _logoUrl = ownProps.defaultJitsiLogoURL || defaultLogoUrl;
        _logoLink = JITSI_WATERMARK_LINK;
    }
    return {
        _logoLink,
        _logoUrl,
        _showJitsiWatermark
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(Watermarks));
