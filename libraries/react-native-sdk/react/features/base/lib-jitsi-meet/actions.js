"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.libInitError = exports.initLib = exports.disposeLib = void 0;
// @ts-expect-error
const js_utils_1 = require("@jitsi/js-utils");
const selectors_1 = require("../net-info/selectors");
const _1 = __importDefault(require("./_"));
const actionTypes_1 = require("./actionTypes");
const functions_any_1 = require("./functions.any");
const logger_1 = __importDefault(require("./logger"));
/**
 * Disposes (of) lib-jitsi-meet.
 *
 * @returns {Function}
 */
function disposeLib() {
    return (dispatch) => {
        dispatch({ type: actionTypes_1.LIB_WILL_DISPOSE });
        // TODO Currently, lib-jitsi-meet doesn't have the functionality to
        // dispose itself.
        dispatch({ type: actionTypes_1.LIB_DID_DISPOSE });
    };
}
exports.disposeLib = disposeLib;
/**
 * Initializes lib-jitsi-meet (i.e. {@link invokes JitsiMeetJS.init()}) with the
 * current config(uration).
 *
 * @returns {Function}
 */
function initLib() {
    return (dispatch, getState) => {
        const state = getState();
        const config = state['features/base/config'];
        if (!config) {
            throw new Error('Cannot init lib-jitsi-meet without config');
        }
        dispatch({ type: actionTypes_1.LIB_WILL_INIT });
        try {
            _1.default.init({
                enableAnalyticsLogging: (0, functions_any_1.isAnalyticsEnabled)(getState),
                ...config,
                externalStorage: js_utils_1.jitsiLocalStorage.isLocalStorageDisabled() ? js_utils_1.jitsiLocalStorage : undefined
            });
            _1.default.setNetworkInfo({
                isOnline: (0, selectors_1.isOnline)(state)
            });
            logger_1.default.info(`lib-jitsi-meet version:${_1.default.version}`);
            dispatch({ type: actionTypes_1.LIB_DID_INIT });
        }
        catch (error) {
            dispatch(libInitError(error));
        }
    };
}
exports.initLib = initLib;
/**
 * Notifies about a specific error raised by {@link JitsiMeetJS.init()}.
 *
 * @param {Error} error - The Error raised by JitsiMeetJS.init().
 * @returns {{
 *     type: LIB_INIT_ERROR,
 *     error: Error
 * }}
 */
function libInitError(error) {
    return {
        type: actionTypes_1.LIB_INIT_ERROR,
        error
    };
}
exports.libInitError = libInitError;
