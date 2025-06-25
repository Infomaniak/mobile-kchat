"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_1 = require("../base/redux/functions");
const functions_2 = require("../follow-me/functions");
const actions_1 = require("./actions");
const functions_3 = require("./functions");
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/participants'].sortedRemoteVirtualScreenshareParticipants, 
/* listener */ (sortedRemoteVirtualScreenshareParticipants, store) => {
    const oldScreenSharesOrder = store.getState()['features/video-layout'].remoteScreenShares || [];
    const knownSharingParticipantIds = [...sortedRemoteVirtualScreenshareParticipants.keys()];
    // Filter out any participants which are no longer screen sharing
    // by looping through the known sharing participants and removing any
    // participant IDs which are no longer sharing.
    const newScreenSharesOrder = oldScreenSharesOrder.filter(participantId => knownSharingParticipantIds.includes(participantId));
    // Make sure all new sharing participant get added to the end of the
    // known screen shares.
    knownSharingParticipantIds.forEach(participantId => {
        if (!newScreenSharesOrder.includes(participantId)) {
            newScreenSharesOrder.push(participantId);
        }
    });
    if (!(0, functions_1.equals)(oldScreenSharesOrder, newScreenSharesOrder)) {
        store.dispatch((0, actions_1.virtualScreenshareParticipantsUpdated)(newScreenSharesOrder));
        if ((0, functions_3.getAutoPinSetting)() && !(0, functions_2.isFollowMeActive)(store)) {
            (0, functions_3.updateAutoPinnedParticipant)(oldScreenSharesOrder, store);
        }
    }
});
