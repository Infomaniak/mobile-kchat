"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../participants/actionTypes");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_2 = require("./actionTypes");
/**
 * Reducer function for a single track.
 *
 * @param {Track|undefined} state - Track to be modified.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {string} action.name - Name of last media event.
 * @param {string} action.newValue - New participant ID value (in this
 * particular case).
 * @param {string} action.oldValue - Old participant ID value (in this
 * particular case).
 * @param {Track} action.track - Information about track to be changed.
 * @param {Participant} action.participant - Information about participant.
 * @returns {Track|undefined}
 */
function track(state, action) {
    switch (action.type) {
        case actionTypes_1.PARTICIPANT_ID_CHANGED:
            if (state.participantId === action.oldValue) {
                return {
                    ...state,
                    participantId: action.newValue
                };
            }
            break;
        case actionTypes_2.TRACK_UPDATED: {
            const t = action.track;
            if (state.jitsiTrack === t.jitsiTrack) {
                // Make sure that there's an actual update in order to reduce the
                // risk of unnecessary React Component renders.
                for (const p in t) {
                    // @ts-ignore
                    if (state[p] !== t[p]) {
                        // There's an actual update.
                        return {
                            ...state,
                            ...t
                        };
                    }
                }
            }
            break;
        }
        case actionTypes_2.TRACK_NO_DATA_FROM_SOURCE: {
            const t = action.track;
            if (state.jitsiTrack === t.jitsiTrack) {
                const isReceivingData = t.jitsiTrack.isReceivingData();
                if (state.isReceivingData !== isReceivingData) {
                    return {
                        ...state,
                        isReceivingData
                    };
                }
            }
            break;
        }
    }
    return state;
}
/**
 * Listen for actions that mutate (e.g. Add, remove) local and remote tracks.
 */
ReducerRegistry_1.default.register('features/base/tracks', (state = [], action) => {
    switch (action.type) {
        case actionTypes_1.PARTICIPANT_ID_CHANGED:
        case actionTypes_2.TRACK_NO_DATA_FROM_SOURCE:
        case actionTypes_2.TRACK_UPDATED:
            return state.map((t) => track(t, action));
        case actionTypes_2.TRACK_ADDED: {
            let withoutTrackStub = state;
            if (action.track.local) {
                withoutTrackStub
                    = state.filter((t) => !t.local || t.mediaType !== action.track.mediaType);
            }
            return [...withoutTrackStub, action.track];
        }
        case actionTypes_2.TRACK_CREATE_CANCELED:
        case actionTypes_2.TRACK_CREATE_ERROR: {
            return state.filter((t) => !t.local || t.mediaType !== action.trackType);
        }
        case actionTypes_2.TRACK_REMOVED:
            return state.filter((t) => t.jitsiTrack !== action.track.jitsiTrack);
        case actionTypes_2.TRACK_WILL_CREATE:
            return [...state, action.track];
        default:
            return state;
    }
});
/**
 * Listen for actions that mutate the no-src-data state, like the current notification id.
 */
ReducerRegistry_1.default.register('features/base/no-src-data', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_2.SET_NO_SRC_DATA_NOTIFICATION_UID:
            return (0, functions_1.set)(state, 'noSrcDataNotificationUid', action.uid);
        default:
            return state;
    }
});
