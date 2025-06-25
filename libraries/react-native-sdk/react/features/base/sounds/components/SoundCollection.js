"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapDispatchToProps = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const index_1 = require("../../media/components/index");
const actions_1 = require("../actions");
/**
 * Collections of all global sounds used by the app for playing audio
 * notifications in response to various events. It renders <code>Audio</code>
 * element for each sound registered in the base/sounds feature. When the audio
 * resource is loaded it will emit add/remove audio element actions which will
 * attach the element to the corresponding {@link Sound} instance in the Redux
 * state. When that happens the sound can be played using the {@link playSound}
 * action.
 */
class SoundCollection extends react_1.Component {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        let key = 0;
        const sounds = [];
        for (const [soundId, sound] of this.props._sounds.entries()) {
            const { options, src } = sound;
            sounds.push(react_1.default.createElement(index_1.Audio, {
                key,
                setRef: this._setRef.bind(this, soundId),
                src,
                loop: options?.loop
            }));
            key += 1;
        }
        return sounds;
    }
    /**
     * Set the (reference to the) {@link AudioElement} object which implements
     * the audio playback functionality.
     *
     * @param {string} soundId - The sound Id for the audio element for which
     * the callback is being executed.
     * @param {AudioElement} element - The {@link AudioElement} instance
     * which implements the audio playback functionality.
     * @protected
     * @returns {void}
     */
    _setRef(soundId, element) {
        if (element) {
            this.props._addAudioElement(soundId, element);
        }
        else {
            this.props._removeAudioElement(soundId);
        }
    }
}
/**
 * Maps (parts of) the Redux state to {@code SoundCollection}'s props.
 *
 * @param {Object} state - The redux state.
 * @private
 * @returns {{
 *     _sounds: Map<string, Sound>
 * }}
 */
function _mapStateToProps(state) {
    return {
        _sounds: state['features/base/sounds']
    };
}
/**
 * Maps dispatching of some actions to React component props.
 *
 * @param {Function} dispatch - Redux action dispatcher.
 * @private
 * @returns {{
 *     _addAudioElement: void,
 *     _removeAudioElement: void
 * }}
 */
function _mapDispatchToProps(dispatch) {
    return {
        /**
         * Dispatches action to store the {@link AudioElement} for
         * a {@link Sound} identified by given <tt>soundId</tt> in the Redux
         * store, so that the playback can be controlled through the Redux
         * actions.
         *
         * @param {string} soundId - A global identifier which will be used to
         * identify the {@link Sound} instance for which an audio element will
         * be added.
         * @param {AudioElement} audioElement - The {@link AudioElement}
         * instance that will be stored in the Redux state of the base/sounds
         * feature, as part of the {@link Sound} object. At that point the sound
         * will be ready for playback.
         * @private
         * @returns {void}
         */
        _addAudioElement(soundId, audioElement) {
            dispatch((0, actions_1._addAudioElement)(soundId, audioElement));
        },
        /**
         * Dispatches action to remove {@link AudioElement} from the Redux
         * store for specific {@link Sound}, because it is no longer part of
         * the DOM tree and the audio resource will be released.
         *
         * @param {string} soundId - The id of the {@link Sound} instance for
         * which an {@link AudioElement} will be removed from the Redux store.
         * @private
         * @returns {void}
         */
        _removeAudioElement(soundId) {
            dispatch((0, actions_1._removeAudioElement)(soundId));
        }
    };
}
exports._mapDispatchToProps = _mapDispatchToProps;
exports.default = (0, react_redux_1.connect)(_mapStateToProps, _mapDispatchToProps)(SoundCollection);
