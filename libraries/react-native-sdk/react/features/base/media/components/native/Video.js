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
const react_native_webrtc_1 = require("react-native-webrtc");
const Pressable_1 = __importDefault(require("../../../react/components/native/Pressable"));
const VideoTransform_1 = __importDefault(require("./VideoTransform"));
const styles_1 = __importDefault(require("./styles"));
/**
 * The React Native {@link Component} which is similar to Web's
 * {@code HTMLVideoElement} and wraps around react-native-webrtc's
 * {@link RTCView}.
 */
class Video extends react_1.Component {
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     */
    componentDidMount() {
        // RTCView currently does not support media events, so just fire
        // onPlaying callback when <RTCView> is rendered.
        const { onPlaying } = this.props;
        onPlaying?.();
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render() {
        const { onPress, stream, zoomEnabled } = this.props;
        if (stream) {
            // RTCView
            const style = styles_1.default.video;
            const objectFit = zoomEnabled
                ? 'contain'
                : 'cover';
            const rtcView = (<react_native_webrtc_1.RTCView mirror={this.props.mirror} objectFit={objectFit} streamURL={stream.toURL()} style={style} zOrder={this.props.zOrder}/>);
            // VideoTransform implements "pinch to zoom". As part of "pinch to
            // zoom", it implements onPress, of course.
            if (zoomEnabled) {
                return (<VideoTransform_1.default enabled={zoomEnabled} onPress={onPress} streamId={stream.id} style={style}>
                        {rtcView}
                    </VideoTransform_1.default>);
            }
            // XXX Unfortunately, VideoTransform implements a custom press
            // detection which has been observed to be very picky about the
            // precision of the press unlike the builtin/default/standard press
            // detection which is forgiving to imperceptible movements while
            // pressing. It's not acceptable to be so picky, especially when
            // "pinch to zoom" is not enabled.
            return (<Pressable_1.default onPress={onPress}>
                    {rtcView}
                </Pressable_1.default>);
        }
        // RTCView has peculiarities which may or may not be platform specific.
        // For example, it doesn't accept an empty streamURL. If the execution
        // reached here, it means that we explicitly chose to not initialize an
        // RTCView as a way of dealing with its idiosyncrasies.
        return null;
    }
}
exports.default = Video;
