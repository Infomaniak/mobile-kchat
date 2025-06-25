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
const functions_1 = require("../../../base/i18n/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Spinner_1 = __importDefault(require("../../../base/ui/components/web/Spinner"));
const actions_1 = require("../../../calendar-sync/actions");
const MicrosoftSignInButton_1 = __importDefault(require("../../../calendar-sync/components/MicrosoftSignInButton"));
const constants_1 = require("../../../calendar-sync/constants");
const functions_2 = require("../../../calendar-sync/functions");
const GoogleSignInButton_1 = __importDefault(require("../../../google-api/components/GoogleSignInButton"));
const logger_1 = __importDefault(require("../../logger"));
const styles = (theme) => {
    return {
        container: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            minHeight: '100px',
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular)
        },
        button: {
            marginTop: theme.spacing(4)
        }
    };
};
/**
 * React {@code Component} for modifying calendar integration.
 *
 * @augments Component
 */
class CalendarTab extends react_1.Component {
    /**
     * Initializes a new {@code CalendarTab} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onClickDisconnect = this._onClickDisconnect.bind(this);
        this._onClickGoogle = this._onClickGoogle.bind(this);
        this._onClickMicrosoft = this._onClickMicrosoft.bind(this);
    }
    /**
     * Loads third party APIs as needed and bootstraps the initial calendar
     * state if not already set.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.props.dispatch((0, actions_1.bootstrapCalendarIntegration)())
            .catch((err) => logger_1.default.error('CalendarTab bootstrap failed', err))
            .then(() => this.setState({ loading: false }));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const classes = mui_1.withStyles.getClasses(this.props);
        let view;
        if (this.state.loading) {
            view = this._renderLoadingState();
        }
        else if (this.props._isConnectedToCalendar) {
            view = this._renderSignOutState();
        }
        else {
            view = this._renderSignInState();
        }
        return (react_1.default.createElement("div", { className: classes.container }, view));
    }
    /**
     * Dispatches the action to start the sign in flow for a given calendar
     * integration type.
     *
     * @param {string} type - The calendar type to try integrating with.
     * @private
     * @returns {void}
     */
    _attemptSignIn(type) {
        this.props.dispatch((0, actions_1.signIn)(type));
    }
    /**
     * Dispatches an action to sign out of the currently connected third party
     * used for calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickDisconnect() {
        // We clear the integration state instead of actually signing out. This
        // is for two primary reasons. Microsoft does not support a sign out and
        // instead relies on clearing of local auth data. Google signout can
        // also sign the user out of YouTube. So for now we've decided not to
        // do an actual sign out.
        this.props.dispatch((0, actions_1.clearCalendarIntegration)());
    }
    /**
     * Starts the sign in flow for Google calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickGoogle() {
        this._attemptSignIn(constants_1.CALENDAR_TYPE.GOOGLE);
    }
    /**
     * Starts the sign in flow for Microsoft calendar integration.
     *
     * @private
     * @returns {void}
     */
    _onClickMicrosoft() {
        this._attemptSignIn(constants_1.CALENDAR_TYPE.MICROSOFT);
    }
    /**
     * Render a React Element to indicate third party APIs are being loaded.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderLoadingState() {
        return (react_1.default.createElement(Spinner_1.default, null));
    }
    /**
     * Render a React Element to sign into a third party for calendar
     * integration.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSignInState() {
        const { _appName, _enableGoogleIntegration, _enableMicrosoftIntegration, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("p", null, t('settings.calendar.about', { appName: _appName || '' })),
            _enableGoogleIntegration
                && react_1.default.createElement("div", { className: classes.button },
                    react_1.default.createElement(GoogleSignInButton_1.default, { onClick: this._onClickGoogle, text: t('liveStreaming.signIn') })),
            _enableMicrosoftIntegration
                && react_1.default.createElement("div", { className: classes.button },
                    react_1.default.createElement(MicrosoftSignInButton_1.default, { onClick: this._onClickMicrosoft, text: t('settings.calendar.microsoftSignIn') }))));
    }
    /**
     * Render a React Element to sign out of the currently connected third
     * party used for calendar integration.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderSignOutState() {
        const { _profileEmail, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            t('settings.calendar.signedIn', { email: _profileEmail }),
            react_1.default.createElement(Button_1.default, { className: classes.button, id: 'calendar_logout', label: t('settings.calendar.disconnect'), onClick: this._onClickDisconnect })));
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code CalendarTab} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _appName: string,
 *     _enableGoogleIntegration: boolean,
 *     _enableMicrosoftIntegration: boolean,
 *     _isConnectedToCalendar: boolean,
 *     _profileEmail: string
 * }}
 */
function _mapStateToProps(state) {
    const calendarState = state['features/calendar-sync'] || {};
    const { googleApiApplicationClientID, microsoftApiApplicationClientID } = state['features/base/config'];
    const calendarEnabled = (0, functions_2.isCalendarEnabled)(state);
    return {
        _appName: interfaceConfig.APP_NAME,
        _enableGoogleIntegration: Boolean(calendarEnabled && googleApiApplicationClientID),
        _enableMicrosoftIntegration: Boolean(calendarEnabled && microsoftApiApplicationClientID),
        _isConnectedToCalendar: calendarState.integrationReady,
        _profileEmail: calendarState.profileEmail
    };
}
exports.default = (0, mui_1.withStyles)((0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(CalendarTab)), styles);
