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
const react_emoji_render_1 = require("react-emoji-render");
const GifMessage_1 = __importDefault(require("../../../../chat/components/web/GifMessage"));
const constants_1 = require("../../../../gifs/constants");
const functions_web_1 = require("../../../../gifs/functions.web");
const Linkify_1 = __importDefault(require("./Linkify"));
/**
 * Renders the content of a chat message.
 */
class Message extends react_1.Component {
    /**
     * Initializes a new {@code Message} instance.
     *
     * @param {IProps} props - The props of the component.
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance
        this._processMessage = this._processMessage.bind(this);
    }
    /**
     * Parses and builds the message tokens to include emojis and urls.
     *
     * @returns {Array<string|ReactElement>}
     */
    _processMessage() {
        const { text } = this.props;
        const message = [];
        // Tokenize the text in order to avoid emoji substitution for URLs
        const tokens = text ? text.split(' ') : [];
        const content = [];
        // check if the message is a GIF
        if ((0, functions_web_1.isGifMessage)(text)) {
            const url = text.substring(constants_1.GIF_PREFIX.length, text.length - 1);
            content.push(react_1.default.createElement(GifMessage_1.default, { key: url, url: url }));
        }
        else {
            for (const token of tokens) {
                if (token.includes('://') || token.startsWith('@')) {
                    // Bypass the emojification when urls or matrix ids are involved
                    content.push(token);
                }
                else {
                    content.push(...(0, react_emoji_render_1.toArray)(token, { className: 'smiley' }));
                }
                content.push(' ');
            }
        }
        content.forEach((token, index) => {
            if (typeof token === 'string' && token !== ' ') {
                message.push(react_1.default.createElement(Linkify_1.default, { key: `${token}-${index}` }, token));
            }
            else {
                message.push(token);
            }
        });
        return message;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null, this._processMessage()));
    }
}
exports.default = Message;
