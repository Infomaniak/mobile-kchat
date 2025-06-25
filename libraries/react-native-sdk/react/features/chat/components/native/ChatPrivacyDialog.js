"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../../base/i18n/functions");
const AbstractChatPrivacyDialog_1 = require("../AbstractChatPrivacyDialog");
/**
 * Implements a component for the dialog displayed to avoid mis-sending private messages.
 */
class ChatPrivacyDialog extends AbstractChatPrivacyDialog_1.AbstractChatPrivacyDialog {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<ConfirmDialog_1.default cancelLabel='dialog.sendPrivateMessageCancel' confirmLabel='dialog.sendPrivateMessageOk' descriptionKey='dialog.sendPrivateMessage' onCancel={this._onSendGroupMessage} onSubmit={this._onSendPrivateMessage}/>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractChatPrivacyDialog_1._mapStateToProps, AbstractChatPrivacyDialog_1._mapDispatchToProps)(ChatPrivacyDialog));
