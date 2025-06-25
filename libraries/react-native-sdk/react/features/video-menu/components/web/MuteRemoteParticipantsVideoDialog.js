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
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
const AbstractMuteRemoteParticipantsVideoDialog_1 = __importStar(require("../AbstractMuteRemoteParticipantsVideoDialog"));
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before disabling a remote participants camera.
 *
 * @augments Component
 */
class MuteRemoteParticipantsVideoDialog extends AbstractMuteRemoteParticipantsVideoDialog_1.default {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: 'dialog.muteParticipantsVideoButton' }, onSubmit: this._onSubmit, titleKey: 'dialog.muteParticipantsVideoTitle' },
            react_1.default.createElement("div", null, this.props.t(this.props.isVideoModerationOn
                ? 'dialog.muteParticipantsVideoBodyModerationOn'
                : 'dialog.muteParticipantsVideoBody'))));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractMuteRemoteParticipantsVideoDialog_1.abstractMapStateToProps)(MuteRemoteParticipantsVideoDialog));
