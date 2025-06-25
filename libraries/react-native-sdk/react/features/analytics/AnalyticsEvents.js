"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrackMutedEvent = exports.createReactionSoundsDisabledEvent = exports.createReactionMenuEvent = exports.createToolbarEvent = exports.createSyncTrackStateEvent = exports.createStartMutedConfigurationEvent = exports.createAudioPlaySuccessEvent = exports.createAudioPlayErrorEvent = exports.createStartSilentEvent = exports.createStartAudioOnlyEvent = exports.createShortcutEvent = exports.createSharedVideoEvent = exports.createScreenSharingIssueEvent = exports.createScreenSharingEvent = exports.createRTCStatsTraceCloseEvent = exports.createRemoteVideoMenuButtonEvent = exports.createRemoteMuteConfirmedEvent = exports.createRejoinedEvent = exports.createRecordingEvent = exports.createLocalTracksDurationEvent = exports.createLiveStreamingDialogEvent = exports.createRecordingDialogEvent = exports.createProfilePanelButtonEvent = exports.createPollEvent = exports.createPinnedEvent = exports.createPageReloadScheduledEvent = exports.createOfferAnswerFailedEvent = exports.createNotAllowedErrorEvent = exports.createNetworkInfoEvent = exports.createInviteDialogEvent = exports.createFeedbackOpenEvent = exports.createE2EEEvent = exports.createDeviceChangedEvent = exports.createDeepLinkingPageEvent = exports.createRecentSelectedEvent = exports.createChromeExtensionBannerEvent = exports.createRecentClickedEvent = exports.createCalendarConnectedEvent = exports.createCalendarSelectedEvent = exports.createCalendarClickedEvent = exports.createConnectionEvent = exports.createAudioOnlyChangedEvent = exports.createApiEvent = exports.VIDEO_MUTE = exports.AUDIO_MUTE = exports.ACTION_SHORTCUT_TRIGGERED = exports.ACTION_SHORTCUT_RELEASED = exports.ACTION_SHORTCUT_PRESSED = exports.ACTION_UNPINNED = exports.ACTION_PINNED = void 0;
exports.createRestrictWhiteboardEvent = exports.createOpenWhiteboardEvent = exports.createGifSentEvent = exports.createBreakoutRoomsEvent = exports.createScreensharingCaptureTakenEvent = exports.createWelcomePageEvent = exports.createVpaasConferenceJoinedEvent = void 0;
/**
 * The constant for the event type 'track'.
 * TODO: keep these constants in a single place. Can we import them from
 * lib-jitsi-meet's AnalyticsEvents somehow?
 *
 * @type {string}
 */
const TYPE_TRACK = 'track';
/**
 * The constant for the event type 'UI' (User Interaction).
 * TODO: keep these constants in a single place. Can we import them from
 * lib-jitsi-meet's AnalyticsEvents somehow?
 *
 * @type {string}
 */
const TYPE_UI = 'ui';
/**
 * The identifier for the "pinned" action. The local participant has pinned a
 * participant to remain on large video.
 *
 * @type {String}
 */
exports.ACTION_PINNED = 'pinned';
/**
 * The identifier for the "unpinned" action. The local participant has unpinned
 * a participant so the participant doesn't remain permanently on local large
 * video.
 *
 * @type {String}
 */
exports.ACTION_UNPINNED = 'unpinned';
/**
 * The identifier for the "pressed" action for shortcut events. This action
 * means that a button was pressed (and not yet released).
 *
 * @type {String}
 */
exports.ACTION_SHORTCUT_PRESSED = 'pressed';
/**
 * The identifier for the "released" action for shortcut events. This action
 * means that a button which was previously pressed was released.
 *
 * @type {String}
 */
exports.ACTION_SHORTCUT_RELEASED = 'released';
/**
 * The identifier for the "triggered" action for shortcut events. This action
 * means that a button was pressed, and we don't care about whether it was
 * released or will be released in the future.
 *
 * @type {String}
 */
exports.ACTION_SHORTCUT_TRIGGERED = 'triggered';
/**
 * The name of the keyboard shortcut or toolbar button for muting audio.
 */
exports.AUDIO_MUTE = 'audio.mute';
/**
 * The name of the keyboard shortcut or toolbar button for muting video.
 */
