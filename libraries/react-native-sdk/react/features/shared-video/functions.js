"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractYoutubeIdOrURL = exports.isVideoPlaying = exports.isSharingStatus = void 0;
const functions_1 = require("../base/participants/functions");
const constants_1 = require("./constants");
/**
 * Validates the entered video url.
 *
 * It returns a boolean to reflect whether the url matches the youtube regex.
 *
 * @param {string} url - The entered video link.
 * @returns {string} The youtube video id if matched.
 */
function getYoutubeId(url) {
    if (!url) {
        return null;
    }
    const p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|(?:m\.)?youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/; // eslint-disable-line max-len
    const result = url.match(p);
    return result ? result[1] : null;
}
/**
 * Checks if the status is one that is actually sharing the video - playing, pause or start.
 *
 * @param {string} status - The shared video status.
 * @returns {boolean}
 */
function isSharingStatus(status) {
    return ['playing', 'pause', 'start'].includes(status);
}
exports.isSharingStatus = isSharingStatus;
/**
 * Returns true if there is a video being shared in the meeting.
 *
 * @param {Object | Function} stateful - The Redux state or a function that gets resolved to the Redux state.
 * @returns {boolean}
 */
function isVideoPlaying(stateful) {
    let videoPlaying = false;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [id, p] of (0, functions_1.getFakeParticipants)(stateful)) {
        if (p.name === constants_1.VIDEO_PLAYER_PARTICIPANT_NAME || p.name === constants_1.YOUTUBE_PLAYER_PARTICIPANT_NAME) {
            videoPlaying = true;
            break;
        }
    }
    return videoPlaying;
}
exports.isVideoPlaying = isVideoPlaying;
/**
 * Extracts a Youtube id or URL from the user input.
 *
 * @param {string} input - The user input.
 * @returns {string|undefined}
 */
function extractYoutubeIdOrURL(input) {
    if (!input) {
        return;
    }
    const trimmedLink = input.trim();
    if (!trimmedLink) {
        return;
    }
    const youtubeId = getYoutubeId(trimmedLink);
    if (youtubeId) {
        return youtubeId;
    }
    // Check if the URL is valid, native may crash otherwise.
    try {
        // eslint-disable-next-line no-new
        new URL(trimmedLink);
    }
    catch (_) {
        return;
    }
    return trimmedLink;
}
exports.extractYoutubeIdOrURL = extractYoutubeIdOrURL;
