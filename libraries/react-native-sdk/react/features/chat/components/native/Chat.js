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
/* eslint-disable react/no-multi-comp */
const native_1 = require("@react-navigation/native");
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const TabBarLabelCounter_1 = require("../../../mobile/navigation/components/TabBarLabelCounter");
const actions_native_1 = require("../../actions.native");
const ChatInputBar_1 = __importDefault(require("./ChatInputBar"));
const MessageContainer_1 = __importDefault(require("./MessageContainer"));
const MessageRecipient_1 = __importDefault(require("./MessageRecipient"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React native component that renders the chat window (modal) of
 * the mobile client.
 */
class Chat extends react_1.Component {
    /**
     * Initializes a new {@code AbstractChat} instance.
     *
     * @param {Props} props - The React {@code Component} props to initialize
     * the new {@code AbstractChat} instance with.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onSendMessage = this._onSendMessage.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { _messages, route } = this.props;
        const privateMessageRecipient = route?.params?.privateMessageRecipient;
        return (<JitsiScreen_1.default disableForcedKeyboardDismiss={true} 
        /* eslint-disable react/jsx-no-bind */
        footerComponent={() => <ChatInputBar_1.default onSend={this._onSendMessage}/>} hasBottomTextInput={true} hasExtraHeaderHeight={true} style={styles_1.default.chatContainer}>
                {/* @ts-ignore */}
                <MessageContainer_1.default messages={_messages}/>
                <MessageRecipient_1.default privateMessageRecipient={privateMessageRecipient}/>
            </JitsiScreen_1.default>);
    }
    /**
    * Sends a text message.
    *
    * @private
    * @param {string} text - The text message to be sent.
    * @returns {void}
    * @type {Function}
    */
    _onSendMessage(text) {
        this.props.dispatch((0, actions_native_1.sendMessage)(text));
    }
}
/**
 * Maps (parts of) the redux state to {@link Chat} React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @param {any} _ownProps - Components' own props.
 * @private
 * @returns {{
 *     _messages: Array<Object>,
 *     _nbUnreadMessages: number
 * }}
 */
function _mapStateToProps(state, _ownProps) {
    const { messages, nbUnreadMessages } = state['features/chat'];
    return {
        _messages: messages,
        _nbUnreadMessages: nbUnreadMessages
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)((props) => {
    const { _nbUnreadMessages, dispatch, navigation, t } = props;
    const unreadMessagesNr = _nbUnreadMessages > 0;
    const isFocused = (0, native_1.useIsFocused)();
    (0, react_1.useEffect)(() => {
        navigation?.setOptions({
            tabBarLabel: () => (<TabBarLabelCounter_1.TabBarLabelCounter activeUnreadNr={unreadMessagesNr} isFocused={isFocused} label={t('chat.tabs.chat')} nbUnread={_nbUnreadMessages}/>)
        });
        return () => {
            isFocused && dispatch((0, actions_native_1.closeChat)());
        };
    }, [isFocused, _nbUnreadMessages]);
    return (<Chat {...props}/>);
}));
