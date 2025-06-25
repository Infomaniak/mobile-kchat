"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const AbstractVideoTrack_1 = __importDefault(require("../AbstractVideoTrack"));
const Video_1 = __importDefault(require("./Video"));
/**
 * Component that renders a video element for a passed in video track and
 * notifies the store when the video has started playing.
 *
 * @augments AbstractVideoTrack
 */
class VideoTrack extends AbstractVideoTrack_1.default {
    /**
     * Renders the video element.
     *
     * @override
     * @returns {ReactElement}
     */
    render() {
        const { _noAutoPlayVideo, className, id, muted, videoTrack, style, eventHandlers } = this.props;
        return (react_1.default.createElement(Video_1.default, { autoPlay: !_noAutoPlayVideo, className: className, eventHandlers: eventHandlers, id: id, muted: muted, onVideoPlaying: this._onVideoPlaying, style: style, videoTrack: videoTrack }));
    }
}
/**
 * Default values for {@code VideoTrack} component's properties.
 *
 * @static
 */
VideoTrack.defaultProps = {
    className: '',
    id: ''
};
/**
 * Maps (parts of) the Redux state to the associated VideoTracks props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _noAutoPlayVideo: boolean
 * }}
 */
function _mapStateToProps(state) {
    const testingConfig = state['features/base/config'].testing;
    return {
        _noAutoPlayVideo: Boolean(testingConfig?.noAutoPlayVideo)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(VideoTrack);
