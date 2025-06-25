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
const Dialog_1 = __importDefault(require("../../../../base/ui/components/web/Dialog"));
const Spinner_1 = __importDefault(require("../../../../base/ui/components/web/Spinner"));
const actions_1 = require("../../../../google-api/actions");
const GoogleSignInButton_web_1 = __importDefault(require("../../../../google-api/components/GoogleSignInButton.web"));
const constants_1 = require("../../../../google-api/constants");
const AbstractStartLiveStreamDialog_1 = __importStar(require("../AbstractStartLiveStreamDialog"));
const StreamKeyForm_1 = __importDefault(require("./StreamKeyForm"));
const StreamKeyPicker_1 = __importDefault(require("./StreamKeyPicker"));
/**
 * A React Component for requesting a YouTube stream key to use for live
 * streaming of the current conference.
 *
 * @augments Component
 */
class StartLiveStreamDialog extends AbstractStartLiveStreamDialog_1.default {
    /**
     * Initializes a new {@code StartLiveStreamDialog} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code StartLiveStreamDialog} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onGetYouTubeBroadcasts = this._onGetYouTubeBroadcasts.bind(this);
        this._onInitializeGoogleApi = this._onInitializeGoogleApi.bind(this);
        this._onGoogleSignIn = this._onGoogleSignIn.bind(this);
        this._onRequestGoogleSignIn = this._onRequestGoogleSignIn.bind(this);
        this._onYouTubeBroadcastIDSelected
            = this._onYouTubeBroadcastIDSelected.bind(this);
    }
    /**
     * Implements {@link Component#componentDidMount()}. Invoked immediately
     * after this component is mounted.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        super.componentDidMount();
        if (this.props._googleApiApplicationClientID) {
            this._onInitializeGoogleApi();
        }
    }
    /**
     * Implements {@code Component}'s render.
     *
     * @inheritdoc
     */
    render() {
        const { _googleApiApplicationClientID } = this.props;
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.startLiveStreaming' }, onCancel: this._onCancel, onSubmit: this._onSubmit, titleKey: 'liveStreaming.start' },
            react_1.default.createElement("div", { className: 'live-stream-dialog' },
                _googleApiApplicationClientID
                    ? this._renderYouTubePanel() : null,
                react_1.default.createElement(StreamKeyForm_1.default, { onChange: this._onStreamKeyChange, value: this.state.streamKey || this.props._streamKey || '' }))));
    }
    /**
     * Loads the Google web client application used for fetching stream keys.
     * If the user is already logged in, then a request for available YouTube
     * broadcasts is also made.
     *
     * @private
     * @returns {void}
     */
    _onInitializeGoogleApi() {
        this.props.dispatch((0, actions_1.loadGoogleAPI)())
            .catch((response) => this._parseErrorFromResponse(response));
    }
    /**
     * Automatically selects the input field's value after starting to edit the
     * display name.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(previousProps) {
        if (previousProps._googleAPIState === constants_1.GOOGLE_API_STATES.LOADED
            && this.props._googleAPIState === constants_1.GOOGLE_API_STATES.SIGNED_IN) {
            this._onGetYouTubeBroadcasts();
        }
    }
    /**
     * Asks the user to sign in, if not already signed in, and then requests a
     * list of the user's YouTube broadcasts.
     *
     * @private
     * @returns {void}
     */
    _onGetYouTubeBroadcasts() {
        this.props.dispatch((0, actions_1.updateProfile)())
            .catch((response) => this._parseErrorFromResponse(response));
        this.props.dispatch((0, actions_1.requestAvailableYouTubeBroadcasts)())
            .then((broadcasts) => {
            this._setStateIfMounted({
                broadcasts
            });
            if (broadcasts.length === 1) {
                const broadcast = broadcasts[0];
                this._onYouTubeBroadcastIDSelected(broadcast.boundStreamID);
            }
        })
            .catch((response) => this._parseErrorFromResponse(response));
    }
    /**
     * Forces the Google web client application to prompt for a sign in, such as
     * when changing account, and will then fetch available YouTube broadcasts.
     *
     * @private
     * @returns {Promise}
     */
    _onGoogleSignIn() {
        this.props.dispatch((0, actions_1.signIn)())
            .catch((response) => this._parseErrorFromResponse(response));
    }
    /**
     * Forces the Google web client application to prompt for a sign in, such as
     * when changing account, and will then fetch available YouTube broadcasts.
     *
     * @private
     * @returns {Promise}
     */
    _onRequestGoogleSignIn() {
        // when there is an error we show the google sign-in button.
        // once we click it we want to clear the error from the state
        this.props.dispatch((0, actions_1.showAccountSelection)())
            .then(() => this._setStateIfMounted({
            broadcasts: undefined,
            errorType: undefined
        }))
            .then(() => this._onGetYouTubeBroadcasts());
    }
    /**
     * Fetches the stream key for a YouTube broadcast and updates the internal
     * state to display the associated stream key as being entered.
     *
     * @param {string} boundStreamID - The bound stream ID associated with the
     * broadcast from which to get the stream key.
     * @private
     * @returns {Promise}
     */
    _onYouTubeBroadcastIDSelected(boundStreamID) {
        this.props.dispatch((0, actions_1.requestLiveStreamsForYouTubeBroadcast)(boundStreamID))
            .then(({ streamKey, selectedBoundStreamID }) => this._setStateIfMounted({
            streamKey,
            selectedBoundStreamID
        }));
    }
    /**
     * Only show an error if an external request was made with the Google api.
     * Do not error if the login in canceled.
     * And searches in a Google API error response for the error type.
     *
     * @param {Object} response - The Google API response that may contain an
     * error.
     * @private
     * @returns {string|null}
     */
    _parseErrorFromResponse(response) {
        if (!response?.result) {
            return;
        }
        const result = response.result;
        const error = result.error;
        const errors = error?.errors;
        const firstError = errors?.[0];
        this._setStateIfMounted({
            errorType: firstError?.reason || null
        });
    }
    /**
     * Renders a React Element for authenticating with the Google web client.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderYouTubePanel() {
        const { t, _googleProfileEmail } = this.props;
        const { broadcasts, selectedBoundStreamID } = this.state;
        let googleContent, helpText;
        switch (this.props._googleAPIState) {
            case constants_1.GOOGLE_API_STATES.LOADED:
                googleContent
                    = react_1.default.createElement(GoogleSignInButton_web_1.default, { onClick: this._onGoogleSignIn });
                helpText = t('liveStreaming.signInCTA');
                break;
            case constants_1.GOOGLE_API_STATES.SIGNED_IN:
                if (broadcasts) {
                    googleContent = (react_1.default.createElement(StreamKeyPicker_1.default, { broadcasts: broadcasts, onBroadcastSelected: this._onYouTubeBroadcastIDSelected, selectedBoundStreamID: selectedBoundStreamID }));
                }
                else {
                    googleContent
                        = react_1.default.createElement(Spinner_1.default, null);
                }
                /**
                 * FIXME: Ideally this help text would be one translation string
                 * that also accepts the anchor. This can be done using the Trans
                 * component of react-i18next but I couldn't get it working...
                 */
                helpText = (react_1.default.createElement("div", null,
                    `${t('liveStreaming.chooseCTA', { email: _googleProfileEmail })} `,
                    react_1.default.createElement("a", { onClick: this._onRequestGoogleSignIn }, t('liveStreaming.changeSignIn'))));
                break;
            case constants_1.GOOGLE_API_STATES.NEEDS_LOADING:
            default:
                googleContent
                    = react_1.default.createElement(Spinner_1.default, null);
                break;
        }
        if (this.state.errorType !== undefined) {
            googleContent = (react_1.default.createElement(GoogleSignInButton_web_1.default, { onClick: this._onRequestGoogleSignIn }));
            helpText = this._getGoogleErrorMessageToDisplay();
        }
        return (react_1.default.createElement("div", { className: 'google-panel' },
            react_1.default.createElement("div", { className: 'live-stream-cta' }, helpText),
            react_1.default.createElement("div", { className: 'google-api' }, googleContent)));
    }
    /**
     * Returns the error message to display for the current error state.
     *
     * @private
     * @returns {string} The error message to display.
     */
    _getGoogleErrorMessageToDisplay() {
        let text;
        switch (this.state.errorType) {
            case 'liveStreamingNotEnabled':
                text = this.props.t('liveStreaming.errorLiveStreamNotEnabled', { email: this.props._googleProfileEmail });
                break;
            default:
                text = this.props.t('liveStreaming.errorAPI');
                break;
        }
        return react_1.default.createElement("div", { className: 'google-error' }, text);
    }
}
/**
 * Maps part of the Redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @returns {{
 *     _googleApiApplicationClientID: string
 * }}
*/
function _mapStateToProps(state) {
    return {
        ...(0, AbstractStartLiveStreamDialog_1._mapStateToProps)(state),
        _googleApiApplicationClientID: state['features/base/config'].googleApiApplicationClientID
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(StartLiveStreamDialog));
