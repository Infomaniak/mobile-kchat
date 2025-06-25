"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const VideoLayout_js_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout.js"));
const actionTypes_1 = require("../base/conference/actionTypes");
const constants_1 = require("../base/media/constants");
const actionTypes_2 = require("../base/participants/actionTypes");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_3 = require("../base/tracks/actionTypes");
const actionTypes_4 = require("../participants-pane/actionTypes");
require("./middleware.any");
/**
 * Middleware which intercepts actions and updates the legacy component
 * {@code VideoLayout} as needed. The purpose of this middleware is to redux-ify
 * {@code VideoLayout} without having to simultaneously react-ifying it.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry_1.default.register(store => next => action => {
    // Purposefully perform additional actions after state update to mimic
    // being connected to the store for updates.
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.CONFERENCE_WILL_INIT:
            // Reset VideoLayout. It's destroyed on CONFERENCE_WILL_LEAVE so re-initialize it.
            VideoLayout_js_1.default.initLargeVideo();
            VideoLayout_js_1.default.resizeVideoArea();
            break;
        case actionTypes_1.CONFERENCE_WILL_LEAVE:
            VideoLayout_js_1.default.reset();
            break;
        case actionTypes_2.PARTICIPANT_JOINED:
            if (!action.participant.local) {
                VideoLayout_js_1.default.updateVideoMutedForNoTracks(action.participant.id);
            }
            break;
        case actionTypes_4.PARTICIPANTS_PANE_CLOSE:
        case actionTypes_4.PARTICIPANTS_PANE_OPEN:
            VideoLayout_js_1.default.resizeVideoArea();
            break;
        case actionTypes_3.TRACK_ADDED:
            if (action.track.mediaType !== constants_1.MEDIA_TYPE.AUDIO) {
                VideoLayout_js_1.default._updateLargeVideoIfDisplayed(action.track.participantId, true);
            }
            break;
        case actionTypes_3.TRACK_STOPPED: {
            if (action.track.jitsiTrack.isLocal()) {
                const participant = (0, functions_1.getLocalParticipant)(store.getState);
                VideoLayout_js_1.default._updateLargeVideoIfDisplayed(participant?.id);
            }
            break;
        }
        case actionTypes_3.TRACK_REMOVED:
            if (!action.track.local && action.track.mediaType !== constants_1.MEDIA_TYPE.AUDIO) {
                VideoLayout_js_1.default.updateVideoMutedForNoTracks(action.track.jitsiTrack.getParticipantId());
            }
            break;
    }
    return result;
});
