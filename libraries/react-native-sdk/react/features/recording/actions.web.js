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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.showStartRecordingNotification = exports.showRecordingLimitNotification = void 0;
const react_1 = __importDefault(require("react"));
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = __importDefault(require("../base/lib-jitsi-meet"));
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_any_1 = require("./actions.any");
const Recording_1 = require("./components/Recording");
const RecordingLimitNotificationDescription_1 = __importDefault(require("./components/web/RecordingLimitNotificationDescription"));
__exportStar(require("./actions.any"), exports);
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {showNotification}
 */
function showRecordingLimitNotification(streamType) {
    const isLiveStreaming = streamType === lib_jitsi_meet_1.default.constants.recording.mode.STREAM;
    return (0, actions_2.showNotification)({
        description: react_1.default.createElement(RecordingLimitNotificationDescription_1.default, { isLiveStreaming: isLiveStreaming }),
        titleKey: isLiveStreaming ? 'dialog.liveStreaming' : 'dialog.recording'
    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG);
}
exports.showRecordingLimitNotification = showRecordingLimitNotification;
/**
 * Displays the notification suggesting to start the recording.
 *
 * @returns {void}
 */
function showStartRecordingNotification() {
    return (dispatch) => {
        const openDialogCallback = () => dispatch((0, actions_1.openDialog)(Recording_1.StartRecordingDialog));
        dispatch((0, actions_any_1.showStartRecordingNotificationWithCallback)(openDialogCallback));
    };
}
exports.showStartRecordingNotification = showStartRecordingNotification;
