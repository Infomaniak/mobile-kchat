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
const svg_1 = require("../../../base/icons/svg");
const Label_1 = __importDefault(require("../../../base/label/components/native/Label"));
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const AbstractRecordingLabel_1 = __importStar(require("../AbstractRecordingLabel"));
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React {@link Component} which displays the current state of
 * conference recording.
 *
 * @augments {Component}
 */
class RecordingLabel extends AbstractRecordingLabel_1.default {
    /**
     * Renders the platform specific label component.
     *
     * @inheritdoc
     */
    _renderLabel() {
        let status = 'on';
        const isRecording = this.props.mode === lib_jitsi_meet_1.JitsiRecordingConstants.mode.FILE;
        const icon = isRecording ? svg_1.IconRecord : svg_1.IconSites;
        switch (this.props._status) {
            case lib_jitsi_meet_1.JitsiRecordingConstants.status.PENDING:
                status = 'in_progress';
                break;
            case lib_jitsi_meet_1.JitsiRecordingConstants.status.OFF:
                status = 'off';
                break;
        }
        return (<Label_1.default icon={icon} status={status} style={styles_1.default.indicatorStyle}/>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractRecordingLabel_1._mapStateToProps)(RecordingLabel));
