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
const functions_any_1 = require("../../../../base/config/functions.any");
const constants_1 = require("../../../../base/flags/constants");
const functions_1 = require("../../../../base/flags/functions");
const functions_2 = require("../../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../../base/modal/components/JitsiScreen"));
const functions_3 = require("../../../../base/participants/functions");
const Button_1 = __importDefault(require("../../../../base/ui/components/native/Button"));
const Input_1 = __importDefault(require("../../../../base/ui/components/native/Input"));
const Switch_1 = __importDefault(require("../../../../base/ui/components/native/Switch"));
const constants_native_1 = require("../../../../base/ui/constants.native");
const copyText_native_1 = require("../../../../base/util/copyText.native");
const functions_4 = require("../../../../breakout-rooms/functions");
const actions_any_1 = require("../../../../lobby/actions.any");
const functions_5 = require("../../../../lobby/functions");
const actions_1 = require("../../../../room-lock/actions");
const constants_2 = require("../../../../room-lock/constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * The style of the {@link TextInput} rendered by {@code SecurityDialog}. As it
 * requests the entry of a password, {@code TextInput} automatically correcting
 * the entry of the password is a pain to deal with as a user.
 */
const _TEXT_INPUT_PROPS = {
    autoCapitalize: 'none',
    autoCorrect: false
};
/**
 * Component that renders the security options dialog.
 *
 * @returns {React$Element<any>}
 */
class SecurityDialog extends react_1.PureComponent {
    /**
     * Instantiates a new {@code SecurityDialog}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            lobbyEnabled: props._lobbyEnabled,
            passwordInputValue: '',
            showElement: props._locked === constants_2.LOCKED_LOCALLY || false
        };
        this._onChangeText = this._onChangeText.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onCopy = this._onCopy.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onToggleLobbyMode = this._onToggleLobbyMode.bind(this);
        this._onAddPassword = this._onAddPassword.bind(this);
    }
    /**
     * Implements {@code SecurityDialog.render}.
     *
     * @inheritdoc
     */
    render() {
        return (<JitsiScreen_1.default style={styles_1.default.securityDialogContainer}>
                {this._renderLobbyMode()}
                {this._renderSetRoomPassword()}
            </JitsiScreen_1.default>);
    }
    /**
     * Renders lobby mode.
     *
     * @returns {ReactElement}
     * @private
     */
    _renderLobbyMode() {
        const { _isEnablingLobbyAllowed, _lobbyModeSwitchVisible, t } = this.props;
        if (!_lobbyModeSwitchVisible || !_isEnablingLobbyAllowed) {
            return null;
        }
        return (<react_native_1.View style={styles_1.default.lobbyModeContainer}>
                <react_native_1.View style={styles_1.default.lobbyModeContent}>
                    <react_native_1.Text style={styles_1.default.lobbyModeText}>
                        {t('lobby.enableDialogText')}
                    </react_native_1.Text>
                    <react_native_1.View style={styles_1.default.lobbyModeSection}>
                        <react_native_1.Text style={styles_1.default.lobbyModeLabel}>
                            {t('lobby.toggleLabel')}
                        </react_native_1.Text>
                        <Switch_1.default checked={this.state.lobbyEnabled} onChange={this._onToggleLobbyMode}/>
                    </react_native_1.View>
                </react_native_1.View>
            </react_native_1.View>);
    }
    /**
     * Renders setting the password.
     *
     * @returns {ReactElement}
     * @private
     */
    _renderSetRoomPassword() {
        const { _isModerator, _locked, _lockedConference, _password, _roomPasswordControls, t } = this.props;
        const { showElement } = this.state;
        let setPasswordControls;
        if (!_roomPasswordControls) {
            return null;
        }
        if (_locked && showElement) {
            setPasswordControls = (<>
                    <Button_1.default accessibilityLabel='dialog.Remove' labelKey='dialog.Remove' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onCancel} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    {_password
                    && <Button_1.default accessibilityLabel='dialog.copy' labelKey='dialog.copy' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onCopy} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>}
                </>);
        }
        else if (!_lockedConference && showElement) {
            setPasswordControls = (<>
                    <Button_1.default accessibilityLabel='dialog.Cancel' labelKey='dialog.Cancel' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onCancel} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    <Button_1.default accessibilityLabel='dialog.add' labelKey='dialog.add' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onSubmit} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                </>);
        }
        else if (!_lockedConference && !showElement) {
            setPasswordControls = (<Button_1.default accessibilityLabel='info.addPassword' disabled={!_isModerator} labelKey='info.addPassword' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onAddPassword} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>);
        }
        if (_locked === constants_2.LOCKED_REMOTELY) {
            if (_isModerator) {
                setPasswordControls = (<react_native_1.View style={styles_1.default.passwordSetRemotelyContainer}>
                        <react_native_1.Text style={styles_1.default.passwordSetRemotelyText}>
                            {t('passwordSetRemotely')}
                        </react_native_1.Text>
                        <Button_1.default accessibilityLabel='dialog.Remove' labelKey='dialog.Remove' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onCancel} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    </react_native_1.View>);
            }
            else {
                setPasswordControls = (<react_native_1.View style={styles_1.default.passwordSetRemotelyContainer}>
                        <react_native_1.Text style={styles_1.default.passwordSetRemotelyTextDisabled}>
                            {t('passwordSetRemotely')}
                        </react_native_1.Text>
                        <Button_1.default accessibilityLabel='info.addPassword' disabled={!_isModerator} labelKey='info.addPassword' labelStyle={styles_1.default.passwordSetupButtonLabel} onClick={this._onAddPassword} type={constants_native_1.BUTTON_TYPES.TERTIARY}/>
                    </react_native_1.View>);
            }
        }
        return (<react_native_1.View style={styles_1.default.passwordContainer}>
                <react_native_1.Text style={styles_1.default.passwordContainerText}>
                    {t(_isModerator ? 'security.about' : 'security.aboutReadOnly')}
                </react_native_1.Text>
                <react_native_1.View style={_locked !== constants_2.LOCKED_REMOTELY
                && styles_1.default.passwordContainerControls}>
                    <react_native_1.View>
                        {this._setRoomPasswordMessage()}
                    </react_native_1.View>
                    {_isModerator && setPasswordControls}
                </react_native_1.View>
            </react_native_1.View>);
    }
    /**
     * Renders room lock text input/message.
     *
     * @returns {ReactElement}
     * @private
     */
    _setRoomPasswordMessage() {
        let textInputProps = _TEXT_INPUT_PROPS;
        const { _isModerator, _locked, _password, _passwordNumberOfDigits, t } = this.props;
        const { passwordInputValue, showElement } = this.state;
        if (_passwordNumberOfDigits) {
            textInputProps = {
                ...textInputProps,
                keyboardType: 'numeric',
                maxLength: _passwordNumberOfDigits
            };
        }
        if (!_isModerator) {
            return null;
        }
        if (showElement) {
            if (typeof _locked === 'undefined') {
                return (<Input_1.default accessibilityLabel={t('info.addPassword')} autoFocus={true} clearable={true} customStyles={{ container: styles_1.default.customContainer }} onChange={this._onChangeText} placeholder={t('dialog.password')} value={passwordInputValue} {...textInputProps}/>);
            }
            else if (_locked) {
                if (_locked === constants_2.LOCKED_LOCALLY && typeof _password !== 'undefined') {
                    return (<react_native_1.View style={styles_1.default.savedPasswordContainer}>
                            <react_native_1.Text style={styles_1.default.savedPasswordLabel}>
                                {t('info.password')}
                            </react_native_1.Text>
                            <react_native_1.Text style={styles_1.default.savedPassword}>
                                {_password}
                            </react_native_1.Text>
                        </react_native_1.View>);
                }
            }
        }
    }
    /**
     * Handles the enable-disable lobby mode switch.
     *
     * @private
     * @returns {void}
     */
    _onToggleLobbyMode() {
        const { dispatch } = this.props;
        const { lobbyEnabled } = this.state;
        this.setState({
            lobbyEnabled: !lobbyEnabled
        });
        dispatch((0, actions_any_1.toggleLobbyMode)(!lobbyEnabled));
    }
    /**
     * Callback to be invoked when add password button is pressed.
     *
     * @returns {void}
     */
    _onAddPassword() {
        const { showElement } = this.state;
        this.setState({
            showElement: !showElement
        });
    }
    /**
     * Verifies input in case only digits are required.
     *
     * @param {string} passwordInputValue - The value of the password
     * text input.
     * @private
     * @returns {boolean} False when the value is not valid and True otherwise.
     */
    _validateInputValue(passwordInputValue) {
        const { _passwordNumberOfDigits } = this.props;
        // we want only digits,
        // but both number-pad and numeric add ',' and '.' as symbols
        if (_passwordNumberOfDigits
            && passwordInputValue.length > 0
            && !/^\d+$/.test(passwordInputValue)) {
            return false;
        }
        return true;
    }
    /**
     * Callback to be invoked when the text in the field changes.
     *
     * @param {string} passwordInputValue - The value of password input.
     * @returns {void}
     */
    _onChangeText(passwordInputValue) {
        if (!this._validateInputValue(passwordInputValue)) {
            return;
        }
        this.setState({
            passwordInputValue
        });
    }
    /**
     * Cancels value typed in text input.
     *
     * @returns {void}
     */
    _onCancel() {
        this.setState({
            passwordInputValue: '',
            showElement: false
        });
        this.props.dispatch((0, actions_1.unlockRoom)());
    }
    /**
     * Copies room password.
     *
     * @returns {void}
     */
    _onCopy() {
        const { passwordInputValue } = this.state;
        (0, copyText_native_1.copyText)(passwordInputValue);
    }
    /**
     * Submits value typed in text input.
     *
     * @returns {void}
     */
    _onSubmit() {
        const { _conference, dispatch } = this.props;
        const { passwordInputValue } = this.state;
        _conference && dispatch((0, actions_1.endRoomLockRequest)(_conference, passwordInputValue));
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { conference, locked, password } = state['features/base/conference'];
    const { disableLobbyPassword, hideLobbyButton } = (0, functions_any_1.getSecurityUiConfig)(state);
    const { lobbyEnabled } = state['features/lobby'];
    const { roomPasswordNumberOfDigits } = state['features/base/config'];
    const lobbySupported = conference?.isLobbySupported();
    const visible = (0, functions_1.getFeatureFlag)(state, constants_1.MEETING_PASSWORD_ENABLED, true);
    return {
        _conference: conference,
        _isEnablingLobbyAllowed: (0, functions_5.isEnablingLobbyAllowed)(state),
        _isModerator: (0, functions_3.isLocalParticipantModerator)(state),
        _lobbyEnabled: lobbyEnabled,
        _lobbyModeSwitchVisible: lobbySupported && (0, functions_3.isLocalParticipantModerator)(state) && !hideLobbyButton && !(0, functions_4.isInBreakoutRoom)(state),
        _locked: locked,
        _lockedConference: Boolean(conference && locked),
        _password: password,
        _passwordNumberOfDigits: roomPasswordNumberOfDigits,
        _roomPasswordControls: visible && !disableLobbyPassword
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(SecurityDialog));
