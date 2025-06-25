"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../../base/i18n/functions");
const AbstractKickRemoteParticipantDialog_1 = __importDefault(require("../AbstractKickRemoteParticipantDialog"));
/**
 * Dialog to confirm a remote participant kick action.
 */
class KickRemoteParticipantDialog extends AbstractKickRemoteParticipantDialog_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (<ConfirmDialog_1.default cancelLabel='dialog.Cancel' confirmLabel='dialog.kickParticipantButton' descriptionKey='dialog.kickParticipantDialog' isConfirmDestructive={true} onSubmit={this._onSubmit} title='dialog.kickParticipantTitle'/>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(KickRemoteParticipantDialog));
