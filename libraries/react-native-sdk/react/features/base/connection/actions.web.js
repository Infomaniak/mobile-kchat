"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hangup = exports.connect = void 0;
// @ts-expect-error
const js_utils_1 = require("@jitsi/js-utils");
const actions_any_1 = require("../../jaas/actions.any");
const functions_1 = require("../../jaas/functions");
const actions_1 = require("../../notifications/actions");
const constants_1 = require("../../notifications/constants");
const actions_any_2 = require("../../recording/actions.any");
const LocalRecordingManager_web_1 = __importDefault(require("../../recording/components/Recording/LocalRecordingManager.web"));
const actions_2 = require("../jwt/actions");
const actions_any_3 = require("./actions.any");
__exportStar(require("./actions.any"), exports);
/**
 * Opens new connection.
 *
 * @param {string} [id] - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string} [password] - The XMPP user's password.
 * @returns {Function}
 */
function connect(id, password) {
    return (dispatch, getState) => {
        const state = getState();
        const { jwt } = state['features/base/jwt'];
        const { iAmRecorder, iAmSipGateway } = state['features/base/config'];
        if (!iAmRecorder && !iAmSipGateway && (0, functions_1.isVpaasMeeting)(state)) {
            return dispatch((0, actions_any_1.getCustomerDetails)())
                .then(() => {
                if (!jwt) {
                    return (0, functions_1.getJaasJWT)(state);
                }
            })
                .then(j => j && dispatch((0, actions_2.setJWT)(j)))
                .then(() => dispatch((0, actions_any_3._connectInternal)(id, password)));
        }
        // used by jibri
        const usernameOverride = js_utils_1.jitsiLocalStorage.getItem('xmpp_username_override');
        const passwordOverride = js_utils_1.jitsiLocalStorage.getItem('xmpp_password_override');
        if (usernameOverride && usernameOverride.length > 0) {
            id = usernameOverride; // eslint-disable-line no-param-reassign
        }
        if (passwordOverride && passwordOverride.length > 0) {
            password = passwordOverride; // eslint-disable-line no-param-reassign
        }
        return dispatch((0, actions_any_3._connectInternal)(id, password));
    };
}
exports.connect = connect;
/**
 * Closes connection.
 *
 * @param {boolean} [requestFeedback] - Whether to attempt showing a
 * request for call feedback.
 * @param {string} [feedbackTitle] - The feedback title.
 * @returns {Function}
 */
function hangup(requestFeedback = false, feedbackTitle) {
    // XXX For web based version we use conference hanging up logic from the old app.
    return async (dispatch) => {
        if (LocalRecordingManager_web_1.default.isRecordingLocally()) {
            dispatch((0, actions_any_2.stopLocalVideoRecording)());
            dispatch((0, actions_1.showWarningNotification)({
                titleKey: 'localRecording.stopping',
                descriptionKey: 'localRecording.wait'
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.STICKY));
            // wait 1000ms for the recording to end and start downloading
            await new Promise(res => {
                setTimeout(res, 1000);
            });
        }
        return APP.conference.hangup(requestFeedback, feedbackTitle);
    };
}
exports.hangup = hangup;
