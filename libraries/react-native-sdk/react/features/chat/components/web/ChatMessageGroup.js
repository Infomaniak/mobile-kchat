"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const clsx_1 = __importDefault(require("clsx"));
const react_1 = __importDefault(require("react"));
const mui_1 = require("tss-react/mui");
const Avatar_1 = __importDefault(require("../../../base/avatar/components/Avatar"));
const ChatMessage_1 = __importDefault(require("./ChatMessage"));
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        messageGroup: {
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '100%',
            '&.remote': {
                maxWidth: 'calc(100% - 40px)' // 100% - avatar and margin
            }
        },
        groupContainer: {
            display: 'flex',
            '&.local': {
                justifyContent: 'flex-end',
                '& .avatar': {
                    display: 'none'
                }
            }
        },
        avatar: {
            margin: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(3)} 0`,
            position: 'sticky',
            flexShrink: 0,
            top: 0
        }
    };
});
const ChatMessageGroup = ({ className = '', messages }) => {
    const { classes } = useStyles();
    const messagesLength = messages.length;
    if (!messagesLength) {
        return null;
    }
    return (react_1.default.createElement("div", { className: (0, clsx_1.default)(classes.groupContainer, className) },
        react_1.default.createElement(Avatar_1.default, { className: (0, clsx_1.default)(classes.avatar, 'avatar'), participantId: messages[0].id, size: 32 }),
        react_1.default.createElement("div", { className: `${classes.messageGroup} chat-message-group ${className}` }, messages.map((message, i) => (react_1.default.createElement(ChatMessage_1.default, { key: i, message: message, showDisplayName: i === 0, showTimestamp: i === messages.length - 1, type: className }))))));
};
exports.default = ChatMessageGroup;
