"use strict";
/* eslint-disable lines-around-comment */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const debounce_1 = __importDefault(require("lodash/debounce"));
const react_native_1 = require("react-native");
// @ts-expect-error
const constants_1 = require("../../../../modules/API/constants");
const actions_native_1 = require("../../app/actions.native");
const actionTypes_1 = require("../../base/app/actionTypes");
const actionTypes_2 = require("../../base/conference/actionTypes");
const constants_2 = require("../../base/conference/constants");
const functions_1 = require("../../base/conference/functions");
const actionTypes_3 = require("../../base/connection/actionTypes");
const constants_3 = require("../../base/connection/constants");
const utils_1 = require("../../base/connection/utils");
const lib_jitsi_meet_1 = require("../../base/lib-jitsi-meet");
const actionTypes_4 = require("../../base/media/actionTypes");
const actions_1 = require("../../base/media/actions");
const constants_4 = require("../../base/media/constants");
const actionTypes_5 = require("../../base/participants/actionTypes");
const functions_2 = require("../../base/participants/functions");
const MiddlewareRegistry_1 = __importDefault(require("../../base/redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../../base/redux/StateListenerRegistry"));
const actions_native_2 = require("../../base/tracks/actions.native");
const functions_native_1 = require("../../base/tracks/functions.native");
const actionTypes_6 = require("../../chat/actionTypes");
const actions_native_3 = require("../../chat/actions.native");
const actions_any_1 = require("../../subtitles/actions.any");
const actions_native_4 = require("../../video-menu/actions.native");
const actionTypes_7 = require("../picture-in-picture/actionTypes");
// @ts-ignore
const functions_3 = require("../react-native-sdk/functions");
const actionTypes_8 = require("./actionTypes");
const actions_2 = require("./actions");
const functions_4 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Event which will be emitted on the native side when a chat message is received
 * through the channel.
 */
const CHAT_MESSAGE_RECEIVED = 'CHAT_MESSAGE_RECEIVED';
/**
 * Event which will be emitted on the native side when the chat dialog is displayed/closed.
 */
const CHAT_TOGGLED = 'CHAT_TOGGLED';
/**
 * Event which will be emitted on the native side to indicate the conference
 * has ended either by user request or because an error was produced.
 */
const CONFERENCE_TERMINATED = 'CONFERENCE_TERMINATED';
/**
 * Event which will be emitted on the native side to indicate that the custom overflow menu button was pressed.
 */
const CUSTOM_MENU_BUTTON_PRESSED = 'CUSTOM_MENU_BUTTON_PRESSED';
/**
 * Event which will be emitted on the native side to indicate a message was received
 * through the channel.
 */
const ENDPOINT_TEXT_MESSAGE_RECEIVED = 'ENDPOINT_TEXT_MESSAGE_RECEIVED';
/**
 * Event which will be emitted on the native side to indicate a participant toggles
 * the screen share.
 */
const SCREEN_SHARE_TOGGLED = 'SCREEN_SHARE_TOGGLED';
/**
 * Event which will be emitted on the native side with the participant info array.
 */
const PARTICIPANTS_INFO_RETRIEVED = 'PARTICIPANTS_INFO_RETRIEVED';
const externalAPIEnabled = (0, functions_3.isExternalAPIAvailable)();
let eventEmitter;
const { ExternalAPI } = react_native_1.NativeModules;
if (externalAPIEnabled) {
    eventEmitter = new react_native_1.NativeEventEmitter(ExternalAPI);
}
/**
 * Middleware that captures Redux actions and uses the ExternalAPI module to
 * turn them into native events so the application knows about them.
 *
 * @param {Store} store - Redux store.
 * @returns {Function}
 */
