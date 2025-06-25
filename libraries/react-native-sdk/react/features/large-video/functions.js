"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLargeVideoParticipant = void 0;
const functions_1 = require("../base/participants/functions");
/**
 * Selector for the participant currently displaying on the large video.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function getLargeVideoParticipant(state) {
    const { participantId } = state['features/large-video'];
    return (0, functions_1.getParticipantById)(state, participantId ?? '');
}
exports.getLargeVideoParticipant = getLargeVideoParticipant;
