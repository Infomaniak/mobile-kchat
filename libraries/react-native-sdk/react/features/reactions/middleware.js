"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../analytics/AnalyticsEvents");
const functions_1 = require("../analytics/functions");
const actionTypes_1 = require("../base/app/actionTypes");
const actionTypes_2 = require("../base/conference/actionTypes");
const actions_1 = require("../base/conference/actions");
const functions_2 = require("../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../base/redux/MiddlewareRegistry"));
const actionTypes_3 = require("../base/settings/actionTypes");
const actions_2 = require("../base/settings/actions");
const actions_3 = require("../base/sounds/actions");
const functions_any_1 = require("../base/sounds/functions.any");
const actions_4 = require("../notifications/actions");
const constants_1 = require("../notifications/constants");
const actionTypes_4 = require("./actionTypes");
const actions_5 = require("./actions");
const constants_2 = require("./constants");
const functions_any_2 = require("./functions.any");
const logger_1 = __importDefault(require("./logger"));
const sounds_1 = require("./sounds");
/**
 * Middleware which intercepts Reactions actions to handle changes to the
 * visibility timeout of the Reactions.
 *
 * @param {IStore} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register((store) => (next) => (action) => {
    const { dispatch, getState } = store;
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            (0, react_redux_1.batch)(() => {
                Object.keys(constants_2.REACTIONS).forEach(key => {
                    for (let i = 0; i < constants_2.SOUNDS_THRESHOLDS.length; i++) {
                        dispatch((0, actions_3.registerSound)(`${constants_2.REACTIONS[key].soundId}${constants_2.SOUNDS_THRESHOLDS[i]}`, constants_2.REACTIONS[key].soundFiles[i]));
                    }
                });
                dispatch((0, actions_3.registerSound)(constants_2.RAISE_HAND_SOUND_ID, sounds_1.RAISE_HAND_SOUND_FILE));
            });
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            (0, react_redux_1.batch)(() => {
                Object.keys(constants_2.REACTIONS).forEach(key => {
                    for (let i = 0; i < constants_2.SOUNDS_THRESHOLDS.length; i++) {
                        dispatch((0, actions_3.unregisterSound)(`${constants_2.REACTIONS[key].soundId}${constants_2.SOUNDS_THRESHOLDS[i]}`));
                    }
                });
                dispatch((0, actions_3.unregisterSound)(constants_2.RAISE_HAND_SOUND_ID));
            });
            break;
        case actionTypes_4.ADD_REACTION_BUFFER: {
            const { timeoutID, buffer } = getState()['features/reactions'];
            const { reaction } = action;
            clearTimeout(timeoutID ?? 0);
            buffer.push(reaction);
            action.buffer = buffer;
            action.timeoutID = setTimeout(() => {
                dispatch((0, actions_5.flushReactionBuffer)());
            }, 500);
            break;
        }
        case actionTypes_2.CONFERENCE_JOIN_IN_PROGRESS: {
            const { conference } = action;
            conference.addCommandListener(constants_2.MUTE_REACTIONS_COMMAND, ({ attributes }, id) => {
                _onMuteReactionsCommand(attributes, id, store);
            });
            break;
        }
        case actionTypes_4.FLUSH_REACTION_BUFFER: {
            const state = getState();
            const { buffer } = state['features/reactions'];
            const participantCount = (0, functions_2.getParticipantCount)(state);
            (0, react_redux_1.batch)(() => {
                if (participantCount > 1) {
                    dispatch((0, actions_5.sendReactions)());
                }
                dispatch((0, actions_5.addReactionsToChat)((0, functions_any_2.getReactionMessageFromBuffer)(buffer)));
                dispatch((0, actions_5.pushReactions)(buffer));
            });
            (0, functions_any_2.sendReactionsWebhook)(state, buffer);
            break;
        }
        case actionTypes_4.PUSH_REACTIONS: {
            const state = getState();
            const { queue, notificationDisplayed } = state['features/reactions'];
            const { soundsReactions } = state['features/base/settings'];
            const disabledSounds = (0, functions_any_1.getDisabledSounds)(state);
            const reactions = action.reactions;
            (0, react_redux_1.batch)(() => {
                if (!notificationDisplayed && soundsReactions && !disabledSounds.includes(constants_2.REACTION_SOUND)
                    && actions_5.displayReactionSoundsNotification) {
                    dispatch((0, actions_5.displayReactionSoundsNotification)());
                }
                if (soundsReactions) {
                    const reactionSoundsThresholds = (0, functions_any_2.getReactionsSoundsThresholds)(reactions);
                    reactionSoundsThresholds.forEach(reaction => dispatch((0, actions_3.playSound)(`${constants_2.REACTIONS[reaction.reaction].soundId}${reaction.threshold}`)));
                }
                dispatch((0, actions_5.setReactionQueue)([...queue, ...(0, functions_any_2.getReactionsWithId)(reactions)]));
            });
            break;
        }
        case actionTypes_4.SEND_REACTIONS: {
            const state = getState();
            const { buffer } = state['features/reactions'];
            const { conference } = state['features/base/conference'];
            if (conference) {
                conference.sendEndpointMessage('', {
                    name: constants_2.ENDPOINT_REACTION_NAME,
                    reactions: buffer,
                    timestamp: Date.now()
                });
            }
            break;
        }
        // Settings changed for mute reactions in the meeting
        case actionTypes_2.SET_START_REACTIONS_MUTED: {
            const state = getState();
            const { conference } = state['features/base/conference'];
            const { muted, updateBackend } = action;
            if (conference && (0, functions_2.isLocalParticipantModerator)(state) && updateBackend) {
                conference.sendCommand(constants_2.MUTE_REACTIONS_COMMAND, { attributes: { startReactionsMuted: Boolean(muted) } });
            }
            break;
        }
        case actionTypes_3.SETTINGS_UPDATED: {
            const { soundsReactions } = getState()['features/base/settings'];
            if (action.settings.soundsReactions === false && soundsReactions === true) {
                (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createReactionSoundsDisabledEvent)());
            }
            break;
        }
        case actionTypes_4.SHOW_SOUNDS_NOTIFICATION: {
            const state = getState();
            const isModerator = (0, functions_2.isLocalParticipantModerator)(state);
            const { disableReactionsModeration } = state['features/base/config'];
            const customActions = ['notify.reactionSounds'];
            const customFunctions = [() => dispatch((0, actions_2.updateSettings)({
                    soundsReactions: false
                }))];
            if (isModerator && !disableReactionsModeration) {
                customActions.push('notify.reactionSoundsForAll');
                customFunctions.push(() => (0, react_redux_1.batch)(() => {
                    dispatch((0, actions_1.setStartReactionsMuted)(true));
                    dispatch((0, actions_2.updateSettings)({ soundsReactions: false }));
                }));
            }
            dispatch((0, actions_4.showNotification)({
                titleKey: 'toolbar.disableReactionSounds',
                customActionNameKey: customActions,
                customActionHandler: customFunctions
            }, constants_1.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
            break;
        }
    }
    return next(action);
});
/**
 * Notifies this instance about a "Mute Reaction Sounds" command received by the Jitsi
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
function _onMuteReactionsCommand(attributes = {}, id, store) {
    const state = store.getState();
    // We require to know who issued the command because (1) only a
    // moderator is allowed to send commands and (2) a command MUST be
    // issued by a defined commander.
    if (typeof id === 'undefined') {
        return;
    }
    const participantSendingCommand = (0, functions_2.getParticipantById)(state, id);
    // The Command(s) API will send us our own commands and we don't want
    // to act upon them.
    if (participantSendingCommand?.local) {
        return;
    }
    if (participantSendingCommand?.role !== 'moderator') {
        logger_1.default.warn('Received mute-reactions command not from moderator');
        return;
    }
    const oldState = Boolean(state['features/base/conference'].startReactionsMuted);
    const newState = attributes.startReactionsMuted === 'true';
    if (oldState !== newState) {
        (0, react_redux_1.batch)(() => {
            store.dispatch((0, actions_1.setStartReactionsMuted)(newState));
            store.dispatch((0, actions_2.updateSettings)({ soundsReactions: !newState }));
        });
    }
}