externalAPIEnabled && MiddlewareRegistry_1.default.register(store => next => action => {
    const oldAudioMuted = store.getState()['features/base/media'].audio.muted;
    const result = next(action);
    const { type } = action;
    switch (type) {
        case actionTypes_1.APP_WILL_MOUNT:
            _registerForNativeEvents(store);
            break;
        case actionTypes_1.APP_WILL_UNMOUNT:
            _unregisterForNativeEvents();
            break;
        case actionTypes_2.CONFERENCE_FAILED: {
            const { error, ...data } = action;
            // XXX Certain CONFERENCE_FAILED errors are recoverable i.e. they have
            // prevented the user from joining a specific conference but the app may
            // be able to eventually join the conference. For example, the app will
            // ask the user for a password upon
            // JitsiConferenceErrors.PASSWORD_REQUIRED and will retry joining the
            // conference afterwards. Such errors are to not reach the native
            // counterpart of the External API (or at least not in the
            // fatality/finality semantics attributed to
            // conferenceFailed:/onConferenceFailed).
            if (!error.recoverable) {
                _sendConferenceEvent(store, /* action */ {
                    error: _toErrorString(error),
                    ...data
                });
            }
            break;
        }
        case actionTypes_2.CONFERENCE_LEFT:
            _sendConferenceEvent(store, action);
            break;
        case actionTypes_2.CONFERENCE_JOINED:
            _sendConferenceEvent(store, action);
            _registerForEndpointTextMessages(store);
            break;
        case actionTypes_2.CONFERENCE_BLURRED:
            (0, functions_4.sendEvent)(store, actionTypes_2.CONFERENCE_BLURRED, {});
            break;
        case actionTypes_2.CONFERENCE_FOCUSED:
            (0, functions_4.sendEvent)(store, actionTypes_2.CONFERENCE_FOCUSED, {});
            break;
        case actionTypes_3.CONNECTION_DISCONNECTED: {
            // FIXME: This is a hack. See the description in the JITSI_CONNECTION_CONFERENCE_KEY constant definition.
            // Check if this connection was attached to any conference.
            // If it wasn't, fake a CONFERENCE_TERMINATED event.
            const { connection } = action;
            const conference = connection[constants_3.JITSI_CONNECTION_CONFERENCE_KEY];
            if (!conference) {
                // This action will arrive late, so the locationURL stored on the state is no longer valid.
                const locationURL = connection[constants_3.JITSI_CONNECTION_URL_KEY];
                (0, functions_4.sendEvent)(store, CONFERENCE_TERMINATED, 
                /* data */ {
                    url: _normalizeUrl(locationURL)
                });
            }
            break;
        }
        case actionTypes_8.CUSTOM_OVERFLOW_MENU_BUTTON_PRESSED: {
            const { id, text } = action;
            (0, functions_4.sendEvent)(store, CUSTOM_MENU_BUTTON_PRESSED, {
                id,
                text
            });
            break;
        }
        case actionTypes_2.ENDPOINT_MESSAGE_RECEIVED: {
            const { participant, data } = action;
            if (data?.name === constants_1.ENDPOINT_TEXT_MESSAGE_NAME) {
                (0, functions_4.sendEvent)(store, ENDPOINT_TEXT_MESSAGE_RECEIVED, 
                /* data */ {
                    message: data.text,
                    senderId: participant.getId()
                });
            }
            break;
        }
        case actionTypes_7.ENTER_PICTURE_IN_PICTURE:
            (0, functions_4.sendEvent)(store, type, /* data */ {});
            break;
        case actionTypes_6.OPEN_CHAT:
        case actionTypes_6.CLOSE_CHAT: {
            (0, functions_4.sendEvent)(store, CHAT_TOGGLED, 
            /* data */ {
                isOpen: action.type === actionTypes_6.OPEN_CHAT
            });
            break;
        }
        case actionTypes_5.PARTICIPANT_JOINED:
        case actionTypes_5.PARTICIPANT_LEFT: {
            // Skip these events while not in a conference. SDK users can still retrieve them.
            const { conference } = store.getState()['features/base/conference'];
            if (!conference) {
                break;
            }
            const { participant } = action;
            const isVirtualScreenshareParticipant = (0, functions_2.isScreenShareParticipantById)(store.getState(), participant.id);
            if (isVirtualScreenshareParticipant) {
                break;
            }
            (0, functions_4.sendEvent)(store, action.type, (0, functions_4.participantToParticipantInfo)(participant) /* data */);
            break;
        }
        case actionTypes_8.READY_TO_CLOSE:
            (0, functions_4.sendEvent)(store, type, /* data */ {});
            break;
        case actionTypes_2.SET_ROOM:
            _maybeTriggerEarlyConferenceWillJoin(store, action);
            break;
        case actionTypes_4.SET_AUDIO_MUTED:
            if (action.muted !== oldAudioMuted) {
                (0, functions_4.sendEvent)(store, 'AUDIO_MUTED_CHANGED', 
                /* data */ {
                    muted: action.muted
                });
            }
            break;
        case actionTypes_4.SET_VIDEO_MUTED:
            (0, functions_4.sendEvent)(store, 'VIDEO_MUTED_CHANGED', 
            /* data */ {
                muted: action.muted
            });
            break;
    }
    return result;
});
/**
 * Listen for changes to the known media tracks and look
 * for updates to screen shares for emitting native events.
 * The listener is debounced to avoid state thrashing that might occur,
 * especially when switching in or out of p2p.
 */
