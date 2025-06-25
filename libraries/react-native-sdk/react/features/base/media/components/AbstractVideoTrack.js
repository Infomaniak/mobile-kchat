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
const react_1 = __importStar(require("react"));
const actions_1 = require("../../tracks/actions");
const functions_1 = require("../functions");
const index_1 = require("./index");
/**
 * Implements a React {@link Component} that renders video element for a
 * specific video track.
 *
 * @abstract
 */
class AbstractVideoTrack extends react_1.Component {
    /**
     * Initializes a new AbstractVideoTrack instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);
        // Bind event handlers so they are only bound once for every instance.
        this._onVideoPlaying = this._onVideoPlaying.bind(this);
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const videoTrack = _falsy2null(this.props.videoTrack);
        let render;
        if (this.props.waitForVideoStarted && videoTrack) {
            // That's the complex case: we have to wait for onPlaying before we
            // render videoTrack. The complexity comes from the fact that
            // onPlaying will come after we render videoTrack.
            if ((0, functions_1.shouldRenderVideoTrack)(videoTrack, true)) {
                // It appears that onPlaying has come for videoTrack already.
                // Most probably, another render has already passed through the
                // else clause below already.
                render = true;
            }
            else if ((0, functions_1.shouldRenderVideoTrack)(videoTrack, false)
                && !videoTrack.videoStarted) {
                // XXX Unfortunately, onPlaying has not come for videoTrack yet.
                // We have to render in order to give onPlaying a chance to
                // come.
                render = true;
            }
        }
        else {
            // That's the simple case: we don't have to wait for onPlaying
            // before we render videoTrack
            render = (0, functions_1.shouldRenderVideoTrack)(videoTrack, false);
        }
        const stream = render && videoTrack
            ? videoTrack.jitsiTrack.getOriginalStream() : null;
        // Actual zoom is currently only enabled if the stream is a desktop
        // stream.
        const zoomEnabled = this.props.zoomEnabled
            && stream
            && videoTrack
            && videoTrack.videoType === 'desktop';
        return (react_1.default.createElement(index_1.Video, { mirror: videoTrack?.mirror, onPlaying: this._onVideoPlaying, 
            // @ts-ignore
            onPress: this.props.onPress, stream: stream, zOrder: this.props.zOrder, zoomEnabled: zoomEnabled }));
    }
    /**
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying() {
        const { videoTrack } = this.props;
        if (videoTrack && !videoTrack.videoStarted) {
            this.props.dispatch((0, actions_1.trackVideoStarted)(videoTrack.jitsiTrack));
        }
    }
}
exports.default = AbstractVideoTrack;
/**
 * Returns null if a specific value is falsy; otherwise, returns the specified
 * value.
 *
 * @param {*} value - The value to return if it is not falsy.
 * @returns {*} If the specified value is falsy, null; otherwise, the specified
 * value.
 */
function _falsy2null(value) {
    return value || null;
}
