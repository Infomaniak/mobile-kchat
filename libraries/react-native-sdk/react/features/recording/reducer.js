"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../base/redux/ReducerRegistry"));
const actionTypes_1 = require("./actionTypes");
const DEFAULT_STATE = {
    disableHighlightMeetingMoment: false,
    pendingNotificationUids: {},
    selectedRecordingService: '',
    sessionDatas: []
};
/**
 * The name of the Redux store this feature stores its state in.
 */
const STORE_NAME = 'features/recording';
/**
 * Reduces the Redux actions of the feature features/recording.
 */
ReducerRegistry_1.default.register(STORE_NAME, (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1.CLEAR_RECORDING_SESSIONS:
            return {
                ...state,
                sessionDatas: []
            };
        case actionTypes_1.RECORDING_SESSION_UPDATED:
            return {
                ...state,
                sessionDatas: _updateSessionDatas(state.sessionDatas, action.sessionData)
            };
        case actionTypes_1.SET_PENDING_RECORDING_NOTIFICATION_UID: {
            const pendingNotificationUids = {
                ...state.pendingNotificationUids
            };
            pendingNotificationUids[action.streamType] = action.uid;
            return {
                ...state,
                pendingNotificationUids
            };
        }
        case actionTypes_1.SET_SELECTED_RECORDING_SERVICE: {
            return {
                ...state,
                selectedRecordingService: action.selectedRecordingService
            };
        }
        case actionTypes_1.SET_STREAM_KEY:
            return {
                ...state,
                streamKey: action.streamKey
            };
        case actionTypes_1.SET_MEETING_HIGHLIGHT_BUTTON_STATE:
            return {
                ...state,
                disableHighlightMeetingMoment: action.disabled
            };
        case actionTypes_1.SET_START_RECORDING_NOTIFICATION_SHOWN:
            return {
                ...state,
                wasStartRecordingSuggested: true
            };
        default:
            return state;
    }
});
/**
 * Updates the known information on recording sessions.
 *
 * @param {Array} sessionDatas - The current sessions in the redux store.
 * @param {Object} newSessionData - The updated session data.
 * @private
 * @returns {Array} The session datas with the updated session data added.
 */
function _updateSessionDatas(sessionDatas, newSessionData) {
    const hasExistingSessionData = sessionDatas.find(sessionData => sessionData.id === newSessionData.id);
    let newSessionDatas;
    if (hasExistingSessionData) {
        newSessionDatas = sessionDatas.map(sessionData => {
            if (sessionData.id === newSessionData.id) {
                return {
                    ...newSessionData
                };
            }
            // Nothing to update for this session data so pass it back in.
            return sessionData;
        });
    }
    else {
        // If the session data is not present, then there is nothing to update
        // and instead it needs to be added to the known session datas.
        newSessionDatas = [
            ...sessionDatas,
            { ...newSessionData }
        ];
    }
    return newSessionDatas;
}
