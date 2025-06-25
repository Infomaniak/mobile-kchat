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
const react_native_dialog_1 = __importDefault(require("react-native-dialog"));
const react_redux_1 = require("react-redux");
const actions_native_1 = require("../../../base/connection/actions.native");
const functions_1 = require("../../../base/connection/functions");
const functions_2 = require("../../../base/dialog/functions");
const functions_3 = require("../../../base/i18n/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const actions_native_2 = require("../../actions.native");
/**
 * Dialog asks user for username and password.
 *
 * First authentication configuration that it will deal with is the main XMPP
 * domain (config.hosts.domain) with password authentication. A LoginDialog
 * will be opened after 'CONNECTION_FAILED' action with
 * 'JitsiConnectionErrors.PASSWORD_REQUIRED' error. After username and password
 * are entered a new 'connect' action from 'features/base/connection' will be
 * triggered which will result in new XMPP connection. The conference will start
 * if the credentials are correct.
 *
 * The second setup is the main XMPP domain with password plus guest domain with
 * anonymous access configured under 'config.hosts.anonymousdomain'. In such
 * case user connects from the anonymous domain, but if the room does not exist
 * yet, Jicofo will not allow to start new conference. This will trigger
 * 'CONFERENCE_FAILED' action with JitsiConferenceErrors.AUTHENTICATION_REQUIRED
 * error and 'authRequired' value of 'features/base/conference' will hold
 * the {@link JitsiConference} instance. If user decides to authenticate, a
 * new/separate XMPP connection is established and authentication is performed.
 * In case it succeeds, Jicofo will assign new session ID which then can be used
 * from the anonymous domain connection to create and join the room. This part
 * is done by {@link JitsiConference#authenticateAndUpgradeRole} in
 * lib-jitsi-meet.
 *
 * See {@link https://github.com/jitsi/jicofo#secure-domain} for a description
 * of the configuration parameters.
 */
class LoginDialog extends react_1.Component {
    /**
     * Initializes a new LoginDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onPasswordChange = this._onPasswordChange.bind(this);
        this._onUsernameChange = this._onUsernameChange.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _connecting: connecting, t } = this.props;
        return (<react_native_dialog_1.default.Container coverScreen={false} visible={true}>
                <react_native_dialog_1.default.Title>
                    {t('dialog.login')}
                </react_native_dialog_1.default.Title>
                <react_native_dialog_1.default.Input autoCapitalize={'none'} autoCorrect={false} onChangeText={this._onUsernameChange} placeholder={'user@domain.com'} spellCheck={false} value={this.state.username}/>
                <react_native_dialog_1.default.Input autoCapitalize={'none'} onChangeText={this._onPasswordChange} placeholder={t('dialog.userPassword')} secureTextEntry={true} value={this.state.password}/>
                <react_native_dialog_1.default.Description>
                    {this._renderMessage()}
                </react_native_dialog_1.default.Description>
                <react_native_dialog_1.default.Button label={t('dialog.Cancel')} onPress={this._onCancel}/>
                <react_native_dialog_1.default.Button disabled={connecting} label={t('dialog.Ok')} onPress={this._onLogin}/>
            </react_native_dialog_1.default.Container>);
    }
    /**
     * Renders an optional message, if applicable.
     *
     * @returns {ReactElement}
     * @private
     */
    _renderMessage() {
        const { _connecting: connecting, _error: error, _progress: progress, t } = this.props;
        let messageKey;
        const messageOptions = { msg: '' };
        if (progress && progress < 1) {
            messageKey = 'connection.FETCH_SESSION_ID';
        }
        else if (error) {
            const { name } = error;
            if (name === lib_jitsi_meet_1.JitsiConnectionErrors.PASSWORD_REQUIRED) {
                // Show a message that the credentials are incorrect only if the
                // credentials which have caused the connection to fail are the
                // ones which the user sees.
                const { credentials } = error;
                if (credentials
                    && credentials.jid
                        === (0, functions_1.toJid)(this.state.username, this.props._configHosts ?? {})
                    && credentials.password === this.state.password) {
                    messageKey = 'dialog.incorrectPassword';
                }
            }
            else if (name) {
                messageKey = 'dialog.connectErrorWithMsg';
                messageOptions.msg = `${name} ${error.message}`;
            }
        }
        else if (connecting) {
            messageKey = 'connection.CONNECTING';
        }
        if (messageKey) {
            return t(messageKey, messageOptions);
        }
        return null;
    }
    /**
     * Called when user edits the username.
     *
     * @param {string} text - A new username value entered by user.
     * @returns {void}
     * @private
     */
    _onUsernameChange(text) {
        this.setState({
            username: text.trim()
        });
    }
    /**
     * Called when user edits the password.
     *
     * @param {string} text - A new password value entered by user.
     * @returns {void}
     * @private
     */
    _onPasswordChange(text) {
        this.setState({
            password: text
        });
    }
    /**
     * Notifies this LoginDialog that it has been dismissed by cancel.
     *
     * @private
     * @returns {void}
     */
    _onCancel() {
        this.props.dispatch((0, actions_native_2.cancelLogin)());
    }
    /**
     * Notifies this LoginDialog that the login button (OK) has been pressed by
     * the user.
     *
     * @private
     * @returns {void}
     */
    _onLogin() {
        const { _conference: conference, dispatch } = this.props;
        const { password, username } = this.state;
        const jid = (0, functions_1.toJid)(username, this.props._configHosts ?? {});
        let r;
        // If there's a conference it means that the connection has succeeded,
        // but authentication is required in order to join the room.
        if (conference) {
            r = dispatch((0, actions_native_2.authenticateAndUpgradeRole)(jid, password, conference));
        }
        else {
            r = dispatch((0, actions_native_1.connect)(jid, password));
        }
        return r;
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code LoginDialog} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { error: authenticateAndUpgradeRoleError, progress, thenableWithCancel } = state['features/authentication'];
    const { authRequired, conference } = state['features/base/conference'];
    const { hosts: configHosts } = state['features/base/config'];
    const { connecting, error: connectionError } = state['features/base/connection'];
    return {
        ...(0, functions_2._abstractMapStateToProps)(state),
        _conference: authRequired || conference,
        _configHosts: configHosts,
        _connecting: Boolean(connecting) || Boolean(thenableWithCancel),
        _error: connectionError || authenticateAndUpgradeRoleError,
        _progress: progress
    };
}
exports.default = (0, functions_3.translate)((0, react_redux_1.connect)(_mapStateToProps)(LoginDialog));
