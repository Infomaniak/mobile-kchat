"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("lodash/debounce"));
const actionTypes_1 = require("../../filmstrip/actionTypes");
const actionTypes_2 = require("../../mobile/background/actionTypes");
const actionTypes_3 = require("../../video-layout/actionTypes");
const actionTypes_4 = require("../audio-only/actionTypes");
const actionTypes_5 = require("../conference/actionTypes");
const functions_1 = require("../participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const functions_2 = require("../tracks/functions");
const actions_1 = require("./actions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Updates the last N value in the conference based on the current state of the redux store.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
const _updateLastN = (0, debounce_1.default)(({ dispatch, getState }) => {
    const state = getState();
    const { conference } = state['features/base/conference'];
    if (!conference) {
        logger_1.default.debug('There is no active conference, not updating last N');
        return;
    }
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const { appState } = state['features/background'] || {};
    const { enabled: filmStripEnabled } = state['features/filmstrip'];
    const config = state['features/base/config'];
    const { carMode } = state['features/video-layout'];
    // Select the (initial) lastN value based on the following preference order.
    // 1. The last-n value from 'startLastN' if it is specified in config.js
    // 2. The last-n value from 'channelLastN' if specified in config.js.
    // 3. -1 as the default value.
    let lastNSelected = config.startLastN ?? (config.channelLastN ?? -1);
    if (typeof appState !== 'undefined' && appState !== 'active') {
        lastNSelected = (0, functions_2.isLocalVideoTrackDesktop)(state) ? 1 : 0;
    }
    else if (carMode) {
        lastNSelected = 0;
    }
    else if (audioOnly) {
        const { remoteScreenShares, tileViewEnabled } = state['features/video-layout'];
        const largeVideoParticipantId = state['features/large-video'].participantId;
        const largeVideoParticipant = largeVideoParticipantId ? (0, functions_1.getParticipantById)(state, largeVideoParticipantId) : undefined;
        // Use tileViewEnabled state from redux here instead of determining if client should be in tile
        // view since we make an exception only for screenshare when in audio-only mode. If the user unpins
        // the screenshare, lastN will be set to 0 here. It will be set to 1 if screenshare has been auto pinned.
        if (!tileViewEnabled && largeVideoParticipant && !largeVideoParticipant.local) {
            lastNSelected = (remoteScreenShares || []).includes(largeVideoParticipantId ?? '') ? 1 : 0;
        }
        else {
            lastNSelected = 0;
        }
    }
    else if (!filmStripEnabled) {
        lastNSelected = 1;
    }
    const { lastN } = state['features/base/lastn'];
    if (lastN !== lastNSelected) {
        dispatch((0, actions_1.setLastN)(lastNSelected));
    }
}, 1000); /* Don't send this more often than once a second. */
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_2.APP_STATE_CHANGED:
        case actionTypes_5.CONFERENCE_JOINED:
        case actionTypes_4.SET_AUDIO_ONLY:
        case actionTypes_3.SET_CAR_MODE:
        case actionTypes_1.SET_FILMSTRIP_ENABLED:
        case actionTypes_3.VIRTUAL_SCREENSHARE_REMOTE_PARTICIPANTS_UPDATED:
            _updateLastN(store);
            break;
    }
    return result;
});
