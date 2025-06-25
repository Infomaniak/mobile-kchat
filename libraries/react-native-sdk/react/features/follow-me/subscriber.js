"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../base/conference/functions");
const functions_2 = require("../base/participants/functions");
const StateListenerRegistry_1 = __importDefault(require("../base/redux/StateListenerRegistry"));
const functions_3 = require("../filmstrip/functions");
const functions_4 = require("../video-layout/functions");
const constants_1 = require("./constants");
/**
 * Subscribes to changes to the Follow Me setting for the local participant to
 * notify remote participants of current user interface status.
 * Changing newSelectedValue param to off, when feature is turned of so we can
 * notify all listeners.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/conference'].followMeEnabled, 
/* listener */ (newSelectedValue, store) => _sendFollowMeCommand(newSelectedValue || 'off', store));
/**
 * Subscribes to changes to the currently pinned participant in the user
 * interface of the local participant.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => {
    const pinnedParticipant = (0, functions_2.getPinnedParticipant)(state);
    return pinnedParticipant ? pinnedParticipant.id : null;
}, 
/* listener */ _sendFollowMeCommand);
/**
 * Subscribes to changes to the shared document (etherpad) visibility in the
 * user interface of the local participant.
 *
 * @param sharedDocumentVisible - {Boolean} {true} If the shared document was
 * shown (as a result of the toggle) or {false} if it was hidden.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/etherpad'].editing, 
/* listener */ _sendFollowMeCommand);
/**
 * Subscribes to changes to the filmstrip visibility in the user interface of
 * the local participant.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/filmstrip'].visible, 
/* listener */ _sendFollowMeCommand);
/**
 * Subscribes to changes to the stage filmstrip participants.
 */
StateListenerRegistry_1.default.register(
/* selector */ functions_3.getPinnedActiveParticipants, 
/* listener */ _sendFollowMeCommand, {
    deepEquals: true
});
/**
 * Subscribes to changes to the tile view setting in the user interface of the
 * local participant.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/video-layout'].tileViewEnabled, 
/* listener */ _sendFollowMeCommand);
/**
 * Subscribes to changes to the max number of stage participants setting.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/settings'].maxStageParticipants, 
/* listener */ _sendFollowMeCommand);
/**
 * Private selector for returning state from redux that should be respected by
 * other participants while follow me is enabled.
 *
 * @param {Object} state - The redux state.
 * @returns {Object}
 */
function _getFollowMeState(state) {
    const pinnedParticipant = (0, functions_2.getPinnedParticipant)(state);
    const stageFilmstrip = (0, functions_3.isStageFilmstripEnabled)(state);
    return {
        filmstripVisible: state['features/filmstrip'].visible,
        maxStageParticipants: stageFilmstrip ? state['features/base/settings'].maxStageParticipants : undefined,
        nextOnStage: pinnedParticipant?.id,
        pinnedStageParticipants: stageFilmstrip ? JSON.stringify((0, functions_3.getPinnedActiveParticipants)(state)) : undefined,
        sharedDocumentVisible: state['features/etherpad'].editing,
        tileViewEnabled: (0, functions_4.shouldDisplayTileView)(state)
    };
}
/**
 * Sends the follow-me command, when a local property change occurs.
 *
 * @param {*} newSelectedValue - The changed selected value from the selector.
 * @param {Object} store - The redux store.
 * @private
 * @returns {void}
 */
function _sendFollowMeCommand(newSelectedValue, store) {
    const state = store.getState();
    const conference = (0, functions_1.getCurrentConference)(state);
    if (!conference) {
        return;
    }
    // Only a moderator is allowed to send commands.
    if (!(0, functions_2.isLocalParticipantModerator)(state)) {
        return;
    }
    if (newSelectedValue === 'off') {
        // if the change is to off, local user turned off follow me and
        // we want to signal this
        conference.sendCommandOnce(constants_1.FOLLOW_ME_COMMAND, { attributes: { off: true } });
        return;
    }
    else if (!state['features/base/conference'].followMeEnabled) {
        return;
    }
    conference.sendCommand(constants_1.FOLLOW_ME_COMMAND, { attributes: _getFollowMeState(state) });
}