externalAPIEnabled && StateListenerRegistry_1.default.register(
/* selector */ state => state['features/base/tracks'], 
/* listener */ (0, debounce_1.default)((tracks, store) => {
    const oldScreenShares = store.getState()['features/mobile/external-api'].screenShares || [];
    const newScreenShares = tracks
        .filter(track => track.mediaType === constants_4.MEDIA_TYPE.SCREENSHARE || track.videoType === constants_4.VIDEO_TYPE.DESKTOP)
        .map(track => track.participantId);
    oldScreenShares.forEach(participantId => {
        if (!newScreenShares.includes(participantId)) {
            (0, functions_4.sendEvent)(store, SCREEN_SHARE_TOGGLED, 
            /* data */ {
                participantId,
                sharing: false
            });
        }
    });
    newScreenShares.forEach(participantId => {
        if (!oldScreenShares.includes(participantId)) {
            (0, functions_4.sendEvent)(store, SCREEN_SHARE_TOGGLED, 
            /* data */ {
                participantId,
                sharing: true
            });
        }
    });
    store.dispatch((0, actions_2.setParticipantsWithScreenShare)(newScreenShares));
}, 100));
/**
 * Registers for events sent from the native side via NativeEventEmitter.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _registerForNativeEvents(store) {
    const { getState, dispatch } = store;
    eventEmitter.addListener(ExternalAPI.HANG_UP, () => {
        dispatch((0, actions_native_1.appNavigate)(undefined));
    });
    eventEmitter.addListener(ExternalAPI.SET_AUDIO_MUTED, ({ muted }) => {
        dispatch((0, actions_native_4.muteLocal)(muted, constants_4.MEDIA_TYPE.AUDIO));
    });
    eventEmitter.addListener(ExternalAPI.SET_VIDEO_MUTED, ({ muted }) => {
        dispatch((0, actions_native_4.muteLocal)(muted, constants_4.MEDIA_TYPE.VIDEO));
    });
    eventEmitter.addListener(ExternalAPI.SEND_ENDPOINT_TEXT_MESSAGE, ({ to, message }) => {
        const conference = (0, functions_1.getCurrentConference)(getState());
        try {
            conference?.sendEndpointMessage(to, {
                name: constants_1.ENDPOINT_TEXT_MESSAGE_NAME,
                text: message
            });
        }
        catch (error) {
            logger_1.default.warn('Cannot send endpointMessage', error);
        }
    });
    eventEmitter.addListener(ExternalAPI.TOGGLE_SCREEN_SHARE, ({ enabled }) => {
        dispatch((0, actions_native_2.toggleScreensharing)(enabled));
    });
    eventEmitter.addListener(ExternalAPI.RETRIEVE_PARTICIPANTS_INFO, ({ requestId }) => {
        const participantsInfo = [];
        const remoteParticipants = (0, functions_2.getRemoteParticipants)(store);
        const localParticipant = (0, functions_2.getLocalParticipant)(store);
        localParticipant && participantsInfo.push((0, functions_4.participantToParticipantInfo)(localParticipant));
        remoteParticipants.forEach(participant => {
            if (!participant.fakeParticipant) {
                participantsInfo.push((0, functions_4.participantToParticipantInfo)(participant));
            }
        });
        (0, functions_4.sendEvent)(store, PARTICIPANTS_INFO_RETRIEVED, 
        /* data */ {
            participantsInfo,
            requestId
        });
    });
    eventEmitter.addListener(ExternalAPI.OPEN_CHAT, ({ to }) => {
        const participant = (0, functions_2.getParticipantById)(store, to);
        dispatch((0, actions_native_3.openChat)(participant));
    });
    eventEmitter.addListener(ExternalAPI.CLOSE_CHAT, () => {
        dispatch((0, actions_native_3.closeChat)());
    });
    eventEmitter.addListener(ExternalAPI.SEND_CHAT_MESSAGE, ({ message, to }) => {
        const participant = (0, functions_2.getParticipantById)(store, to);
        if (participant) {
            dispatch((0, actions_native_3.setPrivateMessageRecipient)(participant));
        }
        dispatch((0, actions_native_3.sendMessage)(message));
    });
    eventEmitter.addListener(ExternalAPI.SET_CLOSED_CAPTIONS_ENABLED, ({ enabled, displaySubtitles, language }) => {
        dispatch((0, actions_any_1.setRequestingSubtitles)(enabled, displaySubtitles, language));
    });
    eventEmitter.addListener(ExternalAPI.TOGGLE_CAMERA, () => {
        dispatch((0, actions_1.toggleCameraFacingMode)());
    });
}
/**
 * Unregister for events sent from the native side via NativeEventEmitter.
 *
 * @private
 * @returns {void}
 */