exports.VIDEO_MUTE = 'video.mute';
/**
 * Creates an event which indicates that a certain action was requested through
 * the jitsi-meet API.
 *
 * @param {string} action - The action which was requested through the
 * jitsi-meet API.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createApiEvent(action, attributes = {}) {
    return {
        action,
        attributes,
        source: 'jitsi-meet-api'
    };
}
exports.createApiEvent = createApiEvent;
/**
 * Creates an event which indicates that the audio-only mode has been changed.
 *
 * @param {boolean} enabled - True if audio-only is enabled, false otherwise.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createAudioOnlyChangedEvent(enabled) {
    return {
        action: `audio.only.${enabled ? 'enabled' : 'disabled'}`
    };
}
exports.createAudioOnlyChangedEvent = createAudioOnlyChangedEvent;
/**
 * Creates an event for about the JitsiConnection.
 *
 * @param {string} action - The action that the event represents.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createConnectionEvent(action, attributes = {}) {
    return {
        action,
        actionSubject: 'connection',
        attributes
    };
}
exports.createConnectionEvent = createConnectionEvent;
/**
 * Creates an event which indicates an action occurred in the calendar
 * integration UI.
 *
 * @param {string} eventName - The name of the calendar UI event.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createCalendarClickedEvent(eventName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: eventName,
        attributes,
        source: 'calendar',
        type: TYPE_UI
    };
}
exports.createCalendarClickedEvent = createCalendarClickedEvent;
/**
 * Creates an event which indicates that the calendar container is shown and
 * selected.
 *
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createCalendarSelectedEvent(attributes = {}) {
    return {
        action: 'selected',
        attributes,
        source: 'calendar',
        type: TYPE_UI
    };
}
exports.createCalendarSelectedEvent = createCalendarSelectedEvent;
/**
 * Creates an event indicating that a calendar has been connected.
 *
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createCalendarConnectedEvent(attributes = {}) {
    return {
        action: 'connected',
        actionSubject: 'calendar',
        attributes
    };
}
exports.createCalendarConnectedEvent = createCalendarConnectedEvent;
/**
 * Creates an event which indicates an action occurred in the recent list
 * integration UI.
 *
 * @param {string} eventName - The name of the recent list UI event.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRecentClickedEvent(eventName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: eventName,
        attributes,
        source: 'recent.list',
        type: TYPE_UI
    };
}
exports.createRecentClickedEvent = createRecentClickedEvent;
/**
 * Creates an event which indicate an action occurred in the chrome extension banner.
 *
 * @param {boolean} installPressed - Whether the user pressed install or `x` - cancel.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createChromeExtensionBannerEvent(installPressed, attributes = {}) {
    return {
        action: installPressed ? 'install' : 'cancel',
        attributes,
        source: 'chrome.extension.banner',
        type: TYPE_UI
    };
}
exports.createChromeExtensionBannerEvent = createChromeExtensionBannerEvent;
/**
 * Creates an event which indicates that the recent list container is shown and
 * selected.
 *
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRecentSelectedEvent(attributes = {}) {
    return {
        action: 'selected',
        attributes,
        source: 'recent.list',
        type: TYPE_UI
    };
}
exports.createRecentSelectedEvent = createRecentSelectedEvent;
/**
 * Creates an event for an action on the deep linking page.
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createDeepLinkingPageEvent(action, actionSubject, attributes = {}) {
    return {
        action,
        actionSubject,
        source: 'deepLinkingPage',
        attributes
    };
}
exports.createDeepLinkingPageEvent = createDeepLinkingPageEvent;
/**
 * Creates an event which indicates that a device was changed.
 *
 * @param {string} mediaType - The media type of the device ('audio' or
 * 'video').
 * @param {string} deviceType - The type of the device ('input' or 'output').
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createDeviceChangedEvent(mediaType, deviceType) {
    return {
        action: 'device.changed',
        attributes: {
            'device_type': deviceType,
            'media_type': mediaType
        }
    };
}
exports.createDeviceChangedEvent = createDeviceChangedEvent;
/**
 * Creates an event indicating that an action related to E2EE occurred.
 *
 * @param {string} action - The action which occurred.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createE2EEEvent(action) {
    return {
        action,
        actionSubject: 'e2ee'
    };
}
exports.createE2EEEvent = createE2EEEvent;
/**
 * Creates an event which specifies that the feedback dialog has been opened.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createFeedbackOpenEvent() {
    return {
        action: 'feedback.opened'
    };
}
exports.createFeedbackOpenEvent = createFeedbackOpenEvent;
/**
 * Creates an event for an action regarding the AddPeopleDialog (invites).
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createInviteDialogEvent(action, actionSubject, attributes = {}) {
    return {
        action,
        actionSubject,
        attributes,
        source: 'inviteDialog'
    };
}
exports.createInviteDialogEvent = createInviteDialogEvent;
/**
 * Creates an event which reports about the current network information reported by the operating system.
 *
 * @param {boolean} isOnline - Tells whether or not the internet is reachable.
 * @param {string} [networkType] - Network type, see {@code NetworkInfo} type defined by the 'base/net-info' feature.
 * @param {Object} [details] - Extra info, see {@code NetworkInfo} type defined by the 'base/net-info' feature.
 * @returns {Object}
 */
