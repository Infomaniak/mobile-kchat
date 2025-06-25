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
const ConfirmDialog_1 = __importDefault(require("../../../../base/dialog/components/native/ConfirmDialog"));
const functions_1 = require("../../../../base/i18n/functions");
const AbstractStopRecordingDialog_1 = __importStar(require("../AbstractStopRecordingDialog"));
/**
 * React Component for getting confirmation to stop a file recording session in
 * progress.
 *
 * @augments Component
 */
class StopRecordingDialog extends AbstractStopRecordingDialog_1.default {
    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        return (<ConfirmDialog_1.default descriptionKey='dialog.stopRecordingWarning' onSubmit={this._onSubmit}/>);
    }
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(AbstractStopRecordingDialog_1._mapStateToProps)(StopRecordingDialog));
