"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const functions_any_1 = require("../base/lib-jitsi-meet/functions.any");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actions_1 = require("./actions");
/**
 * List of errors that are not fatal (or handled differently) so then the page reload dialog won't kick in.
 */
const RN_NO_RELOAD_DIALOG_ERRORS = [
    lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_ACCESS_DENIED,
    lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_DESTROYED,
    lib_jitsi_meet_1.JitsiConferenceErrors.CONNECTION_ERROR,
    lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_RESTARTED
];
const ERROR_TYPES = {
    CONFIG: 'CONFIG',
    CONNECTION: 'CONNECTION',
    CONFERENCE: 'CONFERENCE'
};
/**
 * Gets the error type and whether it's fatal or not.
 *
 * @param {Object} state - The redux state.
 * @param {Object|string} error - The error to process.
 * @returns {void}
 */
const getErrorExtraInfo = (state, error) => {
    const { error: conferenceError } = state['features/base/conference'];
    const { error: configError } = state['features/base/config'];
    const { error: connectionError } = state['features/base/connection'];
    if (error === conferenceError) {
        return {
            type: ERROR_TYPES.CONFERENCE,
            isFatal: (0, functions_any_1.isFatalJitsiConferenceError)(error.name || error)
        };
    }
    if (error === configError) {
        return {
            type: ERROR_TYPES.CONFIG,
            isFatal: true
        };
    }
    if (error === connectionError) {
        return {
            type: ERROR_TYPES.CONNECTION,
            isFatal: (0, functions_any_1.isFatalJitsiConnectionError)(error.name || error)
        };
    }
};
/**
 * State listener which emits the {@code fatalErrorOccurred} action which works
 * as a catch all for critical errors which have not been claimed by any other
 * feature for error recovery (the recoverable flag is not set).
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const { error: conferenceError } = state['features/base/conference'];
    const { error: configError } = state['features/base/config'];
    const { error: connectionError } = state['features/base/connection'];
    return configError || connectionError || conferenceError;
}, 
/* listener */ (error, store) => {
    const state = store.getState();
    if (!error) {
        return;
    }
    // eslint-disable-next-line no-negated-condition
    if (typeof APP !== 'undefined') {
        APP.API.notifyError({
            ...error,
            ...getErrorExtraInfo(state, error)
        });
    }
    else if (RN_NO_RELOAD_DIALOG_ERRORS.indexOf(error.name) === -1 && typeof error.recoverable === 'undefined') {
        setTimeout(() => {
            store.dispatch((0, actions_1.openPageReloadDialog)());
        }, 500);
    }
});