function createNetworkInfoEvent({ isOnline, networkType, details }) {
    const attributes = { isOnline };
    // Do no include optional stuff or Amplitude handler will log warnings.
    networkType && (attributes.networkType = networkType);
    details && (attributes.details = details);
    return {
        action: 'network.info',
        attributes
    };
}
exports.createNetworkInfoEvent = createNetworkInfoEvent;
/**
 * Creates a "not allowed error" event.
 *
 * @param {string} type - The type of the error.
 * @param {string} reason - The reason for the error.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createNotAllowedErrorEvent(type, reason) {
    return {
        action: 'not.allowed.error',
        attributes: {
            reason,
            type
        }
    };
}
exports.createNotAllowedErrorEvent = createNotAllowedErrorEvent;
/**
 * Creates an "offer/answer failure" event.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createOfferAnswerFailedEvent() {
    return {
        action: 'offer.answer.failure'
    };
}
exports.createOfferAnswerFailedEvent = createOfferAnswerFailedEvent;
/**
 * Creates a "page reload" event.
 *
 * @param {string} reason - The reason for the reload.
 * @param {number} timeout - The timeout in seconds after which the page is
 * scheduled to reload.
 * @param {Object} details - The details for the error.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createPageReloadScheduledEvent(reason, timeout, details = {}) {
    return {
        action: 'page.reload.scheduled',
        attributes: {
            reason,
            timeout,
            ...details
        }
    };
}
exports.createPageReloadScheduledEvent = createPageReloadScheduledEvent;
/**
 * Creates a "pinned" or "unpinned" event.
 *
 * @param {string} action - The action ("pinned" or "unpinned").
 * @param {string} participantId - The ID of the participant which was pinned.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createPinnedEvent(action, participantId, attributes = {}) {
    return {
        type: TYPE_TRACK,
        action,
        actionSubject: 'participant',
        objectType: 'participant',
        objectId: participantId,
        attributes
    };
}
exports.createPinnedEvent = createPinnedEvent;
/**
 * Creates a poll event.
 * The following events will be created:
 * - poll.created
 * - poll.vote.checked
 * - poll.vote.sent
 * - poll.vote.skipped
 * - poll.vote.detailsViewed
 * - poll.vote.changed
 * - poll.option.added
 * - poll.option.moved
 * - poll.option.removed.
 *
 * @param {string} action - The action.
 * @returns {Object}
 */
