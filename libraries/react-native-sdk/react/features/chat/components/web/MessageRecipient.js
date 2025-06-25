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
const react_i18next_1 = require("react-i18next");
const react_redux_1 = require("react-redux");
const mui_1 = require("tss-react/mui");
const svg_1 = require("../../../base/icons/svg");
const functions_web_1 = require("../../../base/styles/functions.web");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const constants_any_1 = require("../../../base/ui/constants.any");
const AbstractMessageRecipient_1 = require("../AbstractMessageRecipient");
const useStyles = (0, mui_1.makeStyles)()(theme => {
    return {
        container: {
            margin: '0 16px 8px',
            padding: '6px',
            paddingLeft: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: theme.palette.support05,
            borderRadius: theme.shape.borderRadius,
            ...(0, functions_web_1.withPixelLineHeight)(theme.typography.bodyShortRegular),
            color: theme.palette.text01
        },
        text: {
            maxWidth: 'calc(100% - 30px)',
            overflow: 'hidden',
            whiteSpace: 'break-spaces',
            wordBreak: 'break-all'
        },
        iconButton: {
            padding: '2px',
            '&:hover': {
                backgroundColor: theme.palette.action03
            }
        }
    };
});
const MessageRecipient = ({ _privateMessageRecipient, _isLobbyChatActive, _lobbyMessageRecipient, _onRemovePrivateMessageRecipient, _onHideLobbyChatRecipient, _visible }) => {
    const { classes } = useStyles();
    const { t } = (0, react_i18next_1.useTranslation)();
    const _onKeyPress = (0, react_1.useCallback)((e) => {
        if ((_onRemovePrivateMessageRecipient || _onHideLobbyChatRecipient)
            && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            if (_isLobbyChatActive && _onHideLobbyChatRecipient) {
                _onHideLobbyChatRecipient();
            }
            else if (_onRemovePrivateMessageRecipient) {
                _onRemovePrivateMessageRecipient();
            }
        }
    }, [_onRemovePrivateMessageRecipient, _onHideLobbyChatRecipient, _isLobbyChatActive]);
    if ((!_privateMessageRecipient && !_isLobbyChatActive) || !_visible) {
        return null;
    }
    return (react_1.default.createElement("div", { className: classes.container, id: 'chat-recipient', role: 'alert' },
        react_1.default.createElement("span", { className: classes.text }, t(_isLobbyChatActive ? 'chat.lobbyChatMessageTo' : 'chat.messageTo', {
            recipient: _isLobbyChatActive ? _lobbyMessageRecipient : _privateMessageRecipient
        })),
        react_1.default.createElement(Button_1.default, { accessibilityLabel: t('dialog.close'), className: classes.iconButton, icon: svg_1.IconCloseLarge, onClick: _isLobbyChatActive
                ? _onHideLobbyChatRecipient : _onRemovePrivateMessageRecipient, onKeyPress: _onKeyPress, type: constants_any_1.BUTTON_TYPES.TERTIARY })));
};
exports.default = (0, react_redux_1.connect)(AbstractMessageRecipient_1._mapStateToProps, AbstractMessageRecipient_1._mapDispatchToProps)(MessageRecipient);
