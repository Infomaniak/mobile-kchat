"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const actionTypes_1 = require("./actionTypes");
const actions_native_1 = require("./actions.native");
require("./middleware.any");
/**
 * Middleware that captures LIB_DID_DISPOSE and LIB_DID_INIT actions and,
 * respectively, creates/destroys local media tracks. Also listens to
 * media-related actions and performs corresponding operations with tracks.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.TRACK_UPDATED: {
            const { jitsiTrack, local } = action.track;
            if (local && jitsiTrack.isMuted()
                && jitsiTrack.type === constants_1.MEDIA_TYPE.VIDEO && jitsiTrack.videoType === constants_1.VIDEO_TYPE.DESKTOP) {
                store.dispatch((0, actions_native_1.toggleScreensharing)(false));
            }
            break;
        }
    }
    return next(action);
});
