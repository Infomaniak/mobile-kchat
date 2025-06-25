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
exports.showStartRecordingNotification = exports.showRecordingLimitNotification = exports.openHighlightDialog = void 0;
const actions_1 = require("../base/dialog/actions");
const lib_jitsi_meet_1 = __importDefault(require("../base/lib-jitsi-meet"));
const ConferenceNavigationContainerRef_1 = require("../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../mobile/navigation/routes");
const actions_2 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actions_any_1 = require("./actions.any");
const HighlightDialog_1 = __importDefault(require("./components/Recording/native/HighlightDialog"));
__exportStar(require("./actions.any"), exports);
/**
 * Opens the highlight dialog.
 *
 * @returns {Function}
 */
function openHighlightDialog() {
    return (dispatch) => {
        dispatch((0, actions_1.openSheet)(HighlightDialog_1.default));
    };
}
exports.openHighlightDialog = openHighlightDialog;
/**
 * Signals that a started recording notification should be shown on the
 * screen for a given period.
 *
 * @param {string} streamType - The type of the stream ({@code file} or
 * {@code stream}).
 * @returns {showNotification}
 */
function showRecordingLimitNotification(streamType) {
    return (dispatch, getState) => {
        const isLiveStreaming = streamType === lib_jitsi_meet_1.default.constants.recording.mode.STREAM;
        let descriptionKey, titleKey;
        if (isLiveStreaming) {
            descriptionKey = 'liveStreaming.limitNotificationDescriptionNative';
            titleKey = 'dialog.liveStreaming';
        }
        else {
            descriptionKey = 'recording.limitNotificationDescriptionNative';
            titleKey = 'dialog.recording';
        }
        const { recordingLimit = {} } = getState()['features/base/config'];
        const { limit, appName } = recordingLimit;
        return dispatch((0, actions_2.showNotification)({
            descriptionArguments: {
                limit,
                app: appName
            },
            descriptionKey,
            titleKey,
            maxLines: 2
        }, constants_1.NOTIFICATION_TIMEOUT_TYPE.LONG));
    };
}
exports.showRecordingLimitNotification = showRecordingLimitNotification;
/**
 * Displays the notification suggesting to start the recording.
 *
 * @returns {void}
 */
function showStartRecordingNotification() {
    return (dispatch) => {
        const openDialogCallback = () => (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.recording);
        dispatch((0, actions_any_1.showStartRecordingNotificationWithCallback)(openDialogCallback));
    };
}
exports.showStartRecordingNotification = showStartRecordingNotification;
