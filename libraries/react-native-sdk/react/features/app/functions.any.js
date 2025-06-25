"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTrackStateToURL = void 0;
const constants_1 = require("../base/media/constants");
const functions_1 = require("../base/redux/functions");
const functions_2 = require("../base/tracks/functions");
const uri_1 = require("../base/util/uri");
/**
 * Adds the current track state to the passed URL.
 *
 * @param {URL} url - The URL that will be modified.
 * @param {Function|Object} stateful - The redux store or {@code getState} function.
 * @returns {URL} - Returns the modified URL.
 */
function addTrackStateToURL(url, stateful) {
    const state = (0, functions_1.toState)(stateful);
    const tracks = state['features/base/tracks'];
    const isVideoMuted = (0, functions_2.isLocalTrackMuted)(tracks, constants_1.MEDIA_TYPE.VIDEO);
    const isAudioMuted = (0, functions_2.isLocalTrackMuted)(tracks, constants_1.MEDIA_TYPE.AUDIO);
    return (0, uri_1.addHashParamsToURL)(new URL(url), {
        'config.startWithAudioMuted': isAudioMuted,
        'config.startWithVideoMuted': isVideoMuted
    });
}
exports.addTrackStateToURL = addTrackStateToURL;
