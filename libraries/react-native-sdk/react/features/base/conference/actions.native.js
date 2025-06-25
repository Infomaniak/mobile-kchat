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
__exportStar(require("./actions.any"), exports);
/**
 * Starts audio and/or video for the visitor.
 *
 * @param {Array<MediaType>} mediaTypes - The media types that need to be started.
 * @returns {Function}
 */
function setupVisitorStartupMedia(mediaTypes) {
    return (dispatch) => {
        if (!mediaTypes || !Array.isArray(mediaTypes)) {
            return;
        }
        mediaTypes.forEach(mediaType => {
            switch (mediaType) {
                case constants_1.MEDIA_TYPE.AUDIO:
                    dispatch((0, actions_1.setAudioMuted)(false, true));
                    break;
                case constants_1.MEDIA_TYPE.VIDEO:
                    dispatch((0, actions_1.setVideoMuted)(false, constants_1.VIDEO_MUTISM_AUTHORITY.USER, true));
            }
        });
    };
}
exports.setupVisitorStartupMedia = setupVisitorStartupMedia;
