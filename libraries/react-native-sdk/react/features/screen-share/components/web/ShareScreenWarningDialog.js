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
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const actions_1 = require("../../../base/tracks/actions");
const Dialog_1 = __importDefault(require("../../../base/ui/components/web/Dialog"));
/**
 *  Component that displays the share audio helper dialog.
 */
class ShareScreenWarningDialog extends react_1.Component {
    /**
     * Instantiates a new component.
     *
     * @inheritdoc
     */
    constructor(props) {
        super(props);
        this._onStopSharing = this._onStopSharing.bind(this);
    }
    /**
     * Stop current screen sharing session.
     *
     * @returns {boolean}
     */
    _onStopSharing() {
        // Depending on the context from which this dialog is opened we'll either be toggling off an audio only
        // share session or a normal screen sharing one, this is indicated by the _isAudioScreenShareWarning prop.
        this.props.dispatch((0, actions_1.toggleScreensharing)(undefined, !this.props._isAudioScreenShareWarning));
        return true;
    }
    /**
     * Implements {@Component#render}.
     *§.
     *
     * @inheritdoc
     */
    render() {
        const { t } = this.props;
        let description1, description2, header1, header2, stopSharing, title;
        if (this.props._isAudioScreenShareWarning) {
            header1 = 'dialog.shareAudioWarningH1';
            header2 = 'dialog.shareMediaWarningGenericH2';
            description1 = 'dialog.shareAudioWarningD1';
            description2 = 'dialog.shareAudioWarningD2';
            title = 'dialog.shareAudioWarningTitle';
            stopSharing = 'toolbar.stopScreenSharing';
        }
        else {
            header1 = 'dialog.shareScreenWarningTitle';
            header2 = 'dialog.shareMediaWarningGenericH2';
            description1 = 'dialog.shareScreenWarningD1';
            description2 = 'dialog.shareScreenWarningD2';
            title = 'dialog.shareScreenWarningTitle';
            stopSharing = 'toolbar.stopAudioSharing';
        }
        return (react_1.default.createElement(Dialog_1.default, { ok: { translationKey: stopSharing }, onSubmit: this._onStopSharing, titleKey: t(title) },
            react_1.default.createElement("div", { className: 'share-screen-warn-dialog' },
                react_1.default.createElement("p", { className: 'header' },
                    " ",
                    t(header1),
                    " "),
                react_1.default.createElement("p", { className: 'description' },
                    " ",
                    t(description1),
                    " "),
                react_1.default.createElement("div", { className: 'separator-line' }),
                react_1.default.createElement("p", { className: 'header' },
                    " ",
                    t(header2),
                    " "),
                react_1.default.createElement("p", { className: 'description' },
                    " ",
                    t(description2),
                    " "))));
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)()(ShareScreenWarningDialog));