function _unregisterForNativeEvents() {
    eventEmitter.removeAllListeners(ExternalAPI.HANG_UP);
    eventEmitter.removeAllListeners(ExternalAPI.SET_AUDIO_MUTED);
    eventEmitter.removeAllListeners(ExternalAPI.SET_VIDEO_MUTED);
    eventEmitter.removeAllListeners(ExternalAPI.SEND_ENDPOINT_TEXT_MESSAGE);
    eventEmitter.removeAllListeners(ExternalAPI.TOGGLE_SCREEN_SHARE);
    eventEmitter.removeAllListeners(ExternalAPI.RETRIEVE_PARTICIPANTS_INFO);
    eventEmitter.removeAllListeners(ExternalAPI.OPEN_CHAT);
    eventEmitter.removeAllListeners(ExternalAPI.CLOSE_CHAT);
    eventEmitter.removeAllListeners(ExternalAPI.SEND_CHAT_MESSAGE);
    eventEmitter.removeAllListeners(ExternalAPI.SET_CLOSED_CAPTIONS_ENABLED);
    eventEmitter.removeAllListeners(ExternalAPI.TOGGLE_CAMERA);
}
/**
 * Registers for endpoint messages sent on conference data channel.
 *
 * @param {Store} store - The redux store.
 * @private
 * @returns {void}
 */
function _registerForEndpointTextMessages(store) {
    const conference = (0, functions_1.getCurrentConference)(store.getState());
    conference?.on(lib_jitsi_meet_1.JitsiConferenceEvents.MESSAGE_RECEIVED, (id, message, timestamp) => {
        (0, functions_4.sendEvent)(store, CHAT_MESSAGE_RECEIVED, 
        /* data */ {
            senderId: id,
            message,
            isPrivate: false,
            timestamp
        });
    });
    conference?.on(lib_jitsi_meet_1.JitsiConferenceEvents.PRIVATE_MESSAGE_RECEIVED, (id, message, timestamp) => {
        (0, functions_4.sendEvent)(store, CHAT_MESSAGE_RECEIVED, 
        /* data */ {
            senderId: id,
            message,
            isPrivate: true,
            timestamp
        });
    });
}
/**
 * Returns a {@code String} representation of a specific error {@code Object}.
 *
 * @param {Error|Object|string} error - The error {@code Object} to return a
 * {@code String} representation of.
 * @returns {string} A {@code String} representation of the specified
 * {@code error}.
 */
