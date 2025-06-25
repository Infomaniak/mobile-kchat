"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./middleware.any");
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const LocalRecordingManager_web_1 = __importDefault(require("../../recording/components/Recording/LocalRecordingManager.web"));
const StopRecordingDialog_1 = __importDefault(require("../../recording/components/Recording/web/StopRecordingDialog"));
const actions_2 = require("../dialog/actions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
require("./subscriber");
/**
 * Implements the entry point of the middleware of the feature base/media.
 *
 * @param {IStore} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => (next) => (action) => {
    const { dispatch } = store;
    switch (action.type) {
        case actionTypes_1.SET_VIDEO_MUTED: {
            if (LocalRecordingManager_web_1.default.isRecordingLocally() && LocalRecordingManager_web_1.default.selfRecording.on) {
                if (action.muted && LocalRecordingManager_web_1.default.selfRecording.withVideo) {
                    dispatch((0, actions_2.openDialog)(StopRecordingDialog_1.default, { localRecordingVideoStop: true }));
                    return;
                }
                else if (!action.muted && !LocalRecordingManager_web_1.default.selfRecording.withVideo) {
                    dispatch((0, actions_1.showNotification)({
                        titleKey: 'recording.localRecordingNoVideo',
                        descriptionKey: 'recording.localRecordingVideoWarning',
                        uid: 'recording.localRecordingNoVideo'
                    }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
                }
            }
        }
    }
    return next(action);
});
