"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actionTypes_1 = require("../base/conference/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_2 = require("./functions");
/**
 * The redux middleware for billing counter.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => async (action) => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOINED: {
            _maybeTrackVpaasConferenceJoin(store.getState());
            break;
        }
    }
    return next(action);
});
/**
 * Tracks the conference join event if the meeting is a vpaas one.
 *
 * @param {Store} state - The app state.
 * @returns {Function}
 */
function _maybeTrackVpaasConferenceJoin(state) {
    if ((0, functions_2.isVpaasMeeting)(state)) {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createVpaasConferenceJoinedEvent)((0, functions_2.getVpaasTenant)(state)));
    }
}
