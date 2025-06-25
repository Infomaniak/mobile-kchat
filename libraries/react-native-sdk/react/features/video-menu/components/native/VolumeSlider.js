"use strict";
/* eslint-disable lines-around-comment*/
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const slider_1 = __importDefault(require("@react-native-community/slider"));
const lodash_1 = __importDefault(require("lodash"));
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const Icon_1 = __importDefault(require("../../../base/icons/components/Icon"));
const svg_1 = require("../../../base/icons/svg");
const constants_1 = require("../../../base/media/constants");
const functions_native_1 = require("../../../base/tracks/functions.native");
const BaseTheme_native_1 = __importDefault(require("../../../base/ui/components/BaseTheme.native"));
const actions_native_1 = require("../../../participants-pane/actions.native");
const constants_2 = require("../../constants");
const styles_1 = __importDefault(require("./styles"));
/**
 * Component that renders the volume slider.
 *
 * @returns {React$Element<any>}
 */
class VolumeSlider extends react_1.PureComponent {
    /**
     * Initializes a new {@code VolumeSlider} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        this.state = {
            volumeLevel: props._volume || Math.ceil(constants_2.NATIVE_VOLUME_SLIDER_SCALE / 2)
        };
        this._originalVolumeChange = this._onVolumeChange;
        this._onVolumeChange = lodash_1.default.throttle(volumeLevel => this._originalVolumeChange(volumeLevel), 500);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _startSilent } = this.props;
        const { volumeLevel } = this.state;
        const onVolumeChange = _startSilent ? undefined : this._onVolumeChange;
        return (<react_native_1.View style={styles_1.default.volumeSliderContainer}>
                <Icon_1.default size={24} src={svg_1.IconVolumeUp}/>
                <slider_1.default maximumTrackTintColor={BaseTheme_native_1.default.palette.ui10} maximumValue={constants_2.NATIVE_VOLUME_SLIDER_SCALE} minimumTrackTintColor={BaseTheme_native_1.default.palette.action01} minimumValue={0} onValueChange={onVolumeChange} style={styles_1.default.sliderContainer} thumbTintColor={BaseTheme_native_1.default.palette.ui10} value={volumeLevel}/>
            </react_native_1.View>);
    }
    /**
     * Sets the internal state of the volume level for the volume slider.
     * Invokes the prop onVolumeChange to notify of volume changes.
     *
     * @param {number} volumeLevel - Selected volume on slider.
     * @private
     * @returns {void}
     */
    _onVolumeChange(volumeLevel) {
        const { _track, dispatch, participantID } = this.props;
        const audioTrack = _track?.jitsiTrack.track;
        let newVolumeLevel;
        if (volumeLevel <= 10) {
            newVolumeLevel = volumeLevel / 10;
        }
        else {
            newVolumeLevel = volumeLevel - 9;
        }
        audioTrack?._setVolume(newVolumeLevel);
        // @ts-ignore
        dispatch((0, actions_native_1.setVolume)(participantID, newVolumeLevel));
    }
}
/**
 * Maps (parts of) the Redux state to the associated props for the
 * {@code VolumeSlider} component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @returns {IProps}
 */
function mapStateToProps(state, ownProps) {
    const { participantID } = ownProps;
    const { participantsVolume } = state['features/filmstrip'];
    const { startSilent } = state['features/base/config'];
    const tracks = (0, functions_native_1.getTrackState)(state);
    return {
        _startSilent: Boolean(startSilent),
        _track: (0, functions_native_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.AUDIO, participantID),
        _volume: participantID && participantsVolume[participantID]
    };
}
// @ts-ignore
exports.default = (0, react_redux_1.connect)(mapStateToProps)(VolumeSlider);
