"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const InputDialog_1 = __importDefault(require("../../../base/dialog/components/native/InputDialog"));
const functions_1 = require("../../../base/i18n/functions");
const AbstractSharedVideoDialog_1 = __importDefault(require("../AbstractSharedVideoDialog"));
/**
 * Implements a component to render a display name prompt.
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
            error: false
        };
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }
    /**
     * Callback to be invoked when the value of the link input is submitted.
     *
     * @param {string} value - The entered video link.
     * @returns {boolean}
     */
    _onSubmitValue(value) {
        const result = super._onSetVideoLink(value);
        if (!result) {
            this.setState({ error: true });
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
        return (<InputDialog_1.default messageKey={error ? 'dialog.sharedVideoDialogError' : undefined} onSubmit={this._onSubmitValue} textInputProps={{
                autoCapitalize: 'none',
                autoCorrect: false,
                placeholder: t('dialog.sharedVideoLinkPlaceholder')
            }} titleKey='dialog.shareVideoTitle'/>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(SharedVideoDialog));
