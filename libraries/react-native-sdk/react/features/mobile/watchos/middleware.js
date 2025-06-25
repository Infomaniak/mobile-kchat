"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_native_watch_connectivity_1 = require("react-native-watch-connectivity");
const actions_1 = require("../../app/actions");
const actionTypes_1 = require("../../base/app/actionTypes");
const actionTypes_2 = require("../../base/conference/actionTypes");
const functions_1 = require("../../base/connection/functions");
const actions_2 = require("../../base/media/actions");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../../base/redux/StateListenerRegistry"));
const functions_2 = require("../../base/redux/functions");
const actions_3 = require("./actions");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
const { AppInfo } = react_native_1.NativeModules;
const watchOSEnabled = react_native_1.Platform.OS === 'ios' && !AppInfo.isLiteSDK;
// Handles the recent URLs state sent to the watch
watchOSEnabled && StateListenerRegistry_1.default.register(
/* selector */ state => state['features/recent-list'], 
/* listener */ (recentListState, { getState }) => {
    _updateApplicationContext(getState);
});
// Handles the mic muted state sent to the watch
watchOSEnabled && StateListenerRegistry_1.default.register(
/* selector */ state => _isAudioMuted(state), 
/* listener */ (isAudioMuted, { getState }) => {
    _updateApplicationContext(getState);
});
// Handles the conference URL state sent to the watch
watchOSEnabled && StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_1.getCurrentConferenceUrl)(state), 
/* listener */ (currentUrl, { dispatch, getState }) => {
    dispatch((0, actions_3.setSessionId)());
    _updateApplicationContext(getState);
});
/**
 * Middleware that captures conference actions.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
watchOSEnabled && MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            _appWillMount(store);
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            store.dispatch((0, actions_3.setConferenceTimestamp)(new Date().getTime()));
            _updateApplicationContext(store.getState());
            break;
    }
    return next(action);
});
/**
 * Registers listeners to the react-native-watch-connectivity lib.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _appWillMount({ dispatch, getState }) {
    react_native_watch_connectivity_1.watchEvents.addListener('reachability', reachable => {
        dispatch((0, actions_3.setWatchReachable)(reachable));
        _updateApplicationContext(getState);
    });
    react_native_watch_connectivity_1.watchEvents.addListener('message', message => {
        const { command, sessionID } = message;
        const currentSessionID = _getSessionId(getState());
        if (!sessionID || sessionID !== currentSessionID) {
            logger_1.default.warn(`Ignoring outdated watch command: ${message.command}`
                + ` sessionID: ${sessionID} current session ID: ${currentSessionID}`);
            return;
        }
        switch (command) {
            case constants_1.CMD_HANG_UP:
                if (typeof (0, functions_1.getCurrentConferenceUrl)(getState()) !== 'undefined') {
                    dispatch((0, actions_1.appNavigate)(undefined));
                }
                break;
            case constants_1.CMD_JOIN_CONFERENCE: {
                const newConferenceURL = message.data;
                const oldConferenceURL = (0, functions_1.getCurrentConferenceUrl)(getState());
                if (oldConferenceURL !== newConferenceURL) {
                    dispatch((0, actions_1.appNavigate)(newConferenceURL));
                }
                break;
            }
            case constants_1.CMD_SET_MUTED:
                dispatch((0, actions_2.setAudioMuted)(message.muted === 'true', 
                /* ensureTrack */ true));
                break;
        }
    });
}
/**
 * Gets the current Apple Watch session's ID. A new session is started whenever the conference URL has changed. It is
 * used to filter out outdated commands which may arrive very later if the Apple Watch loses the connectivity.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {number}
 * @private
 */
function _getSessionId(stateful) {
    const state = (0, functions_2.toState)(stateful);
    return state['features/mobile/watchos'].sessionID;
}
/**
 * Gets the list of recent URLs to be passed over to the Watch app.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {Array<Object>}
 * @private
 */
function _getRecentUrls(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const recentURLs = state['features/recent-list'];
    // Trim to MAX_RECENT_URLS and reverse the list
    const reversedList = recentURLs.slice(-constants_1.MAX_RECENT_URLS);
    reversedList.reverse();
    return reversedList;
}
/**
 * Determines the audio muted state to be sent to the apple watch.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @returns {boolean}
 * @private
 */
function _isAudioMuted(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { audio } = state['features/base/media'];
    return audio.muted;
}
/**
 * Sends the context to the watch os app. At the time of this writing it's the entire state of
 * the 'features/mobile/watchos' reducer.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @private
 * @returns {void}
 */
function _updateApplicationContext(stateful) {
    const state = (0, functions_2.toState)(stateful);
    const { conferenceTimestamp, sessionID, watchReachable } = state['features/mobile/watchos'];
    if (!watchReachable) {
        return;
    }
    try {
        (0, react_native_watch_connectivity_1.updateApplicationContext)({
            conferenceTimestamp,
            conferenceURL: (0, functions_1.getCurrentConferenceUrl)(state),
            micMuted: _isAudioMuted(state),
            recentURLs: _getRecentUrls(state),
            sessionID
        });
    }
    catch (error) {
        logger_1.default.error('Failed to stringify or send the context', error);
    }
}
