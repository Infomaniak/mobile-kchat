/**
 * The identifier for the "pinned" action. The local participant has pinned a
 * participant to remain on large video.
 *
 * @type {String}
 */
export declare const ACTION_PINNED = "pinned";
/**
 * The identifier for the "unpinned" action. The local participant has unpinned
 * a participant so the participant doesn't remain permanently on local large
 * video.
 *
 * @type {String}
 */
export declare const ACTION_UNPINNED = "unpinned";
/**
 * The identifier for the "pressed" action for shortcut events. This action
 * means that a button was pressed (and not yet released).
 *
 * @type {String}
 */
export declare const ACTION_SHORTCUT_PRESSED = "pressed";
/**
 * The identifier for the "released" action for shortcut events. This action
 * means that a button which was previously pressed was released.
 *
 * @type {String}
 */
export declare const ACTION_SHORTCUT_RELEASED = "released";
/**
 * The identifier for the "triggered" action for shortcut events. This action
 * means that a button was pressed, and we don't care about whether it was
 * released or will be released in the future.
 *
 * @type {String}
 */
export declare const ACTION_SHORTCUT_TRIGGERED = "triggered";
/**
 * The name of the keyboard shortcut or toolbar button for muting audio.
 */
export declare const AUDIO_MUTE = "audio.mute";
/**
 * The name of the keyboard shortcut or toolbar button for muting video.
 */
export declare const VIDEO_MUTE = "video.mute";
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
export declare function createApiEvent(action: string, attributes?: {}): {
    action: string;
    attributes: {};
    source: string;
};
/**
 * Creates an event which indicates that the audio-only mode has been changed.
 *
 * @param {boolean} enabled - True if audio-only is enabled, false otherwise.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createAudioOnlyChangedEvent(enabled: boolean): {
    action: string;
};
/**
 * Creates an event for about the JitsiConnection.
 *
 * @param {string} action - The action that the event represents.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createConnectionEvent(action: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
};
/**
 * Creates an event which indicates an action occurred in the calendar
 * integration UI.
 *
 * @param {string} eventName - The name of the calendar UI event.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createCalendarClickedEvent(eventName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event which indicates that the calendar container is shown and
 * selected.
 *
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createCalendarSelectedEvent(attributes?: {}): {
    action: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event indicating that a calendar has been connected.
 *
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createCalendarConnectedEvent(attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
};
/**
 * Creates an event which indicates an action occurred in the recent list
 * integration UI.
 *
 * @param {string} eventName - The name of the recent list UI event.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createRecentClickedEvent(eventName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event which indicate an action occurred in the chrome extension banner.
 *
 * @param {boolean} installPressed - Whether the user pressed install or `x` - cancel.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createChromeExtensionBannerEvent(installPressed: boolean, attributes?: {}): {
    action: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event which indicates that the recent list container is shown and
 * selected.
 *
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createRecentSelectedEvent(attributes?: {}): {
    action: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event for an action on the deep linking page.
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createDeepLinkingPageEvent(action: string, actionSubject: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    source: string;
    attributes: {};
};
/**
 * Creates an event which indicates that a device was changed.
 *
 * @param {string} mediaType - The media type of the device ('audio' or
 * 'video').
 * @param {string} deviceType - The type of the device ('input' or 'output').
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createDeviceChangedEvent(mediaType: string, deviceType: string): {
    action: string;
    attributes: {
        device_type: string;
        media_type: string;
    };
};
/**
 * Creates an event indicating that an action related to E2EE occurred.
 *
 * @param {string} action - The action which occurred.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createE2EEEvent(action: string): {
    action: string;
    actionSubject: string;
};
/**
 * Creates an event which specifies that the feedback dialog has been opened.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createFeedbackOpenEvent(): {
    action: string;
};
/**
 * Creates an event for an action regarding the AddPeopleDialog (invites).
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createInviteDialogEvent(action: string, actionSubject: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
};
/**
 * Creates an event which reports about the current network information reported by the operating system.
 *
 * @param {boolean} isOnline - Tells whether or not the internet is reachable.
 * @param {string} [networkType] - Network type, see {@code NetworkInfo} type defined by the 'base/net-info' feature.
 * @param {Object} [details] - Extra info, see {@code NetworkInfo} type defined by the 'base/net-info' feature.
 * @returns {Object}
 */
