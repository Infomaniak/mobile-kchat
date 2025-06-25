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
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const functions_2 = require("../../functions");
const INITIAL_DISPLAY_NAME = '';
/**
 * Implements a React {@code Component} for displaying a dialog with an field
 * for setting the local participant's display name.
 *
 * @augments Component
 */
class DisplayNamePrompt extends react_1.Component {
    /**
     * Initializes a new {@code DisplayNamePrompt} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            displayName: INITIAL_DISPLAY_NAME,
            isValid: this.props.validateInput ? this.props.validateInput(INITIAL_DISPLAY_NAME) : true
        };
        // Bind event handlers so they are only bound once for every instance.
        this._onDisplayNameChange = this._onDisplayNameChange.bind(this);
        this._onSubmit = this._onSubmit.bind(this);
        this._onSetDisplayName = (0, functions_2.onSetDisplayName)(props.dispatch, props.onPostSubmit);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const disableCloseDialog = Boolean(this.props.validateInput);
        return (react_1.default.createElement(Dialog_1.default, { cancel: { hidden: true }, disableBackdropClose: disableCloseDialog, disableEnter: !this.state.isValid, disableEscape: disableCloseDialog, hideCloseButton: disableCloseDialog, ok: {
                disabled: !this.state.isValid,
                translationKey: 'dialog.Ok'
            }, onSubmit: this._onSubmit, titleKey: 'dialog.displayNameRequired' },
            react_1.default.createElement(Input_1.default, { autoFocus: true, className: 'dialog-bottom-margin', id: 'dialog-displayName', label: this.props.t('dialog.enterDisplayName'), name: 'displayName', onChange: this._onDisplayNameChange, type: 'text', value: this.state.displayName })));
    }
    /**
     * Updates the entered display name.
     *
     * @param {string} value - The new value of the input.
     * @private
     * @returns {void}
     */
    _onDisplayNameChange(value) {
        if (this.props.validateInput) {
            this.setState({
                isValid: this.props.validateInput(value),
                displayName: value
            });
            return;
        }
        this.setState({
            displayName: value
        });
    }
    /**
     * Dispatches an action to update the local participant's display name. A
     * name must be entered for the action to dispatch.
     *
     * @private
     * @returns {boolean}
     */
    _onSubmit() {
        return this._onSetDisplayName(this.state.displayName);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(DisplayNamePrompt));
