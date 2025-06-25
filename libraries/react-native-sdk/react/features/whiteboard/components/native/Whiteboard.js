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
const functions_1 = require("../../../base/conference/functions");
const actions_1 = require("../../../base/dialog/actions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/native/LoadingIndicator"));
const uri_1 = require("../../../base/util/uri");
const HeaderNavigationButton_1 = __importDefault(require("../../../mobile/navigation/components/HeaderNavigationButton"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const actions_native_1 = require("../../actions.native");
const constants_1 = require("../../constants");
const functions_3 = require("../../functions");
const logger_1 = __importDefault(require("../../logger"));
const WhiteboardErrorDialog_1 = __importDefault(require("./WhiteboardErrorDialog"));
const styles_1 = __importStar(require("./styles"));
/**
 * Implements a React native component that displays the whiteboard page for a specific room.
 */
class Whiteboard extends react_1.PureComponent {
    /**
     * Initializes a new instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onError = this._onError.bind(this);
        this._onNavigate = this._onNavigate.bind(this);
        this._onMessage = this._onMessage.bind(this);
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
        const headerLeft = () => {
            if (react_native_1.Platform.OS === 'ios') {
                return (<HeaderNavigationButton_1.default label={t('dialog.close')} onPress={ConferenceNavigationContainerRef_1.goBack}/>);
            }
            return (<HeaderNavigationButton_1.default onPress={ConferenceNavigationContainerRef_1.goBack} src={svg_1.IconCloseLarge}/>);
        };
        navigation.setOptions({ headerLeft });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { locationHref, route } = this.props;
        const collabServerUrl = (0, uri_1.safeDecodeURIComponent)(route.params?.collabServerUrl);
        const localParticipantName = (0, uri_1.safeDecodeURIComponent)(route.params?.localParticipantName);
        const collabDetails = route.params?.collabDetails;
        const uri = (0, functions_3.getWhiteboardInfoForURIString)(locationHref, collabServerUrl, collabDetails, localParticipantName) ?? '';
        return (<JitsiScreen_1.default safeAreaInsets={['bottom', 'left', 'right']} style={styles_1.default.backDrop}>
                <react_native_webview_1.WebView domStorageEnabled={false} incognito={true} javaScriptEnabled={true} nestedScrollEnabled={true} onError={this._onError} onMessage={this._onMessage} onShouldStartLoadWithRequest={this._onNavigate} renderLoading={this._renderLoading} scrollEnabled={true} setSupportMultipleWindows={false} source={{ uri }} startInLoadingState={true} style={styles_1.default.webView} webviewDebuggingEnabled={true}/>
            </JitsiScreen_1.default>);
    }
    /**
     * Callback to handle the error if the page fails to load.
     *
     * @returns {void}
     */
    _onError() {
        this.props.dispatch((0, actions_1.openDialog)(WhiteboardErrorDialog_1.default));
    }
    /**
     * Callback to intercept navigation inside the webview and make the native app handle the whiteboard requests.
     *
     * NOTE: We don't navigate to anywhere else from that view.
     *
     * @param {any} request - The request object.
     * @returns {boolean}
     */
    _onNavigate(request) {
        const { url } = request;
        const { locationHref, route } = this.props;
        const collabServerUrl = route.params?.collabServerUrl;
        const collabDetails = route.params?.collabDetails;
        const localParticipantName = route.params?.localParticipantName;
        return url === (0, functions_3.getWhiteboardInfoForURIString)(locationHref, collabServerUrl, collabDetails, localParticipantName);
    }
    /**
     * Callback to handle the message events.
     *
     * @param {any} event - The event.
     * @returns {void}
     */
    _onMessage(event) {
        const { conference, dispatch } = this.props;
        const collabData = JSON.parse(event.nativeEvent.data);
        if (!collabData) {
            logger_1.default.error('Message payload is missing whiteboard collaboration data');
            return;
        }
        const { collabDetails, collabServerUrl } = collabData;
        if (collabDetails?.roomId && collabDetails?.roomKey && collabServerUrl) {
            dispatch((0, actions_native_1.setupWhiteboard)({
                collabDetails,
                collabServerUrl
            }));
            // Broadcast the collab details.
            conference?.getMetadataHandler().setMetadata(constants_1.WHITEBOARD_ID, {
                collabServerUrl,
                collabDetails
            });
        }
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
/**
 * Maps (parts of) the redux state to the associated
 * {@code WaitForOwnerDialog}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { locationURL } = state['features/base/connection'];
    const { href = '' } = locationURL ?? {};
    return {
        conference: (0, functions_1.getCurrentConference)(state),
        locationHref: href
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(Whiteboard));
