"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const actions_web_1 = require("../../../authentication/actions.web");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const AbstractDialogTab_1 = __importDefault(require("../../../base/dialog/components/web/AbstractDialogTab"));
const functions_2 = require("../../../base/i18n/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const styles = (theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '0 2px'
        },
        avatarContainer: {
            display: 'flex',
            width: '100%',
            justifyContent: 'center',
            marginBottom: theme.spacing(4)
        },
        bottomMargin: {
            marginBottom: theme.spacing(4)
        },
        label: {
            color: `${theme.palette.text01} !important`,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            marginBottom: theme.spacing(2)
        },
        name: {
            marginBottom: theme.spacing(1)
        }
    };
};
/**
 * React {@code Component} for modifying the local user's profile.
 *
 * @augments Component
 */
class ProfileTab extends AbstractDialogTab_1.default {
    /**
     * Initializes a new {@code ConnectedSettingsDialog} instance.
     *
     * @param {IProps} props - The React {@code Component} props to initialize
     * the new {@code ConnectedSettingsDialog} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._onAuthToggle = this._onAuthToggle.bind(this);
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onEmailChange = this._onEmailChange.bind(this);
    }
    /**
     * Changes display name of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onDisplayNameChange(value) {
        super._onChange({ displayName: value });
    }
    /**
     * Changes email of the user.
     *
     * @param {string} value - The key event to handle.
     *
     * @returns {void}
     */
    _onEmailChange(value) {
        super._onChange({ email: value });
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { authEnabled, displayName, email, hideEmailInSettings, id, readOnlyName, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", { className: classes.container },
            react_1.default.createElement("div", { className: classes.avatarContainer },
                react_1.default.createElement(Avatar_1.default, { participantId: id, size: 60 })),
            react_1.default.createElement(Input_1.default, { className: classes.bottomMargin, disabled: readOnlyName, id: 'setDisplayName', label: t('profile.setDisplayNameLabel'), name: 'name', onChange: this._onDisplayNameChange, placeholder: t('settings.name'), type: 'text', value: displayName }),
            !hideEmailInSettings && react_1.default.createElement("div", { className: 'profile-edit-field' },
                react_1.default.createElement(Input_1.default, { className: classes.bottomMargin, id: 'setEmail', label: t('profile.setEmailLabel'), name: 'email', onChange: this._onEmailChange, placeholder: t('profile.setEmailInput'), type: 'text', value: email })),
            authEnabled && this._renderAuth()));
    }
    /**
     * Shows the dialog for logging in or out of a server and closes this
     * dialog.
     *
     * @private
     * @returns {void}
     */
    _onAuthToggle() {
        if (this.props.authLogin) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createProfilePanelButtonEvent)('logout.button'));
            this.props.dispatch((0, actions_web_1.logout)());
        }
        else {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createProfilePanelButtonEvent)('login.button'));
            this.props.dispatch((0, actions_web_1.login)());
        }
    }
    /**
     * Returns a React Element for interacting with server-side authentication.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderAuth() {
        const { authLogin, t } = this.props;
        const classes = mui_1.withStyles.getClasses(this.props);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h2", { className: classes.label }, t('toolbar.authenticate')),
            authLogin
                && react_1.default.createElement("div", { className: classes.name }, t('settings.loggedIn', { name: authLogin })),
            react_1.default.createElement(Button_1.default, { accessibilityLabel: authLogin ? t('toolbar.logout') : t('toolbar.login'), id: 'login_button', label: authLogin ? t('toolbar.logout') : t('toolbar.login'), onClick: this._onAuthToggle })));
    }
}
ProfileTab.defaultProps = {
    displayName: '',
    email: ''
};
exports.default = (0, mui_1.withStyles)((0, functions_2.translate)((0, react_redux_1.connect)()(ProfileTab)), styles);
