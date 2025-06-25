import { Component } from 'react';
import { IStore } from '../../../app/types';
/**
 * The type of the React {@code Component} props of {@link AbstractVideoTrack}.
 */
export interface IProps {
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
     * Callback to invoke when the {@link Video} of {@code AbstractVideoTrack}
     * is clicked/pressed.
     */
    onPress?: Function;
    /**
     * The Redux representation of the participant's video track.
     */
    videoTrack?: any;
    /**
     * Whether or not video should be rendered after knowing video playback has
     * started.
     */
    waitForVideoStarted?: boolean;
    /**
     * The z-order of the Video of AbstractVideoTrack in the stacking space of
     * all Videos. For more details, refer to the zOrder property of the Video
     * class for React Native.
     */
    zOrder?: number;
    /**
     * Indicates whether zooming (pinch to zoom and/or drag) is enabled.
     */
    zoomEnabled?: boolean;
}
/**
 * Implements a React {@link Component} that renders video element for a
 * specific video track.
 *
 * @abstract
 */
export default class AbstractVideoTrack<P extends IProps> extends Component<P> {
    /**
     * Initializes a new AbstractVideoTrack instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: P);
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
    /**
     * Handler for case when video starts to play.
     *
     * @private
     * @returns {void}
     */
    _onVideoPlaying(): void;
}
