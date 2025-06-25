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
const constants_1 = require("../../constants");
const ChatMessage_1 = __importDefault(require("./ChatMessage"));
/**
 * Implements a container to render all the chat messages in a conference.
 */
class ChatMessageGroup extends react_1.Component {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._keyExtractor = this._keyExtractor.bind(this);
        this._renderMessage = this._renderMessage.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        return (<react_native_1.FlatList data={this.props.messages} inverted={true} keyExtractor={this._keyExtractor} renderItem={this._renderMessage}/>);
    }
    /**
     * Key extractor for the flatlist.
     *
     * @param {Object} _item - The flatlist item that we need the key to be
     * generated for.
     * @param {number} index - The index of the element.
     * @returns {string}
     */
    _keyExtractor(_item, index) {
        return `key_${index}`;
    }
    /**
     * Renders a single chat message.
     *
     * @param {Object} message - The chat message to render.
     * @returns {React$Element<*>}
     */
    _renderMessage({ index, item: message }) {
        return (<ChatMessage_1.default message={message} showAvatar={this.props.messages[0].messageType !== constants_1.MESSAGE_TYPE_LOCAL
                && index === this.props.messages.length - 1} showDisplayName={this.props.messages[0].messageType === constants_1.MESSAGE_TYPE_REMOTE
                && index === this.props.messages.length - 1} showTimestamp={index === 0}/>);
    }
}
exports.default = ChatMessageGroup;
