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
const functions_2 = require("../../../base/participants/functions");
const functions_web_1 = require("../../../base/styles/functions.web");
const Tabs_1 = __importDefault(require("../../../base/ui/components/web/Tabs"));
const functions_any_1 = require("../../../conference/functions.any");
const PollsPane_1 = __importDefault(require("../../../polls/components/web/PollsPane"));
const actions_web_1 = require("../../actions.web");
const constants_1 = require("../../constants");
const ChatHeader_1 = __importDefault(require("./ChatHeader"));
const ChatInput_1 = __importDefault(require("./ChatInput"));
const DisplayNameForm_1 = __importDefault(require("./DisplayNameForm"));
const KeyboardAvoider_1 = __importDefault(require("./KeyboardAvoider"));
const MessageContainer_1 = __importDefault(require("./MessageContainer"));
const MessageRecipient_1 = __importDefault(require("./MessageRecipient"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            backgroundColor: theme.palette.ui01,
            flexShrink: 0,
            overflow: 'hidden',
            position: 'relative',
            transition: 'width .16s ease-in-out',
            width: `${constants_1.CHAT_SIZE}px`,
            zIndex: 300,
            '@media (max-width: 580px)': {
                height: '100dvh',
                position: 'fixed',
                left: 0,
                right: 0,
                top: 0,
                width: 'auto'
            },
            '*': {
                userSelect: 'text',
                '-webkit-user-select': 'text'
            }
        },
        chatHeader: {
            height: '60px',
            position: 'relative',
            width: '100%',
            zIndex: 1,
            display: 'flex',
            justifyContent: 'space-between',
            padding: `${theme.spacing(3)} ${theme.spacing(4)}`,
            alignItems: 'center',
            boxSizing: 'border-box',
            color: theme.palette.text01,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.heading6),
            '.jitsi-icon': {
                cursor: 'pointer'
            }
        },
        chatPanel: {
            display: 'flex',
            flexDirection: 'column',
            // extract header + tabs height
            height: 'calc(100% - 110px)'
        },
        chatPanelNoTabs: {
            // extract header height
            height: 'calc(100% - 60px)'
        },
        pollsPanel: {
            // extract header + tabs height
            height: 'calc(100% - 110px)'
        }
    };
});
const Chat = ({ _isModal, _isOpen, _isPollsEnabled, _isPollsTabFocused, _messages, _nbUnreadMessages, _nbUnreadPolls, _onSendMessage, _onToggleChat, _onToggleChatTab, _onTogglePollsTab, _showNamePrompt, dispatch, t }) => {
    const { classes, cx } = useStyles();
    /**
    * Sends a text message.
    *
    * @private
    * @param {string} text - The text message to be sent.
    * @returns {void}
    * @type {Function}
    */
    const onSendMessage = (0, react_1.useCallback)((text) => {
        dispatch((0, actions_web_1.sendMessage)(text));
    }, []);
    /**
    * Toggles the chat window.
    *
    * @returns {Function}
    */
    const onToggleChat = (0, react_1.useCallback)(() => {
        dispatch((0, actions_web_1.toggleChat)());
    }, []);
    /**
     * Click handler for the chat sidenav.
     *
     * @param {KeyboardEvent} event - Esc key click to close the popup.
     * @returns {void}
     */
    const onEscClick = (0, react_1.useCallback)((event) => {
        if (event.key === 'Escape' && _isOpen) {
            event.preventDefault();
            event.stopPropagation();
            onToggleChat();
        }
    }, [_isOpen]);
    /**
     * Change selected tab.
     *
     * @param {string} id - Id of the clicked tab.
     * @returns {void}
     */
    const onChangeTab = (0, react_1.useCallback)((id) => {
        dispatch((0, actions_web_1.setIsPollsTabFocused)(id !== constants_1.CHAT_TABS.CHAT));
    }, []);
    /**
     * Returns a React Element for showing chat messages and a form to send new
     * chat messages.
     *
     * @private
     * @returns {ReactElement}
     */
    function renderChat() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            _isPollsEnabled && renderTabs(),
            react_1.default.createElement("div", { "aria-labelledby": constants_1.CHAT_TABS.CHAT, className: cx(classes.chatPanel, !_isPollsEnabled && classes.chatPanelNoTabs, _isPollsTabFocused && 'hide'), id: `${constants_1.CHAT_TABS.CHAT}-panel`, role: 'tabpanel', tabIndex: 0 },
                react_1.default.createElement(MessageContainer_1.default, { messages: _messages }),
                react_1.default.createElement(MessageRecipient_1.default, null),
                react_1.default.createElement(ChatInput_1.default, { onSend: onSendMessage })),
            _isPollsEnabled && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement("div", { "aria-labelledby": constants_1.CHAT_TABS.POLLS, className: cx(classes.pollsPanel, !_isPollsTabFocused && 'hide'), id: `${constants_1.CHAT_TABS.POLLS}-panel`, role: 'tabpanel', tabIndex: 0 },
                    react_1.default.createElement(PollsPane_1.default, null)),
                react_1.default.createElement(KeyboardAvoider_1.default, null)))));
    }
    /**
     * Returns a React Element showing the Chat and Polls tab.
     *
     * @private
     * @returns {ReactElement}
     */
    function renderTabs() {
        return (react_1.default.createElement(Tabs_1.default, { accessibilityLabel: t(_isPollsEnabled ? 'chat.titleWithPolls' : 'chat.title'), onChange: onChangeTab, selected: _isPollsTabFocused ? constants_1.CHAT_TABS.POLLS : constants_1.CHAT_TABS.CHAT, tabs: [{
                    accessibilityLabel: t('chat.tabs.chat'),
                    countBadge: _isPollsTabFocused && _nbUnreadMessages > 0 ? _nbUnreadMessages : undefined,
                    id: constants_1.CHAT_TABS.CHAT,
                    controlsId: `${constants_1.CHAT_TABS.CHAT}-panel`,
                    label: t('chat.tabs.chat')
                }, {
                    accessibilityLabel: t('chat.tabs.polls'),
                    countBadge: !_isPollsTabFocused && _nbUnreadPolls > 0 ? _nbUnreadPolls : undefined,
                    id: constants_1.CHAT_TABS.POLLS,
                    controlsId: `${constants_1.CHAT_TABS.POLLS}-panel`,
                    label: t('chat.tabs.polls')
                }
            ] }));
    }
    return (_isOpen ? react_1.default.createElement("div", { className: classes.container, id: 'sideToolbarContainer', onKeyDown: onEscClick },
        react_1.default.createElement(ChatHeader_1.default, { className: cx('chat-header', classes.chatHeader), isPollsEnabled: _isPollsEnabled, onCancel: onToggleChat }),
        _showNamePrompt
            ? react_1.default.createElement(DisplayNameForm_1.default, { isPollsEnabled: _isPollsEnabled })
            : renderChat()) : null);
};
/**
 * Maps (parts of) the redux state to {@link Chat} React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @param {any} _ownProps - Components' own props.
 * @private
 * @returns {{
 *     _isModal: boolean,
 *     _isOpen: boolean,
 *     _isPollsEnabled: boolean,
 *     _isPollsTabFocused: boolean,
 *     _messages: Array<Object>,
 *     _nbUnreadMessages: number,
 *     _nbUnreadPolls: number,
 *     _showNamePrompt: boolean
 * }}
 */
function _mapStateToProps(state, _ownProps) {
    const { isOpen, isPollsTabFocused, messages, nbUnreadMessages } = state['features/chat'];
    const { nbUnreadPolls } = state['features/polls'];
    const _localParticipant = (0, functions_2.getLocalParticipant)(state);
    return {
        _isModal: window.innerWidth <= constants_1.SMALL_WIDTH_THRESHOLD,
        _isOpen: isOpen,
        _isPollsEnabled: !(0, functions_any_1.arePollsDisabled)(state),
        _isPollsTabFocused: isPollsTabFocused,
        _messages: messages,
        _nbUnreadMessages: nbUnreadMessages,
        _nbUnreadPolls: nbUnreadPolls,
        _showNamePrompt: !_localParticipant?.name
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(Chat));
