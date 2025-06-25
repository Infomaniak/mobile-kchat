"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../base/conference/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_native_1 = require("../video-layout/functions.native");
const actions_native_1 = require("./actions.native");
const functions_native_2 = require("./functions.native");
require("./subscriber.any");
/**
 * Listens for changes in the number of participants to calculate the dimensions of the tile view grid and the tiles.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_native_2.getTileViewParticipantCount)(state), 
/* listener */ (_, store) => {
    const state = store.getState();
    if ((0, functions_native_1.shouldDisplayTileView)(state)) {
        store.dispatch((0, actions_native_1.setTileViewDimensions)());
    }
});
/**
 * Listens for changes in the selected layout to calculate the dimensions of the tile view grid and horizontal view.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_native_1.shouldDisplayTileView)(state), 
/* listener */ (isTileView, store) => {
    if (isTileView) {
        store.dispatch((0, actions_native_1.setTileViewDimensions)());
    }
});
/**
 * Listens for changes in the current conference and clears remote participants from this feature.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (conference !== previousConference) {
        dispatch((0, actions_native_1.setRemoteParticipants)([]));
    }
});
