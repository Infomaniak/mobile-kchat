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
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../../base/i18n/functions");
const actions_native_1 = require("../../actions.native");
/**
 * The dialog is display in XMPP password + guest access configuration, after
 * user connects from anonymous domain and the conference does not exist yet.
 *
 * See {@link LoginDialog} description for more details.
 */
class WaitForOwnerDialog extends react_1.Component {
    /**
     * Initializes a new WaitForWonderDialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._onLogin = this._onLogin.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isConfirmHidden } = this.props;
        return (<ConfirmDialog_1.default cancelLabel={this.props._alternativeCancelText ? 'dialog.WaitingForHostButton' : 'dialog.Cancel'} confirmLabel='dialog.IamHost' descriptionKey='dialog.WaitForHostMsg' isConfirmHidden={_isConfirmHidden} onCancel={this._onCancel} onSubmit={this._onLogin}/>);
    }
    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancel() {
        this.props.dispatch((0, actions_native_1.cancelWaitForOwner)());
    }
    /**
     * Called when the OK button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onLogin() {
        this.props.dispatch((0, actions_native_1.login)());
    }
}
/**
 * Maps (parts of) the redux state to the associated
 * {@code WaitForOwnerDialog}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {IProps}
 */
function mapStateToProps(state) {
    const { membersOnly, lobbyWaitingForHost } = state['features/base/conference'];
    const { locationURL } = state['features/base/connection'];
    return {
        _alternativeCancelText: membersOnly && lobbyWaitingForHost,
        _isConfirmHidden: locationURL?.hostname?.includes('8x8.vc')
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(WaitForOwnerDialog));
