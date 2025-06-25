"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_dialog_1 = __importDefault(require("react-native-dialog"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../i18n/functions");
const functions_2 = require("../../functions");
const AbstractDialog_1 = __importDefault(require("./AbstractDialog"));
const styles_1 = require("./styles");
/**
 * Implements a single field input dialog component.
 */
class InputDialog extends AbstractDialog_1.default {
    /**
     * Instantiates a new {@code InputDialog}.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this.state = {
            fieldValue: props.initialValue,
            isValid: props.validateInput ? props.validateInput(props.initialValue) : true,
            submitting: false
        };
        this._onChangeText = this._onChangeText.bind(this);
        this._onSubmitValue = this._onSubmitValue.bind(this);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { descriptionKey, messageKey, t, titleKey } = this.props;
        return (<react_native_dialog_1.default.Container coverScreen={false} visible={true}>
                <react_native_dialog_1.default.Title>
                    {t(titleKey ?? '')}
                </react_native_dialog_1.default.Title>
                {descriptionKey && (<react_native_dialog_1.default.Description>
                            {t(descriptionKey)}
                        </react_native_dialog_1.default.Description>)}
                <react_native_dialog_1.default.Input autoFocus={true} onChangeText={this._onChangeText} value={this.state.fieldValue} {...this.props.textInputProps}/>
                {messageKey && (<react_native_dialog_1.default.Description style={styles_1.inputDialog.formMessage}>
                            {t(messageKey)}
                        </react_native_dialog_1.default.Description>)}
                {!this.props.disableCancel && <react_native_dialog_1.default.Button label={t('dialog.Cancel')} onPress={this._onCancel}/>}
                <react_native_dialog_1.default.Button disabled={!this.state.isValid} label={t('dialog.Ok')} onPress={this._onSubmitValue}/>
            </react_native_dialog_1.default.Container>);
    }
    /**
     * Callback to be invoked when the text in the field changes.
     *
     * @param {string} fieldValue - The updated field value.
     * @returns {void}
     */
    _onChangeText(fieldValue) {
        if (this.props.validateInput) {
            this.setState({
                isValid: this.props.validateInput(fieldValue),
                fieldValue
            });
            return;
        }
        this.setState({
            fieldValue
        });
    }
    /**
     * Callback to be invoked when the value of this dialog is submitted.
     *
     * @returns {boolean}
     */
    _onSubmitValue() {
        return this._onSubmit(this.state.fieldValue);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(functions_2._abstractMapStateToProps)(InputDialog));