export declare function createNetworkInfoEvent({ isOnline, networkType, details }: {
    details?: Object;
    isOnline: boolean;
    networkType?: string;
}): {
    action: string;
    attributes: {
        details?: Object | undefined;
        isOnline: boolean;
        networkType?: string | undefined;
    };
};
/**
 * Creates a "not allowed error" event.
 *
 * @param {string} type - The type of the error.
 * @param {string} reason - The reason for the error.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createNotAllowedErrorEvent(type: string, reason: string): {
    action: string;
    attributes: {
        reason: string;
        type: string;
    };
};
/**
 * Creates an "offer/answer failure" event.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createOfferAnswerFailedEvent(): {
    action: string;
};
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
export declare function createPageReloadScheduledEvent(reason: string, timeout: number, details?: Object): {
    action: string;
    attributes: {
        constructor: Function;
        toString(): string;
        toLocaleString(): string;
        valueOf(): Object;
        hasOwnProperty(v: PropertyKey): boolean;
        isPrototypeOf(v: Object): boolean;
        propertyIsEnumerable(v: PropertyKey): boolean;
        reason: string;
        timeout: number;
    };
};
/**
 * Creates a "pinned" or "unpinned" event.
 *
 * @param {string} action - The action ("pinned" or "unpinned").
 * @param {string} participantId - The ID of the participant which was pinned.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createPinnedEvent(action: string, participantId: string, attributes?: {}): {
    type: string;
    action: string;
    actionSubject: string;
    objectType: string;
    objectId: string;
    attributes: {};
};
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
export declare function createPollEvent(action: string): {
    action: string;
};
/**
 * Creates an event which indicates that a button in the profile panel was
 * clicked.
 *
 * @param {string} buttonName - The name of the button.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createProfilePanelButtonEvent(buttonName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
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
export declare function createRecordingDialogEvent(dialogName: string, buttonName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
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
export declare function createLiveStreamingDialogEvent(dialogName: string, buttonName: string): {
    action: string;
    actionSubject: string;
    source: string;
    type: string;
};
/**
 * Creates an event with the local tracks duration.
 *
 * @param {Object} duration - The object with the duration of the local tracks.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createLocalTracksDurationEvent(duration: {
    audio: {
        value: number;
    };
    conference: {
        value: number;
    };
    video: {
        camera: {
            value: number;
        };
        desktop: {
            value: number;
        };
    };
}): {
    action: string;
    attributes: {
        audio: number;
        camera: number;
        conference: number;
        desktop: number;
    };
};
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
export declare function createRecordingEvent(action: string, type: string, value?: number): {
    action: string;
    actionSubject: string;
    attributes: {
        value: number | undefined;
    };
};
/**
 * Creates an event which indicates that the same conference has been rejoined.
 *
 * @param {string} url - The full conference URL.
 * @param {number} lastConferenceDuration - How many seconds user stayed in the previous conference.
 * @param {number} timeSinceLeft - How many seconds since the last conference was left.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
export declare function createRejoinedEvent({ url, lastConferenceDuration, timeSinceLeft }: {
    lastConferenceDuration: number;
    timeSinceLeft: number;
    url: string;
}): {
    action: string;
    attributes: {
        lastConferenceDuration: number;
        timeSinceLeft: number;
        url: string;
    };
};
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
export declare function createRemoteMuteConfirmedEvent(participantId: string, mediaType: string): {
    action: string;
    attributes: {
        participant_id: string;
        media_type: string;
    };
    source: string;
    type: string;
};
/**
 * Creates an event which indicates that one of the buttons in the "remote
 * video menu" was clicked.
 *
 * @param {string} buttonName - The name of the button.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createRemoteVideoMenuButtonEvent(buttonName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * The rtcstats websocket onclose event. We send this to amplitude in order
 * to detect trace ws prematurely closing.
 *
 * @param {Object} closeEvent - The event with which the websocket closed.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createRTCStatsTraceCloseEvent(closeEvent: {
    code: string;
    reason: string;
}): {
    action: string;
    code?: string | undefined;
    reason?: string | undefined;
    source: string;
};
/**
 * Creates an event indicating that an action related to screen sharing
 * occurred (e.g. It was started or stopped).
 *
 * @param {string} action - The action which occurred.
 * @param {number?} value - The screenshare duration in seconds.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createScreenSharingEvent(action: string, value?: null): {
    action: string;
    actionSubject: string;
    attributes: {
        value: null;
    };
};
/**
 * Creates an event which indicates the screen sharing video is not displayed when it needs to be displayed.
 *
 * @param {Object} attributes - Additional information that describes the issue.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
export declare function createScreenSharingIssueEvent(attributes?: {}): {
    action: string;
    attributes: {};
};
/**
 * Creates an event associated with the "shared video" feature.
 *
 * @param {string} action - The action that the event represents.
 * @param {Object} attributes - Attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createSharedVideoEvent(action: string, attributes?: {}): {
    action: string;
    attributes: {};
    actionSubject: string;
};
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
export declare function createShortcutEvent(shortcut: string, action?: string, attributes?: {}, source?: string): {
    action: string;
    actionSubjectId: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event which indicates the "start audio only" configuration.
 *
 * @param {boolean} audioOnly - Whether "start audio only" is enabled or not.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createStartAudioOnlyEvent(audioOnly: boolean): {
    action: string;
    attributes: {
        enabled: boolean;
    };
};
/**
 * Creates an event which indicates the "start silent" configuration.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createStartSilentEvent(): {
    action: string;
};
/**
 * Creates an event which indicates that HTMLAudioElement.play has failed.
 *
 * @param {string} elementID - The ID of the HTMLAudioElement.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
export declare function createAudioPlayErrorEvent(elementID: string): {
    action: string;
    attributes: {
        elementID: string;
    };
};
/**
 * Creates an event which indicates that HTMLAudioElement.play has succeeded after a prior failure.
 *
 * @param {string} elementID - The ID of the HTMLAudioElement.
 * @returns {Object} The event in a format suitable for sending via sendAnalytics.
 */
