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
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../../base/dialog/functions");
const functions_2 = require("../../../../base/i18n/functions");
const actions_1 = require("../../../../google-api/actions");
const GoogleSignInButton_native_1 = __importDefault(require("../../../../google-api/components/GoogleSignInButton.native"));
const constants_1 = require("../../../../google-api/constants");
// eslint-disable-next-line lines-around-comment
// @ts-ignore
const googleApi_native_1 = __importDefault(require("../../../../google-api/googleApi.native"));
const logger_1 = __importDefault(require("../../../logger"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Class to render a google sign in form, or a google stream picker dialog.
 *
 * @augments Component
 */
class GoogleSigninForm extends react_1.Component {
    /**
     * Instantiates a new {@code GoogleSigninForm} component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._logGoogleError = this._logGoogleError.bind(this);
        this._onGoogleButtonPress = this._onGoogleButtonPress.bind(this);
    }
    /**
     * Implements React's Component.componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount() {
        googleApi_native_1.default.hasPlayServices()
            .then(() => {
            googleApi_native_1.default.configure({
                offlineAccess: false,
                scopes: [constants_1.GOOGLE_SCOPE_YOUTUBE]
            });
            googleApi_native_1.default.signInSilently().then((response) => {
                this._setApiState(response
                    ? constants_1.GOOGLE_API_STATES.SIGNED_IN
                    : constants_1.GOOGLE_API_STATES.LOADED, response);
            }, () => {
                this._setApiState(constants_1.GOOGLE_API_STATES.LOADED);
            });
        })
            .catch((error) => {
            this._logGoogleError(error);
            this._setApiState(constants_1.GOOGLE_API_STATES.NOT_AVAILABLE);
        });
    }
    /**
     * Renders the component.
     *
     * @inheritdoc
     */
    render() {
        const { _dialogStyles, t } = this.props;
        const { googleAPIState, googleResponse } = this.props;
        const signedInUser = googleResponse?.user?.email;
        if (googleAPIState === constants_1.GOOGLE_API_STATES.NOT_AVAILABLE
            || googleAPIState === constants_1.GOOGLE_API_STATES.NEEDS_LOADING
            || typeof googleAPIState === 'undefined') {
            return null;
        }
        const userInfo = signedInUser
            ? `${t('liveStreaming.signedInAs')} ${signedInUser}`
            : t('liveStreaming.signInCTA');
        return (<react_native_1.View style={styles_1.default.formWrapper}>
                <react_native_1.View style={styles_1.default.helpText}>
                    <react_native_1.Text style={[
                _dialogStyles.text,
                styles_1.default.text
            ]}>
                        {userInfo}
                    </react_native_1.Text>
                </react_native_1.View>
                <GoogleSignInButton_native_1.default onClick={this._onGoogleButtonPress} signedIn={googleAPIState === constants_1.GOOGLE_API_STATES.SIGNED_IN}/>
            </react_native_1.View>);
    }
    /**
     * A helper function to log developer related errors.
     *
     * @private
     * @param {Object} error - The error to be logged.
     * @returns {void}
     */
    _logGoogleError(error) {
        // NOTE: This is a developer error message, not intended for the
        // user to see.
        logger_1.default.error('Google API error. Possible cause: bad config.', error);
    }
    /**
     * Callback to be invoked when the user presses the Google button,
     * regardless of being logged in or out.
     *
     * @private
     * @returns {void}
     */
    _onGoogleButtonPress() {
        const { googleResponse } = this.props;
        if (googleResponse?.user) {
            // the user is signed in
            this._onSignOut();
        }
        else {
            this._onSignIn();
        }
    }
    /**
     * Initiates a sign in if the user is not signed in yet.
     *
     * @private
     * @returns {void}
     */
    _onSignIn() {
        googleApi_native_1.default.signIn().then((response) => {
            this._setApiState(constants_1.GOOGLE_API_STATES.SIGNED_IN, response);
        }, this._logGoogleError);
    }
    /**
     * Initiates a sign out if the user is signed in.
     *
     * @private
     * @returns {void}
     */
    _onSignOut() {
        googleApi_native_1.default.signOut().then((response) => {
            this._setApiState(constants_1.GOOGLE_API_STATES.LOADED, response);
        }, this._logGoogleError);
    }
    /**
     * Updates the API (Google Auth) state.
     *
     * @private
     * @param {number} apiState - The state of the API.
     * @param {?Object} googleResponse - The response from the API.
     * @returns {void}
     */
    _setApiState(apiState, googleResponse) {
        this.props.onUserChanged(googleResponse);
        this.props.dispatch((0, actions_1.setGoogleAPIState)(apiState, googleResponse));
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code GoogleSigninForm} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     googleAPIState: number,
  *    googleResponse: Object
 * }}
 */
function _mapStateToProps(state) {
    const { googleAPIState, googleResponse } = state['features/google-api'];
    return {
        ...(0, functions_1._abstractMapStateToProps)(state),
        googleAPIState,
        googleResponse
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(GoogleSigninForm));
