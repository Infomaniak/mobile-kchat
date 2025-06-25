"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const constants_1 = require("../media/constants");
const functions_1 = require("../participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const functions_2 = require("./functions");
/**
 * Notifies when the list of currently sharing participants changes.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_1.getScreenshareParticipantIds)(state), 
/* listener */ (participantIDs, store, previousParticipantIDs) => {
    if (typeof APP !== 'object') {
        return;
    }
    if (!lodash_1.default.isEqual(lodash_1.default.sortBy(participantIDs), lodash_1.default.sortBy(previousParticipantIDs))) {
        APP.API.notifySharingParticipantsChanged(participantIDs);
    }
});
/**
 * Notifies when the local video mute state changes.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_2.isLocalTrackMuted)(state['features/base/tracks'], constants_1.MEDIA_TYPE.VIDEO), 
/* listener */ (muted, store, previousMuted) => {
    if (typeof APP !== 'object') {
        return;
    }
    if (muted !== previousMuted) {
        APP.API.notifyVideoMutedStatusChanged(muted);
    }
});
