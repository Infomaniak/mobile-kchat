"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const constants_1 = require("../base/media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Implements the middleware of the feature screen-share.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    const { getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            _setScreenshareCaptureFps(store);
            break;
        }
        case actionTypes_2.SET_SCREENSHARE_CAPTURE_FRAME_RATE: {
            const { captureFrameRate } = action;
            _setScreenshareCaptureFps(store, captureFrameRate);
            break;
        }
        case actionTypes_2.SET_SCREEN_AUDIO_SHARE_STATE: {
            const { isSharingAudio } = action;
            const { participantId } = state['features/large-video'];
            if (isSharingAudio) {
                logger_1.default.debug(`User with id: ${participantId} playing audio sharing.`);
                APP.API.notifyAudioOrVideoSharingToggled(constants_1.MEDIA_TYPE.AUDIO, 'playing', participantId);
            }
            else {
                logger_1.default.debug(`User with id: ${participantId} stop audio sharing.`);
                APP.API.notifyAudioOrVideoSharingToggled(constants_1.MEDIA_TYPE.AUDIO, 'stop', participantId);
            }
        }
    }
    return result;
});
/**
 * Sets the capture frame rate for screenshare.
 *
 * @param {Store} store - The redux store.
 * @param {number} frameRate - Frame rate to be configured.
 * @private
 * @returns {void}
 */
function _setScreenshareCaptureFps(store, frameRate) {
    const state = store.getState();
    const { conference } = state['features/base/conference'];
    const { captureFrameRate } = state['features/screen-share'];
    const screenShareFps = frameRate ?? captureFrameRate;
    if (!conference) {
        return;
    }
    if (screenShareFps) {
        logger_1.default.debug(`Setting screenshare capture frame rate as ${screenShareFps}`);
        conference.setDesktopSharingFrameRate(screenShareFps);
    }
}
