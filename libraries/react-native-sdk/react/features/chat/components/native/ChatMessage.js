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
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const functions_1 = require("../../../base/i18n/functions");
const Linkify_1 = __importDefault(require("../../../base/react/components/native/Linkify"));
const functions_native_1 = require("../../../gifs/functions.native");
const constants_1 = require("../../constants");
const functions_2 = require("../../functions");
const GifMessage_1 = __importDefault(require("./GifMessage"));
const PrivateMessageButton_1 = __importDefault(require("./PrivateMessageButton"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Renders a single chat message.
 */
class ChatMessage extends react_1.Component {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { message, knocking } = this.props;
        const localMessage = message.messageType === constants_1.MESSAGE_TYPE_LOCAL;
        const { privateMessage, lobbyChat } = message;
        // Style arrays that need to be updated in various scenarios, such as
        // error messages or others.
        const detailsWrapperStyle = [
            styles_1.default.detailsWrapper
        ];
        const messageBubbleStyle = [
            styles_1.default.messageBubble
        ];
        if (localMessage) {
            // This is a message sent by the local participant.
            // The wrapper needs to be aligned to the right.
            detailsWrapperStyle.push(styles_1.default.ownMessageDetailsWrapper);
            // The bubble needs some additional styling
            messageBubbleStyle.push(styles_1.default.localMessageBubble);
        }
        else if (message.messageType === constants_1.MESSAGE_TYPE_ERROR) {
            // This is a system message.
            // The bubble needs some additional styling
            messageBubbleStyle.push(styles_1.default.systemMessageBubble);
        }
        else {
            // This is a remote message sent by a remote participant.
            // The bubble needs some additional styling
            messageBubbleStyle.push(styles_1.default.remoteMessageBubble);
        }
        if (privateMessage) {
            messageBubbleStyle.push(styles_1.default.privateMessageBubble);
        }
        if (lobbyChat && !knocking) {
            messageBubbleStyle.push(styles_1.default.lobbyMessageBubble);
        }
        const messageText = (0, functions_2.replaceNonUnicodeEmojis)((0, functions_2.getMessageText)(this.props.message));
        return (<react_native_1.View style={styles_1.default.messageWrapper}>
                {this._renderAvatar()}
                <react_native_1.View style={detailsWrapperStyle}>
                    <react_native_1.View style={messageBubbleStyle}>
                        <react_native_1.View style={styles_1.default.textWrapper}>
                            {this._renderDisplayName()}
                            {(0, functions_native_1.isGifMessage)(messageText)
                ? <GifMessage_1.default message={messageText}/>
                : (<Linkify_1.default linkStyle={styles_1.default.chatLink} style={styles_1.default.chatMessage}>
                                        {messageText}
                                    </Linkify_1.default>)}
                            {this._renderPrivateNotice()}
                        </react_native_1.View>
                        {this._renderPrivateReplyButton()}
                    </react_native_1.View>
                    {this._renderTimestamp()}
                </react_native_1.View>
            </react_native_1.View>);
    }
    /**
     * Renders the avatar of the sender.
     *
     * @returns {React$Element<*>}
     */
    _renderAvatar() {
        const { message } = this.props;
        return (<react_native_1.View style={styles_1.default.avatarWrapper}>
                {this.props.showAvatar && <Avatar_1.default displayName={message.displayName} participantId={message.id} size={styles_1.default.avatarWrapper.width}/>}
            </react_native_1.View>);
    }
    /**
     * Renders the display name of the sender if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderDisplayName() {
        const { message, showDisplayName } = this.props;
        if (!showDisplayName) {
            return null;
        }
        return (<react_native_1.Text style={styles_1.default.senderDisplayName}>
                {message.displayName}
            </react_native_1.Text>);
    }
    /**
     * Renders the message privacy notice, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderPrivateNotice() {
        const { message, knocking } = this.props;
        if (!(message.privateMessage || (message.lobbyChat && !knocking))) {
            return null;
        }
        return (<react_native_1.Text style={message.lobbyChat ? styles_1.default.lobbyMsgNotice : styles_1.default.privateNotice}>
                {(0, functions_2.getPrivateNoticeMessage)(this.props.message)}
            </react_native_1.Text>);
    }
    /**
     * Renders the private reply button, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderPrivateReplyButton() {
        const { message, canReply } = this.props;
        const { lobbyChat } = message;
        if (!canReply) {
            return null;
        }
        return (<react_native_1.View style={styles_1.default.replyContainer}>
                <PrivateMessageButton_1.default isLobbyMessage={lobbyChat} participantID={message.id} reply={true} showLabel={false} toggledStyles={styles_1.default.replyStyles}/>
            </react_native_1.View>);
    }
    /**
     * Renders the time at which the message was sent, if necessary.
     *
     * @returns {React$Element<*> | null}
     */
    _renderTimestamp() {
        if (!this.props.showTimestamp) {
            return null;
        }
        return (<react_native_1.Text style={styles_1.default.timeText}>
                {(0, functions_2.getFormattedTimestamp)(this.props.message)}
            </react_native_1.Text>);
    }
}
/**
 * Maps part of the redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state, { message }) {
    return {
        canReply: (0, functions_2.getCanReplyToMessage)(state, message),
        knocking: state['features/lobby'].knocking
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ChatMessage));
