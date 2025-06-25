"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-expect-error
const VideoLayout_1 = __importDefault(require("../../../modules/UI/videolayout/VideoLayout"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_web_1 = require("../base/tracks/functions.web");
const functions_1 = require("./functions");
/**
 * Updates the on stage participant video.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/large-video'].participantId, 
/* listener */ participantId => {
    VideoLayout_1.default.updateLargeVideo(participantId, true);
});
/**
 * Schedules a large video update when the streaming status of the track associated with the large video changes.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const largeVideoParticipant = (0, functions_1.getLargeVideoParticipant)(state);
    const videoTrack = (0, functions_web_1.getVideoTrackByParticipant)(state, largeVideoParticipant);
    return {
        participantId: largeVideoParticipant?.id,
        streamingStatus: videoTrack?.streamingStatus
    };
}, 
/* listener */ ({ participantId, streamingStatus }, previousState = {}) => {
    if (streamingStatus !== previousState.streamingStatus) {
        VideoLayout_1.default.updateLargeVideo(participantId, true);
    }
}, {
    deepEquals: true
});
