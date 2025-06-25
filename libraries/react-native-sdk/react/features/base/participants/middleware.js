"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../av-moderation/actions");
const actionTypes_1 = require("../../breakout-rooms/actionTypes");
const functions_1 = require("../../breakout-rooms/functions");
const actions_2 = require("../../e2ee/actions");
const constants_1 = require("../../e2ee/constants");
const actions_3 = require("../../notifications/actions");
const constants_2 = require("../../notifications/constants");
const functions_2 = require("../../participants-pane/functions");
const constants_3 = require("../../presence-status/constants");
const constants_4 = require("../../reactions/constants");
const constants_5 = require("../../recording/constants");
const actionTypes_2 = require("../app/actionTypes");
const actionTypes_3 = require("../conference/actionTypes");
const functions_3 = require("../conference/functions");
const actionTypes_4 = require("../config/actionTypes");
const functions_any_1 = require("../config/functions.any");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const constants_6 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const actions_4 = require("../sounds/actions");
const actionTypes_5 = require("./actionTypes");
const actions_5 = require("./actions");
const constants_7 = require("./constants");
const functions_4 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
const sounds_1 = require("./sounds");
require("./subscriber");
/**
 * Middleware that captures CONFERENCE_JOINED and CONFERENCE_LEFT actions and
 * updates respectively ID of local participant.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_2.APP_WILL_MOUNT:
            _registerSounds(store);
            return _localParticipantJoined(store, next, action);
        case actionTypes_2.APP_WILL_UNMOUNT:
            _unregisterSounds(store);
            return _localParticipantLeft(store, next, action);
        case actionTypes_3.CONFERENCE_WILL_JOIN:
            store.dispatch((0, actions_5.localParticipantIdChanged)(action.conference.myUserId()));
            break;
        case actionTypes_5.DOMINANT_SPEAKER_CHANGED: {
            // Lower hand through xmpp when local participant becomes dominant speaker.
            const { id } = action.participant;
            const state = store.getState();
            const participant = (0, functions_4.getLocalParticipant)(state);
            const dominantSpeaker = (0, functions_4.getDominantSpeakerParticipant)(state);
            const isLocal = participant && participant.id === id;
            if (isLocal && dominantSpeaker?.id !== id
                && (0, functions_4.hasRaisedHand)(participant)
                && !(0, functions_any_1.getDisableRemoveRaisedHandOnFocus)(state)) {
                store.dispatch((0, actions_5.raiseHand)(false));
            }
            break;
        }
        case actionTypes_5.LOCAL_PARTICIPANT_AUDIO_LEVEL_CHANGED: {
            const state = store.getState();
            const participant = (0, functions_4.getDominantSpeakerParticipant)(state);
            if (participant?.local
                && (0, functions_4.hasRaisedHand)(participant)
                && action.level > constants_7.LOWER_HAND_AUDIO_LEVEL
                && !(0, functions_any_1.getDisableRemoveRaisedHandOnFocus)(state)) {
                store.dispatch((0, actions_5.raiseHand)(false));
            }
            break;
        }
        case actionTypes_5.GRANT_MODERATOR: {
            const { conference } = store.getState()['features/base/conference'];
            conference?.grantOwner(action.id);
            break;
        }
        case actionTypes_5.KICK_PARTICIPANT: {
            const { conference } = store.getState()['features/base/conference'];
            conference?.kickParticipant(action.id);
            break;
        }
        case actionTypes_5.LOCAL_PARTICIPANT_RAISE_HAND: {
            const { raisedHandTimestamp } = action;
            const localId = (0, functions_4.getLocalParticipant)(store.getState())?.id;
            store.dispatch((0, actions_5.participantUpdated)({
                // XXX Only the local participant is allowed to update without
                // stating the JitsiConference instance (i.e. participant property
                // `conference` for a remote participant) because the local
                // participant is uniquely identified by the very fact that there is
                // only one local participant.
                id: localId ?? '',
                local: true,
                raisedHandTimestamp
            }));
            store.dispatch((0, actions_5.raiseHandUpdateQueue)({
                id: localId ?? '',
                raisedHandTimestamp
            }));
            if (typeof APP !== 'undefined') {
                APP.API.notifyRaiseHandUpdated(localId, raisedHandTimestamp);
            }
            break;
        }
        case actionTypes_4.SET_CONFIG: {
            const result = next(action);
            const state = store.getState();
            const { deploymentInfo } = state['features/base/config'];
            // if there userRegion set let's use it for the local participant
            if (deploymentInfo?.userRegion) {
                const localId = (0, functions_4.getLocalParticipant)(state)?.id;
                if (localId) {
                    store.dispatch((0, actions_5.participantUpdated)({
                        id: localId,
                        local: true,
                        region: deploymentInfo.userRegion
                    }));
                }
            }
            return result;
        }
        case actionTypes_5.SET_LOCAL_PARTICIPANT_RECORDING_STATUS: {
            const state = store.getState();
            const { recording, onlySelf } = action;
            const localId = (0, functions_4.getLocalParticipant)(state)?.id;
            const { localRecording } = state['features/base/config'];
            if (localRecording?.notifyAllParticipants && !onlySelf && localId) {
                store.dispatch((0, actions_5.participantUpdated)({
                    // XXX Only the local participant is allowed to update without
                    // stating the JitsiConference instance (i.e. participant property
                    // `conference` for a remote participant) because the local
                    // participant is uniquely identified by the very fact that there is
                    // only one local participant.
                    id: localId,
                    local: true,
                    localRecording: recording
                }));
            }
            break;
        }
        case actionTypes_5.MUTE_REMOTE_PARTICIPANT: {
            const { conference } = store.getState()['features/base/conference'];
            conference?.muteParticipant(action.id, action.mediaType);
            break;
        }
        case actionTypes_5.RAISE_HAND_UPDATED: {
            const { participant } = action;
            let queue = (0, functions_4.getRaiseHandsQueue)(store.getState());
            if (participant.raisedHandTimestamp) {
                queue.push({
                    id: participant.id,
                    raisedHandTimestamp: participant.raisedHandTimestamp
                });
                // sort the queue before adding to store.
                queue = queue.sort(({ raisedHandTimestamp: a }, { raisedHandTimestamp: b }) => a - b);
            }
            else {
                // no need to sort on remove value.
                queue = queue.filter(({ id }) => id !== participant.id);
            }
            action.queue = queue;
            break;
        }
        case actionTypes_5.PARTICIPANT_JOINED: {
            // Do not play sounds when a screenshare or whiteboard participant tile is created for screenshare.
            (!(0, functions_4.isScreenShareParticipant)(action.participant)
                && !(0, functions_4.isWhiteboardParticipant)(action.participant)) && _maybePlaySounds(store, action);
            return _participantJoinedOrUpdated(store, next, action);
        }
        case actionTypes_5.PARTICIPANT_LEFT: {
            // Do not play sounds when a tile for screenshare or whiteboard is removed.
            (!(0, functions_4.isScreenShareParticipant)(action.participant)
                && !(0, functions_4.isWhiteboardParticipant)(action.participant)) && _maybePlaySounds(store, action);
            break;
        }
        case actionTypes_5.PARTICIPANT_UPDATED:
            return _participantJoinedOrUpdated(store, next, action);
        case actionTypes_5.OVERWRITE_PARTICIPANTS_NAMES: {
            const { participantList } = action;
            if (!Array.isArray(participantList)) {
                logger_1.default.error('Overwrite names failed. Argument is not an array.');
                return;
            }
            (0, react_redux_1.batch)(() => {
                participantList.forEach(p => {
                    store.dispatch((0, actions_5.overwriteParticipantName)(p.id, p.name));
                });
            });
            break;
        }
        case actionTypes_5.OVERWRITE_PARTICIPANT_NAME: {
            const { dispatch, getState } = store;
            const state = getState();
            const { id, name } = action;
            let breakoutRoom = false, identifier = id;
            if (id.indexOf('@') !== -1) {
                identifier = id.slice(id.indexOf('/') + 1);
                breakoutRoom = true;
                action.id = identifier;
            }
            if (breakoutRoom) {
                const rooms = (0, functions_1.getBreakoutRooms)(state);
                const roomCounter = state['features/breakout-rooms'].roomCounter;
                const newRooms = {};
                Object.entries(rooms).forEach(([key, r]) => {
                    const participants = r?.participants || {};
                    const jid = Object.keys(participants).find(p => p.slice(p.indexOf('/') + 1) === identifier);
                    if (jid) {
                        newRooms[key] = {
                            ...r,
                            participants: {
                                ...participants,
                                [jid]: {
                                    ...participants[jid],
                                    displayName: name
                                }
                            }
                        };
                    }
                    else {
                        newRooms[key] = r;
                    }
                });
                dispatch({
                    type: actionTypes_1.UPDATE_BREAKOUT_ROOMS,
                    rooms,
                    roomCounter,
                    updatedNames: true
                });
            }
            else {
                dispatch((0, actions_5.participantUpdated)({
                    id: identifier,
                    name
                }));
            }
            break;
        }
    }
    return next(action);
});
/**
 * Syncs the redux state features/base/participants up with the redux state
 * features/base/conference by ensuring that the former does not contain remote
 * participants no longer relevant to the latter. Introduced to address an issue
 * with multiplying thumbnails in the filmstrip.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => (0, functions_3.getCurrentConference)(state), 
/* listener */ (conference, { dispatch, getState }) => {
    (0, react_redux_1.batch)(() => {
        for (const [id, p] of (0, functions_4.getRemoteParticipants)(getState())) {
            (!conference || p.conference !== conference)
                && dispatch((0, actions_5.participantLeft)(id, p.conference, {
                    isReplaced: p.isReplaced
                }));
        }
    });
});
/**
 * Reset the ID of the local participant to
 * {@link LOCAL_PARTICIPANT_DEFAULT_ID}. Such a reset is deemed possible only if
 * the local participant and, respectively, her ID is not involved in a
 * conference which is still of interest to the user and, consequently, the app.
 * For example, a conference which is in the process of leaving is no longer of
 * interest the user, is unrecoverable from the perspective of the user and,
 * consequently, the app.
 */
StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/conference'], 
/* listener */ ({ leaving }, { dispatch, getState }) => {
    const state = getState();
    const localParticipant = (0, functions_4.getLocalParticipant)(state);
    let id;
    if (!localParticipant
        || (id = localParticipant.id)
            === constants_7.LOCAL_PARTICIPANT_DEFAULT_ID) {
        // The ID of the local participant has been reset already.
        return;
    }
    // The ID of the local may be reset only if it is not in use.
    const dispatchLocalParticipantIdChanged = (0, functions_3.forEachConference)(state, conference => conference === leaving || conference.myUserId() !== id);
    dispatchLocalParticipantIdChanged
        && dispatch((0, actions_5.localParticipantIdChanged)(constants_7.LOCAL_PARTICIPANT_DEFAULT_ID));
});
/**
 * Registers listeners for participant change events.
 */
StateListenerRegistry_1.default.register(state => state['features/base/conference'].conference, (conference, store) => {
    if (conference) {
        const propertyHandlers = {
            'e2ee.enabled': (participant, value) => _e2eeUpdated(store, conference, participant.getId(), value),
            'features_e2ee': (participant, value) => (0, functions_4.getParticipantById)(store.getState(), participant.getId())?.e2eeSupported !== value
                && store.dispatch((0, actions_5.participantUpdated)({
                    conference,
                    id: participant.getId(),
                    e2eeSupported: value
                })),
            'features_jigasi': (participant, value) => store.dispatch((0, actions_5.participantUpdated)({
                conference,
                id: participant.getId(),
                isJigasi: value
            })),
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            'features_screen-sharing': (participant, value) => store.dispatch((0, actions_5.participantUpdated)({
                conference,
                id: participant.getId(),
                features: { 'screen-sharing': true }
            })),
            'localRecording': (participant, value) => _localRecordingUpdated(store, conference, participant.getId(), value),
            'raisedHand': (participant, value) => _raiseHandUpdated(store, conference, participant.getId(), value),
            'region': (participant, value) => store.dispatch((0, actions_5.participantUpdated)({
                conference,
                id: participant.getId(),
                region: value
            })),
            'remoteControlSessionStatus': (participant, value) => store.dispatch((0, actions_5.participantUpdated)({
                conference,
                id: participant.getId(),
                remoteControlSessionStatus: value
            }))
        };
        // update properties for the participants that are already in the conference
        conference.getParticipants().forEach((participant) => {
            Object.keys(propertyHandlers).forEach(propertyName => {
                const value = participant.getProperty(propertyName);
                if (value !== undefined) {
                    propertyHandlers[propertyName](participant, value);
                }
            });
        });
        // We joined a conference
        conference.on(lib_jitsi_meet_1.JitsiConferenceEvents.PARTICIPANT_PROPERTY_CHANGED, (participant, propertyName, oldValue, newValue) => {
            if (propertyHandlers.hasOwnProperty(propertyName)) {
                propertyHandlers[propertyName](participant, newValue);
            }
        });
    }
    else {
        const localParticipantId = (0, functions_4.getLocalParticipant)(store.getState)?.id;
        // We left the conference, the local participant must be updated.
        _e2eeUpdated(store, conference, localParticipantId ?? '', false);
        _raiseHandUpdated(store, conference, localParticipantId ?? '', 0);
    }
});
/**
 * Handles a E2EE enabled status update.
 *
 * @param {Store} store - The redux store.
 * @param {Object} conference - The conference for which we got an update.
 * @param {string} participantId - The ID of the participant from which we got an update.
 * @param {boolean} newValue - The new value of the E2EE enabled status.
 * @returns {void}
 */
