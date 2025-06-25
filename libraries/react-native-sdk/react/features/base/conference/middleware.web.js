"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const actions_web_1 = require("../../prejoin/actions.web");
const actions_web_2 = require("../connection/actions.web");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
require("./middleware.any");
let screenLock;
/**
 * Releases the screen lock.
 *
 * @returns {Promise}
 */
async function releaseScreenLock() {
    if (screenLock) {
        if (!screenLock.released) {
            logger_1.default.debug('Releasing wake lock.');
            try {
                await screenLock.release();
            }
            catch (e) {
                logger_1.default.error(`Error while releasing the screen wake lock: ${e}.`);
            }
        }
        screenLock.removeEventListener('release', onWakeLockReleased);
        screenLock = undefined;
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
}
/**
 * Requests a new screen wake lock.
 *
 * @returns {void}
 */
function requestWakeLock() {
    if (navigator.wakeLock?.request) {
        navigator.wakeLock.request('screen')
            .then(lock => {
            screenLock = lock;
            screenLock.addEventListener('release', onWakeLockReleased);
            document.addEventListener('visibilitychange', handleVisibilityChange);
            logger_1.default.debug('Wake lock created.');
        })
            .catch(e => {
            logger_1.default.error(`Error while requesting wake lock for screen: ${e}`);
        });
    }
}
/**
 * Page visibility change handler that re-requests the wake lock if it has been released by the OS.
 *
 * @returns {void}
 */
async function handleVisibilityChange() {
    if (screenLock?.released && document.visibilityState === 'visible') {
        // The screen lock have been released by the OS because of document visibility change. Lets try to request the
        // wake lock again.
        await releaseScreenLock();
        requestWakeLock();
    }
}
/**
 * Wake lock released handler.
 *
 * @returns {void}
 */
function onWakeLockReleased() {
    logger_1.default.debug('Wake lock released');
}
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch, getState } = store;
    const { enableForcedReload } = getState()['features/base/config'];
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            dispatch((0, actions_web_1.setPrejoinPageVisibility)(false));
            break;
        }
        case actionTypes_1.CONFERENCE_JOINED: {
            if (enableForcedReload) {
                dispatch((0, actions_web_1.setSkipPrejoinOnReload)(false));
            }
            requestWakeLock();
            break;
        }
        case actionTypes_1.CONFERENCE_FAILED: {
            const errorName = action.error?.name;
            if (enableForcedReload && errorName === lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_RESTARTED) {
                dispatch((0, actions_web_1.setSkipPrejoinOnReload)(true));
            }
            if (errorName === lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_DESTROYED) {
                const [reason] = action.error.params;
                const titlekey = Object.keys(constants_1.TRIGGER_READY_TO_CLOSE_REASONS)[Object.values(constants_1.TRIGGER_READY_TO_CLOSE_REASONS).indexOf(reason)];
                dispatch((0, actions_web_2.hangup)(true, i18next_1.default.t(titlekey) || reason));
            }
            releaseScreenLock();
            break;
        }
        case actionTypes_1.CONFERENCE_LEFT:
        case actionTypes_1.KICKED_OUT:
            releaseScreenLock();
            break;
    }
    return next(action);
});
