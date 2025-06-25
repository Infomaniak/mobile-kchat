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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupVisitorStartupMedia = void 0;
const actions_1 = require("../media/actions");
const constants_1 = require("../media/constants");
const types_1 = require("../media/types");
const actions_web_1 = require("../tracks/actions.web");
__exportStar(require("./actions.any"), exports);
/**
 * Starts audio and/or video for the visitor.
 *
 * @param {Array<MediaType>} media - The media types that need to be started.
 * @returns {Function}
 */
function setupVisitorStartupMedia(media) {
    return (dispatch) => {
        // Clear the gum pending state in case we have set it to pending since we are starting the
        // conference without tracks.
        dispatch((0, actions_1.gumPending)([constants_1.MEDIA_TYPE.AUDIO, constants_1.MEDIA_TYPE.VIDEO], types_1.IGUMPendingState.NONE));
        if (media && Array.isArray(media) && media.length > 0) {
            dispatch((0, actions_web_1.createAndAddInitialAVTracks)(media));
        }
        // FIXME: The name of the function doesn't fit the startConference execution but another PR will removes
        // this and calls startConference based on the connection status. This will stay here temporary.
        if (typeof APP !== 'undefined') {
            APP.conference.startConference([]);
        }
    };
}
exports.setupVisitorStartupMedia = setupVisitorStartupMedia;
