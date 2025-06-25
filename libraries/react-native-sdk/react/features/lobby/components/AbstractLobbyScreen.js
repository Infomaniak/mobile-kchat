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
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = exports.SCREEN_STATES = void 0;
const react_1 = __importStar(require("react"));
const actions_1 = require("../../base/conference/actions");
const functions_1 = require("../../base/conference/functions");
const functions_any_1 = require("../../base/config/functions.any");
const constants_1 = require("../../base/flags/constants");
const functions_2 = require("../../base/flags/functions");
const functions_3 = require("../../base/participants/functions");
const functions_4 = require("../../base/react/functions");
const actions_2 = require("../../base/settings/actions");
const functions_5 = require("../../prejoin/functions");
const actions_3 = require("../actions");
exports.SCREEN_STATES = {
    EDIT: 1,
    PASSWORD: 2,
    VIEW: 3
};
/**
 * Abstract class to encapsulate the platform common code of the {@code LobbyScreen}.
 */
class AbstractLobbyScreen extends react_1.PureComponent {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: props._participantName || '',
            email: props._participantEmail || '',
            isChatOpen: true,
            password: '',
            passwordJoinFailed: false,
            screenState: props._participantName ? exports.SCREEN_STATES.VIEW : exports.SCREEN_STATES.EDIT
        };
        this._onAskToJoin = this._onAskToJoin.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onChangeDisplayName = this._onChangeDisplayName.bind(this);
        this._onChangeEmail = this._onChangeEmail.bind(this);
        this._onChangePassword = this._onChangePassword.bind(this);
        this._onEnableEdit = this._onEnableEdit.bind(this);
        this._onJoinWithPassword = this._onJoinWithPassword.bind(this);
        this._onSendMessage = this._onSendMessage.bind(this);
        this._onSwitchToKnockMode = this._onSwitchToKnockMode.bind(this);
        this._onSwitchToPasswordMode = this._onSwitchToPasswordMode.bind(this);
        this._onToggleChat = this._onToggleChat.bind(this);
    }
    /**
     * Implements {@code PureComponent.getDerivedStateFromProps}.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props, state) {
        if (props._passwordJoinFailed && !state.passwordJoinFailed) {
            return {
                password: '',
                passwordJoinFailed: true
            };
        }
        return null;
    }
    /**
     * Returns the screen title.
     *
     * @returns {string}
     */
    _getScreenTitleKey() {
        const { screenState } = this.state;
        const passwordPrompt = screenState === exports.SCREEN_STATES.PASSWORD;
        return !passwordPrompt && this.props._knocking
            ? this.props._isLobbyChatActive ? 'lobby.lobbyChatStartedTitle' : 'lobby.joiningTitle'
            : passwordPrompt ? 'lobby.enterPasswordTitle' : 'lobby.joinTitle';
    }
    /**
     * Callback to be invoked when the user submits the joining request.
     *
     * @returns {void}
     */
    _onAskToJoin() {
        this.setState({
            password: ''
        });
        this.props.dispatch((0, actions_3.startKnocking)());
        return false;
    }
    /**
     * Callback to be invoked when the user cancels the dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        this.props.dispatch((0, actions_3.cancelKnocking)());
        return true;
    }
    /**
     * Callback to be invoked when the user changes its display name.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangeDisplayName(event) {
        const displayName = (0, functions_4.getFieldValue)(event);
        this.setState({
            displayName
        }, () => {
            this.props.dispatch((0, actions_2.updateSettings)({
                displayName
            }));
        });
    }
    /**
     * Callback to be invoked when the user changes its email.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangeEmail(event) {
        const email = (0, functions_4.getFieldValue)(event);
        this.setState({
            email
        }, () => {
            this.props.dispatch((0, actions_2.updateSettings)({
                email
            }));
        });
    }
    /**
     * Callback to be invoked when the user changes the password.
     *
     * @param {SyntheticEvent} event - The SyntheticEvent instance of the change.
     * @returns {void}
     */
    _onChangePassword(event) {
        this.setState({
            password: (0, functions_4.getFieldValue)(event)
        });
    }
    /**
     * Callback to be invoked for the edit button.
     *
     * @returns {void}
     */
    _onEnableEdit() {
        this.setState({
            screenState: exports.SCREEN_STATES.EDIT
        });
    }
    /**
     * Callback to be invoked when the user tries to join using a preset password.
     *
     * @returns {void}
     */
    _onJoinWithPassword() {
        this.setState({
            passwordJoinFailed: false
        });
        this.props.dispatch((0, actions_3.joinWithPassword)(this.state.password));
    }
    /**
     * Callback to be invoked for sending lobby chat messages.
     *
     * @param {string} message - Message to be sent.
     * @returns {void}
     */
    _onSendMessage(message) {
        this.props.dispatch((0, actions_3.onSendMessage)(message));
    }
    /**
     * Callback to be invoked for the enter (go back to) knocking mode button.
     *
     * @returns {void}
     */
    _onSwitchToKnockMode() {
        this.setState({
            password: '',
            screenState: this.state.displayName ? exports.SCREEN_STATES.VIEW : exports.SCREEN_STATES.EDIT
        });
        this.props.dispatch((0, actions_3.setPasswordJoinFailed)(false));
        // let's return to the correct state after password failed
        this.props.dispatch((0, actions_1.conferenceWillJoin)(this.props._membersOnlyConference));
    }
    /**
     * Callback to be invoked for the enter password button.
     *
     * @returns {void}
     */
    _onSwitchToPasswordMode() {
        this.setState({
            screenState: exports.SCREEN_STATES.PASSWORD
        });
    }
    /**
     * Callback to be invoked for toggling lobby chat visibility.
     *
     * @returns {void}
     */
    _onToggleChat() {
        this.setState(_prevState => {
            return {
                isChatOpen: !_prevState.isChatOpen
            };
        });
    }
    /**
     * Renders the content of the dialog.
     *
     * @returns {React$Element}
     */
    _renderContent() {
        const { _knocking } = this.props;
        const { screenState } = this.state;
        if (screenState !== exports.SCREEN_STATES.PASSWORD && _knocking) {
            return this._renderJoining();
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            screenState === exports.SCREEN_STATES.VIEW && this._renderParticipantInfo(),
            screenState === exports.SCREEN_STATES.EDIT && this._renderParticipantForm(),
            screenState === exports.SCREEN_STATES.PASSWORD && this._renderPasswordForm(),
            (screenState === exports.SCREEN_STATES.VIEW || screenState === exports.SCREEN_STATES.EDIT)
                && this._renderStandardButtons(),
            screenState === exports.SCREEN_STATES.PASSWORD && this._renderPasswordJoinButtons()));
    }
    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @returns {React$Element}
     */
    _renderJoining() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * @returns {React$Element}
     */
    _renderParticipantForm() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @returns {React$Element}
     */
    _renderParticipantInfo() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @returns {React$Element}
     */
    _renderPasswordForm() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the password join button (set).
     *
     * @returns {React$Element}
     */
    _renderPasswordJoinButtons() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    /**
     * Renders the standard (pre-knocking) button set.
     *
     * @returns {React$Element}
     */
    _renderStandardButtons() {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
}
exports.default = AbstractLobbyScreen;
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const localParticipant = (0, functions_3.getLocalParticipant)(state);
    const participantId = localParticipant?.id;
    const inviteEnabledFlag = (0, functions_2.getFeatureFlag)(state, constants_1.INVITE_ENABLED, true);
    const { disableInviteFunctions } = state['features/base/config'];
    const { isDisplayNameRequiredError, knocking, passwordJoinFailed } = state['features/lobby'];
    const { iAmSipGateway } = state['features/base/config'];
    const { disableLobbyPassword } = (0, functions_any_1.getSecurityUiConfig)(state);
    const showCopyUrlButton = inviteEnabledFlag || !disableInviteFunctions;
    const deviceStatusVisible = (0, functions_5.isDeviceStatusVisible)(state);
    const { membersOnly, lobbyWaitingForHost } = state['features/base/conference'];
    const { isLobbyChatActive, lobbyMessageRecipient, messages } = state['features/chat'];
    return {
        _deviceStatusVisible: deviceStatusVisible,
        _isDisplayNameRequiredActive: Boolean(isDisplayNameRequiredError),
        _knocking: knocking,
        _lobbyChatMessages: messages,
        _lobbyMessageRecipient: lobbyMessageRecipient?.name,
        _isLobbyChatActive: isLobbyChatActive,
        _meetingName: (0, functions_1.getConferenceName)(state),
        _membersOnlyConference: membersOnly,
        _participantEmail: localParticipant?.email,
        _participantId: participantId,
        _participantName: localParticipant?.name,
        _passwordJoinFailed: passwordJoinFailed,
        _renderPassword: !iAmSipGateway && !disableLobbyPassword && !lobbyWaitingForHost,
        showCopyUrlButton
    };
}
exports._mapStateToProps = _mapStateToProps;
