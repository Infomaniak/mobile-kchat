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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LargeVideoBackground = exports.ORIENTATION = void 0;
const react_1 = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const functions_web_1 = require("../../video-layout/functions.web");
/**
 * Constants to describe the dimensions of the video. Landscape videos
 * are wider than they are taller and portrait videos are taller than they
 * are wider. The dimensions will determine how {@code LargeVideoBackground}
 * will stretch to fill its container.
 *
 * @type {Object}
 */
exports.ORIENTATION = {
    LANDSCAPE: 'landscape',
    PORTRAIT: 'portrait'
};
/**
 * Implements a React Component which shows a video element intended to be used
 * as a background to fill the empty space of container with another video.
 *
 * @augments Component
 */
class LargeVideoBackground extends react_1.Component {
    /**
     * Initializes new {@code LargeVideoBackground} instance.
     *
     * @param {*} props - The read-only properties with which the new instance
     * is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once per instance.
        this._setCanvasEl = this._setCanvasEl.bind(this);
        this._updateCanvas = this._updateCanvas.bind(this);
    }
    /**
     * If the canvas is not hidden, sets the initial interval to update the
     * image displayed in the canvas.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount() {
        const { _shouldDisplayTileView, hidden, videoElement } = this.props;
        if (videoElement && !hidden && !_shouldDisplayTileView) {
            this._updateCanvas();
            this._setUpdateCanvasInterval();
        }
    }
    /**
     * Starts or stops the interval to update the image displayed in the canvas.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps) {
        const wasCanvasUpdating = !prevProps.hidden && !prevProps._shouldDisplayTileView && prevProps.videoElement;
        const shouldCanvasUpdating = !this.props.hidden && !this.props._shouldDisplayTileView && this.props.videoElement;
        if (wasCanvasUpdating !== shouldCanvasUpdating) {
            if (shouldCanvasUpdating) {
                this._clearCanvas();
                this._setUpdateCanvasInterval();
            }
            else {
                this._clearCanvas();
                this._clearUpdateCanvasInterval();
            }
        }
    }
    /**
     * Clears the interval for updating the image displayed in the canvas.
     *
     * @inheritdoc
     */
    componentWillUnmount() {
        this._clearUpdateCanvasInterval();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const { hidden, mirror } = this.props;
        const classNames = `large-video-background ${mirror ? 'flip-x' : ''} ${hidden ? 'invisible' : ''}`;
        return (react_1.default.createElement("div", { className: classNames },
            react_1.default.createElement("canvas", { id: 'largeVideoBackground', ref: this._setCanvasEl })));
    }
    /**
     * Removes any image displayed on the canvas.
     *
     * @private
     * @returns {void}
     */
    _clearCanvas() {
        const cavnasContext = this._canvasEl.getContext('2d');
        cavnasContext?.clearRect(0, 0, this._canvasEl.width, this._canvasEl.height);
    }
    /**
     * Clears the interval for updating the image displayed in the canvas.
     *
     * @private
     * @returns {void}
     */
    _clearUpdateCanvasInterval() {
        clearInterval(this._updateCanvasInterval);
    }
    /**
     * Sets the instance variable for the component's canvas element so it can
     * be accessed directly for drawing on.
     *
     * @param {Object} element - The DOM element for the component's canvas.
     * @private
     * @returns {void}
     */
    _setCanvasEl(element) {
        this._canvasEl = element;
    }
    /**
     * Starts the interval for updating the image displayed in the canvas.
     *
     * @private
     * @returns {void}
     */
    _setUpdateCanvasInterval() {
        this._clearUpdateCanvasInterval();
        this._updateCanvasInterval = window.setInterval(this._updateCanvas, 200);
    }
    /**
     * Draws the current frame of the passed in video element onto the canvas.
     *
     * @private
     * @returns {void}
     */
    _updateCanvas() {
        // On Electron 7 there is a memory leak if we try to draw into a hidden canvas that is part of the DOM tree.
        // See: https://github.com/electron/electron/issues/22417
        // Trying to detect all the cases when the page will be hidden because of something not in our control
        // (for example when the page is loaded in an iframe which is hidden due to the host page styles) to solve
        // the memory leak. Currently we are not handling the use case when the page is hidden with visibility:hidden
        // because we don't have a good way to do it.
        // All other cases when the canvas is not visible are handled through the component props
        // (hidden, _shouldDisplayTileView).
        if (!this._canvasEl || this._canvasEl.offsetParent === null
            || window.innerHeight === 0 || window.innerWidth === 0) {
            return;
        }
        const { videoElement } = this.props;
        const { videoWidth, videoHeight } = videoElement;
        const { height: canvasHeight, width: canvasWidth } = this._canvasEl;
        const canvasContext = this._canvasEl.getContext('2d');
        if (this.props.orientationFit === exports.ORIENTATION.LANDSCAPE) {
            const heightScaledToFit = (canvasWidth / videoWidth) * videoHeight;
            canvasContext?.drawImage(videoElement, 0, 0, canvasWidth, heightScaledToFit);
        }
        else {
            const widthScaledToFit = (canvasHeight / videoHeight) * videoWidth;
            canvasContext?.drawImage(videoElement, 0, 0, widthScaledToFit, canvasHeight);
        }
    }
}
exports.LargeVideoBackground = LargeVideoBackground;
/**
 * Maps (parts of) the Redux state to the associated LargeVideoBackground props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _shouldDisplayTileView: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        _shouldDisplayTileView: (0, functions_web_1.shouldDisplayTileView)(state)
    };
}
exports.default = (0, react_redux_1.connect)(_mapStateToProps)(LargeVideoBackground);
