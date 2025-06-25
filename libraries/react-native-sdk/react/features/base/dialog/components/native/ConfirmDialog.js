"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_native_dialog_1 = __importDefault(require("react-native-dialog"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../i18n/functions");
const functions_native_1 = require("../functions.native");
const AbstractDialog_1 = __importDefault(require("./AbstractDialog"));
const styles_1 = __importDefault(require("./styles"));
/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
class ConfirmDialog extends AbstractDialog_1.default {
    /**
     * Renders the dialog description.
     *
     * @returns {React$Component}
     */
    _renderDescription() {
        const { descriptionKey, t } = this.props;
        const description = typeof descriptionKey === 'string'
            ? t(descriptionKey)
            : (0, functions_native_1.renderHTML)(t(descriptionKey?.key ?? '', descriptionKey?.params));
        return (<react_native_dialog_1.default.Description>
                {description}
            </react_native_dialog_1.default.Description>);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { cancelLabel, children, confirmLabel, isConfirmDestructive, isConfirmHidden, t, title } = this.props;
        const dialogButtonStyle = isConfirmDestructive
            ? styles_1.default.destructiveDialogButton : styles_1.default.dialogButton;
        return (<react_native_dialog_1.default.Container coverScreen={false} visible={true}>
                {title && <react_native_dialog_1.default.Title>
                        {t(title)}
                    </react_native_dialog_1.default.Title>}
                {this._renderDescription()}
                {children}
                <react_native_dialog_1.default.Button label={t(cancelLabel || 'dialog.confirmNo')} onPress={this._onCancel} style={styles_1.default.dialogButton}/>
                {!isConfirmHidden && <react_native_dialog_1.default.Button label={t(confirmLabel || 'dialog.confirmYes')} onPress={this._onSubmit} style={dialogButtonStyle}/>}
            </react_native_dialog_1.default.Container>);
    }
}
/**
 * Default values for {@code ConfirmDialog} component's properties.
 *
 * @static
 */
ConfirmDialog.defaultProps = {
    isConfirmDestructive: false,
    isConfirmHidden: false
};
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(ConfirmDialog));
