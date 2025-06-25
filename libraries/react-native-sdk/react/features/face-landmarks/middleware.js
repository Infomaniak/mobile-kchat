"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("../base/tracks/actionTypes");
const FaceLandmarksDetector_1 = __importDefault(require("./FaceLandmarksDetector"));
const actionTypes_3 = require("./actionTypes");
const constants_1 = require("./constants");
const functions_3 = require("./functions");
MiddlewareRegistry_1.default.register((store) => (next) => (action) => {
    const { dispatch, getState } = store;
    const { faceLandmarks: faceLandmarksConfig } = getState()['features/base/config'];
    const isEnabled = faceLandmarksConfig?.enableFaceCentering || faceLandmarksConfig?.enableFaceExpressionsDetection;
    if (action.type === actionTypes_1.CONFERENCE_JOINED) {
        if (isEnabled) {
            FaceLandmarksDetector_1.default.init(store);
        }
        return next(action);
    }
    else if (action.type === actionTypes_1.ENDPOINT_MESSAGE_RECEIVED) {
        // Allow using remote face centering data when local face centering is not enabled.
        const { participant, data } = action;
        if (data?.type === constants_1.FACE_BOX_EVENT_TYPE) {
            dispatch({
                type: actionTypes_3.UPDATE_FACE_COORDINATES,
                faceBox: data.faceBox,
                id: participant.getId()
            });
        }
        return next(action);
    }
    if (!isEnabled) {
        return next(action);
    }
    switch (action.type) {
        case actionTypes_1.CONFERENCE_WILL_LEAVE: {
            FaceLandmarksDetector_1.default.stopDetection(store);
            break;
        }
        case actionTypes_2.TRACK_ADDED: {
            const { jitsiTrack: { isLocal, videoType }, muted } = action.track;
            if (videoType === 'camera' && isLocal() && !muted) {
                // need to pass this since the track is not yet added in the store
                FaceLandmarksDetector_1.default.startDetection(store, action.track);
            }
            break;
        }
        case actionTypes_2.TRACK_UPDATED: {
            const { jitsiTrack: { isLocal, videoType } } = action.track;
            if (videoType !== 'camera' || !isLocal()) {
                break;
            }
            const { muted } = action.track;
            if (typeof muted !== 'undefined') {
                // addresses video mute state changes
                if (muted) {
                    FaceLandmarksDetector_1.default.stopDetection(store);
                }
                else {
                    FaceLandmarksDetector_1.default.startDetection(store);
                }
            }
            break;
        }
        case actionTypes_2.TRACK_REMOVED: {
            const { jitsiTrack: { isLocal, videoType } } = action.track;
            if (videoType === 'camera' && isLocal()) {
                FaceLandmarksDetector_1.default.stopDetection(store);
            }
            break;
        }
        case actionTypes_3.ADD_FACE_LANDMARKS: {
            const state = getState();
            const { faceLandmarks } = action;
            const conference = (0, functions_1.getCurrentConference)(state);
            if ((0, functions_2.getParticipantCount)(state) > 1) {
                (0, functions_3.sendFaceExpressionToParticipants)(conference, faceLandmarks);
            }
            // Disabling for now as there is no value of having the data in speakerstats at the server
            // sendFaceExpressionToServer(conference, faceLandmarks);
            break;
        }
        case actionTypes_3.NEW_FACE_COORDINATES: {
            const state = getState();
            const { faceBox } = action;
            const conference = (0, functions_1.getCurrentConference)(state);
            const localParticipant = (0, functions_2.getLocalParticipant)(state);
            if ((0, functions_2.getParticipantCount)(state) > 1) {
                (0, functions_3.sendFaceBoxToParticipants)(conference, faceBox);
            }
            dispatch({
                type: actionTypes_3.UPDATE_FACE_COORDINATES,
                faceBox,
                id: localParticipant?.id
            });
            break;
        }
    }
    return next(action);
});
