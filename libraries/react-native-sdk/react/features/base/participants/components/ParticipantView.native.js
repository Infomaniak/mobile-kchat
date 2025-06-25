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
const functions_1 = require("../../../connection-indicator/functions");
const SharedVideo_1 = __importDefault(require("../../../shared-video/components/native/SharedVideo"));
const Avatar_1 = __importDefault(require("../../avatar/components/Avatar"));
const functions_2 = require("../../i18n/functions");
const VideoTrack_1 = __importDefault(require("../../media/components/native/VideoTrack"));
const functions_3 = require("../../media/functions");
const Container_1 = __importDefault(require("../../react/components/native/Container"));
const functions_4 = require("../../redux/functions");
const TestHint_1 = __importDefault(require("../../testing/components/TestHint"));
const functions_5 = require("../../tracks/functions");
const functions_6 = require("../functions");
const styles_1 = __importDefault(require("./styles"));
/**
 * Implements a React Component which depicts a specific participant's avatar
 * and video.
 *
 * @augments Component
 */
class ParticipantView extends react_1.Component {
    /**
     * Renders the inactive connection status label.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderInactiveConnectionInfo() {
        const { avatarSize, _participantName: displayName, t } = this.props;
        // XXX Consider splitting this component into 2: one for the large view
        // and one for the thumbnail. Some of these don't apply to both.
        const containerStyle = {
            ...styles_1.default.connectionInfoContainer,
            width: avatarSize * 1.5
        };
        return (<react_native_1.View pointerEvents='box-none' style={containerStyle}>
                <react_native_1.Text style={styles_1.default.connectionInfoText}>
                    {t('connection.LOW_BANDWIDTH', { displayName })}
                </react_native_1.Text>
            </react_native_1.View>);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { _isConnectionInactive, _isSharedVideoParticipant, _renderVideo: renderVideo, _videoTrack: videoTrack, disableVideo, onPress } = this.props;
        const testHintId = this.props.testHintId
            ? this.props.testHintId
            : `org.jitsi.meet.Participant#${this.props.participantId}`;
        const renderSharedVideo = _isSharedVideoParticipant && !disableVideo;
        return (<Container_1.default onClick={renderVideo || renderSharedVideo ? undefined : onPress} style={{
                ...styles_1.default.participantView,
                ...this.props.style
            }} touchFeedback={false}>

                <TestHint_1.default id={testHintId} onPress={renderSharedVideo ? undefined : onPress} value=''/>

                {renderSharedVideo && <SharedVideo_1.default />}

                {renderVideo
                && <VideoTrack_1.default onPress={onPress} videoTrack={videoTrack} waitForVideoStarted={false} zOrder={this.props.zOrder} zoomEnabled={this.props.zoomEnabled}/>}

                {!renderSharedVideo && !renderVideo
                && <react_native_1.View style={styles_1.default.avatarContainer}>
                        <Avatar_1.default participantId={this.props.participantId} size={this.props.avatarSize}/>
                    </react_native_1.View>}

                {_isConnectionInactive && this.props.useConnectivityInfoLabel
                && this._renderInactiveConnectionInfo()}
            </Container_1.default>);
    }
}
/**
 * Maps (parts of) the redux state to the associated {@link ParticipantView}'s
 * props.
 *
 * @param {Object} state - The redux state.
 * @param {Object} ownProps - The React {@code Component} props passed to the
 * associated (instance of) {@code ParticipantView}.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const { disableVideo, participantId } = ownProps;
    const participant = (0, functions_6.getParticipantById)(state, participantId);
    const videoTrack = (0, functions_5.getVideoTrackByParticipant)(state, participant);
    return {
        _isConnectionInactive: (0, functions_1.isTrackStreamingStatusInactive)(videoTrack),
        _isSharedVideoParticipant: (0, functions_6.isSharedVideoParticipant)(participant),
        _participantName: (0, functions_6.getParticipantDisplayName)(state, participantId),
        _renderVideo: shouldRenderParticipantVideo(state, participantId) && !disableVideo,
        _videoTrack: videoTrack
    };
}
/**
 * Returns true if the video of the participant should be rendered.
 *
 * @param {Object|Function} stateful - Object or function that can be resolved
 * to the Redux state.
 * @param {string} id - The ID of the participant.
 * @returns {boolean}
 */
function shouldRenderParticipantVideo(stateful, id) {
    const state = (0, functions_4.toState)(stateful);
    const participant = (0, functions_6.getParticipantById)(state, id);
    if (!participant) {
        return false;
    }
    /* First check if we have an unmuted video track. */
    const videoTrack = (0, functions_5.getVideoTrackByParticipant)(state, participant);
    if (!videoTrack) {
        return false;
    }
    if (!(0, functions_3.shouldRenderVideoTrack)(videoTrack, /* waitForVideoStarted */ false)) {
        return false;
    }
    /* Then check if the participant connection or track streaming status is active. */
    if (!videoTrack.local && !(0, functions_1.isTrackStreamingStatusActive)(videoTrack)) {
        return false;
    }
    /* Then check if audio-only mode is not active. */
    const audioOnly = state['features/base/audio-only'].enabled;
    if (!audioOnly) {
        return true;
    }
    /* Last, check if the participant is sharing their screen and they are on stage. */
    const remoteScreenShares = state['features/video-layout'].remoteScreenShares || [];
    const largeVideoParticipantId = state['features/large-video'].participantId;
    const participantIsInLargeVideoWithScreen = participant.id === largeVideoParticipantId && remoteScreenShares.includes(participant.id);
    return participantIsInLargeVideoWithScreen;
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(ParticipantView));