function _toErrorString(error) {
    // XXX In lib-jitsi-meet and jitsi-meet we utilize errors in the form of
    // strings, Error instances, and plain objects which resemble Error.
    return (error
        ? typeof error === 'string'
            ? error
            : Error.prototype.toString.apply(error)
        : '');
}
/**
 * If {@link SET_ROOM} action happens for a valid conference room this method
 * will emit an early {@link CONFERENCE_WILL_JOIN} event to let the external API
 * know that a conference is being joined. Before that happens a connection must
 * be created and only then base/conference feature would emit
 * {@link CONFERENCE_WILL_JOIN}. That is fine for the Jitsi Meet app, because
 * that's the a conference instance gets created, but it's too late for
 * the external API to learn that. The latter {@link CONFERENCE_WILL_JOIN} is
 * swallowed in {@link _swallowEvent}.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action.
 * @returns {void}
 */
function _maybeTriggerEarlyConferenceWillJoin(store, action) {
    const { locationURL } = store.getState()['features/base/connection'];
    const { room } = action;
    (0, functions_1.isRoomValid)(room) && locationURL && (0, functions_4.sendEvent)(store, actionTypes_2.CONFERENCE_WILL_JOIN, 
    /* data */ {
        url: _normalizeUrl(locationURL)
    });
}
/**
 * Normalizes the given URL for presentation over the external API.
 *
 * @param {URL} url -The URL to normalize.
 * @returns {string} - The normalized URL as a string.
 */
function _normalizeUrl(url) {
    return (0, utils_1.getURLWithoutParams)(url).href;
}
/**
 * Sends an event to the native counterpart of the External API for a specific
 * conference-related redux action.
 *
 * @param {Store} store - The redux store.
 * @param {Action} action - The redux action.
 * @returns {void}
 */
function _sendConferenceEvent(store, action) {
    const { conference, type, ...data } = action;
    // For these (redux) actions, conference identifies a JitsiConference
    // instance. The external API cannot transport such an object so we have to
    // transport an "equivalent".
    if (conference) { // @ts-ignore
        data.url = _normalizeUrl(conference[constants_2.JITSI_CONFERENCE_URL_KEY]);
        const localTracks = (0, functions_native_1.getLocalTracks)(store.getState()['features/base/tracks']);
        const isAudioMuted = (0, functions_native_1.isLocalTrackMuted)(localTracks, constants_4.MEDIA_TYPE.AUDIO);
        data.isAudioMuted = isAudioMuted;
    }
    if (_swallowEvent(store, action, data)) {
        return;
    }
    let type_;
    switch (type) {
        case actionTypes_2.CONFERENCE_FAILED:
        case actionTypes_2.CONFERENCE_LEFT:
            type_ = CONFERENCE_TERMINATED;
            break;
        default:
            type_ = type;
            break;
    }
    (0, functions_4.sendEvent)(store, type_, data);
}
/**
 * Determines whether to not send a {@code CONFERENCE_LEFT} event to the native
 * counterpart of the External API.
 *
 * @param {Object} store - The redux store.
 * @param {Action} action - The redux action which is causing the sending of the
 * event.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code action}.
 * @returns {boolean} If the specified event is to not be sent, {@code true};
 * otherwise, {@code false}.
 */
function _swallowConferenceLeft({ getState }, action, { url }) {
    // XXX Internally, we work with JitsiConference instances. Externally
    // though, we deal with URL strings. The relation between the two is many to
    // one so it's technically and practically possible (by externally loading
    // the same URL string multiple times) to try to send CONFERENCE_LEFT
    // externally for a URL string which identifies a JitsiConference that the
    // app is internally legitimately working with.
    let swallowConferenceLeft = false;
    url
        && (0, functions_1.forEachConference)(getState, (conference, conferenceURL) => {
            if (conferenceURL && conferenceURL.toString() === url) {
                swallowConferenceLeft = true;
            }
            return !swallowConferenceLeft;
        });
    return swallowConferenceLeft;
}
/**
 * Determines whether to not send a specific event to the native counterpart of
 * the External API.
 *
 * @param {Object} store - The redux store.
 * @param {Action} action - The redux action which is causing the sending of the
 * event.
 * @param {Object} data - The details/specifics of the event to send determined
 * by/associated with the specified {@code action}.
 * @returns {boolean} If the specified event is to not be sent, {@code true};
 * otherwise, {@code false}.
 */
function _swallowEvent(store, action, data) {
    switch (action.type) {
        case actionTypes_2.CONFERENCE_LEFT:
            return _swallowConferenceLeft(store, action, data);
        default:
            return false;
    }
}
