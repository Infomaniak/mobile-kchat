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
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/responsive-ui/constants");
const IconButton_1 = __importDefault(require("../../../base/ui/components/native/IconButton"));
const Input_1 = __importDefault(require("../../../base/ui/components/native/Input"));
const constants_native_1 = require("../../../base/ui/constants.native");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements the chat input bar with text field and action(s).
 */
class ChatInputBar extends react_1.Component {
    /**
     * Instantiates a new instance of the component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            addPadding: false,
            message: '',
            showSend: false
        };
        this._onChangeText = this._onChangeText.bind(this);
        this._onFocused = this._onFocused.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        let inputBarStyles;
        if (this.props.aspectRatio === constants_1.ASPECT_RATIO_WIDE) {
            inputBarStyles = styles_1.default.inputBarWide;
        }
        else {
            inputBarStyles = styles_1.default.inputBarNarrow;
        }
        return (<react_native_1.View style={[
                inputBarStyles,
                this.state.addPadding ? styles_1.default.extraBarPadding : null
            ]}>
                <Input_1.default blurOnSubmit={false} customStyles={{ container: styles_1.default.customInputContainer }} multiline={false} onBlur={this._onFocused(false)} onChange={this._onChangeText} onFocus={this._onFocused(true)} onSubmitEditing={this._onSubmit} placeholder={this.props.t('chat.fieldPlaceHolder')} returnKeyType='send' value={this.state.message}/>
                <IconButton_1.default disabled={!this.state.message} onPress={this._onSubmit} src={svg_1.IconSend} type={constants_native_1.BUTTON_TYPES.PRIMARY}/>
            </react_native_1.View>);
    }
    /**
     * Callback to handle the change of the value of the text field.
     *
     * @param {string} text - The current value of the field.
     * @returns {void}
     */
    _onChangeText(text) {
        this.setState({
            message: text,
            showSend: Boolean(text)
        });
    }
    /**
     * Constructs a callback to be used to update the padding of the field if necessary.
     *
     * @param {boolean} focused - True of the field is focused.
     * @returns {Function}
     */
    _onFocused(focused) {
        return () => {
            react_native_1.Platform.OS === 'android' && this.setState({
                addPadding: focused
            });
        };
    }
    /**
     * Callback to handle the submit event of the text field.
     *
     * @returns {void}
     */
    _onSubmit() {
        const message = this.state.message.trim();
        message && this.props.onSend(message);
        this.setState({
            message: '',
            showSend: false
        });
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { aspectRatio } = state['features/base/responsive-ui'];
    return {
        aspectRatio
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ChatInputBar));
