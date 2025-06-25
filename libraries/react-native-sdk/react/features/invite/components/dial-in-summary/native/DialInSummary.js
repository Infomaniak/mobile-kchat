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
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../../base/dialog/actions");
const functions_1 = require("../../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../../base/react/components/native/LoadingIndicator"));
const functions_2 = require("../../../functions");
const DialInSummaryErrorDialog_1 = __importDefault(require("./DialInSummaryErrorDialog"));
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a React native component that displays the dial in info page for a specific room.
 */
class DialInSummary extends react_1.PureComponent {
    /**
     * Initializes a new instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onError = this._onError.bind(this);
        this._onNavigate = this._onNavigate.bind(this);
        this._renderLoading = this._renderLoading.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after mounting occurs.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { navigation, t } = this.props;
        navigation.setOptions({
            headerTitle: t('dialIn.screenTitle')
        });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { route } = this.props;
        const summaryUrl = route.params?.summaryUrl;
        return (<JitsiScreen_1.default style={styles_1.default.backDrop}>
                <react_native_webview_1.WebView incognito={true} onError={this._onError} onShouldStartLoadWithRequest={this._onNavigate} renderLoading={this._renderLoading} setSupportMultipleWindows={false} source={{ uri: (0, functions_2.getDialInfoPageURLForURIString)(summaryUrl) ?? '' }} startInLoadingState={true} style={styles_1.default.webView} webviewDebuggingEnabled={true}/>
            </JitsiScreen_1.default>);
    }
    /**
     * Callback to handle the error if the page fails to load.
     *
     * @returns {void}
     */
    _onError() {
        this.props.dispatch((0, actions_1.openDialog)(DialInSummaryErrorDialog_1.default));
    }
    /**
     * Callback to intercept navigation inside the webview and make the native app handle the dial requests.
     *
     * NOTE: We don't navigate to anywhere else form that view.
     *
     * @param {any} request - The request object.
     * @returns {boolean}
     */
    _onNavigate(request) {
        const { url } = request;
        const { route } = this.props;
        const summaryUrl = route.params?.summaryUrl;
        if (url.startsWith('tel:')) {
            react_native_1.Linking.openURL(url);
        }
        return url === (0, functions_2.getDialInfoPageURLForURIString)(summaryUrl);
    }
    /**
     * Renders the loading indicator.
     *
     * @returns {React$Component<any>}
     */
    _renderLoading() {
        return (<react_native_1.View style={styles_1.default.indicatorWrapper}>
                <LoadingIndicator_1.default color={styles_1.INDICATOR_COLOR} size='large'/>
            </react_native_1.View>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(DialInSummary));
