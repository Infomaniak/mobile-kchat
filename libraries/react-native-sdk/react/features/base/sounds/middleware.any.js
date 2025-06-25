"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const functions_1 = require("../../../features/e2ee/functions");
const functions_2 = require("../../../features/recording/functions");
const constants_1 = require("../media/constants");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const StateListenerRegistry_1 = __importDefault(require("../redux/StateListenerRegistry"));
const actionTypes_1 = require("./actionTypes");
const logger_1 = __importDefault(require("./logger"));
/**
 * Implements the entry point of the middleware of the feature base/sounds.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    switch (action.type) {
        case actionTypes_1.PLAY_SOUND:
            _playSound(store, action.soundId);
            break;
        case actionTypes_1.STOP_SOUND:
            _stopSound(store, action.soundId);
            break;
    }
    return next(action);
});
/**
 * Plays sound from audio element registered in the Redux store.
 *
 * @param {Store} store - The Redux store instance.
 * @param {string} soundId - Audio element identifier.
 * @private
 * @returns {void}
 */
function _playSound({ getState }, soundId) {
    const sounds = getState()['features/base/sounds'];
    const sound = sounds.get(soundId);
    if (sound) {
        if (sound.audioElement) {
            sound.audioElement.play();
        }
        else {
            logger_1.default.warn(`PLAY_SOUND: sound not loaded yet for id: ${soundId}`);
        }
    }
    else {
        logger_1.default.warn(`PLAY_SOUND: no sound found for id: ${soundId}`);
    }
}
/**
 * Stop sound from audio element registered in the Redux store.
 *
 * @param {Store} store - The Redux store instance.
 * @param {string} soundId - Audio element identifier.
 * @private
 * @returns {void}
 */
function _stopSound({ getState }, soundId) {
    const sounds = getState()['features/base/sounds'];
    const sound = sounds.get(soundId);
    if (sound) {
        const { audioElement } = sound;
        if (audioElement) {
            audioElement.stop();
        }
        else {
            logger_1.default.warn(`STOP_SOUND: sound not loaded yet for id: ${soundId}`);
        }
    }
    else {
        logger_1.default.warn(`STOP_SOUND: no sound found for id: ${soundId}`);
    }
}
/**
 * Returns whether the language is supported for audio messages.
 *
 * @param {string} language - The requested language.
 * @returns {boolean}
 */
function isLanguageSupported(language) {
    return Boolean(constants_1.AudioSupportedLanguage[language]);
}
/**
 * Checking if it's necessary to reload the translated files.
 *
 * @param {string} language - The next language.
 * @param {string} prevLanguage - The previous language.
 * @returns {boolean}
 */
function shouldReloadAudioFiles(language, prevLanguage) {
    const isNextLanguageSupported = isLanguageSupported(language);
    const isPrevLanguageSupported = isLanguageSupported(prevLanguage);
    return (
    // From an unsupported language (which defaulted to English) to a supported language (that isn't English).
    isNextLanguageSupported && language !== constants_1.AudioSupportedLanguage.en && !isPrevLanguageSupported) || (
    // From a supported language (that wasn't English) to English.
    !isNextLanguageSupported && isPrevLanguageSupported && prevLanguage !== constants_1.AudioSupportedLanguage.en) || (
    // From a supported language to another.
    isNextLanguageSupported && isPrevLanguageSupported);
}
/**
 * Set up state change listener for language.
 */
StateListenerRegistry_1.default.register(() => i18next_1.default.language, (language, { dispatch }, prevLanguage) => {
    if (language !== prevLanguage && shouldReloadAudioFiles(language, prevLanguage)) {
        (0, functions_1.registerE2eeAudioFiles)(dispatch, true);
        (0, functions_2.registerRecordingAudioFiles)(dispatch, true);
    }
});
