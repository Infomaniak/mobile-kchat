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
const functions_1 = require("../../../base/i18n/functions");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const PreMeetingScreen_1 = __importDefault(require("../../../base/premeeting/components/web/PreMeetingScreen"));
const LoadingIndicator_1 = __importDefault(require("../../../base/react/components/web/LoadingIndicator"));
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const ChatInput_1 = __importDefault(require("../../../chat/components/web/ChatInput"));
const MessageContainer_1 = __importDefault(require("../../../chat/components/web/MessageContainer"));
const AbstractLobbyScreen_1 = __importStar(require("../AbstractLobbyScreen"));
/**
 * Implements a waiting screen that represents the participant being in the lobby.
 */
class LobbyScreen extends AbstractLobbyScreen_1.default {
    /**
       * Initializes a new {@code LobbyScreen} instance.
       *
       * @param {Object} props - The read-only properties with which the new
       * instance is to be initialized.
       */
    constructor(props) {
        super(props);
        this._messageContainerRef = react_1.default.createRef();
    }
    /**
       * Implements {@code Component#componentDidMount}.
       *
       * @inheritdoc
       */
    componentDidMount() {
        this._scrollMessageContainerToBottom(true);
    }
    /**
       * Implements {@code Component#componentDidUpdate}.
       *
       * @inheritdoc
       */
    componentDidUpdate(prevProps) {
        if (this.props._lobbyChatMessages !== prevProps._lobbyChatMessages) {
            this._scrollMessageContainerToBottom(true);
        }
        else if (this.props._isLobbyChatActive && !prevProps._isLobbyChatActive) {
            this._scrollMessageContainerToBottom(false);
        }
    }
    /**
     * Implements {@code PureComponent#render}.
     *
     * @inheritdoc
     */
    render() {
        const { _deviceStatusVisible, showCopyUrlButton, t } = this.props;
        return (react_1.default.createElement(PreMeetingScreen_1.default, { className: 'lobby-screen', showCopyUrlButton: showCopyUrlButton, showDeviceStatus: _deviceStatusVisible, title: t(this._getScreenTitleKey(), { moderator: this.props._lobbyMessageRecipient }) }, this._renderContent()));
    }
    /**
     * Renders the joining (waiting) fragment of the screen.
     *
     * @inheritdoc
     */
    _renderJoining() {
        const { _isLobbyChatActive } = this.props;
        return (react_1.default.createElement("div", { className: 'lobby-screen-content' },
            _isLobbyChatActive
                ? this._renderLobbyChat()
                : (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("div", { className: 'spinner' },
                        react_1.default.createElement(LoadingIndicator_1.default, { size: 'large' })),
                    react_1.default.createElement("span", { className: 'joining-message' }, this.props.t('lobby.joiningMessage')))),
            this._renderStandardButtons()));
    }
    /**
     * Renders the widget to chat with the moderator before allowed in.
     *
     * @inheritdoc
     */
    _renderLobbyChat() {
        const { _lobbyChatMessages, t } = this.props;
        const { isChatOpen } = this.state;
        return (react_1.default.createElement("div", { className: `lobby-chat-container ${isChatOpen ? 'hidden' : ''}` },
            react_1.default.createElement("div", { className: 'lobby-chat-header' },
                react_1.default.createElement("h1", { className: 'title' }, t(this._getScreenTitleKey(), { moderator: this.props._lobbyMessageRecipient })),
                react_1.default.createElement(Icon_1.default, { ariaLabel: t('toolbar.closeChat'), onClick: this._onToggleChat, role: 'button', src: svg_1.IconCloseLarge })),
            react_1.default.createElement(MessageContainer_1.default, { messages: _lobbyChatMessages, ref: this._messageContainerRef }),
            react_1.default.createElement(ChatInput_1.default, { onSend: this._onSendMessage })));
    }
    /**
     * Renders the participant form to let the knocking participant enter its details.
     *
     * NOTE: We don't use edit action on web since the prejoin functionality got merged.
     * Mobile won't use it either once prejoin gets implemented there too.
     *
     * @inheritdoc
     */
    _renderParticipantForm() {
        return this._renderParticipantInfo();
    }
    /**
     * Renders the participant info fragment when we have all the required details of the user.
     *
     * @inheritdoc
     */
    _renderParticipantInfo() {
        const { displayName } = this.state;
        const { _isDisplayNameRequiredActive, t } = this.props;
        const showError = _isDisplayNameRequiredActive && !displayName;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Input_1.default, { autoFocus: true, className: 'lobby-prejoin-input', error: showError, id: 'lobby-name-field', onChange: this._onChangeDisplayName, placeholder: t('lobby.nameField'), testId: 'lobby.nameField', value: displayName }),
            showError && react_1.default.createElement("div", { className: 'lobby-prejoin-error', "data-testid": 'lobby.errorMessage' }, t('prejoin.errorMissingName'))));
    }
    /**
     * Renders the password form to let the participant join by using a password instead of knocking.
     *
     * @inheritdoc
     */
    _renderPasswordForm() {
        const { _passwordJoinFailed, t } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Input_1.default, { className: `lobby-prejoin-input ${_passwordJoinFailed ? 'error' : ''}`, id: 'lobby-password-input', onChange: this._onChangePassword, placeholder: t('lobby.enterPasswordButton'), testId: 'lobby.password', type: 'password', value: this.state.password }),
            _passwordJoinFailed && react_1.default.createElement("div", { className: 'lobby-prejoin-error', "data-testid": 'lobby.errorMessage' }, t('lobby.invalidPassword'))));
    }
    /**
     * Renders the password join button (set).
     *
     * @inheritdoc
     */
    _renderPasswordJoinButtons() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Button_1.default, { className: 'lobby-button-margin', fullWidth: true, labelKey: 'prejoin.joinMeeting', onClick: this._onJoinWithPassword, testId: 'lobby.passwordJoinButton', type: 'primary' }),
            react_1.default.createElement(Button_1.default, { className: 'lobby-button-margin', fullWidth: true, labelKey: 'lobby.backToKnockModeButton', onClick: this._onSwitchToKnockMode, testId: 'lobby.backToKnockModeButton', type: 'secondary' })));
    }
    /**
     * Renders the standard button set.
     *
     * @inheritdoc
     */
    _renderStandardButtons() {
        const { _knocking, _isLobbyChatActive, _renderPassword } = this.props;
        return (react_1.default.createElement(react_1.default.Fragment, null,
            _knocking || react_1.default.createElement(Button_1.default, { className: 'lobby-button-margin', disabled: !this.state.displayName, fullWidth: true, labelKey: 'lobby.knockButton', onClick: this._onAskToJoin, testId: 'lobby.knockButton', type: 'primary' }),
            (_knocking && _isLobbyChatActive) && react_1.default.createElement(Button_1.default, { className: 'lobby-button-margin open-chat-button', fullWidth: true, labelKey: 'toolbar.openChat', onClick: this._onToggleChat, testId: 'toolbar.openChat', type: 'primary' }),
            _renderPassword && react_1.default.createElement(Button_1.default, { className: 'lobby-button-margin', fullWidth: true, labelKey: 'lobby.enterPasswordButton', onClick: this._onSwitchToPasswordMode, testId: 'lobby.enterPasswordButton', type: 'secondary' })));
    }
    /**
     * Scrolls the chat messages so the latest message is visible.
     *
     * @param {boolean} withAnimation - Whether or not to show a scrolling
     * animation.
     * @private
     * @returns {void}
     */
    _scrollMessageContainerToBottom(withAnimation) {
        if (this._messageContainerRef.current) {
            this._messageContainerRef.current.scrollToElement(withAnimation, null);
        }
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractLobbyScreen_1._mapStateToProps)(LobbyScreen));
