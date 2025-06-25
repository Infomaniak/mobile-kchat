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
const functions_1 = require("../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../base/ui/components/web/Input"));
const actions_2 = require("../actions");
/**
 * Implements a React Component which prompts the user when a password is
 * required to join a conference.
 */
class PasswordRequiredPrompt extends react_1.Component {
    /**
     * Initializes a new PasswordRequiredPrompt instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            password: ''
        };
        // Bind event handlers so they are only bound once per instance.
        this._onPasswordChanged = this._onPasswordChanged.bind(this);
        this._onCancel = this._onCancel.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement(Dialog_1.default, { disableBackdropClose: true, onCancel: this._onCancel, onSubmit: this._onSubmit, titleKey: 'dialog.passwordRequired' }, this._renderBody()));
    }
    /**
     * Display component in dialog body.
     *
     * @returns {ReactElement}
     * @protected
     */
    _renderBody() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(Input_1.default, { autoFocus: true, className: 'dialog-bottom-margin', id: 'required-password-input', label: this.props.t('dialog.passwordLabel'), name: 'lockKey', onChange: this._onPasswordChanged, type: 'password', value: this.state.password })));
    }
    /**
     * Notifies this dialog that password has changed.
     *
     * @param {string} value - The details of the notification/event.
     * @private
     * @returns {void}
     */
    _onPasswordChanged(value) {
        this.setState({
            password: value
        });
    }
    /**
     * Dispatches action to cancel and dismiss this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onCancel() {
        this.props.dispatch((0, actions_2._cancelPasswordRequiredPrompt)(this.props.conference));
        return true;
    }
    /**
     * Dispatches action to submit value from this dialog.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit() {
        const { conference } = this.props;
        // We received that password is required, but user is trying anyway to
        // login without a password. Mark the room as not locked in case she
        // succeeds (maybe someone removed the password meanwhile). If it is
        // still locked, another password required will be received and the room
        // again will be marked as locked.
        this.props.dispatch((0, actions_1.setPassword)(conference, conference.join, this.state.password));
        // We have used the password so let's clean it.
        this.setState({
            password: undefined
        });
        return true;
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(PasswordRequiredPrompt));
