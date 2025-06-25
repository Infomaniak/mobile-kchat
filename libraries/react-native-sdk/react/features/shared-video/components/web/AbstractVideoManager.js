"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapDispatchToProps = exports._mapStateToProps = void 0;
// @ts-expect-error
const logger_1 = __importDefault(require("@jitsi/logger"));
const throttle_1 = __importDefault(require("lodash/throttle"));
const react_1 = require("react");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/conference/functions");
const constants_1 = require("../../../base/media/constants");
const functions_3 = require("../../../base/participants/functions");
const functions_4 = require("../../../base/tracks/functions");
const actions_1 = require("../../../notifications/actions");
const constants_2 = require("../../../notifications/constants");
const actions_2 = require("../../../toolbox/actions");
const actions_any_1 = require("../../../video-menu/actions.any");
const actions_any_2 = require("../../actions.any");
const constants_3 = require("../../constants");
const logger = logger_1.default.getLogger(__filename);
/**
 * Return true if the difference between the two times is larger than 5.
 *
 * @param {number} newTime - The current time.
 * @param {number} previousTime - The previous time.
 * @private
 * @returns {boolean}
*/
function shouldSeekToPosition(newTime, previousTime) {
    return Math.abs(newTime - previousTime) > 5;
}
/**
 * Manager of shared video.
 */
