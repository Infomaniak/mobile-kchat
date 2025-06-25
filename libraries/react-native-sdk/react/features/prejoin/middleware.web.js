"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/connection/actionTypes");
const actionTypes_3 = require("../base/media/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("../base/settings/actions");
const actionTypes_4 = require("../base/tracks/actionTypes");
const actions_2 = require("./actions");
const functions_1 = require("./functions");
/**
 * The redux middleware for {@link PrejoinPage}.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    switch (action.type) {
        case actionTypes_3.SET_AUDIO_MUTED: {
            if ((0, functions_1.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_1.updateSettings)({
                    startWithAudioMuted: Boolean(action.muted)
                }));
            }
            break;
        }
        case actionTypes_3.SET_VIDEO_MUTED: {
            if ((0, functions_1.isPrejoinPageVisible)(store.getState())) {
                store.dispatch((0, actions_1.updateSettings)({
                    startWithVideoMuted: Boolean(action.muted)
                }));
            }
            break;
        }
        case actionTypes_4.TRACK_ADDED:
        case actionTypes_4.TRACK_NO_DATA_FROM_SOURCE: {
            const state = store.getState();
            if ((0, functions_1.isPrejoinPageVisible)(state)) {
                const { track: { jitsiTrack: track } } = action;
                const { deviceStatusType, deviceStatusText } = state['features/prejoin'];
                if (!track.isAudioTrack()) {
                    break;
                }
                if (track.isReceivingData()) {
                    if (deviceStatusType === 'warning'
                        && deviceStatusText === 'prejoin.audioDeviceProblem') {
                        store.dispatch((0, actions_2.setDeviceStatusOk)('prejoin.lookGood'));
                    }
                }
                else if (deviceStatusType === 'ok') {
                    store.dispatch((0, actions_2.setDeviceStatusWarning)('prejoin.audioDeviceProblem'));
                }
            }
            break;
        }
        case actionTypes_1.CONFERENCE_FAILED:
        case actionTypes_2.CONNECTION_FAILED:
            store.dispatch((0, actions_2.setJoiningInProgress)(false));
            break;
        case actionTypes_1.CONFERENCE_JOINED:
            return _conferenceJoined(store, next, action);
    }
    return next(action);
});
/**
 * Handles cleanup of prejoin state when a conference is joined.
 *
 * @param {Object} store - The Redux store.
 * @param {Function} next - The Redux next function.
 * @param {Object} action - The Redux action.
 * @returns {Object}
 */
function _conferenceJoined({ dispatch }, next, action) {
    dispatch((0, actions_2.setJoiningInProgress)(false));
    return next(action);
}
