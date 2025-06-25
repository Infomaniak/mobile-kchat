"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_1 = require("./actionTypes");
/**
 * Initial/default state of the feature {@code base/sounds}. It is a {@code Map}
 * of globally stored sounds.
 *
 * @type {Map<string, Sound>}
 */
const DEFAULT_STATE = new Map();
/**
 * The base/sounds feature's reducer.
 */
ReducerRegistry_1.default.register('features/base/sounds', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case actionTypes_1._ADD_AUDIO_ELEMENT:
        case actionTypes_1._REMOVE_AUDIO_ELEMENT:
            return _addOrRemoveAudioElement(state, action);
        case actionTypes_1.REGISTER_SOUND:
            return _registerSound(state, action);
        case actionTypes_1.UNREGISTER_SOUND:
            return _unregisterSound(state, action);
        default:
            return state;
    }
});
/**
 * Adds or removes {@link AudioElement} associated with a {@link Sound}.
 *
 * @param {Map<string, Sound>} state - The current Redux state of this feature.
 * @param {_ADD_AUDIO_ELEMENT | _REMOVE_AUDIO_ELEMENT} action - The action to be
 * handled.
 * @private
 * @returns {Map<string, Sound>}
 */
function _addOrRemoveAudioElement(state, action) {
    const isAddAction = action.type === actionTypes_1._ADD_AUDIO_ELEMENT;
    const nextState = new Map(state);
    const { soundId } = action;
    const sound = nextState.get(soundId);
    if (sound) {
        if (isAddAction) {
            nextState.set(soundId, (0, functions_1.assign)(sound, {
                audioElement: action.audioElement
            }));
        }
        else {
            nextState.set(soundId, (0, functions_1.assign)(sound, {
                audioElement: undefined
            }));
        }
    }
    return nextState;
}
/**
 * Registers a new {@link Sound} for given id and source. It will make
 * the {@link SoundCollection} component render HTMLAudioElement for given
 * source making it available for playback through the redux actions.
 *
 * @param {Map<string, Sound>} state - The current Redux state of the sounds
 * features.
 * @param {REGISTER_SOUND} action - The register sound action.
 * @private
 * @returns {Map<string, Sound>}
 */
function _registerSound(state, action) {
    const nextState = new Map(state);
    nextState.set(action.soundId, {
        src: action.src,
        options: action.options
    });
    return nextState;
}
/**
 * Unregisters a {@link Sound} which will make the {@link SoundCollection}
 * component stop rendering the corresponding HTMLAudioElement. This will
 * result further in the audio resource disposal.
 *
 * @param {Map<string, Sound>} state - The current Redux state of this feature.
 * @param {UNREGISTER_SOUND} action - The unregister sound action.
 * @private
 * @returns {Map<string, Sound>}
 */
function _unregisterSound(state, action) {
    const nextState = new Map(state);
    nextState.delete(action.soundId);
    return nextState;
}