class AbstractVideoManager extends react_1.PureComponent {
    /**
     * Initializes a new instance of AbstractVideoManager.
     *
     * @param {IProps} props - Component props.
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.throttledFireUpdateSharedVideoEvent = (0, throttle_1.default)(this.fireUpdateSharedVideoEvent.bind(this), 5000);
        // selenium tests handler
        window._sharedVideoPlayer = this;
    }
    /**
     * Implements React Component's componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.props._dockToolbox(true);
        this.processUpdatedProps();
    }
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const { _videoUrl } = this.props;
        if (prevProps._videoUrl !== _videoUrl) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('started'));
        }
        this.processUpdatedProps();
    }
    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('stopped'));
        if (this.dispose) {
            this.dispose();
        }
        this.props._dockToolbox(false);
    }
    /**
     * Processes new properties.
     *
     * @returns {void}
     */
    processUpdatedProps() {
        const { _status, _time, _isOwner, _muted } = this.props;
        if (_isOwner) {
            return;
        }
        const playerTime = this.getTime();
        if (shouldSeekToPosition(Number(_time), Number(playerTime))) {
            this.seek(Number(_time));
        }
        if (this.getPlaybackStatus() !== _status) {
            if (_status === constants_3.PLAYBACK_STATUSES.PLAYING) {
                this.play();
            }
            if (_status === constants_3.PLAYBACK_STATUSES.PAUSED) {
                this.pause();
            }
        }
        if (this.isMuted() !== _muted) {
            if (_muted) {
                this.mute();
            }
            else {
                this.unMute();
            }
        }
    }
    /**
     * Handle video error.
     *
     * @param {Object|undefined} e - The error returned by the API or none.
     * @returns {void}
     */
    onError(e) {
        logger.error('Error in the video player', e?.data, e?.data ? 'Check error code at https://developers.google.com/youtube/iframe_api_reference#onError' : '');
        this.props._stopSharedVideo();
        this.props._displayWarning();
    }
    /**
     * Handle video playing.
     *
     * @returns {void}
     */
    onPlay() {
        this.smartAudioMute();
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('play'));
        this.fireUpdateSharedVideoEvent();
    }
    /**
     * Handle video paused.
     *
     * @returns {void}
     */
    onPause() {
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('paused'));
        this.fireUpdateSharedVideoEvent();
    }
    /**
     * Handle volume changed.
     *
     * @returns {void}
     */
    onVolumeChange() {
        const volume = this.getVolume();
        const muted = this.isMuted();
        if (Number(volume) > 0 && !muted) {
            this.smartAudioMute();
        }
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('volume.changed', {
            volume,
            muted
        }));
        this.fireUpdatePlayingVideoEvent();
    }
    /**
     * Handle changes to the shared playing video.
     *
     * @returns {void}
     */
    fireUpdatePlayingVideoEvent() {
        if (this.getPlaybackStatus() === constants_3.PLAYBACK_STATUSES.PLAYING) {
            this.fireUpdateSharedVideoEvent();
        }
    }
    /**
     * Dispatches an update action for the shared video.
     *
     * @returns {void}
     */
    fireUpdateSharedVideoEvent() {
        const { _isOwner } = this.props;
        if (!_isOwner) {
            return;
        }
        const status = this.getPlaybackStatus();
        if (!Object.values(constants_3.PLAYBACK_STATUSES).includes(status ?? '')) {
            return;
        }
        const { _ownerId, _setSharedVideoStatus, _videoUrl } = this.props;
        _setSharedVideoStatus({
            videoUrl: _videoUrl,
            status,
            time: this.getTime(),
            ownerId: _ownerId,
            muted: this.isMuted()
        });
    }
    /**
     * Indicates if the player volume is currently on. This will return true if
     * we have an available player, which is currently in a PLAYING state,
     * which isn't muted and has it's volume greater than 0.
     *
     * @returns {boolean} Indicating if the volume of the shared video is
     * currently on.
     */
    isSharedVideoVolumeOn() {
        return this.getPlaybackStatus() === constants_3.PLAYBACK_STATUSES.PLAYING
            && !this.isMuted()
            && Number(this.getVolume()) > 0;
    }
    /**
     * Smart mike mute. If the mike isn't currently muted and the shared video
     * volume is on we mute the mike.
     *
     * @returns {void}
     */
    smartAudioMute() {
        const { _isLocalAudioMuted, _muteLocal } = this.props;
        if (!_isLocalAudioMuted
            && this.isSharedVideoVolumeOn()) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createSharedVideoEvent)('audio.muted'));
            _muteLocal(true);
        }
    }
    /**
     * Seeks video to provided time.
     *
     * @param {number} _time - Time to seek to.
     * @returns {void}
     */
    seek(_time) {
        // to be implemented by subclass
    }
    /**
     * Indicates the playback state of the video.
     *
     * @returns {string}
     */
    getPlaybackStatus() {
        return;
    }
    /**
     * Indicates whether the video is muted.
     *
     * @returns {boolean}
     */
    isMuted() {
        return;
    }
    /**
     * Retrieves current volume.
     *
     * @returns {number}
     */
    getVolume() {
        return 1;
    }
    /**
     * Plays video.
     *
     * @returns {void}
     */
    play() {
        // to be implemented by subclass
    }
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause() {
        // to be implemented by subclass
    }
    /**
     * Mutes video.
     *
     * @returns {void}
     */
    mute() {
        // to be implemented by subclass
    }
    /**
     * Unmutes video.
     *
     * @returns {void}
     */
    unMute() {
        // to be implemented by subclass
    }
    /**
     * Retrieves current time.
     *
     * @returns {number}
     */
    getTime() {
        return 0;
    }
    /**
     * Disposes current video player.
     *
     * @returns {void}
     */
    dispose() {
        // to be implemented by subclass
    }
}
exports.default = AbstractVideoManager;
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { ownerId, status, time, videoUrl, muted } = state['features/shared-video'];
    const localParticipant = (0, functions_3.getLocalParticipant)(state);
    const _isLocalAudioMuted = (0, functions_4.isLocalTrackMuted)(state['features/base/tracks'], constants_1.MEDIA_TYPE.AUDIO);
    return {
        _conference: (0, functions_2.getCurrentConference)(state),
        _isLocalAudioMuted,
        _isOwner: ownerId === localParticipant?.id,
        _muted: muted,
        _ownerId: ownerId,
        _status: status,
        _time: time,
        _videoUrl: videoUrl
    };
}
exports._mapStateToProps = _mapStateToProps;
/**
 * Maps part of the props of this component to Redux actions.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {IProps}
 */
function _mapDispatchToProps(dispatch) {
    return {
        _displayWarning: () => {
            dispatch((0, actions_1.showWarningNotification)({
                titleKey: 'dialog.shareVideoLinkError'
            }, constants_2.NOTIFICATION_TIMEOUT_TYPE.LONG));
        },
        _dockToolbox: (value) => {
            dispatch((0, actions_2.dockToolbox)(value));
        },
        _stopSharedVideo: () => {
            dispatch((0, actions_any_2.stopSharedVideo)());
        },
        _muteLocal: (value) => {
            dispatch((0, actions_any_1.muteLocal)(value, constants_1.MEDIA_TYPE.AUDIO));
        },
        _setSharedVideoStatus: ({ videoUrl, status, time, ownerId, muted }) => {
            dispatch((0, actions_any_2.setSharedVideoStatus)({
                videoUrl,
                status,
                time,
                ownerId,
                muted
            }));
        }
    };
}
exports._mapDispatchToProps = _mapDispatchToProps;
