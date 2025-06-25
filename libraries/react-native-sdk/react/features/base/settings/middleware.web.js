"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../../prejoin/actionTypes");
const actions_1 = require("../../prejoin/actions");
const actionTypes_2 = require("../app/actionTypes");
const functions_1 = require("../jwt/functions");
const constants_1 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_3 = require("../tracks/actionTypes");
const actions_2 = require("./actions");
const logger_1 = __importDefault(require("./logger"));
require("./middleware.any");
/**
 * The middleware of the feature base/settings. Distributes changes to the state
 * of base/settings to the states of other features computed from the state of
 * base/settings.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_2.APP_WILL_MOUNT:
            _initializeShowPrejoin(store);
            break;
        case actionTypes_1.PREJOIN_INITIALIZED:
            _maybeUpdateDisplayName(store);
            break;
        case actionTypes_3.TRACK_ADDED:
            _maybeUpdateDeviceId(store, action.track);
            break;
    }
    return result;
});
/**
 * Overwrites the showPrejoin flag based on cached used selection for showing prejoin screen.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _initializeShowPrejoin({ dispatch, getState }) {
    const { userSelectedSkipPrejoin } = getState()['features/base/settings'];
    if (userSelectedSkipPrejoin) {
        dispatch((0, actions_1.setPrejoinPageVisibility)(false));
    }
}
/**
 * Updates the display name to the one in JWT if there is one.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _maybeUpdateDisplayName({ dispatch, getState }) {
    const state = getState();
    const hasJwt = Boolean(state['features/base/jwt'].jwt);
    if (hasJwt) {
        const displayName = (0, functions_1.getJwtName)(state);
        if (displayName) {
            dispatch((0, actions_2.updateSettings)({
                displayName
            }));
        }
    }
}
/**
 * Maybe update the camera or mic device id when local track is added or updated.
 *
 * @param {Store} store - The redux store.
 * @param {ITrack} track - The potential local track.
 * @private
 * @returns {void}
 */
function _maybeUpdateDeviceId({ dispatch, getState }, track) {
    if (track.local) {
        const { cameraDeviceId, micDeviceId } = getState()['features/base/settings'];
        const deviceId = track.jitsiTrack.getDeviceId();
        if (track.mediaType === constants_1.MEDIA_TYPE.VIDEO && track.videoType === 'camera' && cameraDeviceId !== deviceId) {
            dispatch((0, actions_2.updateSettings)({
                cameraDeviceId: track.jitsiTrack.getDeviceId()
            }));
            logger_1.default.info(`switched local video device to: ${deviceId}`);
        }
        else if (track.mediaType === constants_1.MEDIA_TYPE.AUDIO && micDeviceId !== deviceId) {
            dispatch((0, actions_2.updateSettings)({
                micDeviceId: track.jitsiTrack.getDeviceId()
            }));
            logger_1.default.info(`switched local audio input device to: ${deviceId}`);
        }
    }
}
