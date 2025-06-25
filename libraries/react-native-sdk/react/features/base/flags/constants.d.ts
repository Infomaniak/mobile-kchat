/**
 * Flag indicating if add-people functionality should be enabled.
 * Default: enabled (true).
 */
export declare const ADD_PEOPLE_ENABLED = "add-people.enabled";
/**
 * Flag indicating if the SDK should not require the audio focus.
 * Used by apps that do not use Jitsi audio.
 * Default: disabled (false).
 */
export declare const AUDIO_FOCUS_DISABLED = "audio-focus.disabled";
/**
 * Flag indicating if the audio mute button should be displayed.
 * Default: enabled (true).
 */
export declare const AUDIO_MUTE_BUTTON_ENABLED = "audio-mute.enabled";
/**
 * Flag indicating that the Audio only button in the overflow menu is enabled.
 * Default: enabled (true).
 */
export declare const AUDIO_ONLY_BUTTON_ENABLED = "audio-only.enabled";
/**
 * Flag indicating that the Breakout Rooms button in the overflow menu is enabled.
 * Default: enabled (true).
 */
export declare const BREAKOUT_ROOMS_BUTTON_ENABLED = "breakout-rooms.enabled";
/**
 * Flag indicating if calendar integration should be enabled.
 * Default: enabled (true) on Android, auto-detected on iOS.
 */
export declare const CALENDAR_ENABLED = "calendar.enabled";
/**
 * Flag indicating if call integration (CallKit on iOS, ConnectionService on Android)
 * should be enabled.
 * Default: enabled (true).
 */
export declare const CALL_INTEGRATION_ENABLED = "call-integration.enabled";
/**
 * Flag indicating if car mode should be enabled.
 * Default: enabled (true).
 */
export declare const CAR_MODE_ENABLED = "car-mode.enabled";
/**
 * Flag indicating if close captions should be enabled.
 * Default: enabled (true).
 */
export declare const CLOSE_CAPTIONS_ENABLED = "close-captions.enabled";
/**
 * Flag indicating if conference timer should be enabled.
 * Default: enabled (true).
 */
export declare const CONFERENCE_TIMER_ENABLED = "conference-timer.enabled";
/**
 * Flag indicating if chat should be enabled.
 * Default: enabled (true).
 */
export declare const CHAT_ENABLED = "chat.enabled";
/**
 * Flag indicating if the filmstrip should be enabled.
 * Default: enabled (true).
 */
export declare const FILMSTRIP_ENABLED = "filmstrip.enabled";
/**
 * Flag indicating if fullscreen (immersive) mode should be enabled.
 * Default: enabled (true).
 */
export declare const FULLSCREEN_ENABLED = "fullscreen.enabled";
/**
 * Flag indicating if the Help button should be enabled.
 * Default: enabled (true).
 */
export declare const HELP_BUTTON_ENABLED = "help.enabled";
/**
 * Flag indicating if invite functionality should be enabled.
 * Default: enabled (true).
 */
export declare const INVITE_ENABLED = "invite.enabled";
/**
 * Flag indicating if dial-in invite functionality should be enabled.
 * Default: enabled (true).
 */
export declare const INVITE_DIAL_IN_ENABLED = "invite-dial-in.enabled";
/**
 * Flag indicating if recording should be enabled in iOS.
 * Default: disabled (false).
 */
export declare const IOS_RECORDING_ENABLED = "ios.recording.enabled";
/**
 * Flag indicating if screen sharing should be enabled in iOS.
 * Default: disabled (false).
 */
export declare const IOS_SCREENSHARING_ENABLED = "ios.screensharing.enabled";
/**
 * Flag indicating if screen sharing should be enabled in android.
 * Default: enabled (true).
 */
export declare const ANDROID_SCREENSHARING_ENABLED = "android.screensharing.enabled";
/**
 * Flag indicating if speaker statistics should be enabled.
 * Default: enabled (true).
 */
export declare const SPEAKERSTATS_ENABLED = "speakerstats.enabled";
/**
 * Flag indicating if kickout is enabled.
 * Default: enabled (true).
 */
export declare const KICK_OUT_ENABLED = "kick-out.enabled";
/**
 * Flag indicating if live-streaming should be enabled.
 * Default: auto-detected.
 */
export declare const LIVE_STREAMING_ENABLED = "live-streaming.enabled";
/**
 * Flag indicating if lobby mode button should be enabled.
 * Default: enabled.
 */
