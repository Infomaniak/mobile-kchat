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
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const actions_web_1 = require("../../actions.web");
/**
 * Authentication message dialog for host confirmation.
 *
 * @returns {React$Element<any>}
 */
class WaitForOwnerDialog extends react_1.PureComponent {
    /**
     * Instantiates a new component.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this._onCancelWaitForOwner = this._onCancelWaitForOwner.bind(this);
        this._onIAmHost = this._onIAmHost.bind(this);
    }
    /**
     * Called when the cancel button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onCancelWaitForOwner() {
        const { dispatch } = this.props;
        dispatch((0, actions_web_1.cancelWaitForOwner)());
    }
    /**
     * Called when the OK button is clicked.
     *
     * @private
     * @returns {void}
     */
    _onIAmHost() {
        this.props.dispatch((0, actions_web_1.login)());
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        return (react_1.default.createElement(Dialog_1.default, { cancel: { translationKey: this.props._alternativeCancelText ? 'dialog.WaitingForHostButton' : 'dialog.Cancel' }, disableBackdropClose: true, hideCloseButton: true, ok: this.props._hideLoginButton ? { hidden: true,
                disabled: true } : { translationKey: 'dialog.IamHost' }, onCancel: this._onCancelWaitForOwner, onSubmit: this._onIAmHost, titleKey: t('dialog.WaitingForHostTitle') },
            react_1.default.createElement("span", null, this.props._hideLoginButton ? t('dialog.WaitForHostNoAuthMsg') : t('dialog.WaitForHostMsg'))));
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
    const { hideLoginButton } = state['features/base/config'];
    return {
        _alternativeCancelText: membersOnly && lobbyWaitingForHost,
        _hideLoginButton: hideLoginButton
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(mapStateToProps)(WaitForOwnerDialog));
