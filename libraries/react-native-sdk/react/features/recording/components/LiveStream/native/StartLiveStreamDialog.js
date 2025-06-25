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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const googleApi_native_1 = __importDefault(require("../../../../google-api/googleApi.native"));
const HeaderNavigationButton_1 = __importDefault(require("../../../../mobile/navigation/components/HeaderNavigationButton"));
const ConferenceNavigationContainerRef_1 = require("../../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const actions_1 = require("../../../actions");
const AbstractStartLiveStreamDialog_1 = __importStar(require("../AbstractStartLiveStreamDialog"));
const GoogleSigninForm_1 = __importDefault(require("./GoogleSigninForm"));
const StreamKeyForm_1 = __importDefault(require("./StreamKeyForm"));
const StreamKeyPicker_1 = __importDefault(require("./StreamKeyPicker"));
const styles_1 = __importDefault(require("./styles"));
/**
 * A React Component for requesting a YouTube stream key to use for live
 * streaming of the current conference.
 */
class StartLiveStreamDialog extends AbstractStartLiveStreamDialog_1.default {
    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onStartPress = this._onStartPress.bind(this);
        this._onStreamKeyChangeNative
            = this._onStreamKeyChangeNative.bind(this);
        this._onStreamKeyPick = this._onStreamKeyPick.bind(this);
        this._onUserChanged = this._onUserChanged.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}. Invoked
     * immediately after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { navigation, t } = this.props;
        navigation.setOptions({
            headerRight: () => (<HeaderNavigationButton_1.default label={t('dialog.start')} onPress={this._onStartPress} twoActions={true}/>)
        });
    }
    /**
     * Starts live stream session and goes back to the previous screen.
     *
     * @returns {void}
     */
    _onStartPress() {
        this._onSubmit() && (0, ConferenceNavigationContainerRef_1.goBack)();
    }
    /**
     * Implements {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        return (<JitsiScreen_1.default style={styles_1.default.startLiveStreamContainer}>
                <GoogleSigninForm_1.default onUserChanged={this._onUserChanged}/>
                <StreamKeyPicker_1.default broadcasts={this.state.broadcasts} onChange={this._onStreamKeyPick}/>
                <StreamKeyForm_1.default onChange={this._onStreamKeyChangeNative} value={this.state.streamKey || this.props._streamKey || ''}/>
            </JitsiScreen_1.default>);
    }
    /**
     * Callback to handle stream key changes.
     *
     * FIXME: This is a temporary method to store the streaming key on mobile
     * for easier use, until the Google sign-in is implemented. We don't store
     * the key on web for security reasons (e.g. We don't want to have the key
     * stored if the used signed out).
     *
     * @private
     * @param {string} streamKey - The new key value.
     * @returns {void}
     */
    _onStreamKeyChangeNative(streamKey) {
        this.props.dispatch((0, actions_1.setLiveStreamKey)(streamKey));
        this._onStreamKeyChange(streamKey);
    }
    /**
     * Callback to be invoked when the user selects a stream from the picker.
     *
     * @private
     * @param {string} streamKey - The key of the selected stream.
     * @returns {void}
     */
    _onStreamKeyPick(streamKey) {
        this.setState({
            streamKey
        });
    }
    /**
     * A callback to be invoked when an authenticated user changes, so
     * then we can get (or clear) the YouTube stream key.
     *
     * TODO: Handle errors by showing some indication to the user.
     *
     * @private
     * @param {Object} response - The retrieved signin response.
     * @returns {void}
     */
    _onUserChanged(response) {
        if (response) {
            googleApi_native_1.default.getTokens()
                .then((tokens) => {
                googleApi_native_1.default.getYouTubeLiveStreams(tokens.accessToken)
                    .then((broadcasts) => {
                    this.setState({
                        broadcasts
                    });
                });
            })
                .catch(() => {
                this.setState({
                    broadcasts: undefined,
                    streamKey: undefined
                });
            });
        }
        else {
            this.setState({
                broadcasts: undefined,
                streamKey: undefined
            });
        }
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStartLiveStreamDialog_1._mapStateToProps)(StartLiveStreamDialog));
