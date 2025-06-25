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
const react_native_dialog_1 = __importDefault(require("react-native-dialog"));
const react_native_paper_1 = require("react-native-paper");
const react_redux_1 = require("react-redux");
const ConfirmDialog_1 = __importDefault(require("../../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../../base/i18n/functions");
const AbstractMuteEveryonesVideoDialog_1 = __importStar(require("../AbstractMuteEveryonesVideoDialog"));
const styles_1 = __importDefault(require("./styles"));
/**
 * A React Component with the contents for a dialog that asks for confirmation
 * from the user before muting all remote participants.
 *
 * @augments AbstractMuteEveryonesVideoDialog
 */
class MuteEveryonesVideoDialog extends AbstractMuteEveryonesVideoDialog_1.default {
    /**
     * Renders the dialog switch.
     *
     * @returns {React$Component}
     */
    _renderSwitch() {
        return (this.props.exclude.length === 0
            && <react_native_dialog_1.default.Switch label={this.props.t('dialog.moderationVideoLabel')} onValueChange={this._onToggleModeration} value={!this.state.moderationEnabled}/>);
    }
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        return (<ConfirmDialog_1.default confirmLabel='dialog.muteEveryonesVideoDialogOk' descriptionKey={this.state.content} onSubmit={this._onSubmit} title={this.props.title}>
                {/* @ts-ignore */}
                <react_native_paper_1.Divider style={styles_1.default.dividerDialog}/>
                {this._renderSwitch()}
            </ConfirmDialog_1.default>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractMuteEveryonesVideoDialog_1.abstractMapStateToProps)(MuteEveryonesVideoDialog));
