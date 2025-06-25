import React, { ReactEventHandler } from 'react';
import AbstractVideoTrack, { IProps as AbstractVideoTrackProps } from '../AbstractVideoTrack';
/**
 * The type of the React {@code Component} props of {@link VideoTrack}.
 */
export interface IProps extends AbstractVideoTrackProps {
    /**
     *
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean;
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
     * The value of the id attribute of the video. Used by the torture tests
     * to locate video elements.
     */
    id: string;
    /**
     * The value of the muted attribute for the underlying element.
     */
    muted?: boolean;
    /**
     * A styles that will be applied on the video element.
     */
    style: Object;
}
/**
 * Component that renders a video element for a passed in video track and
 * notifies the store when the video has started playing.
 *
 * @augments AbstractVideoTrack
 */
declare class VideoTrack extends AbstractVideoTrack<IProps> {
    /**
     * Default values for {@code VideoTrack} component's properties.
     *
     * @static
     */
    static defaultProps: {
        className: string;
        id: string;
    };
    /**
     * Renders the video element.
     *
     * @override
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof VideoTrack, import("react-redux").Omit<Pick<React.ClassAttributes<VideoTrack> & IProps, "style" | "dispatch" | "muted" | "onPress" | "eventHandlers" | "videoTrack" | "zOrder" | "zoomEnabled" | "waitForVideoStarted" | "_noAutoPlayVideo" | keyof React.ClassAttributes<VideoTrack>> & Partial<Pick<React.ClassAttributes<VideoTrack> & IProps, "id" | "className">> & Partial<Pick<{
    className: string;
    id: string;
}, never>>, "dispatch" | "_noAutoPlayVideo">>;
export default _default;
