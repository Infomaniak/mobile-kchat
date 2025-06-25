import { Component } from 'react';
import { GestureResponderEvent } from 'react-native';
import { MediaStream } from 'react-native-webrtc';
/**
 * The type of the React {@code Component} props of {@link Video}.
 */
export interface IProps {
    mirror: boolean;
    onPlaying: Function;
    /**
     * Callback to invoke when the {@code Video} is clicked/pressed.
     */
    onPress?: (event: GestureResponderEvent) => void;
    stream: MediaStream;
    /**
     * Similarly to the CSS property z-index, specifies the z-order of this
     * Video in the stacking space of all Videos. When Videos overlap,
     * zOrder determines which one covers the other. A Video with a larger
     * zOrder generally covers a Video with a lower one.
     *
     * Non-overlapping Videos may safely share a z-order (because one does
     * not have to cover the other).
     *
     * The support for zOrder is platform-dependent and/or
     * implementation-specific. Thus, specifying a value for zOrder is to be
     * thought of as giving a hint rather than as imposing a requirement.
     * For example, video renderers such as Video are commonly implemented
     * using OpenGL and OpenGL views may have different numbers of layers in
     * their stacking space. Android has three: a layer below the window
     * (aka default), a layer below the window again but above the previous
     * layer (aka media overlay), and above the window. Consequently, it is
     * advisable to limit the number of utilized layers in the stacking
     * space to the minimum sufficient for the desired display. For example,
     * a video call application usually needs a maximum of two zOrder
     * values: 0 for the remote video(s) which appear in the background, and
     * 1 for the local video(s) which appear above the remote video(s).
     */
    zOrder?: number;
    /**
     * Indicates whether zooming (pinch to zoom and/or drag) is enabled.
     */
    zoomEnabled: boolean;
}
/**
 * The React Native {@link Component} which is similar to Web's
 * {@code HTMLVideoElement} and wraps around react-native-webrtc's
 * {@link RTCView}.
 */
export default class Video extends Component<IProps> {
    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement|null}
     */
    render(): JSX.Element | null;
}
