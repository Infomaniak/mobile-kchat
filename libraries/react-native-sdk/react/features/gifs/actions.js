"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setGifMenuVisibility = exports.hideGif = exports.showGif = exports.removeGif = exports.addGif = void 0;
const actionTypes_1 = require("./actionTypes");
/**
 * Adds a GIF for a given participant.
 *
 * @param {string} participantId - The id of the participant that sent the GIF.
 * @param {string} gifUrl - The URL of the GIF.
 * @returns {Object}
 */
function addGif(participantId, gifUrl) {
    return {
        type: actionTypes_1.ADD_GIF_FOR_PARTICIPANT,
        participantId,
        gifUrl
    };
}
exports.addGif = addGif;
/**
 * Removes the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to remove the GIF.
 * @returns {Object}
 */
function removeGif(participantId) {
    return {
        type: actionTypes_1.REMOVE_GIF_FOR_PARTICIPANT,
        participantId
    };
}
exports.removeGif = removeGif;
/**
 * Keep showing the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to show the GIF.
 * @returns {Object}
 */
function showGif(participantId) {
    return {
        type: actionTypes_1.SHOW_GIF_FOR_PARTICIPANT,
        participantId
    };
}
exports.showGif = showGif;
/**
 * Set timeout to hide the GIF of the given participant.
 *
 * @param {string} participantId - The Id of the participant for whom to show the GIF.
 * @returns {Object}
 */
function hideGif(participantId) {
    return {
        type: actionTypes_1.HIDE_GIF_FOR_PARTICIPANT,
        participantId
    };
}
exports.hideGif = hideGif;
/**
 * Set visibility of the GIF menu.
 *
 * @param {boolean} visible - Whether or not it should be visible.
 * @returns {Object}
 */
function setGifMenuVisibility(visible) {
    return {
        type: actionTypes_1.SET_GIF_MENU_VISIBILITY,
        visible
    };
}
exports.setGifMenuVisibility = setGifMenuVisibility;
