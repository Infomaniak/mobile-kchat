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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const lib_jitsi_meet_1 = require("../../base/lib-jitsi-meet");
const ParticipantView_native_1 = __importDefault(require("../../base/participants/components/ParticipantView.native"));
const functions_1 = require("../../base/participants/functions");
const actions_native_1 = require("../../base/tracks/actions.native");
const functions_native_1 = require("../../base/tracks/functions.native");
const styles_1 = require("./styles");
const DEFAULT_STATE = {
    avatarSize: styles_1.AVATAR_SIZE,
    useConnectivityInfoLabel: true
};
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on mobile/React Native.
 *
 * @augments Component
 */
class LargeVideo extends react_1.PureComponent {
    /**
     * Creates new LargeVideo component.
     *
     * @param {IProps} props - The props of the component.
     * @returns {LargeVideo}
     */
    constructor(props) {
        super(props);
        this.state = {
            ...DEFAULT_STATE
        };
        this.handleTrackStreamingStatusChanged = this.handleTrackStreamingStatusChanged.bind(this);
    }
    /**
     * Handles dimension changes. In case we deem it's too
     * small, the connectivity indicator won't be rendered and the avatar
     * will occupy the entirety of the available screen state.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props) {
        const { _height, _width } = props;
        // Get the size, rounded to the nearest even number.
        const size = 2 * Math.round(Math.min(_height, _width) / 2);
        if (size < styles_1.AVATAR_SIZE * 1.5) {
            return {
                avatarSize: size - 15,
                useConnectivityInfoLabel: false
            };
        }
        return DEFAULT_STATE;
    }
    /**
     * Starts listening for track streaming status updates after the initial render.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        // Listen to track streaming status changed event to keep it updated.
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (_videoTrack && !_videoTrack.local) {
            _videoTrack.jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
            dispatch((0, actions_native_1.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
        }
    }
    /**
     * Stops listening for track streaming status updates on the old track and starts listening instead on the new
     * track.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (prevProps._videoTrack?.jitsiTrack?.getSourceName() !== _videoTrack?.jitsiTrack?.getSourceName()) {
            if (prevProps._videoTrack && !prevProps._videoTrack.local) {
                prevProps._videoTrack.jitsiTrack.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
                dispatch((0, actions_native_1.trackStreamingStatusChanged)(prevProps._videoTrack.jitsiTrack, prevProps._videoTrack.jitsiTrack.getTrackStreamingStatus()));
            }
            if (_videoTrack && !_videoTrack.local) {
                _videoTrack.jitsiTrack.on(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
                dispatch((0, actions_native_1.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
            }
        }
    }
    /**
     * Remove listeners for track streaming status update.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        // TODO: after converting this component to a react function component,
        // use a custom hook to update local track streaming status.
        const { _videoTrack, dispatch } = this.props;
        if (_videoTrack && !_videoTrack.local) {
            _videoTrack.jitsiTrack.off(lib_jitsi_meet_1.JitsiTrackEvents.TRACK_STREAMING_STATUS_CHANGED, this.handleTrackStreamingStatusChanged);
            dispatch((0, actions_native_1.trackStreamingStatusChanged)(_videoTrack.jitsiTrack, _videoTrack.jitsiTrack.getTrackStreamingStatus()));
        }
    }
    /**
     * Handle track streaming status change event by by dispatching an action to update track streaming status for the
     * given track in app state.
     *
     * @param {JitsiTrack} jitsiTrack - The track with streaming status updated.
     * @param {JitsiTrackStreamingStatus} streamingStatus - The updated track streaming status.
     * @returns {void}
     */
    handleTrackStreamingStatusChanged(jitsiTrack, streamingStatus) {
        this.props.dispatch((0, actions_native_1.trackStreamingStatusChanged)(jitsiTrack, streamingStatus));
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { avatarSize, useConnectivityInfoLabel } = this.state;
        const { _disableVideo, _participantId, onClick } = this.props;
        return (<ParticipantView_native_1.default avatarSize={avatarSize} disableVideo={_disableVideo} onPress={onClick} participantId={_participantId} testHintId='org.jitsi.meet.LargeVideo' useConnectivityInfoLabel={useConnectivityInfoLabel} zOrder={0} zoomEnabled={true}/>);
    }
}
/**
 * Maps (parts of) the Redux state to the associated LargeVideo's props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { participantId } = state['features/large-video'];
    const participant = (0, functions_1.getParticipantById)(state, participantId ?? '');
    const { clientHeight: height, clientWidth: width } = state['features/base/responsive-ui'];
    const videoTrack = (0, functions_native_1.getVideoTrackByParticipant)(state, participant);
    let disableVideo = false;
    if ((0, functions_1.isLocalScreenshareParticipant)(participant)) {
        disableVideo = true;
    }
    else if (participant?.local) {
        disableVideo = (0, functions_native_1.isLocalVideoTrackDesktop)(state);
    }
    return {
        _disableVideo: disableVideo,
        _height: height,
        _participantId: participantId ?? '',
        _videoTrack: videoTrack,
        _width: width
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(LargeVideo);
