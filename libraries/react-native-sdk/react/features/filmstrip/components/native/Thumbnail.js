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
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const lib_jitsi_meet_1 = require("../../../base/lib-jitsi-meet");
const constants_1 = require("../../../base/media/constants");
const actions_1 = require("../../../base/participants/actions");
const ParticipantView_native_1 = __importDefault(require("../../../base/participants/components/ParticipantView.native"));
const constants_2 = require("../../../base/participants/constants");
const functions_1 = require("../../../base/participants/functions");
const Container_1 = __importDefault(require("../../../base/react/components/native/Container"));
const actions_native_1 = require("../../../base/tracks/actions.native");
const functions_native_1 = require("../../../base/tracks/functions.native");
const ConnectionIndicator_1 = __importDefault(require("../../../connection-indicator/components/native/ConnectionIndicator"));
const DisplayNameLabel_1 = __importDefault(require("../../../display-name/components/native/DisplayNameLabel"));
const functions_native_2 = require("../../../gifs/functions.native");
const actions_native_2 = require("../../../participants-pane/actions.native");
const actions_native_3 = require("../../../toolbox/actions.native");
const functions_native_3 = require("../../../video-layout/functions.native");
const constants_3 = require("../../constants");
const AudioMutedIndicator_1 = __importDefault(require("./AudioMutedIndicator"));
const ModeratorIndicator_1 = __importDefault(require("./ModeratorIndicator"));
const PinnedIndicator_1 = __importDefault(require("./PinnedIndicator"));
const RaisedHandIndicator_1 = __importDefault(require("./RaisedHandIndicator"));
const ScreenShareIndicator_1 = __importDefault(require("./ScreenShareIndicator"));
const styles_1 = __importStar(require("./styles"));
/**
 * React component for video thumbnail.
 */
