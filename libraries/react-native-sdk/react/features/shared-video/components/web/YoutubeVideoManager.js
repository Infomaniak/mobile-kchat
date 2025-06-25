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
/* eslint-disable no-invalid-this */
const react_1 = __importDefault(require("react"));
const react_redux_1 = require("react-redux");
const react_youtube_1 = __importDefault(require("react-youtube"));
const constants_1 = require("../../constants");
const AbstractVideoManager_1 = __importStar(require("./AbstractVideoManager"));
/**
 * Manager of shared video.
 *
 * @returns {void}
 */
class YoutubeVideoManager extends AbstractVideoManager_1.default {
    /**
     * Initializes a new YoutubeVideoManager instance.
     *
     * @param {Object} props - This component's props.
     *
     * @returns {void}
     */
    constructor(props) {
        super(props);
        /**
         * Fired on play state toggle.
         *
         * @param {Object} event - The yt player stateChange event.
         *
         * @returns {void}
         */
        this.onPlayerStateChange = (event) => {
            if (event.data === react_youtube_1.default.PlayerState.PLAYING) {
                this.onPlay();
            }
            else if (event.data === react_youtube_1.default.PlayerState.PAUSED) {
                this.onPause();
            }
        };
        /**
         * Fired when youtube player is ready.
         *
         * @param {Object} event - The youtube player event.
         *
         * @returns {void}
         */
        this.onPlayerReady = (event) => {
            const { _isOwner } = this.props;
            this.player = event.target;
            this.player.addEventListener('onVolumeChange', () => {
                this.onVolumeChange();
            });
            if (_isOwner) {
                this.player.addEventListener('onVideoProgress', this.throttledFireUpdateSharedVideoEvent);
            }
            this.play();
            // sometimes youtube can get muted state from previous videos played in the browser
            // and as we are disabling controls we want to unmute it
            if (this.isMuted()) {
                this.unMute();
            }
        };
        this.getPlayerOptions = () => {
            const { _isOwner, videoId } = this.props;
            const showControls = _isOwner ? 1 : 0;
            const options = {
                id: 'sharedVideoPlayer',
                opts: {
                    height: '100%',
                    width: '100%',
                    playerVars: {
                        'origin': location.origin,
                        'fs': '0',
                        'autoplay': 0,
                        'controls': showControls,
                        'rel': 0
                    }
                },
                onError: (e) => this.onError(e),
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
                videoId
            };
            return options;
        };
        this.isPlayerAPILoaded = false;
    }
    /**
     * Indicates the playback state of the video.
     *
     * @returns {string}
     */
    getPlaybackStatus() {
        let status;
        if (!this.player) {
            return;
        }
        const playerState = this.player.getPlayerState();
        if (playerState === react_youtube_1.default.PlayerState.PLAYING) {
            status = constants_1.PLAYBACK_STATUSES.PLAYING;
        }
        if (playerState === react_youtube_1.default.PlayerState.PAUSED) {
            status = constants_1.PLAYBACK_STATUSES.PAUSED;
        }
        return status;
    }
    /**
     * Indicates whether the video is muted.
     *
     * @returns {boolean}
     */
    isMuted() {
        return this.player?.isMuted();
    }
    /**
     * Retrieves current volume.
     *
     * @returns {number}
     */
    getVolume() {
        return this.player?.getVolume();
    }
    /**
     * Retrieves current time.
     *
     * @returns {number}
     */
    getTime() {
        return this.player?.getCurrentTime();
    }
    /**
     * Seeks video to provided time.
     *
     * @param {number} time - The time to seek to.
     *
     * @returns {void}
     */
    seek(time) {
        return this.player?.seekTo(time);
    }
    /**
     * Plays video.
     *
     * @returns {void}
     */
    play() {
        return this.player?.playVideo();
    }
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause() {
        return this.player?.pauseVideo();
    }
    /**
     * Mutes video.
     *
     * @returns {void}
     */
    mute() {
        return this.player?.mute();
    }
    /**
     * Unmutes video.
     *
     * @returns {void}
     */
    unMute() {
        return this.player?.unMute();
    }
    /**
     * Disposes of the current video player.
     *
     * @returns {void}
     */
    dispose() {
        if (this.player) {
            this.player.destroy();
            this.player = null;
        }
    }
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render() {
        return (react_1.default.createElement(react_youtube_1.default, { ...this.getPlayerOptions() }));
    }
}
exports.default = (0, react_redux_1.connect)(AbstractVideoManager_1._mapStateToProps, AbstractVideoManager_1._mapDispatchToProps)(YoutubeVideoManager);
