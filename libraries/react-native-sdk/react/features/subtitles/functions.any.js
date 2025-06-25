"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.canStartSubtitles = void 0;
const functions_1 = require("../transcribing/functions");
/**
 * Checks whether the participant can start the subtitles.
 *
 * @param {IReduxState} state - The redux state.
 * @returns {boolean} - True if the participant can start the subtitles.
 */
function canStartSubtitles(state) {
    return (0, functions_1.canAddTranscriber)(state) || (0, functions_1.isTranscribing)(state);
}
exports.canStartSubtitles = canStartSubtitles;
