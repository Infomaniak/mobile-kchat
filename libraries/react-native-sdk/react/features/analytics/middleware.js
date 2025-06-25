"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/config/actionTypes");
const actionTypes_3 = require("../base/net-info/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_4 = require("../base/tracks/actionTypes");
const functions_1 = require("../base/tracks/functions");
const actionTypes_5 = require("../lobby/actionTypes");
const functions_2 = require("../lobby/functions");
const actionTypes_6 = require("../visitors/actionTypes");
const functions_3 = require("../visitors/functions");
const AnalyticsEvents_1 = require("./AnalyticsEvents");
const actionTypes_7 = require("./actionTypes");
const actions_1 = require("./actions");
const functions_4 = require("./functions");
/**
 * Calculates the duration of the local tracks.
 *
 * @param {Object} state - The redux state.
 * @returns {Object} - The local tracks duration.
 */
function calculateLocalTrackDuration(state) {
    const now = Date.now();
    const { localTracksDuration } = state['features/analytics'];
    const { conference } = state['features/base/conference'];
    const { audio, video } = localTracksDuration;
    const { camera, desktop } = video;
    const tracks = state['features/base/tracks'];
    const audioTrack = (0, functions_1.getLocalAudioTrack)(tracks);
    const videoTrack = (0, functions_1.getLocalVideoTrack)(tracks);
    const newDuration = { ...localTracksDuration };
    if (!audioTrack || audioTrack.muted || !conference) {
        newDuration.audio = {
            startedTime: -1,
            value: audio.value + (audio.startedTime === -1 ? 0 : now - audio.startedTime)
        };
    }
    else if (audio.startedTime === -1) {
        newDuration.audio.startedTime = now;
    }
    if (!videoTrack || videoTrack.muted || !conference) {
        newDuration.video = {
            camera: {
                startedTime: -1,
                value: camera.value + (camera.startedTime === -1 ? 0 : now - camera.startedTime)
            },
            desktop: {
                startedTime: -1,
                value: desktop.value + (desktop.startedTime === -1 ? 0 : now - desktop.startedTime)
            }
        };
    }
    else {
        const { videoType } = videoTrack;
        if (video[videoType].startedTime === -1) {
            newDuration.video[videoType].startedTime = now;
        }
    }
    return {
        ...localTracksDuration,
        ...newDuration
    };
}
/**
 * Middleware which intercepts config actions to handle evaluating analytics
 * config based on the config stored in the store.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_6.I_AM_VISITOR_MODE: {
            const oldIAmVisitor = (0, functions_3.iAmVisitor)(store.getState());
            const result = next(action);
            const newIAmVisitor = (0, functions_3.iAmVisitor)(store.getState());
            store.dispatch((0, actions_1.setPermanentProperty)({
                isVisitor: newIAmVisitor,
                isPromotedFromVisitor: oldIAmVisitor && !newIAmVisitor
            }));
            return result;
        }
        case actionTypes_2.SET_CONFIG:
            if (navigator.product === 'ReactNative') {
                // Resetting the analytics is currently not needed for web because
                // the user will be redirected to another page and new instance of
                // Analytics will be created and initialized.
                (0, functions_4.resetAnalytics)();
                const { dispatch } = store;
                dispatch({
                    type: actionTypes_7.SET_INITIALIZED,
                    value: false
                });
            }
            break;
        case actionTypes_1.SET_ROOM: {
            // createHandlers is called before the SET_ROOM action is executed in order for Amplitude to initialize before
            // the deeplinking logic is executed (after the SET_ROOM action) so that the Amplitude device id is available
            // if needed.
            const createHandlersPromise = (0, functions_4.createHandlers)(store);
            const result = next(action);
            createHandlersPromise.then(handlers => {
                if ((0, functions_4.initAnalytics)(store, handlers)) {
                    store.dispatch({
                        type: actionTypes_7.SET_INITIALIZED,
                        value: true
                    });
                }
            });
            return result;
        }
    }
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            const { dispatch, getState } = store;
            const state = getState();
            dispatch({
                type: actionTypes_7.UPDATE_LOCAL_TRACKS_DURATION,
                localTracksDuration: {
                    ...calculateLocalTrackDuration(state),
                    conference: {
                        startedTime: Date.now(),
                        value: 0
                    }
                }
            });
            break;
        }
        case actionTypes_1.CONFERENCE_WILL_LEAVE: {
            const { dispatch, getState } = store;
            const state = getState();
            const { localTracksDuration } = state['features/analytics'];
            const newLocalTracksDuration = {
                ...calculateLocalTrackDuration(state),
                conference: {
                    startedTime: -1,
                    value: Date.now() - localTracksDuration.conference.startedTime
                }
            };
            (0, functions_4.sendAnalytics)((0, AnalyticsEvents_1.createLocalTracksDurationEvent)(newLocalTracksDuration));
            dispatch({
                type: actionTypes_7.UPDATE_LOCAL_TRACKS_DURATION,
                localTracksDuration: newLocalTracksDuration
            });
            break;
        }
        case actionTypes_5.SET_LOBBY_VISIBILITY:
            if ((0, functions_2.getIsLobbyVisible)(store.getState())) {
                store.dispatch((0, actions_1.setPermanentProperty)({
                    wasLobbyVisible: true
                }));
            }
            break;
        case actionTypes_3.SET_NETWORK_INFO:
            (0, functions_4.sendAnalytics)((0, AnalyticsEvents_1.createNetworkInfoEvent)({
                isOnline: action.isOnline,
                details: action.details,
                networkType: action.networkType
            }));
            break;
        case actionTypes_4.TRACK_ADDED:
        case actionTypes_4.TRACK_REMOVED:
        case actionTypes_4.TRACK_UPDATED: {
            const { dispatch, getState } = store;
            const state = getState();
            const { localTracksDuration } = state['features/analytics'];
            if (localTracksDuration.conference.startedTime === -1) {
                // We don't want to track the media duration if the conference is not joined yet because otherwise we won't
                // be able to compare them with the conference duration (from conference join to conference will leave).
                break;
            }
            dispatch({
                type: actionTypes_7.UPDATE_LOCAL_TRACKS_DURATION,
                localTracksDuration: {
                    ...localTracksDuration,
                    ...calculateLocalTrackDuration(state)
                }
            });
            break;
        }
    }
    return result;
});