export declare function createAudioPlaySuccessEvent(elementID: string): {
    action: string;
    attributes: {
        elementID: string;
    };
};
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
export declare function createStartMutedConfigurationEvent(source: string, audioMute: boolean, videoMute: boolean): {
    action: string;
    attributes: {
        source: string;
        audio_mute: boolean;
        video_mute: boolean;
    };
};
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
export declare function createSyncTrackStateEvent(mediaType: string, muted: boolean): {
    action: string;
    attributes: {
        media_type: string;
        muted: boolean;
    };
};
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
export declare function createToolbarEvent(buttonName: string, attributes?: {}): {
    action: string;
    actionSubject: string;
    attributes: {};
    source: string;
    type: string;
};
/**
 * Creates an event associated with a reaction button being clicked/pressed.
 *
 * @param {string} buttonName - The identifier of the reaction button which was
 * clicked/pressed.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createReactionMenuEvent(buttonName: string): {
    action: string;
    actionSubject: string;
    source: string;
    buttonName: string;
    type: string;
};
/**
 * Creates an event associated with disabling of reaction sounds.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createReactionSoundsDisabledEvent(): {
    action: string;
    actionSubject: string;
    source: string;
    type: string;
};
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
export declare function createTrackMutedEvent(mediaType: string, reason: string, muted?: boolean): {
    action: string;
    attributes: {
        media_type: string;
        muted: boolean;
        reason: string;
    };
};
/**
 * Creates an event for joining a vpaas conference.
 *
 * @param {string} tenant - The conference tenant.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createVpaasConferenceJoinedEvent(tenant: string): {
    action: string;
    attributes: {
        tenant: string;
    };
};
/**
 * Creates an event for an action on the welcome page.
 *
 * @param {string} action - The action that the event represents.
 * @param {string} actionSubject - The subject that was acted upon.
 * @param {boolean} attributes - Additional attributes to attach to the event.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createWelcomePageEvent(action: string, actionSubject?: string, attributes?: {}): {
    action: string;
    actionSubject: string | undefined;
    attributes: {};
    source: string;
};
/**
 * Creates an event which indicates a screenshot of the screensharing has been taken.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createScreensharingCaptureTakenEvent(): {
    action: string;
};
/**
 * Creates an event for an action on breakout rooms.
 *
 * @param {string} actionSubject - The subject that was acted upon.
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createBreakoutRoomsEvent(actionSubject: string): {
    action: string;
    actionSubject: string;
    source: string;
};
/**
 * Creates an event which indicates a GIF was sent.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createGifSentEvent(): {
    action: string;
};
/**
 * Creates an event which indicates the whiteboard was opened.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createOpenWhiteboardEvent(): {
    action: string;
};
/**
 * Creates an event which indicates the whiteboard limit was enforced.
 *
 * @returns {Object} The event in a format suitable for sending via
 * sendAnalytics.
 */
export declare function createRestrictWhiteboardEvent(): {
    action: string;
};