function _e2eeUpdated({ getState, dispatch }, conference, participantId, newValue) {
    const e2eeEnabled = newValue === 'true';
    const state = getState();
    const { e2ee = {} } = state['features/base/config'];
    if (e2eeEnabled === (0, functions_4.getParticipantById)(state, participantId)?.e2eeEnabled) {
        return;
    }
    dispatch((0, actions_5.participantUpdated)({
        conference,
        id: participantId,
        e2eeEnabled
    }));
    if (e2ee.externallyManagedKey) {
        return;
    }
    const { maxMode } = getState()['features/e2ee'] || {};
    if (maxMode !== constants_1.MAX_MODE.THRESHOLD_EXCEEDED || !e2eeEnabled) {
        dispatch((0, actions_2.toggleE2EE)(e2eeEnabled));
    }
}
/**
 * Initializes the local participant and signals that it joined.
 *
 * @private
 * @param {Store} store - The redux store.
 * @param {Dispatch} next - The redux dispatch function to dispatch the
 * specified action to the specified store.
 * @param {Action} action - The redux action which is being dispatched
 * in the specified store.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _localParticipantJoined({ getState, dispatch }, next, action) {
    const result = next(action);
    const settings = getState()['features/base/settings'];
    dispatch((0, actions_5.localParticipantJoined)({
        avatarURL: settings.avatarURL,
        email: settings.email,
        name: settings.displayName,
        id: ''
    }));
    return result;
}
/**
 * Signals that the local participant has left.
 *
 * @param {Store} store - The redux store.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} into the specified {@code store}.
 * @param {Action} action - The redux action which is being dispatched in the
 * specified {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _localParticipantLeft({ dispatch }, next, action) {
    const result = next(action);
    dispatch((0, actions_5.localParticipantLeft)());
    return result;
}
/**
 * Plays sounds when participants join/leave conference.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action. Should be either
 * {@link PARTICIPANT_JOINED} or {@link PARTICIPANT_LEFT}.
 * @private
 * @returns {void}
 */
