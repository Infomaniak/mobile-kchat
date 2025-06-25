"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../base/conference/functions");
const actionTypes_1 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const actionTypes_2 = require("../etherpad/actionTypes");
const functions_3 = require("../filmstrip/functions");
const functions_4 = require("../follow-me/functions");
const actionTypes_3 = require("./actionTypes");
const actions_2 = require("./actions");
const functions_5 = require("./functions");
require("./subscriber");
let previousTileViewEnabled;
/**
 * Middleware which intercepts actions and updates tile view related state.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    // we want to extract the leaving participant and check its type before actually the participant being removed.
    let shouldUpdateAutoPin = false;
    switch (action.type) {
        case actionTypes_1.PARTICIPANT_LEFT: {
            if (!(0, functions_5.getAutoPinSetting)() || (0, functions_4.isFollowMeActive)(store)) {
                break;
            }
            shouldUpdateAutoPin = Boolean((0, functions_2.getParticipantById)(store.getState(), action.participant.id)?.fakeParticipant);
            break;
        }
    }
    const result = next(action);
    switch (action.type) {
        // Actions that temporarily clear the user preferred state of tile view,
        // then re-set it when needed.
        case actionTypes_1.PIN_PARTICIPANT: {
            const pinnedParticipant = action.participant?.id;
            if (pinnedParticipant) {
                _storeTileViewStateAndClear(store);
            }
            else {
                _restoreTileViewState(store);
            }
            break;
        }
        case actionTypes_2.SET_DOCUMENT_EDITING_STATUS:
            if (action.editing) {
                _storeTileViewStateAndClear(store);
            }
            else {
                _restoreTileViewState(store);
            }
            break;
        // Things to update when tile view state changes
        case actionTypes_3.SET_TILE_VIEW: {
            const state = store.getState();
            const stageFilmstrip = (0, functions_3.isStageFilmstripEnabled)(state);
            if (action.enabled && !stageFilmstrip && (0, functions_2.getPinnedParticipant)(state)) {
                store.dispatch((0, actions_1.pinParticipant)(null));
            }
            break;
        }
    }
    if (shouldUpdateAutoPin) {
        const screenShares = store.getState()['features/video-layout'].remoteScreenShares || [];
        (0, functions_5.updateAutoPinnedParticipant)(screenShares, store);
    }
    return result;
});
/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed.
 */
StateListenerRegistry_1.default.register(state => (0, functions_1.getCurrentConference)(state), (conference, { dispatch }, previousConference) => {
    if (conference !== previousConference) {
        // conference changed, left or failed...
        // Clear tile view state.
        dispatch((0, actions_2.setTileView)());
    }
});
/**
 * Restores tile view state, if it wasn't updated since then.
 *
 * @param {Object} store - The Redux Store.
 * @returns {void}
 */
function _restoreTileViewState({ dispatch, getState }) {
    const { tileViewEnabled } = getState()['features/video-layout'];
    if (tileViewEnabled === undefined && previousTileViewEnabled !== undefined) {
        dispatch((0, actions_2.setTileView)(previousTileViewEnabled));
    }
    previousTileViewEnabled = undefined;
}
/**
 * Stores the current tile view state and clears it.
 *
 * @param {Object} store - The Redux Store.
 * @returns {void}
 */
function _storeTileViewStateAndClear({ dispatch, getState }) {
    const { tileViewEnabled } = getState()['features/video-layout'];
    if (tileViewEnabled !== undefined) {
        previousTileViewEnabled = tileViewEnabled;
        dispatch((0, actions_2.setTileView)(undefined));
    }
}
