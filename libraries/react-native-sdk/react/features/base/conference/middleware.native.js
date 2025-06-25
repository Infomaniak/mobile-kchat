"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actions_native_1 = require("../../app/actions.native");
const actions_native_2 = require("../../conference/actions.native");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const actions_1 = require("./actions");
const constants_1 = require("./constants");
require("./middleware.any");
MiddlewareRegistry_1.default.register(store => next => action => {
    const { dispatch } = store;
    const { error } = action;
    switch (action.type) {
        case actionTypes_1.CONFERENCE_FAILED: {
            if (error?.name !== lib_jitsi_meet_1.JitsiConferenceErrors.CONFERENCE_DESTROYED) {
                break;
            }
            const [reason] = error.params;
            const reasonKey = Object.keys(constants_1.TRIGGER_READY_TO_CLOSE_REASONS)[Object.values(constants_1.TRIGGER_READY_TO_CLOSE_REASONS).indexOf(reason)];
            dispatch((0, actions_native_2.notifyConferenceFailed)(reasonKey, () => {
                dispatch((0, actions_1.conferenceLeft)(action.conference));
                dispatch((0, actions_native_1.appNavigate)(undefined));
            }));
        }
    }
    return next(action);
});
