"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/participants/actionTypes");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const functions_2 = require("../base/testing/functions");
const actionTypes_2 = require("../base/tracks/actionTypes");
const actionTypes_3 = require("../etherpad/actionTypes");
const actions_1 = require("./actions");
const logger_1 = __importDefault(require("./logger"));
require("./subscriber");
/**
 * Middleware that catches actions related to participants and tracks and
 * dispatches an action to select a participant depicted by LargeVideo.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.DOMINANT_SPEAKER_CHANGED: {
            const state = store.getState();
            const localParticipant = (0, functions_1.getLocalParticipant)(state);
            const dominantSpeaker = (0, functions_1.getDominantSpeakerParticipant)(state);
            if (dominantSpeaker?.id === action.participant.id) {
                return next(action);
            }
            const result = next(action);
            if ((0, functions_2.isTestModeEnabled)(state)) {
                logger_1.default.info(`Dominant speaker changed event for: ${action.participant.id}`);
            }
            if (localParticipant && localParticipant.id !== action.participant.id) {
                store.dispatch((0, actions_1.selectParticipantInLargeVideo)());
            }
            return result;
        }
        case actionTypes_1.PIN_PARTICIPANT: {
            const result = next(action);
            store.dispatch((0, actions_1.selectParticipantInLargeVideo)(action.participant?.id));
            return result;
        }
        case actionTypes_1.PARTICIPANT_JOINED:
        case actionTypes_1.PARTICIPANT_LEFT:
        case actionTypes_3.TOGGLE_DOCUMENT_EDITING:
        case actionTypes_2.TRACK_ADDED:
        case actionTypes_2.TRACK_REMOVED: {
            const result = next(action);
            store.dispatch((0, actions_1.selectParticipantInLargeVideo)());
            return result;
        }
    }
    const result = next(action);
    return result;
});
