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
const react_native_youtube_iframe_1 = __importDefault(require("react-native-youtube-iframe"));
const react_redux_1 = require("react-redux");
const constants_1 = require("../../constants");
const AbstractVideoManager_1 = __importStar(require("./AbstractVideoManager"));
/**
 * Passed to the webviewProps in order to avoid the usage of the ios player on which we cannot hide the controls.
 *
 * @private
 */
const webviewUserAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36'; // eslint-disable-line max-len
/**
 * Manager of youtube shared video.
 */
class YoutubeVideoManager extends AbstractVideoManager_1.default {
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
            paused: false
        };
        this.playerRef = react_1.default.createRef();
        this._onReady = this._onReady.bind(this);
        this._onChangeState = this._onChangeState.bind(this);
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
        // @ts-ignore
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
        if (this.player) {
            // @ts-ignore
            this.player.seekTo(time);
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
     * Handles state change event.
     *
     * @param {string} event - State event.
     * @returns {void}
     */
    _onChangeState(event) {
        if (event === 'paused') {
            this.setState({
                paused: true
            }, () => {
                this.onPause();
            });
        }
        if (event === 'playing') {
            this.setState({
                paused: false
            }, () => {
                this.onPlay();
            });
        }
    }
    /**
     * Handles onReady event.
     *
     * @returns {void}
     */
    _onReady() {
        this.setState({
            paused: false
        });
    }
    /**
     * Retrieves video tag params.
     *
     * @returns {void}
     */
    getPlayerOptions() {
        const { _isOwner, videoId, width, height } = this.props;
        const options = {
            height,
            initialPlayerParams: {
                controls: _isOwner,
                modestbranding: true,
                preventFullScreen: true
            },
            play: !this.state.paused,
            ref: this.playerRef,
            videoId,
            volume: 50,
            webViewProps: {
                bounces: false,
                mediaPlaybackRequiresUserAction: false,
                scrollEnabled: false,
                userAgent: webviewUserAgent
            },
            width
        };
        if (_isOwner) {
            options.onChangeState = this._onChangeState;
            options.onReady = this._onReady;
        }
        return options;
    }
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render() {
        return (<react_native_youtube_iframe_1.default ref={this.playerRef} {...this.getPlayerOptions()}/>);
    }
}
exports.default = (0, react_redux_1.connect)(AbstractVideoManager_1._mapStateToProps)(YoutubeVideoManager);
