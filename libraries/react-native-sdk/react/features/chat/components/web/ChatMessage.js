"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const functions_1 = require("../../../base/i18n/functions");
const Message_1 = __importDefault(require("../../../base/react/components/web/Message"));
const functions_web_1 = require("../../../base/styles/functions.web");
const functions_2 = require("../../functions");
const PrivateMessageButton_1 = __importDefault(require("./PrivateMessageButton"));
const useStyles = (0, mui_1.makeStyles)()((theme) => {
    return {
        chatMessageWrapper: {
            maxWidth: '100%'
        },
        chatMessage: {
            display: 'inline-flex',
            padding: '12px',
            backgroundColor: theme.palette.ui02,
            borderRadius: '4px 12px 12px 12px',
            maxWidth: '100%',
            marginTop: '4px',
            boxSizing: 'border-box',
            '&.privatemessage': {
                backgroundColor: theme.palette.support05
            },
            '&.local': {
                backgroundColor: theme.palette.ui04,
                borderRadius: '12px 4px 12px 12px',
                '&.privatemessage': {
                    backgroundColor: theme.palette.support05
                }
            },
            '&.error': {
                backgroundColor: theme.palette.actionDanger,
                borderRadius: 0,
                fontWeight: 100
            },
            '&.lobbymessage': {
                backgroundColor: theme.palette.support05
            }
        },
        replyWrapper: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            maxWidth: '100%'
        },
        messageContent: {
            maxWidth: '100%',
            overflow: 'hidden',
            flex: 1
        },
        replyButtonContainer: {
            display: 'flex',
            alignItems: 'flex-start',
            height: '100%'
        },
        replyButton: {
            padding: '2px'
        },
        displayName: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelBold),
            color: theme.palette.text02,
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            marginBottom: theme.spacing(1)
        },
        userMessage: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
        },
        privateMessageNotice: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text02,
            marginTop: theme.spacing(1)
        },
        timestamp: {
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.labelRegular),
            color: theme.palette.text03,
            marginTop: theme.spacing(1)
        }
    };
});
/**
 * Renders a single chat message.
 *
 * @param {IProps} props - Component's props.
 * @returns {JSX}
 */
const ChatMessage = ({ canReply, knocking, message, showDisplayName, showTimestamp, type, t }) => {
    const { classes, cx } = useStyles();
    /**
     * Renders the display name of the sender.
     *
     * @returns {React$Element<*>}
     */
    function _renderDisplayName() {
        return (react_1.default.createElement("div", { "aria-hidden": true, className: cx('display-name', classes.displayName) }, message.displayName));
    }
    /**
     * Renders the message privacy notice.
     *
     * @returns {React$Element<*>}
     */
    function _renderPrivateNotice() {
        return (react_1.default.createElement("div", { className: classes.privateMessageNotice }, (0, functions_2.getPrivateNoticeMessage)(message)));
    }
    /**
     * Renders the time at which the message was sent.
     *
     * @returns {React$Element<*>}
     */
    function _renderTimestamp() {
        return (react_1.default.createElement("div", { className: cx('timestamp', classes.timestamp) }, (0, functions_2.getFormattedTimestamp)(message)));
    }
    return (react_1.default.createElement("div", { className: cx(classes.chatMessageWrapper, type), id: message.messageId, tabIndex: -1 },
        react_1.default.createElement("div", { className: cx('chatmessage', classes.chatMessage, type, message.privateMessage && 'privatemessage', message.lobbyChat && !knocking && 'lobbymessage') },
            react_1.default.createElement("div", { className: classes.replyWrapper },
                react_1.default.createElement("div", { className: cx('messagecontent', classes.messageContent) },
                    showDisplayName && _renderDisplayName(),
                    react_1.default.createElement("div", { className: cx('usermessage', classes.userMessage) },
                        react_1.default.createElement("span", { className: 'sr-only' }, message.displayName === message.recipient
                            ? t('chat.messageAccessibleTitleMe')
                            : t('chat.messageAccessibleTitle', { user: message.displayName })),
                        react_1.default.createElement(Message_1.default, { text: (0, functions_2.getMessageText)(message) })),
                    (message.privateMessage || (message.lobbyChat && !knocking))
                        && _renderPrivateNotice()),
                canReply
                    && (react_1.default.createElement("div", { className: classes.replyButtonContainer },
                        react_1.default.createElement(PrivateMessageButton_1.default, { isLobbyMessage: message.lobbyChat, participantID: message.id }))))),
        showTimestamp && _renderTimestamp()));
};
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state, { message }) {
    const { knocking } = state['features/lobby'];
    return {
        canReply: (0, functions_2.getCanReplyToMessage)(state, message),
        knocking
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ChatMessage));
