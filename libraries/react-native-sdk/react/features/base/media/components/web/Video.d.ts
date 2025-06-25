import { Component, ReactEventHandler } from 'react';
import { ITrack } from '../../../tracks/types';
/**
 * The type of the React {@code Component} props of {@link Video}.
 */
export interface IProps {
    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    autoPlay: boolean;
    /**
     * CSS classes to add to the video element.
     */
    className: string;
    /**
     * A map of the event handlers for the video HTML element.
     */
    eventHandlers?: {
        /**
         * OnAbort event handler.
         */
        onAbort?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnCanPlay event handler.
         */
        onCanPlay?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnCanPlayThrough event handler.
         */
        onCanPlayThrough?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnEmptied event handler.
         */
        onEmptied?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnEnded event handler.
         */
        onEnded?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnError event handler.
         */
        onError?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnLoadStart event handler.
         */
        onLoadStart?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnLoadedData event handler.
         */
        onLoadedData?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnLoadedMetadata event handler.
         */
        onLoadedMetadata?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnPause event handler.
         */
        onPause?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnPlay event handler.
         */
        onPlay?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnPlaying event handler.
         */
        onPlaying?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnRateChange event handler.
         */
        onRateChange?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnStalled event handler.
         */
        onStalled?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnSuspend event handler.
         */
        onSuspend?: ReactEventHandler<HTMLVideoElement>;
        /**
         * OnWaiting event handler.
         */
        onWaiting?: ReactEventHandler<HTMLVideoElement>;
    };
    /**
     * The value of the id attribute of the video. Used by the torture tests to
     * locate video elements.
     */
    id: string;
    /**
     * Used on native.
     */
    mirror?: boolean;
    /**
     * The value of the muted attribute for the underlying video element.
     */
    muted?: boolean;
    /**
     * Used on native.
     */
    onPlaying?: Function;
    /**
     * Used on native.
     */
    onPress?: Function;
    /**
     * Optional callback to invoke once the video starts playing.
     */
    onVideoPlaying?: Function;
    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    playsinline: boolean;
    /**
     * Used on native.
     */
    stream?: any;
    /**
     * A styles that will be applied on the video element.
     */
    style?: Object;
    /**
     * The JitsiLocalTrack to display.
     */
    videoTrack?: Partial<ITrack>;
    /**
     * Used on native.
     */
    zOrder?: number;
    /**
     * Used on native.
     */
    zoomEnabled?: boolean;
}
/**
 * Component that renders a video element for a passed in video track.
 *
 * @augments Component
 */
declare class Video extends Component<IProps> {
    _videoElement?: HTMLVideoElement | null;
    _mounted: boolean;
    /**
     * Default values for {@code Video} component's properties.
     *
     * @static
     */
    static defaultProps: {
        className: string;
        autoPlay: boolean;
        id: string;
        playsinline: boolean;
    };
    /**
     * Initializes a new {@code Video} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps);
    /**
     * Invokes the library for rendering the video on initial display. Sets the
     * volume level to zero to ensure no sound plays.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Remove any existing associations between the current video track and the
     * component's video element.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Updates the video display only if a new track is added. This component's
     * updating is blackboxed from React to prevent re-rendering of video
     * element, as the lib uses {@code track.attach(videoElement)} instead.
     *
     * @inheritdoc
     * @returns {boolean} - False is always returned to blackbox this component
     * from React.
     */
    shouldComponentUpdate(nextProps: IProps): boolean;
    /**
     * Renders the video element.
     *
     * @override
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Calls into the passed in track to associate the track with the
     * component's video element and render video.
     *
     * @param {Object} videoTrack - The redux representation of the
     * {@code JitsiLocalTrack}.
     * @private
     * @returns {void}
     */
    _attachTrack(videoTrack?: Partial<ITrack>): any;
    /**
     * Removes the association to the component's video element from the passed
     * in redux representation of jitsi video track to stop the track from
     * rendering.
     *
     * @param {Object} videoTrack -  The redux representation of the
     * {@code JitsiLocalTrack}.
     * @private
     * @returns {void}
     */
    _detachTrack(videoTrack?: Partial<ITrack>): void;
    /**
     * Invokes the onvideoplaying callback if defined.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying(): void;
    /**
     * Sets an instance variable for the component's video element so it can be
     * referenced later for attaching and detaching a JitsiLocalTrack.
     *
     * @param {Object} element - DOM element for the component's video display.
     * @private
     * @returns {void}
     */
    _setVideoElement(element: HTMLVideoElement | null): void;
}
export default Video;
