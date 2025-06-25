"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const actionTypes_1 = require("../base/conference/actionTypes");
const actionTypes_2 = require("../base/participants/actionTypes");
const actions_1 = require("../base/participants/actions");
const functions_1 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actions_2 = require("../base/settings/actions");
const actions_3 = require("../filmstrip/actions");
const actions_any_1 = require("../video-layout/actions.any");
const actions_4 = require("./actions");
const constants_1 = require("./constants");
const functions_2 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
require("./subscriber");
/**
 * The timeout after which a follow-me command that has been received will be
 * ignored if not consumed.
 *
 * @type {number} in seconds
 * @private
 */
const _FOLLOW_ME_RECEIVED_TIMEOUT = 30;
/**
 * An instance of a timeout used as a workaround when attempting to pin a
 * non-existent particapant, which may be caused by participant join information
 * not being received yet.
 *
 * @type {TimeoutID}
 */
let nextOnStageTimeout;
/**
 * A count of how many seconds the nextOnStageTimeout has ticked while waiting
 * for a participant to be discovered that should be pinned. This variable
 * works in conjunction with {@code _FOLLOW_ME_RECEIVED_TIMEOUT} and
 * {@code nextOnStageTimeout}.
 *
 * @type {number}
 */
let nextOnStageTimer = 0;
/**
 * Represents "Follow Me" feature which enables a moderator to (partially)
 * control the user experience/interface (e.g. Filmstrip visibility) of (other)
 * non-moderator participant.
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.addCommandListener(constants_1.FOLLOW_ME_COMMAND, ({ attributes }, id) => {
                _onFollowMeCommand(attributes, id, store);
            });
            break;
        }
        case actionTypes_2.PARTICIPANT_LEFT:
            if (store.getState()['features/follow-me'].moderator === action.participant.id) {
                store.dispatch((0, actions_4.setFollowMeModerator)());
            }
            break;
    }
    return next(action);
});
/**
 * Notifies this instance about a "Follow Me" command received by the Jitsi
 * conference.
 *
 * @param {Object} attributes - The attributes carried by the command.
 * @param {string} id - The identifier of the participant who issuing the
 * command. A notable idiosyncrasy to be mindful of here is that the command
 * may be issued by the local participant.
 * @param {Object} store - The redux store. Used to calculate and dispatch
 * updates.
 * @private
 * @returns {void}
 */
function _onFollowMeCommand(attributes = {}, id, store) {
    const state = store.getState();
    // We require to know who issued the command because (1) only a
    // moderator is allowed to send commands and (2) a command MUST be
    // issued by a defined commander.
    if (typeof id === 'undefined') {
        return;
    }
    const participantSendingCommand = (0, functions_1.getParticipantById)(state, id);
    if (participantSendingCommand) {
        // The Command(s) API will send us our own commands and we don't want
        // to act upon them.
        if (participantSendingCommand.local) {
            return;
        }
        if (participantSendingCommand.role !== 'moderator') {
            logger_1.default.warn('Received follow-me command not from moderator');
            return;
        }
    }
    else {
        // This is the case of jibri receiving commands from a hidden participant.
        const { iAmRecorder } = state['features/base/config'];
        const { conference } = state['features/base/conference'];
        // As this participant is not stored in redux store we do the checks on the JitsiParticipant from lib-jitsi-meet
        const participant = conference?.getParticipantById(id);
        if (!iAmRecorder || !participant || participant.getRole() !== 'moderator'
            || !participant.isHiddenFromRecorder()) {
            logger_1.default.warn('Something went wrong with follow-me command');
            return;
        }
    }
    if (!(0, functions_2.isFollowMeActive)(state)) {
        store.dispatch((0, actions_4.setFollowMeModerator)(id));
    }
    // just a command that follow me was turned off
    if (attributes.off) {
        store.dispatch((0, actions_4.setFollowMeModerator)());
        return;
    }
    const oldState = state['features/follow-me'].state || {};
    store.dispatch((0, actions_4.setFollowMeState)(attributes));
    // XMPP will translate all booleans to strings, so explicitly check against
    // the string form of the boolean {@code true}.
    if (oldState.filmstripVisible !== attributes.filmstripVisible) {
        store.dispatch((0, actions_3.setFilmstripVisible)(attributes.filmstripVisible === 'true'));
    }
    if (oldState.tileViewEnabled !== attributes.tileViewEnabled) {
        store.dispatch((0, actions_any_1.setTileView)(attributes.tileViewEnabled === 'true'));
    }
    // For now gate etherpad checks behind a web-app check to be extra safe
    // against calling a web-app global.
    if (typeof APP !== 'undefined'
        && oldState.sharedDocumentVisible !== attributes.sharedDocumentVisible) {
        const isEtherpadVisible = attributes.sharedDocumentVisible === 'true';
        const documentManager = APP.UI.getSharedDocumentManager();
        if (documentManager
            && isEtherpadVisible !== state['features/etherpad'].editing) {
            documentManager.toggleEtherpad();
        }
    }
    const pinnedParticipant = (0, functions_1.getPinnedParticipant)(state);
    const idOfParticipantToPin = attributes.nextOnStage;
    if (typeof idOfParticipantToPin !== 'undefined'
        && (!pinnedParticipant || idOfParticipantToPin !== pinnedParticipant.id)
        && oldState.nextOnStage !== attributes.nextOnStage) {
        _pinVideoThumbnailById(store, idOfParticipantToPin);
    }
    else if (typeof idOfParticipantToPin === 'undefined' && pinnedParticipant) {
        store.dispatch((0, actions_1.pinParticipant)(null));
    }
    if (attributes.pinnedStageParticipants !== undefined) {
        const stageParticipants = JSON.parse(attributes.pinnedStageParticipants);
        let oldStageParticipants = [];
        if (oldState.pinnedStageParticipants !== undefined) {
            oldStageParticipants = JSON.parse(oldState.pinnedStageParticipants);
        }
        if (!lodash_1.default.isEqual(stageParticipants, oldStageParticipants)) {
            const toRemove = lodash_1.default.differenceWith(oldStageParticipants, stageParticipants, lodash_1.default.isEqual);
            const toAdd = lodash_1.default.differenceWith(stageParticipants, oldStageParticipants, lodash_1.default.isEqual);
            toRemove.forEach((p) => store.dispatch((0, actions_3.removeStageParticipant)(p.participantId)));
            toAdd.forEach((p) => store.dispatch((0, actions_3.addStageParticipant)(p.participantId, true)));
        }
    }
    if (attributes.maxStageParticipants !== undefined
        && oldState.maxStageParticipants !== attributes.maxStageParticipants) {
        store.dispatch((0, actions_2.updateSettings)({
            maxStageParticipants: Number(attributes.maxStageParticipants)
        }));
    }
}
/**
 * Pins the video thumbnail given by clickId.
 *
 * @param {Object} store - The redux store.
 * @param {string} clickId - The identifier of the participant to pin.
 * @private
 * @returns {void}
 */
function _pinVideoThumbnailById(store, clickId) {
    if ((0, functions_1.getParticipantById)(store.getState(), clickId)) {
        clearTimeout(nextOnStageTimeout);
        nextOnStageTimer = 0;
        store.dispatch((0, actions_1.pinParticipant)(clickId));
    }
    else {
        nextOnStageTimeout = window.setTimeout(() => {
            if (nextOnStageTimer > _FOLLOW_ME_RECEIVED_TIMEOUT) {
                nextOnStageTimer = 0;
                return;
            }
            nextOnStageTimer++;
            _pinVideoThumbnailById(store, clickId);
        }, 1000);
    }
}
