import React from 'react';
import AbstractVideoManager, { IProps } from './AbstractVideoManager';
/**
 * Manager of shared video.
 *
 * @returns {void}
 */
declare class YoutubeVideoManager extends AbstractVideoManager {
    isPlayerAPILoaded: boolean;
    player?: any;
    /**
     * Initializes a new YoutubeVideoManager instance.
     *
     * @param {Object} props - This component's props.
     *
     * @returns {void}
     */
    constructor(props: IProps);
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
    isMuted(): any;
    /**
     * Retrieves current volume.
     *
     * @returns {number}
     */
    getVolume(): any;
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
    seek(time: number): any;
    /**
     * Plays video.
     *
     * @returns {void}
     */
    play(): any;
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    pause(): any;
    /**
     * Mutes video.
     *
     * @returns {void}
     */
    mute(): any;
    /**
     * Unmutes video.
     *
     * @returns {void}
     */
    unMute(): any;
    /**
     * Disposes of the current video player.
     *
     * @returns {void}
     */
    dispose(): void;
    /**
     * Fired on play state toggle.
     *
     * @param {Object} event - The yt player stateChange event.
     *
     * @returns {void}
     */
    onPlayerStateChange: (event: any) => void;
    /**
     * Fired when youtube player is ready.
     *
     * @param {Object} event - The youtube player event.
     *
     * @returns {void}
     */
    onPlayerReady: (event: any) => void;
    getPlayerOptions: () => {
        id: string;
        opts: {
            height: string;
            width: string;
            playerVars: {
                origin: string;
                fs: string;
                autoplay: number;
                controls: number;
                rel: number;
            };
        };
        onError: (e: any) => void;
        onReady: (event: any) => void;
        onStateChange: (event: any) => void;
        videoId: string;
    };
    /**
     * Implements React Component's render.
     *
     * @inheritdoc
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof YoutubeVideoManager, import("react-redux").Omit<React.ClassAttributes<YoutubeVideoManager> & IProps, "_conference" | "_dockToolbox" | "_muted" | "_displayWarning" | "_isLocalAudioMuted" | "_isOwner" | "_muteLocal" | "_ownerId" | "_setSharedVideoStatus" | "_status" | "_stopSharedVideo" | "_time" | "_videoUrl">>;
export default _default;
