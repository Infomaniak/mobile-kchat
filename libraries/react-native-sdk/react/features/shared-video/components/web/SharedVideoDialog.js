"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/dialog/actions");
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const Input_1 = __importDefault(require("../../../base/ui/components/web/Input"));
const AbstractSharedVideoDialog_1 = __importDefault(require("../AbstractSharedVideoDialog"));
/**
 * Component that renders the video share dialog.
 *
 * @returns {React$Element<any>}
 */
class SharedVideoDialog extends AbstractSharedVideoDialog_1.default {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            okDisabled: true,
            error: false
        };
        this._onChange = this._onChange.bind(this);
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }
    /**
     * Callback for the onChange event of the field.
     *
     * @param {string} value - The static event.
     * @returns {void}
     */
    _onChange(value) {
        this.setState({
            value,
            okDisabled: !value
        });
    }
    /**
     * Callback to be invoked when the value of the link input is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue() {
        const result = super._onSetVideoLink(this.state.value);
        if (result) {
            this.props.dispatch((0, actions_1.hideDialog)());
        }
        else {
            this.setState({
                error: true
            });
        }
        return result;
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        const { error } = this.state;
        return (react_1.default.createElement(Dialog_1.default, { disableAutoHideOnSubmit: true, ok: {
                disabled: this.state.okDisabled,
                translationKey: 'dialog.Share'
            }, onSubmit: this._onSubmitValue, titleKey: 'dialog.shareVideoTitle' },
            react_1.default.createElement(Input_1.default, { autoFocus: true, bottomLabel: error && t('dialog.sharedVideoDialogError'), className: 'dialog-bottom-margin', error: error, id: 'shared-video-url-input', label: t('dialog.videoLink'), name: 'sharedVideoUrl', onChange: this._onChange, placeholder: t('dialog.sharedVideoLinkPlaceholder'), type: 'text', value: this.state.value })));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(SharedVideoDialog));
