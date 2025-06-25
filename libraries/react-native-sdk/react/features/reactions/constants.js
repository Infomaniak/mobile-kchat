"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REACTIONS = exports.SOUNDS_THRESHOLDS = exports.RAISE_HAND_SOUND_ID = exports.SILENCE_SOUND_ID = exports.SURPRISE_SOUND_ID = exports.BOO_SOUND_ID = exports.LIKE_SOUND_ID = exports.CLAP_SOUND_ID = exports.LAUGH_SOUND_ID = exports.REACTION_SOUND = exports.MUTE_REACTIONS_COMMAND = exports.ENDPOINT_REACTION_NAME = exports.REACTIONS_MENU_HEIGHT_IN_OVERFLOW_MENU = exports.REACTIONS_MENU_HEIGHT_DRAWER = exports.GIFS_MENU_HEIGHT_IN_OVERFLOW_MENU = exports.RAISE_HAND_ROW_HEIGHT = void 0;
const sounds_1 = require("./sounds");
/**
 * The height of the raise hand row in the reactions menu.
 */
exports.RAISE_HAND_ROW_HEIGHT = 54;
/**
 * The height of the gifs menu when displayed as part of the overflow menu.
 */
exports.GIFS_MENU_HEIGHT_IN_OVERFLOW_MENU = 200;
/**
 * Reactions menu height when displayed as part of drawer.
 */
exports.REACTIONS_MENU_HEIGHT_DRAWER = 144;
/**
 * Reactions menu height when displayed as part of overflow menu.
 */
exports.REACTIONS_MENU_HEIGHT_IN_OVERFLOW_MENU = 106;
/**
 * The payload name for the datachannel/endpoint reaction event.
 */
exports.ENDPOINT_REACTION_NAME = 'endpoint-reaction';
/**
 * The (name of the) command which transports the state (represented by
 * {State} for the local state at the time of this writing) of a {MuteReactions}
 * (instance) between moderator and participants.
 */
exports.MUTE_REACTIONS_COMMAND = 'mute-reactions';
/**
 * The prefix for all reaction sound IDs. Also the ID used in config to disable reaction sounds.
 */
exports.REACTION_SOUND = 'REACTION_SOUND';
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new laugh reaction is received.
 *
 * @type { string }
 */
exports.LAUGH_SOUND_ID = `${exports.REACTION_SOUND}_LAUGH_`;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new clap reaction is received.
 *
 * @type {string}
 */
exports.CLAP_SOUND_ID = `${exports.REACTION_SOUND}_CLAP_`;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new like reaction is received.
 *
 * @type {string}
 */
exports.LIKE_SOUND_ID = `${exports.REACTION_SOUND}_LIKE_`;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new boo reaction is received.
 *
 * @type {string}
 */
exports.BOO_SOUND_ID = `${exports.REACTION_SOUND}_BOO_`;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new surprised reaction is received.
 *
 * @type {string}
 */
exports.SURPRISE_SOUND_ID = `${exports.REACTION_SOUND}_SURPRISE_`;
/**
 * The audio ID prefix of the audio element for which the {@link playAudio} action is
 * triggered when a new silence reaction is received.
 *
 * @type {string}
 */
exports.SILENCE_SOUND_ID = `${exports.REACTION_SOUND}_SILENCE_`;
/**
 * The audio ID of the audio element for which the {@link playAudio} action is
 * triggered when a new raise hand event is received.
 *
 * @type {string}
 */
exports.RAISE_HAND_SOUND_ID = 'RAISE_HAND_SOUND';
exports.SOUNDS_THRESHOLDS = [1, 4, 10];
exports.REACTIONS = {
    like: {
        message: ':thumbs_up:',
        emoji: '👍',
        shortcutChar: 'T',
        soundId: exports.LIKE_SOUND_ID,
        soundFiles: sounds_1.LIKE_SOUND_FILES
    },
    clap: {
        message: ':clap:',
        emoji: '👏',
        shortcutChar: 'C',
        soundId: exports.CLAP_SOUND_ID,
        soundFiles: sounds_1.CLAP_SOUND_FILES
    },
    laugh: {
        message: ':grinning_face:',
        emoji: '😀',
        shortcutChar: 'L',
        soundId: exports.LAUGH_SOUND_ID,
        soundFiles: sounds_1.LAUGH_SOUND_FILES
    },
    surprised: {
        message: ':face_with_open_mouth:',
        emoji: '😮',
        shortcutChar: 'O',
        soundId: exports.SURPRISE_SOUND_ID,
        soundFiles: sounds_1.SURPRISE_SOUND_FILES
    },
    boo: {
        message: ':slightly_frowning_face:',
        emoji: '🙁',
        shortcutChar: 'B',
        soundId: exports.BOO_SOUND_ID,
        soundFiles: sounds_1.BOO_SOUND_FILES
    },
    silence: {
        message: ':face_without_mouth:',
        emoji: '😶',
        shortcutChar: 'S',
        soundId: exports.SILENCE_SOUND_ID,
        soundFiles: sounds_1.SILENCE_SOUND_FILES
    }
};
