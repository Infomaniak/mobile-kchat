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
const utils_1 = require("../../../base/environment/utils");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const Button_1 = __importDefault(require("../../../base/ui/components/web/Button"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const functions_2 = require("../../functions");
const SmileysPanel_1 = __importDefault(require("./SmileysPanel"));
/**
 * Implements a React Component for drafting and submitting a chat message.
 *
 * @augments Component
 */
class ChatInput extends react_1.Component {
    /**
     * Initializes a new {@code ChatInput} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            showSmileysPanel: false
        };
        this._textArea = react_1.default.createRef();
        // Bind event handlers so they are only bound once for every instance.
        this._onDetectSubmit = this._onDetectSubmit.bind(this);
        this._onMessageChange = this._onMessageChange.bind(this);
        this._onSmileySelect = this._onSmileySelect.bind(this);
        this._onSubmitMessage = this._onSubmitMessage.bind(this);
        this._toggleSmileysPanel = this._toggleSmileysPanel.bind(this);
    }
    /**
     * Implements React's {@link Component#componentDidMount()}.
     *
     * @inheritdoc
     */
    componentDidMount() {
        if ((0, utils_1.isMobileBrowser)()) {
            // Ensure textarea is not focused when opening chat on mobile browser.
            this._textArea?.current && this._textArea.current.blur();
        }
        else {
            this._focus();
        }
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        if (prevProps._privateMessageRecipientId !== this.props._privateMessageRecipientId) {
            this._textArea?.current?.focus();
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement("div", { className: `chat-input-container${this.state.message.trim().length ? ' populated' : ''}` },
            react_1.default.createElement("div", { id: 'chat-input' },
                !this.props._areSmileysDisabled && this.state.showSmileysPanel && (react_1.default.createElement("div", { className: 'smiley-input' },
                    react_1.default.createElement("div", { className: 'smileys-panel' },
                        react_1.default.createElement(SmileysPanel_1.default, { onSmileySelect: this._onSmileySelect })))),
                react_1.default.createElement(Input_1.default, { className: 'chat-input', icon: this.props._areSmileysDisabled ? undefined : svg_1.IconFaceSmile, iconClick: this._toggleSmileysPanel, id: 'chat-input-messagebox', maxRows: 5, onChange: this._onMessageChange, onKeyPress: this._onDetectSubmit, placeholder: this.props.t('chat.messagebox'), ref: this._textArea, textarea: true, value: this.state.message }),
                react_1.default.createElement(Button_1.default, { accessibilityLabel: this.props.t('chat.sendButton'), disabled: !this.state.message.trim(), icon: svg_1.IconSend, onClick: this._onSubmitMessage, size: (0, utils_1.isMobileBrowser)() ? 'large' : 'medium' }))));
    }
    /**
     * Place cursor focus on this component's text area.
     *
     * @private
     * @returns {void}
     */
    _focus() {
        this._textArea?.current && this._textArea.current.focus();
    }
    /**
     * Submits the message to the chat window.
     *
     * @returns {void}
     */
    _onSubmitMessage() {
        const trimmed = this.state.message.trim();
        if (trimmed) {
            this.props.onSend(trimmed);
            this.setState({ message: '' });
            // Keep the textarea in focus when sending messages via submit button.
            this._focus();
        }
    }
    /**
     * Detects if enter has been pressed. If so, submit the message in the chat
     * window.
     *
     * @param {string} event - Keyboard event.
     * @private
     * @returns {void}
     */
    _onDetectSubmit(event) {
        // Composition events used to add accents to characters
        // despite their absence from standard US keyboards,
        // to build up logograms of many Asian languages
        // from their base components or categories and so on.
        if (event.isComposing || event.keyCode === 229) {
            // keyCode 229 means that user pressed some button,
            // but input method is still processing that.
            // This is a standard behavior for some input methods
            // like entering japanese or сhinese hieroglyphs.
            return;
        }
        if (event.key === 'Enter'
            && event.shiftKey === false
            && event.ctrlKey === false) {
            event.preventDefault();
            event.stopPropagation();
            this._onSubmitMessage();
        }
    }
    /**
     * Updates the known message the user is drafting.
     *
     * @param {string} value - Keyboard event.
     * @private
     * @returns {void}
     */
    _onMessageChange(value) {
        this.setState({ message: value });
    }
    /**
     * Appends a selected smileys to the chat message draft.
     *
     * @param {string} smileyText - The value of the smiley to append to the
     * chat message.
     * @private
     * @returns {void}
     */
    _onSmileySelect(smileyText) {
        if (smileyText) {
            this.setState({
                message: `${this.state.message} ${smileyText}`,
                showSmileysPanel: false
            });
        }
        else {
            this.setState({
                showSmileysPanel: false
            });
        }
        this._focus();
    }
    /**
     * Callback invoked to hide or show the smileys selector.
     *
     * @private
     * @returns {void}
     */
    _toggleSmileysPanel() {
        if (this.state.showSmileysPanel) {
            this._focus();
        }
        this.setState({ showSmileysPanel: !this.state.showSmileysPanel });
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {{
 *     _areSmileysDisabled: boolean
 * }}
 */
const mapStateToProps = (state) => {
    const { privateMessageRecipient } = state['features/chat'];
    return {
        _areSmileysDisabled: (0, functions_2.areSmileysDisabled)(state),
        _privateMessageRecipientId: privateMessageRecipient?.id
    };
};
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(ChatInput));
