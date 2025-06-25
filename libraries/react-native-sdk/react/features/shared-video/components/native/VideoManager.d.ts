import React, { RefObject } from 'react';
import Video from 'react-native-video';
import AbstractVideoManager, { IProps } from './AbstractVideoManager';
export interface IState {
    currentTime: number;
    paused: boolean;
}
/**
 * Manager of shared video.
 */
declare class VideoManager extends AbstractVideoManager<IState> {
    playerRef: RefObject<typeof Video>;
    /**
     * Initializes a new VideoManager instance.
     *
     * @param {Object} props - This component's props.
     *
     * @returns {void}
     */
    constructor(props: IProps);
    /**
     * Retrieves the current player ref.
     */
    get player(): React.ForwardRefExoticComponent<import("react-native-video").ReactVideoProps & React.RefAttributes<import("react-native-video").VideoRef>> | null;
    /**
     * Indicates the playback state of the video.
     *
     * @returns {string}
     */
    getPlaybackStatus(): string;
    /**
     * Retrieves current time.
     *
     * @returns {number}
     */
    getTime(): number;
    /**
     * Seeks video to provided time.
     *
     * @param {number} time - The time to seek to.
     *
     * @returns {void}
     */
    seek(time: number): void;
    /**
     * Plays video.
     *
     * @returns {void}
     */
    play(): void;
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause(): void;
    /**
     * Handles playback rate changed event.
     *
     * @param {Object} options.playbackRate - Playback rate: 1 - playing, 0 - paused, other - slowed down / sped up.
     * @returns {void}
     */
    onPlaybackRateChange({ playbackRate }: {
        playbackRate: number;
    }): void;
    /**
     * Handles progress update event.
     *
     * @param {Object} options - Progress event options.
     * @returns {void}
     */
    onProgress(options: {
        currentTime: number;
    }): void;
    /**
     * Retrieves video tag params.
     *
     * @returns {void}
     */
    getPlayerOptions(): any;
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof VideoManager, import("react-redux").Omit<React.ClassAttributes<VideoManager> & IProps, "dispatch" | "_conference" | "_status" | "_isOwner" | "_ownerId" | "_time" | "_videoUrl">>;
export default _default;
