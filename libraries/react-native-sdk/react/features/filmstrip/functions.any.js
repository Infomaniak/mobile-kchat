"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTileViewModeDisabled = exports.updateRemoteParticipantsOnLeave = exports.updateRemoteParticipants = void 0;
const functions_1 = require("../base/participants/functions");
const actions_1 = require("./actions");
const functions_2 = require("./functions");
/**
 * Computes the reorderd list of the remote participants.
 *
 * @param {*} store - The redux store.
 * @param {boolean} force - Does not short circuit, the execution, make execute all checks.
 * @param {string} participantId - The endpoint id of the participant that joined the call.
 * @returns {void}
 * @private
 */
function updateRemoteParticipants(store, force, participantId) {
    const state = store.getState();
    let reorderedParticipants = [];
    const { sortedRemoteVirtualScreenshareParticipants } = state['features/base/participants'];
    if (!(0, functions_2.isFilmstripScrollVisible)(state) && !sortedRemoteVirtualScreenshareParticipants.size && !force) {
        if (participantId) {
            const { remoteParticipants } = state['features/filmstrip'];
            reorderedParticipants = [...remoteParticipants, participantId];
            store.dispatch((0, actions_1.setRemoteParticipants)(Array.from(new Set(reorderedParticipants))));
        }
        return;
    }
    const { fakeParticipants, sortedRemoteParticipants } = state['features/base/participants'];
    const remoteParticipants = new Map(sortedRemoteParticipants);
    const screenShareParticipants = sortedRemoteVirtualScreenshareParticipants
        ? [...sortedRemoteVirtualScreenshareParticipants.keys()] : [];
    const sharedVideos = fakeParticipants ? Array.from(fakeParticipants.keys()) : [];
    const speakers = (0, functions_1.getActiveSpeakersToBeDisplayed)(state);
    for (const screenshare of screenShareParticipants) {
        const ownerId = (0, functions_1.getVirtualScreenshareParticipantOwnerId)(screenshare);
        remoteParticipants.delete(ownerId);
        remoteParticipants.delete(screenshare);
        speakers.delete(ownerId);
    }
    for (const sharedVideo of sharedVideos) {
        remoteParticipants.delete(sharedVideo);
    }
    for (const speaker of speakers.keys()) {
        remoteParticipants.delete(speaker);
    }
    // Always update the order of the thumnails.
    const participantsWithScreenShare = screenShareParticipants.reduce((acc, screenshare) => {
        const ownerId = (0, functions_1.getVirtualScreenshareParticipantOwnerId)(screenshare);
        acc.push(ownerId);
        acc.push(screenshare);
        return acc;
    }, []);
    reorderedParticipants = [
        ...participantsWithScreenShare,
        ...sharedVideos,
        ...Array.from(speakers.keys()),
        ...Array.from(remoteParticipants.keys())
    ];
    store.dispatch((0, actions_1.setRemoteParticipants)(Array.from(new Set(reorderedParticipants))));
}
exports.updateRemoteParticipants = updateRemoteParticipants;
/**
 * Private helper to calculate the reordered list of remote participants when a participant leaves.
 *
 * @param {*} store - The redux store.
 * @param {string} participantId - The endpoint id of the participant leaving the call.
 * @returns {void}
 * @private
 */
function updateRemoteParticipantsOnLeave(store, participantId = null) {
    if (!participantId) {
        return;
    }
    const state = store.getState();
    const { remoteParticipants } = state['features/filmstrip'];
    const reorderedParticipants = new Set(remoteParticipants);
    reorderedParticipants.delete(participantId)
        && store.dispatch((0, actions_1.setRemoteParticipants)(Array.from(reorderedParticipants)));
}
exports.updateRemoteParticipantsOnLeave = updateRemoteParticipantsOnLeave;
/**
 * Returns whether tileview is completely disabled.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {boolean} - Whether tileview is completely disabled.
 */
function isTileViewModeDisabled(state) {
    const { tileView = {} } = state['features/base/config'];
    return tileView.disabled;
}
exports.isTileViewModeDisabled = isTileViewModeDisabled;