function _maybePlaySounds({ getState, dispatch }, action) {
    const state = getState();
    const { startAudioMuted } = state['features/base/config'];
    const { soundsParticipantJoined: joinSound, soundsParticipantLeft: leftSound } = state['features/base/settings'];
    // We're not playing sounds for local participant
    // nor when the user is joining past the "startAudioMuted" limit.
    // The intention there was to not play user joined notification in big
    // conferences where 100th person is joining.
    if (!action.participant.local
        && (!startAudioMuted
            || (0, functions_4.getParticipantCount)(state) < startAudioMuted)) {
        const { isReplacing, isReplaced } = action.participant;
        if (action.type === actionTypes_5.PARTICIPANT_JOINED) {
            if (!joinSound) {
                return;
            }
            const { presence } = action.participant;
            // The sounds for the poltergeist are handled by features/invite.
            if (presence !== constants_3.INVITED && presence !== constants_3.CALLING && !isReplacing) {
                dispatch((0, actions_4.playSound)(constants_7.PARTICIPANT_JOINED_SOUND_ID));
            }
        }
        else if (action.type === actionTypes_5.PARTICIPANT_LEFT && !isReplaced && leftSound) {
            dispatch((0, actions_4.playSound)(constants_7.PARTICIPANT_LEFT_SOUND_ID));
        }
    }
}
/**
 * Notifies the feature base/participants that the action
 * {@code PARTICIPANT_JOINED} or {@code PARTICIPANT_UPDATED} is being dispatched
 * within a specific redux store.
 *
 * @param {Store} store - The redux store in which the specified {@code action}
 * is being dispatched.
 * @param {Dispatch} next - The redux {@code dispatch} function to dispatch the
 * specified {@code action} in the specified {@code store}.
 * @param {Action} action - The redux action {@code PARTICIPANT_JOINED} or
 * {@code PARTICIPANT_UPDATED} which is being dispatched in the specified
 * {@code store}.
 * @private
 * @returns {Object} The value returned by {@code next(action)}.
 */
