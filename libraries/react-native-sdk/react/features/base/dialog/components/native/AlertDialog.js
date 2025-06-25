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
const functions_native_1 = require("../functions.native");
const AbstractDialog_1 = __importDefault(require("./AbstractDialog"));
/**
 * Implements an alert dialog, to simply show an error or a message,
 * then disappear on dismiss.
 */
class AlertDialog extends AbstractDialog_1.default {
    /**
     * Implements React's {@link Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { contentKey, t } = this.props;
        const content = typeof contentKey === 'string'
            ? t(contentKey)
            : (0, functions_native_1.renderHTML)(t(contentKey.key, contentKey.params));
        return (<react_native_dialog_1.default.Container coverScreen={false} visible={true}>
                <react_native_dialog_1.default.Description>
                    {content}
                </react_native_dialog_1.default.Description>
                <react_native_dialog_1.default.Button label={t('dialog.Ok')} onPress={this._onSubmit}/>
            </react_native_dialog_1.default.Container>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(functions_2._abstractMapStateToProps)(AlertDialog));
