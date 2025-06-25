"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../base/participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_2 = require("../display-name/functions");
const functions_3 = require("../video-layout/functions");
/**
 * StateListenerRegistry provides a reliable way of detecting changes to
 * preferred layout state and dispatching additional actions.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_3.shouldDisplayTileView)(state), 
/* listener */ displayTileView => {
    APP.API.notifyTileViewChanged(displayTileView);
});
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/settings'].displayName, 
/* listener */ (displayName, store) => {
    const localParticipant = (0, functions_1.getLocalParticipant)(store.getState());
    const { defaultLocalDisplayName } = store.getState()['features/base/config'];
    // Initial setting of the display name happens on app
    // initialization, before the local participant is ready. The initial
    // settings is not desired to be fired anyways, only changes.
    if (localParticipant) {
        const { id } = localParticipant;
        APP.API.notifyDisplayNameChanged(id, {
            displayName,
            formattedDisplayName: (0, functions_2.appendSuffix)(displayName, defaultLocalDisplayName)
        });
    }
});
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/settings'].email, 
/* listener */ (email, store) => {
    const localParticipant = (0, functions_1.getLocalParticipant)(store.getState());
    // Initial setting of the email happens on app
    // initialization, before the local participant is ready. The initial
    // settings is not desired to be fired anyways, only changes.
    if (localParticipant) {
        const { id } = localParticipant;
        APP.API.notifyEmailChanged(id, {
            email
        });
    }
});
/**
 * Updates the on stage participant value.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/large-video'].participantId, 
/* listener */ participantId => {
    APP.API.notifyOnStageParticipantChanged(participantId);
});
