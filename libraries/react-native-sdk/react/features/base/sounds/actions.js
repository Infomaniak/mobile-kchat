"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unregisterSound = exports.stopSound = exports.registerSound = exports.playSound = exports._removeAudioElement = exports._addAudioElement = void 0;
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
const functions_any_1 = require("./functions.any");
/**
 * Adds {@link AudioElement} instance to the base/sounds feature state for the
 * {@link Sound} instance identified by the given id. After this action the
 * sound can be played by dispatching the {@link PLAY_SOUND} action.
 *
 * @param {string} soundId - The sound identifier for which the audio element
 * will be stored.
 * @param {AudioElement} audioElement - The audio element which implements the
 * audio playback functionality and which is backed by the sound resource
 * corresponding to the {@link Sound} with the given id.
 * @protected
 * @returns {{
 *     type: PLAY_SOUND,
 *     audioElement: AudioElement,
 *     soundId: string
 * }}
 */
function _addAudioElement(soundId, audioElement) {
    return {
        type: actionTypes_1._ADD_AUDIO_ELEMENT,
        audioElement,
        soundId
    };
}
exports._addAudioElement = _addAudioElement;
/**
 * The opposite of {@link _addAudioElement} which removes {@link AudioElement}
 * for given sound from base/sounds state. It means that the audio resource has
 * been disposed and the sound can no longer be played.
 *
 * @param {string} soundId - The {@link Sound} instance identifier for which the
 * audio element is being removed.
 * @protected
 * @returns {{
 *     type: _REMOVE_AUDIO_ELEMENT,
 *     soundId: string
 * }}
 */
function _removeAudioElement(soundId) {
    return {
        type: actionTypes_1._REMOVE_AUDIO_ELEMENT,
        soundId
    };
}
exports._removeAudioElement = _removeAudioElement;
/**
 * Starts playback of the sound identified by the given sound id. The action
 * will have effect only if the audio resource has been loaded already.
 *
 * @param {string} soundId - The id of the sound to be played (the same one
 * which was used in {@link registerSound} to register the sound).
 * @returns {Function}
 */
function playSound(soundId) {
    return (dispatch, getState) => {
        const disabledSounds = (0, functions_any_1.getDisabledSounds)(getState());
        if (!disabledSounds.includes(soundId) && !disabledSounds.find(id => soundId.startsWith(id))) {
            dispatch({
                type: actionTypes_1.PLAY_SOUND,
                soundId
            });
        }
    };
}
exports.playSound = playSound;
/**
 * Registers a new sound for given id and a source object which can be either a
 * path or a raw object depending on the platform (native vs web). It will make
 * the {@link SoundCollection} render extra HTMLAudioElement which will make it
 * available for playback through the {@link playSound} action.
 *
 * @param {string} soundId - The global identifier which identify the sound
 * created for given source object.
 * @param {string} soundName - The name of bundled audio file that will be
 * associated with the given {@code soundId}.
 * @param {Object} options - Optional parameters.
 * @param {boolean} options.loop - True in order to loop the sound.
 * @returns {{
 *     type: REGISTER_SOUND,
 *     soundId: string,
 *     src: string,
 *     options: {
 *          loop: boolean
 *     }
 * }}
 */
function registerSound(soundId, soundName, options = {}) {
    return {
        type: actionTypes_1.REGISTER_SOUND,
        soundId,
        src: `${(0, functions_1.getSoundsPath)()}/${soundName}`,
        options
    };
}
exports.registerSound = registerSound;
/**
 * Stops playback of the sound identified by the given sound id.
 *
 * @param {string} soundId - The id of the sound to be stopped (the same one
 * which was used in {@link registerSound} to register the sound).
 * @returns {{
 *     type: STOP_SOUND,
 *     soundId: string
 * }}
 */
function stopSound(soundId) {
    return {
        type: actionTypes_1.STOP_SOUND,
        soundId
    };
}
exports.stopSound = stopSound;
/**
 * Unregister the sound identified by the given id. It will make the
 * {@link SoundCollection} component stop rendering the corresponding
 * {@code HTMLAudioElement} which then should result in the audio resource
 * disposal.
 *
 * @param {string} soundId - The identifier of the {@link Sound} to be removed.
 * @returns {{
 *     type: UNREGISTER_SOUND,
 *     soundId: string
 * }}
 */
function unregisterSound(soundId) {
    return {
        type: actionTypes_1.UNREGISTER_SOUND,
        soundId
    };
}
exports.unregisterSound = unregisterSound;