class Thumbnail extends react_1.PureComponent {
    /**
     * Creates new Thumbnail component.
     *
     * @param {IProps} props - The props of the component.
     * @returns {Thumbnail}
     */
    constructor(props) {
        super(props);
        this._onClick = this._onClick.bind(this);
        this._onThumbnailLongPress = this._onThumbnailLongPress.bind(this);
        this.handleTrackStreamingStatusChanged = this.handleTrackStreamingStatusChanged.bind(this);
    }
    /**
     * Thumbnail click handler.
     *
     * @returns {void}
     */
    _onClick() {
        const { _participantId, _pinned, dispatch, tileView } = this.props;
        if (tileView) {
            dispatch((0, actions_native_3.toggleToolboxVisible)());
        }
        else {
            dispatch((0, actions_1.pinParticipant)(_pinned ? null : _participantId));
        }
    }
    /**
     * Thumbnail long press handler.
     *
     * @returns {void}
     */
    _onThumbnailLongPress() {
        const { _fakeParticipant, _participantId, _local, _localVideoOwner, dispatch } = this.props;
        if (_fakeParticipant && _localVideoOwner) {
            dispatch((0, actions_native_2.showSharedVideoMenu)(_participantId));
        }
        else if (!_fakeParticipant) {
            if (_local) {
                dispatch((0, actions_native_2.showConnectionStatus)(_participantId));
            }
            else {
                dispatch((0, actions_native_2.showContextMenuDetails)(_participantId));
            }
        } // else no-op
    }
    /**
     * Renders the indicators for the thumbnail.
     *
     * @returns {ReactElement}
     */
    _renderIndicators() {
        const { _audioMuted: audioMuted, _fakeParticipant, _isScreenShare: isScreenShare, _isVirtualScreenshare, _participantId: participantId, _pinned, _renderModeratorIndicator: renderModeratorIndicator, _shouldDisplayTileView, renderDisplayName, tileView } = this.props;
        const indicators = [];
        let bottomIndicatorsContainerStyle;
        if (_shouldDisplayTileView) {
            bottomIndicatorsContainerStyle = styles_1.default.bottomIndicatorsContainer;
        }
        else if (audioMuted || renderModeratorIndicator) {
            bottomIndicatorsContainerStyle = styles_1.default.bottomIndicatorsContainer;
        }
        else {
            bottomIndicatorsContainerStyle = null;
        }
        if (!_fakeParticipant || _isVirtualScreenshare) {
            indicators.push(<react_native_1.View key='top-left-indicators' style={styles_1.default.thumbnailTopLeftIndicatorContainer}>
                {!_isVirtualScreenshare && <ConnectionIndicator_1.default participantId={participantId}/>}
                {!_isVirtualScreenshare && <RaisedHandIndicator_1.default participantId={participantId}/>}
                {tileView && (isScreenShare || _isVirtualScreenshare) && (<react_native_1.View style={styles_1.default.screenShareIndicatorContainer}>
                        <ScreenShareIndicator_1.default />
                    </react_native_1.View>)}
            </react_native_1.View>);
            indicators.push(<Container_1.default key='bottom-indicators' style={styles_1.default.thumbnailIndicatorContainer}>
                <Container_1.default style={bottomIndicatorsContainerStyle}>
                    {audioMuted && !_isVirtualScreenshare && <AudioMutedIndicator_1.default />}
                    {!tileView && _pinned && <PinnedIndicator_1.default />}
                    {renderModeratorIndicator && !_isVirtualScreenshare && <ModeratorIndicator_1.default />}
                    {!tileView && (isScreenShare || _isVirtualScreenshare) && <ScreenShareIndicator_1.default />}
                </Container_1.default>
                {renderDisplayName && <DisplayNameLabel_1.default contained={true} participantId={participantId}/>}
            </Container_1.default>);
        }
        return indicators;
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
        const { _fakeParticipant, _gifSrc, _isScreenShare: isScreenShare, _isVirtualScreenshare, _participantId: participantId, _raisedHand, _renderDominantSpeakerIndicator, height, tileView } = this.props;
        const styleOverrides = tileView ? {
            aspectRatio: constants_3.SQUARE_TILE_ASPECT_RATIO,
            flex: 0,
            height,
            maxHeight: null,
            maxWidth: null,
            width: null
        } : null;
        return (<Container_1.default onClick={this._onClick} onLongPress={this._onThumbnailLongPress} style={[
                styles_1.default.thumbnail,
                styleOverrides,
                _raisedHand && !_isVirtualScreenshare ? styles_1.default.thumbnailRaisedHand : null,
                _renderDominantSpeakerIndicator && !_isVirtualScreenshare ? styles_1.default.thumbnailDominantSpeaker : null
            ]} touchFeedback={false}>
                {_gifSrc ? <react_native_1.Image source={{ uri: _gifSrc }} style={styles_1.default.thumbnailGif}/>
                : <>
                        <ParticipantView_native_1.default avatarSize={tileView ? styles_1.AVATAR_SIZE * 1.5 : styles_1.AVATAR_SIZE} disableVideo={!tileView && (isScreenShare || _fakeParticipant)} participantId={participantId} zOrder={1}/>
                        {this._renderIndicators()}
                    </>}
            </Container_1.default>);
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @param {IProps} ownProps - Properties of component.
 * @returns {Object}
 */
function _mapStateToProps(state, ownProps) {
    const { ownerId } = state['features/shared-video'];
    const tracks = state['features/base/tracks'];
    const { participantID, tileView } = ownProps;
    const participant = (0, functions_1.getParticipantByIdOrUndefined)(state, participantID);
    const localParticipantId = (0, functions_1.getLocalParticipant)(state)?.id;
    const id = participant?.id;
    const audioTrack = (0, functions_native_1.getTrackByMediaTypeAndParticipant)(tracks, constants_1.MEDIA_TYPE.AUDIO, id);
    const videoTrack = (0, functions_native_1.getVideoTrackByParticipant)(state, participant);
    const isScreenShare = videoTrack?.videoType === constants_1.VIDEO_TYPE.DESKTOP;
    const participantCount = (0, functions_1.getParticipantCount)(state);
    const renderDominantSpeakerIndicator = participant?.dominantSpeaker && participantCount > 2;
    const _isEveryoneModerator = (0, functions_1.isEveryoneModerator)(state);
    const renderModeratorIndicator = tileView && !_isEveryoneModerator
        && participant?.role === constants_2.PARTICIPANT_ROLE.MODERATOR;
    const { gifUrl: gifSrc } = (0, functions_native_2.getGifForParticipant)(state, id ?? '');
    const mode = (0, functions_native_2.getGifDisplayMode)(state);
    return {
        _audioMuted: audioTrack?.muted ?? true,
        _fakeParticipant: participant?.fakeParticipant,
        _gifSrc: mode === 'chat' ? undefined : gifSrc,
        _isScreenShare: isScreenShare,
        _isVirtualScreenshare: (0, functions_1.isScreenShareParticipant)(participant),
        _local: participant?.local,
        _localVideoOwner: Boolean(ownerId === localParticipantId),
        _participantId: id ?? '',
        _pinned: participant?.pinned,
        _raisedHand: (0, functions_1.hasRaisedHand)(participant),
        _renderDominantSpeakerIndicator: renderDominantSpeakerIndicator,
        _renderModeratorIndicator: renderModeratorIndicator,
        _shouldDisplayTileView: (0, functions_native_3.shouldDisplayTileView)(state),
        _videoTrack: videoTrack
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(Thumbnail);
