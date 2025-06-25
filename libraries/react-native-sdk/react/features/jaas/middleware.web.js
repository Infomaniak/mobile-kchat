"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_web_1 = require("../app/actions.web");
const actionTypes_1 = require("../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_2 = require("./actionTypes");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * The redux middleware for jaas.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            const { conference } = action;
            if (store.getState()['features/base/config'].iAmRecorder) {
                // We don't register anything on web if we are in iAmRecorder mode
                return next(action);
            }
            conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.CONFERENCE_ERROR, (errorType, errorMsg) => {
                errorType === lib_jitsi_meet_1.JitsiConferenceErrors.SETTINGS_ERROR && logger_1.default.error(errorMsg);
            });
            break;
        }
        case actionTypes_2.SET_DETAILS: {
            const { status } = action.payload;
            if (status === constants_1.STATUSES.BLOCKED) {
                store.dispatch((0, actions_web_1.redirectToStaticPage)('/static/planLimit.html'));
            }
            break;
        }
    }
    return next(action);
});
