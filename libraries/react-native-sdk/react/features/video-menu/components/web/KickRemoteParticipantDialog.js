"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
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
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.kickParticipantButton' }, onSubmit: this._onSubmit, titleKey: 'dialog.kickParticipantTitle' },
            react_1.default.createElement("div", null, this.props.t('dialog.kickParticipantDialog'))));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(KickRemoteParticipantDialog));
