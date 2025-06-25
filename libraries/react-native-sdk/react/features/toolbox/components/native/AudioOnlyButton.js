"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../../base/audio-only/actions");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
/**
 * An implementation of a button for toggling the audio-only mode.
 */
class AudioOnlyButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.audioOnly';
        this.icon = svg_1.IconAudioOnly;
        this.label = 'toolbar.audioOnlyOn';
        this.toggledIcon = svg_1.IconAudioOnlyOff;
        this.toggledLabel = 'toolbar.audioOnlyOff';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { _audioOnly, _startCarMode, dispatch } = this.props;
        if (!_audioOnly && _startCarMode) {
            dispatch((0, actions_1.setAudioOnly)(true));
            (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.carmode);
        }
        else {
            dispatch((0, actions_1.toggleAudioOnly)());
        }
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._audioOnly;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code AudioOnlyButton} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @private
 * @returns {{
 *     _audioOnly: boolean
 * }}
 */
function _mapStateToProps(state, ownProps) {
    const { enabled: audioOnly } = state['features/base/audio-only'];
    const enabledInFeatureFlags = (0, functions_1.getFeatureFlag)(state, constants_1.AUDIO_ONLY_BUTTON_ENABLED, true);
    const { startCarMode } = state['features/base/settings'];
    const { visible = enabledInFeatureFlags } = ownProps;
    return {
        _audioOnly: Boolean(audioOnly),
        _startCarMode: startCarMode,
        visible
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(AudioOnlyButton));
