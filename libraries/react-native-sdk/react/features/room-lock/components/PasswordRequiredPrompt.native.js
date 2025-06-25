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
const actions_1 = require("../../base/conference/actions");
const InputDialog_1 = __importDefault(require("../../base/dialog/components/native/InputDialog"));
const actions_2 = require("../actions");
/**
 * Implements a React {@code Component} which prompts the user when a password
 * is required to join a conference.
 */
class PasswordRequiredPrompt extends react_1.Component {
    /**
     * Initializes a new {@code PasswordRequiredPrompt} instance.
     *
     * @param {IProps} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            password: props._password
        };
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate() {
        const { _password } = this.props;
        // The previous password in Redux gets cleared after the dialog appears and it ends up breaking the dialog
        // logic. We move the prop into state and only update it if it has an actual value, avoiding losing the
        // previously received value when Redux updates.
        if (_password && _password !== this.state.password) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                password: _password
            });
        }
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { password } = this.state;
        const { _passwordNumberOfDigits } = this.props;
        const textInputProps = {
            secureTextEntry: true
        };
        if (_passwordNumberOfDigits) {
            textInputProps.keyboardType = 'numeric';
            textInputProps.maxLength = _passwordNumberOfDigits;
        }
        return (<InputDialog_1.default descriptionKey='dialog.passwordLabel' initialValue={password} messageKey={password ? 'dialog.incorrectRoomLockPassword' : undefined} onCancel={this._onCancel} onSubmit={this._onSubmit} textInputProps={textInputProps} titleKey='dialog.password'/>);
    }
    /**
     * Notifies this prompt that it has been dismissed by cancel.
     *
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onCancel() {
        this.props.dispatch((0, actions_2._cancelPasswordRequiredPrompt)(this.props.conference));
        return true;
    }
    /**
     * Notifies this prompt that it has been dismissed by submitting a specific
     * value.
     *
     * @param {string|undefined} value - The submitted value.
     * @private
     * @returns {boolean} If this prompt is to be closed/hidden, {@code true};
     * otherwise, {@code false}.
     */
    _onSubmit(value) {
        const { conference } = this.props;
        this.props.dispatch((0, actions_1.setPassword)(conference, conference.join, value));
        return true;
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { roomPasswordNumberOfDigits } = state['features/base/config'];
    return {
        _password: state['features/base/conference'].password,
        _passwordNumberOfDigits: roomPasswordNumberOfDigits
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(PasswordRequiredPrompt);
