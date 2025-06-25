"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const functions_1 = require("../conference/functions");
const functions_any_1 = require("../config/functions.any");
const constants_1 = require("../media/constants");
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const actions_1 = require("./actions");
const functions_2 = require("./functions");
const types_1 = require("./types");
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/tracks'], 
/* listener */ (tracks, store) => _updateScreenshareParticipants(store));
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/participants'].remoteVideoSources, 
/* listener */ (remoteVideoSources, store) => (0, functions_any_1.getSsrcRewritingFeatureFlag)(store.getState())
    && _updateScreenshareParticipantsBasedOnPresence(store));
/**
 * Compares the old and new screenshare lists provided and creates/removes the virtual screenshare participant
 * tiles accodingly.
 *
 * @param {Array<string>} oldScreenshareSourceNames - List of old screenshare source names.
 * @param {Array<string>} newScreenshareSourceNames - Current list of screenshare source names.
 * @param {Object} store - The redux store.
 * @returns {void}
 */
function _createOrRemoveVirtualParticipants(oldScreenshareSourceNames, newScreenshareSourceNames, store) {
    const { dispatch, getState } = store;
    const conference = (0, functions_1.getCurrentConference)(getState());
    const removedScreenshareSourceNames = lodash_1.default.difference(oldScreenshareSourceNames, newScreenshareSourceNames);
    const addedScreenshareSourceNames = lodash_1.default.difference(newScreenshareSourceNames, oldScreenshareSourceNames);
    if (removedScreenshareSourceNames.length) {
        removedScreenshareSourceNames.forEach(id => dispatch((0, actions_1.participantLeft)(id, conference, {
            fakeParticipant: types_1.FakeParticipant.RemoteScreenShare
        })));
    }
    if (addedScreenshareSourceNames.length) {
        addedScreenshareSourceNames.forEach(id => dispatch((0, actions_1.createVirtualScreenshareParticipant)(id, false, conference)));
    }
}
/**
 * Handles creating and removing virtual screenshare participants.
 *
 * @param {*} store - The redux store.
 * @returns {void}
 */
function _updateScreenshareParticipants(store) {
    const { dispatch, getState } = store;
    const state = getState();
    const conference = (0, functions_1.getCurrentConference)(state);
    const tracks = state['features/base/tracks'];
    const { sortedRemoteVirtualScreenshareParticipants, localScreenShare } = state['features/base/participants'];
    const previousScreenshareSourceNames = [...sortedRemoteVirtualScreenshareParticipants.keys()];
    let newLocalSceenshareSourceName;
    const currentScreenshareSourceNames = tracks.reduce((acc, track) => {
        if (track.videoType === constants_1.VIDEO_TYPE.DESKTOP && !track.jitsiTrack.isMuted()) {
            const sourceName = track.jitsiTrack.getSourceName();
            // Ignore orphan tracks in ssrc-rewriting mode.
            if (!sourceName && (0, functions_any_1.getSsrcRewritingFeatureFlag)(state)) {
                return acc;
            }
            if (track.local) {
                newLocalSceenshareSourceName = sourceName;
            }
            else if ((0, functions_2.getParticipantById)(state, (0, functions_2.getVirtualScreenshareParticipantOwnerId)(sourceName))) {
                acc.push(sourceName);
            }
        }
        return acc;
    }, []);
    if (!localScreenShare && newLocalSceenshareSourceName) {
        dispatch((0, actions_1.createVirtualScreenshareParticipant)(newLocalSceenshareSourceName, true, conference));
    }
    if (localScreenShare && !newLocalSceenshareSourceName) {
        dispatch((0, actions_1.participantLeft)(localScreenShare.id, conference, {
            fakeParticipant: types_1.FakeParticipant.LocalScreenShare
        }));
    }
    if ((0, functions_any_1.getSsrcRewritingFeatureFlag)(state)) {
        return;
    }
    _createOrRemoveVirtualParticipants(previousScreenshareSourceNames, currentScreenshareSourceNames, store);
}
/**
 * Handles the creation and removal of remote virtual screenshare participants when ssrc-rewriting is enabled.
 *
 * @param {Object} store - The redux store.
 * @returns {void}
 */
function _updateScreenshareParticipantsBasedOnPresence(store) {
    const { getState } = store;
    const state = getState();
    const { sortedRemoteVirtualScreenshareParticipants } = state['features/base/participants'];
    const previousScreenshareSourceNames = [...sortedRemoteVirtualScreenshareParticipants.keys()];
    const currentScreenshareSourceNames = (0, functions_2.getRemoteScreensharesBasedOnPresence)(state);
    _createOrRemoveVirtualParticipants(previousScreenshareSourceNames, currentScreenshareSourceNames, store);
}
