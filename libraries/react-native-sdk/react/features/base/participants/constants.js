"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WHITEBOARD_PARTICIPANT_ICON = exports.LOWER_HAND_AUDIO_LEVEL = exports.PARTICIPANT_ROLE = exports.PARTICIPANT_LEFT_SOUND_ID = exports.PARTICIPANT_JOINED_SOUND_ID = exports.MAX_DISPLAY_NAME_LENGTH = exports.LOCAL_PARTICIPANT_DEFAULT_ID = exports.JIGASI_PARTICIPANT_ICON = exports.DISCO_REMOTE_CONTROL_FEATURE = exports.DEFAULT_AVATAR_RELATIVE_PATH = void 0;
const svg_1 = require("../icons/svg");
/**
 * The relative path to the default/stock avatar (image) file used on both
 * Web/React and mobile/React Native (for the purposes of consistency).
 *
 * XXX (1) Web/React utilizes relativity on the Jitsi Meet deployment.
 * (2) Mobile/React Native utilizes relativity on the local file system at build
 * time. Unfortunately, the packager of React Native cannot deal with the
 * {@code const} early enough for {@code require} to succeed at runtime.
 * Anyway, be sure to synchronize the relative path on Web and mobile for the
 * purposes of consistency.
 *
 * @type {string}
 */
exports.DEFAULT_AVATAR_RELATIVE_PATH = 'images/avatar.png';
/**
 * The value for the "var" attribute of feature tag in disco-info packets.
 */
exports.DISCO_REMOTE_CONTROL_FEATURE = 'http://jitsi.org/meet/remotecontrol';
/**
 * Icon URL for jigasi participants.
 *
 * @type {string}
 */
exports.JIGASI_PARTICIPANT_ICON = svg_1.IconPhoneRinging;
/**
 * The local participant might not have real ID until she joins a conference,
 * so use 'local' as her default ID.
 *
 * @type {string}
 */
exports.LOCAL_PARTICIPANT_DEFAULT_ID = 'local';
/**
 * Max length of the display names.
 *
 * @type {string}
 */
exports.MAX_DISPLAY_NAME_LENGTH = 50;
/**
 * The identifier of the sound to be played when new remote participant joins
 * the room.
 *
 * @type {string}
 */
exports.PARTICIPANT_JOINED_SOUND_ID = 'PARTICIPANT_JOINED_SOUND';
/**
 * The identifier of the sound to be played when remote participant leaves
 * the room.
 *
 * @type {string}
 */
exports.PARTICIPANT_LEFT_SOUND_ID = 'PARTICIPANT_LEFT_SOUND';
/**
 * The set of possible XMPP MUC roles for conference participants.
 *
 * @enum {string}
 */
exports.PARTICIPANT_ROLE = {
    MODERATOR: 'moderator',
    NONE: 'none',
    PARTICIPANT: 'participant'
};
/**
 * The audio level at which the hand will be lowered if raised.
 *
 * @type {string}
 */
exports.LOWER_HAND_AUDIO_LEVEL = 0.2;
/**
 * Icon URL for the whiteboard participant.
 */
exports.WHITEBOARD_PARTICIPANT_ICON = svg_1.IconWhiteboard;
