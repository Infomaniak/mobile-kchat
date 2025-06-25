"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_native_1 = require("../../app/actions.native");
const actionTypes_1 = require("../../base/conference/actionTypes");
const lib_jitsi_meet_1 = require("../../base/lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED:
            return _conferenceFailed(store, next, action);
    }
    return next(action);
});
/**
 * Function to handle the conference failed event and navigate the user to the lobby screen
 * based on the failure reason.
 *
 * @param {Object} store - The Redux store.
 * @param {Function} next - The Redux next function.
 * @param {Object} action - The Redux action.
 * @returns {Object}
 */
function _conferenceFailed({ dispatch }, next, action) {
    const { error } = action;
    // We need to cover the case where knocking participant
    // is rejected from entering the conference
    if (error.name === lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_ACCESS_DENIED) {
        dispatch((0, actions_native_1.appNavigate)(undefined));
    }
    return next(action);
}