function _participantJoinedOrUpdated(store, next, action) {
    const { dispatch, getState } = store;
    const { overwrittenNameList } = store.getState()['features/base/participants'];
    const { participant: { avatarURL, email, id, local, localRecording, name, raisedHandTimestamp } } = action;
    // Send an external update of the local participant's raised hand state
    // if a new raised hand state is defined in the action.
    if (typeof raisedHandTimestamp !== 'undefined') {
        if (local) {
            const { conference } = getState()['features/base/conference'];
            const rHand = parseInt(raisedHandTimestamp, 10);
            // Send raisedHand signalling only if there is a change
            if (conference && rHand !== (0, functions_4.getLocalParticipant)(getState())?.raisedHandTimestamp) {
                conference.setLocalParticipantProperty('raisedHand', rHand);
            }
        }
    }
    if (overwrittenNameList[id]) {
        action.participant.name = overwrittenNameList[id];
    }
    // Send an external update of the local participant's local recording state
    // if a new local recording state is defined in the action.
    if (typeof localRecording !== 'undefined') {
        if (local) {
            const conference = (0, functions_3.getCurrentConference)(getState);
            // Send localRecording signalling only if there is a change
            if (conference
                && localRecording !== (0, functions_4.getLocalParticipant)(getState())?.localRecording) {
                conference.setLocalParticipantProperty('localRecording', localRecording);
            }
        }
    }
    // Allow the redux update to go through and compare the old avatar
    // to the new avatar and emit out change events if necessary.
    const result = next(action);
    // Only run this if the config is populated, otherwise we preload external resources
    // even if disableThirdPartyRequests is set to true in config
    if (getState()['features/base/config']?.hosts) {
        const { disableThirdPartyRequests } = getState()['features/base/config'];
        if (!disableThirdPartyRequests && (avatarURL || email || id || name)) {
            const participantId = !id && local ? (0, functions_4.getLocalParticipant)(getState())?.id : id;
            const updatedParticipant = (0, functions_4.getParticipantById)(getState(), participantId);
            (0, functions_4.getFirstLoadableAvatarUrl)(updatedParticipant ?? { id: '' }, store)
                .then((urlData) => {
                dispatch((0, actions_5.setLoadableAvatarUrl)(participantId, urlData?.src ?? '', Boolean(urlData?.isUsingCORS)));
            });
        }
    }
    return result;
}
/**
 * Handles a local recording status update.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Object} conference - The conference for which we got an update.
 * @param {string} participantId - The ID of the participant from which we got an update.
 * @param {boolean} newValue - The new value of the local recording status.
 * @returns {void}
 */
