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
const functions_1 = require("../../../base/connection/functions");
const functions_2 = require("../../../base/i18n/functions");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const actions_web_1 = require("../../../prejoin/actions.web");
const actions_web_2 = require("../../actions.web");
/**
 * Component that renders the login in conference dialog.
 *
 *  @returns {React$Element<any>}
 */
class LoginDialog extends react_1.Component {
    /**
     * Initializes a new {@code LoginDialog} instance.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
        this._onCancelLogin = this._onCancelLogin.bind(this);
        this._onLogin = this._onLogin.bind(this);
        this._onUsernameChange = this._onUsernameChange.bind(this);
        this._onPasswordChange = this._onPasswordChange.bind(this);
    }
    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancelLogin() {
        const { dispatch } = this.props;
        dispatch((0, actions_web_2.cancelLogin)());
    }
    /**
     * Notifies this LoginDialog that the login button (OK) has been pressed by
     * the user.
     *
     * @private
     * @returns {void}
     */
    _onLogin() {
        const { _conference: conference, _configHosts: configHosts, dispatch } = this.props;
        const { password, username } = this.state;
        const jid = (0, functions_1.toJid)(username, configHosts ?? {
            authdomain: '',
            domain: ''
        });
        if (conference) {
            dispatch((0, actions_web_2.authenticateAndUpgradeRole)(jid, password, conference));
        }
        else {
            // dispatch(connect(jid, password));
            // FIXME: Workaround for the web version. To be removed once we get rid of conference.js
            dispatch((0, actions_web_1.joinConference)(undefined, false, jid, password));
        }
    }
    /**
     * Callback for the onChange event of the field.
     *
     * @param {string} value - The static event.
     * @returns {void}
     */
    _onPasswordChange(value) {
        this.setState({
            password: value
        });
    }
    /**
     * Callback for the onChange event of the username input.
     *
     * @param {string} value - The new value.
     * @returns {void}
     */
    _onUsernameChange(value) {
        this.setState({
            username: value
        });
    }
    /**
     * Renders an optional message, if applicable.
     *
     * @returns {ReactElement}
     * @private
     */
    renderMessage() {
        const { _configHosts: configHosts, _connecting: connecting, _error: error, _progress: progress, t } = this.props;
        const { username, password } = this.state;
        const messageOptions = {};
        let messageKey;
        if (progress && progress < 1) {
            messageKey = 'connection.FETCH_SESSION_ID';
        }
        else if (error) {
            const { name } = error;
            if (name === lib_jitsi_meet_1.JitsiConnectionErrors.PASSWORD_REQUIRED) {
                const { credentials } = error;
                if (credentials
                    && credentials.jid === (0, functions_1.toJid)(username, configHosts ?? { authdomain: '',
                        domain: '' })
                    && credentials.password === password) {
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
            return (react_1.default.createElement("span", null, (0, functions_2.translateToHTML)(t, messageKey, messageOptions)));
        }
        return null;
    }
    /**
     * Implements {@Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _connecting: connecting, t } = this.props;
        const { password, username } = this.state;
        return (react_1.default.createElement(Dialog_1.default, { disableAutoHideOnSubmit: true, disableBackdropClose: true, hideCloseButton: true, ok: {
                disabled: connecting
                    || !password
                    || !username,
                translationKey: 'dialog.login'
            }, onCancel: this._onCancelLogin, onSubmit: this._onLogin, titleKey: t('dialog.authenticationRequired') },
            react_1.default.createElement(Input_1.default, { autoFocus: true, id: 'login-dialog-username', label: t('dialog.user'), name: 'username', onChange: this._onUsernameChange, placeholder: t('dialog.userIdentifier'), type: 'text', value: username }),
            react_1.default.createElement("br", null),
            react_1.default.createElement(Input_1.default, { className: 'dialog-bottom-margin', id: 'login-dialog-password', label: t('dialog.userPassword'), name: 'password', onChange: this._onPasswordChange, placeholder: t('dialog.password'), type: 'password', value: password }),
            this.renderMessage()));
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
function mapStateToProps(state) {
    const { error: authenticateAndUpgradeRoleError, progress, thenableWithCancel } = state['features/authentication'];
    const { authRequired, conference } = state['features/base/conference'];
    const { hosts: configHosts } = state['features/base/config'];
    const { connecting, error: connectionError } = state['features/base/connection'];
    return {
        _conference: authRequired || conference,
        _configHosts: configHosts,
        _connecting: Boolean(connecting) || Boolean(thenableWithCancel),
        _error: connectionError || authenticateAndUpgradeRoleError,
        _progress: progress
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(LoginDialog));
