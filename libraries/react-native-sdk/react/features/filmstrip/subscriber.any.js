"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_1 = require("./functions");
/**
 * Listens for changes to the screensharing status of the remote participants to recompute the reordered list of the
 * remote endpoints.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/video-layout'].remoteScreenShares, 
/* listener */ (remoteScreenShares, store) => (0, functions_1.updateRemoteParticipants)(store));
/**
 * Listens for changes to the remote screenshare participants to recompute the reordered list of the remote endpoints.
 * We force updateRemoteParticipants to make sure it executes and for the case where
 * sortedRemoteVirtualScreenshareParticipants becomes 0. We do not want to short circuit it in case of no screen-sharers
 * and no scroll and triggered for dominant speaker changed.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/participants'].sortedRemoteVirtualScreenshareParticipants, 
/* listener */ (sortedRemoteVirtualScreenshareParticipants, store) => (0, functions_1.updateRemoteParticipants)(store, true));
/**
 * Listens for changes to the dominant speaker to recompute the reordered list of the remote endpoints.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/participants'].dominantSpeaker, 
/* listener */ (dominantSpeaker, store) => (0, functions_1.updateRemoteParticipants)(store));
/**
 * Listens for changes in the filmstrip scroll visibility.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_1.isFilmstripScrollVisible)(state), 
/* listener */ (_, store) => (0, functions_1.updateRemoteParticipants)(store));
