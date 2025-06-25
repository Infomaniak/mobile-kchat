import React from 'react';
import AbstractVideoManager, { IProps } from './AbstractVideoManager';
/**
 * Manager of shared video.
 */
declare class VideoManager extends AbstractVideoManager {
    playerRef: React.RefObject<HTMLVideoElement>;
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
    get player(): HTMLVideoElement | null;
    /**
     * Indicates the playback state of the video.
     *
     * @returns {string}
     */
    getPlaybackStatus(): string | undefined;
    /**
     * Indicates whether the video is muted.
     *
     * @returns {boolean}
     */
    isMuted(): boolean | undefined;
    /**
     * Retrieves current volume.
     *
     * @returns {number}
     */
    getVolume(): number;
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
    play(): Promise<void> | undefined;
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause(): void | undefined;
    /**
     * Mutes video.
     *
     * @returns {void}
     */
    mute(): void;
    /**
     * Unmutes video.
     *
     * @returns {void}
     */
    unMute(): void;
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
declare const _default: import("react-redux").ConnectedComponent<typeof VideoManager, import("react-redux").Omit<React.ClassAttributes<VideoManager> & IProps, "_conference" | "_dockToolbox" | "_muted" | "_displayWarning" | "_isLocalAudioMuted" | "_isOwner" | "_muteLocal" | "_ownerId" | "_setSharedVideoStatus" | "_status" | "_stopSharedVideo" | "_time" | "_videoUrl">>;
export default _default;
