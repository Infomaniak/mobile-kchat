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
const react_1 = __importDefault(require("react"));
const react_native_video_1 = __importDefault(require("react-native-video"));
const react_redux_1 = require("react-redux");
const constants_1 = require("../../constants");
const logger_1 = __importDefault(require("../../logger"));
const AbstractVideoManager_1 = __importStar(require("./AbstractVideoManager"));
/**
 * Manager of shared video.
 */
class VideoManager extends AbstractVideoManager_1.default {
    /**
     * Initializes a new VideoManager instance.
     *
     * @param {Object} props - This component's props.
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            paused: false
        };
        this.playerRef = react_1.default.createRef();
        this.onPlaybackRateChange = this.onPlaybackRateChange.bind(this);
        this.onProgress = this.onProgress.bind(this);
    }
    /**
     * Retrieves the current player ref.
     */
    get player() {
        return this.playerRef.current;
    }
    /**
     * Indicates the playback state of the video.
     *
     * @returns {string}
     */
    getPlaybackStatus() {
        let status;
        if (this.state.paused) {
            status = constants_1.PLAYBACK_STATUSES.PAUSED;
        }
        else {
            status = constants_1.PLAYBACK_STATUSES.PLAYING;
        }
        return status;
    }
    /**
     * Retrieves current time.
     *
     * @returns {number}
     */
    getTime() {
        return this.state.currentTime;
    }
    /**
     * Seeks video to provided time.
     *
     * @param {number} time - The time to seek to.
     *
     * @returns {void}
     */
    seek(time) {
        if (this.player) {
            // @ts-ignore
            this.player.seek(time);
        }
    }
    /**
     * Plays video.
     *
     * @returns {void}
     */
    play() {
        this.setState({
            paused: false
        });
    }
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause() {
        this.setState({
            paused: true
        });
    }
    /**
     * Handles playback rate changed event.
     *
     * @param {Object} options.playbackRate - Playback rate: 1 - playing, 0 - paused, other - slowed down / sped up.
     * @returns {void}
     */
    onPlaybackRateChange({ playbackRate }) {
        if (playbackRate === 0) {
            this.setState({
                paused: true
            }, () => {
                this.onPause();
            });
        }
        if (playbackRate === 1) {
            this.setState({
                paused: false
            }, () => {
                this.onPlay();
            });
        }
    }
    /**
     * Handles progress update event.
     *
     * @param {Object} options - Progress event options.
     * @returns {void}
     */
    onProgress(options) {
        this.setState({ currentTime: options.currentTime });
        this.throttledFireUpdateSharedVideoEvent();
    }
    /**
     * Retrieves video tag params.
     *
     * @returns {void}
     */
    getPlayerOptions() {
        const { _isOwner, videoId, width, height } = this.props;
        const { paused } = this.state;
        const options = {
            paused,
            progressUpdateInterval: 5000,
            resizeMode: 'cover',
            style: {
                height,
                width
            },
            source: { uri: videoId },
            controls: _isOwner,
            pictureInPicture: false,
            onProgress: this.onProgress,
            onError: (event) => {
                logger_1.default.error('Error in the player:', event);
            }
        };
        if (_isOwner) {
            options.onPlaybackRateChange = this.onPlaybackRateChange;
        }
        return options;
    }
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render() {
        return (<react_native_video_1.default ref={this.playerRef} {...this.getPlayerOptions()}/>);
    }
}
exports.default = (0, react_redux_1.connect)(AbstractVideoManager_1._mapStateToProps)(VideoManager);
