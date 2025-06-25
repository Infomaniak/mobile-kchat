"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const AudioTrack_1 = __importDefault(require("../../../base/media/components/web/AudioTrack"));
const constants_1 = require("../../../base/media/constants");
/**
 * A container for the remote tracks audio elements.
 *
 * @param {IProps} props - The props of the component.
 * @returns {Array<ReactElement>}
 */
function AudioTracksContainer(props) {
    const { _tracks } = props;
    const remoteAudioTracks = _tracks.filter(t => !t.local && t.mediaType === constants_1.MEDIA_TYPE.AUDIO);
    return (react_1.default.createElement("div", null, remoteAudioTracks.map(t => {
        const { jitsiTrack, participantId } = t;
        const audioTrackId = jitsiTrack?.getId();
        const id = `remoteAudio_${audioTrackId || ''}`;
        return (react_1.default.createElement(AudioTrack_1.default, { audioTrack: t, id: id, key: id, participantId: participantId }));
    })));
}
/**
 * Maps (parts of) the Redux state to the associated {@code AudioTracksContainer}'s props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    // NOTE: The disadvantage of this approach is that the component will re-render on any track change.
    // One way to solve the problem would be to pass only the participant ID to the AudioTrack component and
    // find the corresponding track inside the AudioTrack's mapStateToProps. But currently this will be very
    // inefficient because features/base/tracks is an array and in order to find a track by participant ID
    // we need to go through the array. Introducing a map participantID -> track could be beneficial in this case.
    return {
        _tracks: state['features/base/tracks']
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(AudioTracksContainer);
