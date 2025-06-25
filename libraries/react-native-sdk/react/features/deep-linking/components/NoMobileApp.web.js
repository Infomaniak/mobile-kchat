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
const AnalyticsEvents_1 = require("../../analytics/AnalyticsEvents");
const functions_1 = require("../../analytics/functions");
/**
 * React component representing no mobile app page.
 *
 * @class NoMobileApp
 */
class NoMobileApp extends react_1.Component {
    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    componentDidMount() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createDeepLinkingPageEvent)('displayed', 'noMobileApp', { isMobileBrowser: true }));
    }
    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    render() {
        const ns = 'no-mobile-app';
        const { desktop } = this.props._deeplinkingCfg;
        const { appName } = desktop ?? {};
        return (react_1.default.createElement("div", { className: ns },
            react_1.default.createElement("h2", { className: `${ns}__title` }, "Video chat isn't available on mobile."),
            react_1.default.createElement("p", { className: `${ns}__description` },
                "Please use ",
                appName,
                " on desktop to join calls.")));
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code NoMobileApp} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _deeplinkingCfg: state['features/base/config'].deeplinking || {}
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(NoMobileApp);