export declare const LOBBY_MODE_ENABLED = "lobby-mode.enabled";
/**
 * Flag indicating if displaying the meeting name should be enabled.
 * Default: enabled (true).
 */
export declare const MEETING_NAME_ENABLED = "meeting-name.enabled";
/**
 * Flag indicating if the meeting password button should be enabled.
 * Note that this flag just decides on the button, if a meeting has a password
 * set, the password dialog will still show up.
 * Default: enabled (true).
 */
export declare const MEETING_PASSWORD_ENABLED = "meeting-password.enabled";
/**
 * Flag indicating if the notifications should be enabled.
 * Default: enabled (true).
 */
export declare const NOTIFICATIONS_ENABLED = "notifications.enabled";
/**
 * Flag indicating if the audio overflow menu button should be displayed.
 * Default: enabled (true).
 */
export declare const OVERFLOW_MENU_ENABLED = "overflow-menu.enabled";
/**
 * Flag indicating if participants should be enabled.
 * Default: enabled (true).
 */
export declare const PARTICIPANTS_ENABLED = "participants.enabled";
/**
 * Flag indicating if Picture-in-Picture should be enabled.
 * Default: auto-detected.
 */
export declare const PIP_ENABLED = "pip.enabled";
/**
 * Flag indicating if Picture-in-Picture button should be shown while screen sharing.
 * Default: disabled (false).
 */
export declare const PIP_WHILE_SCREEN_SHARING_ENABLED = "pip-while-screen-sharing.enabled";
/**
 * Flag indicating if the prejoin page should be enabled.
 * Default: enabled (true).
 */
export declare const PREJOIN_PAGE_ENABLED = "prejoinpage.enabled";
/**
 * Flag indicating if the participant name editing field should be displayed on the prejoin page.
 * Default: disabled (false).
 */
export declare const PREJOIN_PAGE_HIDE_DISPLAY_NAME = "prejoinpage.hideDisplayName";
/**
 * Flag indicating if raise hand feature should be enabled.
 * Default: enabled.
 */
export declare const RAISE_HAND_ENABLED = "raise-hand.enabled";
/**
 * Flag indicating if the reactions feature should be enabled.
 * Default: enabled (true).
 */
export declare const REACTIONS_ENABLED = "reactions.enabled";
/**
 * Flag indicating if recording should be enabled.
 * Default: auto-detected.
 */
export declare const RECORDING_ENABLED = "recording.enabled";
/**
 * Flag indicating if the user should join the conference with the replaceParticipant functionality.
 * Default: (false).
 */
export declare const REPLACE_PARTICIPANT = "replace.participant";
/**
 * Flag indicating the local and (maximum) remote video resolution. Overrides
 * the server configuration.
 * Default: (unset).
 */
export declare const RESOLUTION = "resolution";
/**
 * Flag indicating if the security options button should be enabled.
 * Default: enabled (true).
 */
export declare const SECURITY_OPTIONS_ENABLED = "security-options.enabled";
/**
 * Flag indicating if server URL change is enabled.
 * Default: enabled (true).
 */
export declare const SERVER_URL_CHANGE_ENABLED = "server-url-change.enabled";
/**
 * Flag indicating if settings should be enabled.
 * Default: enabled (true).
 */
export declare const SETTINGS_ENABLED = "settings.enabled";
/**
 * Flag indicating if tile view feature should be enabled.
 * Default: enabled.
 */
export declare const TILE_VIEW_ENABLED = "tile-view.enabled";
/**
 * Flag indicating if the toolbox should be always be visible
 * Default: disabled (false).
 */
export declare const TOOLBOX_ALWAYS_VISIBLE = "toolbox.alwaysVisible";
/**
 * Flag indicating if the toolbox should be enabled
 * Default: enabled.
 */
export declare const TOOLBOX_ENABLED = "toolbox.enabled";
/**
 * Flag indicating if the unsafe room warning should be enabled.
 * Default: disabled (false).
 */
export declare const UNSAFE_ROOM_WARNING = "unsaferoomwarning.enabled";
/**
 * Flag indicating if the video mute button should be displayed.
 * Default: enabled (true).
 */
export declare const VIDEO_MUTE_BUTTON_ENABLED = "video-mute.enabled";
/**
 * Flag indicating if the video share button should be enabled
 * Default: enabled (true).
 */
export declare const VIDEO_SHARE_BUTTON_ENABLED = "video-share.enabled";
/**
 * Flag indicating if the welcome page should be enabled.
 * Default: disabled (false).
 */
export declare const WELCOME_PAGE_ENABLED = "welcomepage.enabled";
