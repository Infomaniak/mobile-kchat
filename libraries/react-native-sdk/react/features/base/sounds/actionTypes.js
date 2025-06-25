"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UNREGISTER_SOUND = exports.STOP_SOUND = exports.REGISTER_SOUND = exports.PLAY_SOUND = exports._REMOVE_AUDIO_ELEMENT = exports._ADD_AUDIO_ELEMENT = void 0;
/**
 * The type of a feature/internal/protected (redux) action to add an audio
 * element to the sounds collection state.
 *
 * {
 *     type: _ADD_AUDIO_ELEMENT,
 *     ref: AudioElement,
 *     soundId: string
 * }
 */
exports._ADD_AUDIO_ELEMENT = '_ADD_AUDIO_ELEMENT';
/**
 * The type of feature/internal/protected (redux) action to remove an audio
 * element for given sound identifier from the sounds collection state.
 *
 * {
 *     type: _REMOVE_AUDIO_ELEMENT,
 *     soundId: string
 * }
 */
exports._REMOVE_AUDIO_ELEMENT = '_REMOVE_AUDIO_ELEMENT';
/**
 * The type of (redux) action to play a sound from the sounds collection.
 *
 * {
 *     type: PLAY_SOUND,
 *     soundId: string
 * }
 */
exports.PLAY_SOUND = 'PLAY_SOUND';
/**
 * The type of (redux) action to register a new sound with the sounds
 * collection.
 *
 * {
 *     type: REGISTER_SOUND,
 *     soundId: string
 * }
 */
exports.REGISTER_SOUND = 'REGISTER_SOUND';
/**
 * The type of (redux) action to stop a sound from the sounds collection.
 *
 * {
 *     type: STOP_SOUND,
 *     soundId: string
 * }
 */
exports.STOP_SOUND = 'STOP_SOUND';
/**
 * The type of (redux) action to unregister an existing sound from the sounds
 * collection.
 *
 * {
 *     type: UNREGISTER_SOUND,
 *     soundId: string
 * }
 */
exports.UNREGISTER_SOUND = 'UNREGISTER_SOUND';
