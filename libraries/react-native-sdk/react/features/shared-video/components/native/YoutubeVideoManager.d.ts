import React, { RefObject } from 'react';
import Video from 'react-native-youtube-iframe';
import AbstractVideoManager, { IProps } from './AbstractVideoManager';
export interface IState {
    paused: boolean;
}
/**
 * Manager of youtube shared video.
 */
declare class YoutubeVideoManager extends AbstractVideoManager<IState> {
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
    get player(): React.VFC<import("react-native-youtube-iframe").YoutubeIframeProps> | null;
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
    getTime(): any;
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
     * Handles state change event.
     *
     * @param {string} event - State event.
     * @returns {void}
     */
    _onChangeState(event: string): void;
    /**
     * Handles onReady event.
     *
     * @returns {void}
     */
    _onReady(): void;
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
declare const _default: import("react-redux").ConnectedComponent<typeof YoutubeVideoManager, import("react-redux").Omit<React.ClassAttributes<YoutubeVideoManager> & IProps, "dispatch" | "_conference" | "_status" | "_isOwner" | "_ownerId" | "_time" | "_videoUrl">>;
export default _default;
