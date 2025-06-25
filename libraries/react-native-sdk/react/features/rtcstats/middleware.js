"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_3 = require("../base/tracks/actionTypes");
const actionTypes_4 = require("../face-landmarks/actionTypes");
const functions_1 = require("../jaas/functions");
const RTCStats_1 = __importDefault(require("./RTCStats"));
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Middleware which intercepts lib-jitsi-meet initialization and conference join in order init the
 * rtcstats-client.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => (next) => (action) => {
    const { getState } = store;
    const state = getState();
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                RTCStats_1.default.init();
                (0, functions_1.sendGetCustomerIdRequest)(action?.conference, state)
                    .then(customerData => {
                    const { customerId } = customerData ?? {};
                    customerId && RTCStats_1.default.sendIdentityData({ customerId });
                })
                    .catch(error => {
                    logger_1.default.error('Error while getting customer id:', error);
                });
            }
            break;
        }
        case actionTypes_3.TRACK_ADDED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                const jitsiTrack = action?.track?.jitsiTrack;
                const { ssrc, videoType } = jitsiTrack || {};
                // Remote tracks store their ssrc in the jitsiTrack object. Local tracks don't. See getSsrcByTrack.
                if (videoType && ssrc && !jitsiTrack.isLocal() && !jitsiTrack.isAudioTrack()) {
                    RTCStats_1.default.sendVideoTypeData({
                        ssrc,
                        videoType
                    });
                }
            }
            break;
        }
        case actionTypes_3.TRACK_UPDATED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                const { videoType, jitsiTrack, muted } = action?.track || {};
                const { ssrc, isLocal, videoType: trackVideoType, conference } = jitsiTrack || {};
                if (trackVideoType === 'camera' && conference && isLocal()) {
                    RTCStats_1.default.sendFaceLandmarksData({
                        duration: 0,
                        faceLandmarks: muted ? 'camera-off' : 'camera-on',
                        timestamp: Date.now()
                    });
                }
                // if the videoType of the remote track has changed we expect to find it in track.videoType. grep for
                // trackVideoTypeChanged.
                if (videoType && ssrc && !jitsiTrack.isLocal() && !jitsiTrack.isAudioTrack()) {
                    RTCStats_1.default.sendVideoTypeData({
                        ssrc,
                        videoType
                    });
                }
            }
            break;
        }
        case actionTypes_2.DOMINANT_SPEAKER_CHANGED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                const { id, previousSpeakers, silence } = action.participant;
                RTCStats_1.default.sendDominantSpeakerData({
                    dominantSpeakerEndpoint: silence ? null : id,
                    previousSpeakers
                });
            }
            break;
        }
        case actionTypes_1.E2E_RTT_CHANGED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                const { participant, rtt } = action.e2eRtt;
                RTCStats_1.default.sendE2ERTTData({
                    remoteEndpointId: participant.getId(),
                    rtt,
                    remoteRegion: participant.getProperty('region')
                });
            }
            break;
        }
        case actionTypes_4.ADD_FACE_LANDMARKS: {
            if ((0, functions_2.canSendFaceLandmarksRTCStatsData)(state)) {
                const { duration, faceExpression, timestamp } = action.faceLandmarks;
                const durationSeconds = Math.round(duration / 1000);
                RTCStats_1.default.sendFaceLandmarksData({
                    duration: durationSeconds,
                    faceLandmarks: faceExpression,
                    timestamp
                });
            }
            break;
        }
        case actionTypes_1.CONFERENCE_TIMESTAMP_CHANGED: {
            if ((0, functions_2.isRTCStatsEnabled)(state)) {
                const { conferenceTimestamp } = action;
                RTCStats_1.default.sendConferenceTimestamp(conferenceTimestamp);
            }
            break;
        }
    }
    return next(action);
});