function _localRecordingUpdated({ dispatch, getState }, conference, participantId, newValue) {
    const state = getState();
    dispatch((0, actions_5.participantUpdated)({
        conference,
        id: participantId,
        localRecording: newValue
    }));
    const participantName = (0, functions_4.getParticipantDisplayName)(state, participantId);
    dispatch((0, actions_3.showNotification)({
        titleKey: 'notify.somebody',
        title: participantName,
        descriptionKey: newValue ? 'notify.localRecordingStarted' : 'notify.localRecordingStopped',
        uid: constants_2.LOCAL_RECORDING_NOTIFICATION_ID
    }, constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
    dispatch((0, actions_4.playSound)(newValue ? constants_5.RECORDING_ON_SOUND_ID : constants_5.RECORDING_OFF_SOUND_ID));
}
/**
 * Handles a raise hand status update.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @param {Object} conference - The conference for which we got an update.
 * @param {string} participantId - The ID of the participant from which we got an update.
 * @param {boolean} newValue - The new value of the raise hand status.
 * @returns {void}
 */
function _raiseHandUpdated({ dispatch, getState }, conference, participantId, newValue) {
    let raisedHandTimestamp;
    switch (newValue) {
        case undefined:
        case 'false':
            raisedHandTimestamp = 0;
            break;
        case 'true':
            raisedHandTimestamp = Date.now();
            break;
        default:
            raisedHandTimestamp = parseInt(`${newValue}`, 10);
    }
    const state = getState();
    dispatch((0, actions_5.participantUpdated)({
        conference,
        id: participantId,
        raisedHandTimestamp
    }));
    dispatch((0, actions_5.raiseHandUpdateQueue)({
        id: participantId,
        raisedHandTimestamp
    }));
    if (typeof APP !== 'undefined') {
        APP.API.notifyRaiseHandUpdated(participantId, raisedHandTimestamp);
    }
    const isModerator = (0, functions_4.isLocalParticipantModerator)(state);
    const participant = (0, functions_4.getParticipantById)(state, participantId);
    let shouldDisplayAllowAction = false;
    if (isModerator) {
        shouldDisplayAllowAction = (0, functions_2.isForceMuted)(participant, constants_6.MEDIA_TYPE.AUDIO, state)
            || (0, functions_2.isForceMuted)(participant, constants_6.MEDIA_TYPE.VIDEO, state);
    }
    const action = shouldDisplayAllowAction ? {
        customActionNameKey: ['notify.allowAction'],
        customActionHandler: [() => dispatch((0, actions_1.approveParticipant)(participantId))]
    } : {};
    if (raisedHandTimestamp) {
        let notificationTitle;
        const participantName = (0, functions_4.getParticipantDisplayName)(state, participantId);
        const { raisedHandsQueue } = state['features/base/participants'];
        if (raisedHandsQueue.length > 1) {
            const raisedHands = raisedHandsQueue.length - 1;
            notificationTitle = i18next_1.default.t('notify.raisedHands', {
                participantName,
                raisedHands
            });
        }
        else {
            notificationTitle = participantName;
        }
        dispatch((0, actions_3.showNotification)({
            titleKey: 'notify.somebody',
            title: notificationTitle,
            descriptionKey: 'notify.raisedHand',
            concatText: true,
            uid: constants_2.RAISE_HAND_NOTIFICATION_ID,
            ...action
        }, shouldDisplayAllowAction ? constants_2.NOTIFICATION_TIMEOUT_TYPE.MEDIUM : constants_2.NOTIFICATION_TIMEOUT_TYPE.SHORT));
        dispatch((0, actions_4.playSound)(constants_4.RAISE_HAND_SOUND_ID));
    }
}
/**
 * Registers sounds related with the participants feature.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _registerSounds({ dispatch }) {
    dispatch((0, actions_4.registerSound)(constants_7.PARTICIPANT_JOINED_SOUND_ID, sounds_1.PARTICIPANT_JOINED_FILE));
    dispatch((0, actions_4.registerSound)(constants_7.PARTICIPANT_LEFT_SOUND_ID, sounds_1.PARTICIPANT_LEFT_FILE));
}
/**
 * Unregisters sounds related with the participants feature.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _unregisterSounds({ dispatch }) {
    dispatch((0, actions_4.unregisterSound)(constants_7.PARTICIPANT_JOINED_SOUND_ID));
    dispatch((0, actions_4.unregisterSound)(constants_7.PARTICIPANT_LEFT_SOUND_ID));
}
