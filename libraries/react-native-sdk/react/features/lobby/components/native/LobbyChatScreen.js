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
const JitsiScreen_1 = __importDefault(require("../../../base/modal/components/JitsiScreen"));
const ChatInputBar_1 = __importDefault(require("../../../chat/components/native/ChatInputBar"));
const MessageContainer_1 = __importDefault(require("../../../chat/components/native/MessageContainer"));
const AbstractLobbyScreen_1 = __importStar(require("../AbstractLobbyScreen"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a chat screen that appears when communication is started
 * between the moderator and the participant being in the lobby.
 */
class LobbyChatScreen extends AbstractLobbyScreen_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _lobbyChatMessages } = this.props;
        return (<JitsiScreen_1.default hasBottomTextInput={true} hasExtraHeaderHeight={true} style={styles_1.default.lobbyChatWrapper}>
                {/* @ts-ignore */}
                <MessageContainer_1.default messages={_lobbyChatMessages}/>
                <ChatInputBar_1.default onSend={this._onSendMessage}/>
            </JitsiScreen_1.default>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractLobbyScreen_1._mapStateToProps)(LobbyChatScreen));