function createPollEvent(action) {
    return {
        action: `poll.${action}`
    };
}
exports.createPollEvent = createPollEvent;
/**
 * Creates an event which indicates that a button in the profile panel was
 * clicked.
 *
 * @param {string} buttonName - The name of the button.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createProfilePanelButtonEvent(buttonName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: buttonName,
        attributes,
        source: 'profile.panel',
        type: TYPE_UI
    };
}
exports.createProfilePanelButtonEvent = createProfilePanelButtonEvent;
/**
 * Creates an event which indicates that a specific button on one of the
 * recording-related dialogs was clicked.
 *
 * @param {string} dialogName - The name of the dialog (e.g. 'start' or 'stop').
 * @param {string} buttonName - The name of the button (e.g. 'confirm' or
 * 'cancel').
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRecordingDialogEvent(dialogName, buttonName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: buttonName,
        attributes,
        source: `${dialogName}.recording.dialog`,
        type: TYPE_UI
    };
}
exports.createRecordingDialogEvent = createRecordingDialogEvent;
/**
 * Creates an event which indicates that a specific button on one of the
 * liveStreaming-related dialogs was clicked.
 *
 * @param {string} dialogName - The name of the dialog (e.g. 'start' or 'stop').
 * @param {string} buttonName - The name of the button (e.g. 'confirm' or
 * 'cancel').
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createLiveStreamingDialogEvent(dialogName, buttonName) {
    return {
        action: 'clicked',
        actionSubject: buttonName,
        source: `${dialogName}.liveStreaming.dialog`,
        type: TYPE_UI
    };
}
exports.createLiveStreamingDialogEvent = createLiveStreamingDialogEvent;
/**
 * Creates an event with the local tracks duration.
 *
 * @param {Object} duration - The object with the duration of the local tracks.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createLocalTracksDurationEvent(duration) {
    const { audio, video, conference } = duration;
    const { camera, desktop } = video;
    return {
        action: 'local.tracks.durations',
        attributes: {
            audio: audio.value,
            camera: camera.value,
            conference: conference.value,
            desktop: desktop.value
        }
    };
}
exports.createLocalTracksDurationEvent = createLocalTracksDurationEvent;
/**
 * Creates an event which indicates that an action related to recording has
 * occurred.
 *
 * @param {string} action - The action (e.g. 'start' or 'stop').
 * @param {string} type - The recording type (e.g. 'file' or 'live').
 * @param {number} value - The duration of the recording in seconds (for stop
 * action).
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRecordingEvent(action, type, value) {
    return {
        action,
        actionSubject: `recording.${type}`,
        attributes: {
            value
        }
    };
}
exports.createRecordingEvent = createRecordingEvent;
/**
 * Creates an event which indicates that the same conference has been rejoined.
 *
 * @param {string} url - The full conference URL.
 * @param {number} lastConferenceDuration - How many seconds user stayed in the previous conference.
 * @param {number} timeSinceLeft - How many seconds since the last conference was left.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
function createRejoinedEvent({ url, lastConferenceDuration, timeSinceLeft }) {
    return {
        action: 'rejoined',
        attributes: {
            lastConferenceDuration,
            timeSinceLeft,
            url
        }
    };
}
exports.createRejoinedEvent = createRejoinedEvent;
/**
 * Creates an event which specifies that the "confirm" button on the remote
 * mute dialog has been clicked.
 *
 * @param {string} participantId - The ID of the participant that was remotely
 * muted.
 * @param {string} mediaType - The media type of the channel to mute.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRemoteMuteConfirmedEvent(participantId, mediaType) {
    return {
        action: 'clicked',
        attributes: {
            'participant_id': participantId,
            'media_type': mediaType
        },
        source: 'remote.mute.button',
        type: TYPE_UI
    };
}
exports.createRemoteMuteConfirmedEvent = createRemoteMuteConfirmedEvent;
/**
 * Creates an event which indicates that one of the buttons in the "remote
 * video menu" was clicked.
 *
 * @param {string} buttonName - The name of the button.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRemoteVideoMenuButtonEvent(buttonName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: buttonName,
        attributes,
        source: 'remote.video.menu',
        type: TYPE_UI
    };
}
exports.createRemoteVideoMenuButtonEvent = createRemoteVideoMenuButtonEvent;
/**
 * The rtcstats websocket onclose event. We send this to amplitude in order
 * to detect trace ws prematurely closing.
 *
 * @param {Object} closeEvent - The event with which the websocket closed.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRTCStatsTraceCloseEvent(closeEvent) {
    const event = {
        action: 'trace.onclose',
        source: 'rtcstats'
    };
    event.code = closeEvent.code;
    event.reason = closeEvent.reason;
    return event;
}
exports.createRTCStatsTraceCloseEvent = createRTCStatsTraceCloseEvent;
/**
 * Creates an event indicating that an action related to screen sharing
 * occurred (e.g. It was started or stopped).
 *
 * @param {string} action - The action which occurred.
 * @param {number?} value - The screenshare duration in seconds.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createScreenSharingEvent(action, value = null) {
    return {
        action,
        actionSubject: 'screen.sharing',
        attributes: {
            value
        }
    };
}
exports.createScreenSharingEvent = createScreenSharingEvent;
/**
 * Creates an event which indicates the screen sharing video is not displayed when it needs to be displayed.
 *
 * @param {Object} attributes - Additional information that describes the issue.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
function createScreenSharingIssueEvent(attributes = {}) {
    return {
        action: 'screen.sharing.issue',
        attributes
    };
}
exports.createScreenSharingIssueEvent = createScreenSharingIssueEvent;
/**
 * Creates an event associated with the "shared video" feature.
 *
 * @param {string} action - The action that the event represents.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createSharedVideoEvent(action, attributes = {}) {
    return {
        action,
        attributes,
        actionSubject: 'shared.video'
    };
}
exports.createSharedVideoEvent = createSharedVideoEvent;
/**
 * Creates an event associated with a shortcut being pressed, released or
 * triggered. By convention, where appropriate an attribute named 'enable'
 * should be used to indicate the action which resulted by the shortcut being
 * pressed (e.g. Whether screen sharing was enabled or disabled).
 *
 * @param {string} shortcut - The identifier of the shortcut which produced
 * an action.
 * @param {string} action - The action that the event represents (one
 * of ACTION_SHORTCUT_PRESSED, ACTION_SHORTCUT_RELEASED
 * or ACTION_SHORTCUT_TRIGGERED).
 * @param {Object} attributes - Attributes to attach to the event.
 * @param {string} source - The event's source.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createShortcutEvent(shortcut, action = exports.ACTION_SHORTCUT_TRIGGERED, attributes = {}, source = 'keyboard.shortcut') {
    return {
        action,
        actionSubjectId: shortcut,
        attributes,
        source,
        type: TYPE_UI
    };
}
exports.createShortcutEvent = createShortcutEvent;
/**
 * Creates an event which indicates the "start audio only" configuration.
 *
 * @param {boolean} audioOnly - Whether "start audio only" is enabled or not.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createStartAudioOnlyEvent(audioOnly) {
    return {
        action: 'start.audio.only',
        attributes: {
            enabled: audioOnly
        }
    };
}
exports.createStartAudioOnlyEvent = createStartAudioOnlyEvent;
/**
 * Creates an event which indicates the "start silent" configuration.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createStartSilentEvent() {
    return {
        action: 'start.silent'
    };
}
exports.createStartSilentEvent = createStartSilentEvent;
/**
 * Creates an event which indicates that HTMLAudioElement.play has failed.
 *
 * @param {string} elementID - The ID of the HTMLAudioElement.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
function createAudioPlayErrorEvent(elementID) {
    return {
        action: 'audio.play.error',
        attributes: {
            elementID
        }
    };
}
exports.createAudioPlayErrorEvent = createAudioPlayErrorEvent;
/**
 * Creates an event which indicates that HTMLAudioElement.play has succeeded after a prior failure.
 *
 * @param {string} elementID - The ID of the HTMLAudioElement.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
function createAudioPlaySuccessEvent(elementID) {
    return {
        action: 'audio.play.success',
        attributes: {
            elementID
        }
    };
}
exports.createAudioPlaySuccessEvent = createAudioPlaySuccessEvent;
/**
 * Creates an event which indicates the "start muted" configuration.
 *
 * @param {string} source - The source of the configuration, 'local' or
 * 'remote' depending on whether it comes from the static configuration (i.e.
 * {@code config.js}) or comes dynamically from Jicofo.
 * @param {boolean} audioMute - Whether the configuration requests that audio
 * is muted.
 * @param {boolean} videoMute - Whether the configuration requests that video
 * is muted.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createStartMutedConfigurationEvent(source, audioMute, videoMute) {
    return {
        action: 'start.muted.configuration',
        attributes: {
            source,
            'audio_mute': audioMute,
            'video_mute': videoMute
        }
    };
}
exports.createStartMutedConfigurationEvent = createStartMutedConfigurationEvent;
/**
 * Automatically changing the mute state of a media track in order to match
 * the current stored state in redux.
 *
 * @param {string} mediaType - The track's media type ('audio' or 'video').
 * @param {boolean} muted - Whether the track is being muted or unmuted as
 * as result of the sync operation.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createSyncTrackStateEvent(mediaType, muted) {
    return {
        action: 'sync.track.state',
        attributes: {
            'media_type': mediaType,
            muted
        }
    };
}
exports.createSyncTrackStateEvent = createSyncTrackStateEvent;
/**
 * Creates an event associated with a toolbar button being clicked/pressed. By
 * convention, where appropriate an attribute named 'enable' should be used to
 * indicate the action which resulted by the shortcut being pressed (e.g.
 * Whether screen sharing was enabled or disabled).
 *
 * @param {string} buttonName - The identifier of the toolbar button which was
 * clicked/pressed.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createToolbarEvent(buttonName, attributes = {}) {
    return {
        action: 'clicked',
        actionSubject: buttonName,
        attributes,
        source: 'toolbar.button',
        type: TYPE_UI
    };
}
exports.createToolbarEvent = createToolbarEvent;
/**
 * Creates an event associated with a reaction button being clicked/pressed.
 *
 * @param {string} buttonName - The identifier of the reaction button which was
 * clicked/pressed.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createReactionMenuEvent(buttonName) {
    return {
        action: 'clicked',
        actionSubject: 'button',
        source: 'reaction',
        buttonName,
        type: TYPE_UI
    };
}
exports.createReactionMenuEvent = createReactionMenuEvent;
/**
 * Creates an event associated with disabling of reaction sounds.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createReactionSoundsDisabledEvent() {
    return {
        action: 'disabled',
        actionSubject: 'sounds',
        source: 'reaction.settings',
        type: TYPE_UI
    };
}
exports.createReactionSoundsDisabledEvent = createReactionSoundsDisabledEvent;
/**
 * Creates an event which indicates that a local track was muted.
 *
 * @param {string} mediaType - The track's media type ('audio' or 'video').
 * @param {string} reason - The reason the track was muted (e.g. It was
 * triggered by the "initial mute" option, or a previously muted track was
 * replaced (e.g. When a new device was used)).
 * @param {boolean} muted - Whether the track was muted or unmuted.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createTrackMutedEvent(mediaType, reason, muted = true) {
    return {
        action: 'track.muted',
        attributes: {
            'media_type': mediaType,
            muted,
            reason
        }
    };
}
exports.createTrackMutedEvent = createTrackMutedEvent;
/**
 * Creates an event for joining a vpaas conference.
 *
 * @param {string} tenant - The conference tenant.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createVpaasConferenceJoinedEvent(tenant) {
    return {
        action: 'vpaas.conference.joined',
        attributes: {
            tenant
        }
    };
}
exports.createVpaasConferenceJoinedEvent = createVpaasConferenceJoinedEvent;
/**
 * Creates an event for an action on the welcome page.
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createWelcomePageEvent(action, actionSubject, attributes = {}) {
    return {
        action,
        actionSubject,
        attributes,
        source: 'welcomePage'
    };
}
exports.createWelcomePageEvent = createWelcomePageEvent;
/**
 * Creates an event which indicates a screenshot of the screensharing has been taken.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createScreensharingCaptureTakenEvent() {
    return {
        action: 'screen.sharing.capture.taken'
    };
}
exports.createScreensharingCaptureTakenEvent = createScreensharingCaptureTakenEvent;
/**
 * Creates an event for an action on breakout rooms.
 *
 * @param {string} actionSubject - The subject that was acted upon.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createBreakoutRoomsEvent(actionSubject) {
    return {
        action: 'clicked',
        actionSubject: `${actionSubject}.button`,
        source: 'breakout.rooms'
    };
}
exports.createBreakoutRoomsEvent = createBreakoutRoomsEvent;
/**
 * Creates an event which indicates a GIF was sent.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createGifSentEvent() {
    return {
        action: 'gif.sent'
    };
}
exports.createGifSentEvent = createGifSentEvent;
/**
 * Creates an event which indicates the whiteboard was opened.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createOpenWhiteboardEvent() {
    return {
        action: 'whiteboard.open'
    };
}
exports.createOpenWhiteboardEvent = createOpenWhiteboardEvent;
/**
 * Creates an event which indicates the whiteboard limit was enforced.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
function createRestrictWhiteboardEvent() {
    return {
        action: 'whiteboard.restrict'
    };
}
exports.createRestrictWhiteboardEvent = createRestrictWhiteboardEvent;
