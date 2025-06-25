"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../base/participants/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_1 = require("./actions");
require("./subscriber");
const TRANSCRIBER_DISPLAY_NAME = 'Transcriber';
/**
 * Implements the middleware of the feature transcribing.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
// eslint-disable-next-line no-unused-vars
MiddlewareRegistry_1.default.register(({ dispatch, getState }) => next => action => {
    const { transcriberJID, potentialTranscriberJIDs } = getState()['features/transcribing'];
    switch (action.type) {
        case actionTypes_1.HIDDEN_PARTICIPANT_JOINED:
            if (action.displayName === TRANSCRIBER_DISPLAY_NAME) {
                dispatch((0, actions_1.transcriberJoined)(action.id));
            }
            else {
                dispatch((0, actions_1.potentialTranscriberJoined)(action.id));
            }
            break;
        case actionTypes_1.HIDDEN_PARTICIPANT_LEFT:
            if (action.id === transcriberJID) {
                dispatch((0, actions_1.transcriberLeft)(action.id));
            }
            break;
        case actionTypes_1.PARTICIPANT_UPDATED: {
            const { participant } = action;
            if (potentialTranscriberJIDs.includes(participant.id) && participant.name === TRANSCRIBER_DISPLAY_NAME) {
                dispatch((0, actions_1.transcriberJoined)(participant.id));
            }
            break;
        }
    }
    return next(action);
});
