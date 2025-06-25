import { PureComponent } from 'react';
import { IReduxState, IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
/**
 * The type of the React {@link PureComponent} props of {@link AbstractVideoManager}.
 */
export interface IProps {
    /**
     * The current conference.
     */
    _conference?: IJitsiConference;
    /**
     * Warning that indicates an incorrect video url.
     */
    _displayWarning: Function;
    /**
     * Docks the toolbox.
     */
    _dockToolbox: Function;
    /**
     * Indicates whether the local audio is muted.
    */
    _isLocalAudioMuted: boolean;
    /**
     * Is the video shared by the local user.
     *
     * @private
     */
    _isOwner: boolean;
    /**
     * Mutes local audio track.
     */
    _muteLocal: Function;
    /**
     * Store flag for muted state.
     */
    _muted?: boolean;
    /**
     * The shared video owner id.
     */
    _ownerId?: string;
    /**
     * Updates the shared video status.
     */
    _setSharedVideoStatus: Function;
    /**
     * The shared video status.
     */
    _status?: string;
    /**
     * Action to stop video sharing.
    */
    _stopSharedVideo: Function;
    /**
     * Seek time in seconds.
     *
     */
    _time?: number;
    /**
     * The video url.
     */
    _videoUrl?: string;
    /**
      * The video id.
      */
    videoId: string;
}
/**
 * Manager of shared video.
 */
declare class AbstractVideoManager extends PureComponent<IProps> {
    throttledFireUpdateSharedVideoEvent: Function;
    /**
     * Initializes a new instance of AbstractVideoManager.
     *
     * @param {IProps} props - Component props.
     * @returns {void}
     */
    constructor(props: IProps);
    /**
     * Implements React Component's componentDidMount.
     *
     * @inheritdoc
     */
    componentDidMount(): void;
    /**
     * Implements React Component's componentDidUpdate.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Implements React Component's componentWillUnmount.
     *
     * @inheritdoc
     */
    componentWillUnmount(): void;
    /**
     * Processes new properties.
     *
     * @returns {void}
     */
    processUpdatedProps(): void;
    /**
     * Handle video error.
     *
     * @param {Object|undefined} e - The error returned by the API or none.
     * @returns {void}
     */
    onError(e?: any): void;
    /**
     * Handle video playing.
     *
     * @returns {void}
     */
    onPlay(): void;
    /**
     * Handle video paused.
     *
     * @returns {void}
     */
    onPause(): void;
    /**
     * Handle volume changed.
     *
     * @returns {void}
     */
    onVolumeChange(): void;
    /**
     * Handle changes to the shared playing video.
     *
     * @returns {void}
     */
    fireUpdatePlayingVideoEvent(): void;
    /**
     * Dispatches an update action for the shared video.
     *
     * @returns {void}
     */
    fireUpdateSharedVideoEvent(): void;
    /**
     * Indicates if the player volume is currently on. This will return true if
     * we have an available player, which is currently in a PLAYING state,
     * which isn't muted and has it's volume greater than 0.
     *
     * @returns {boolean} Indicating if the volume of the shared video is
     * currently on.
     */
    isSharedVideoVolumeOn(): boolean;
    /**
     * Smart mike mute. If the mike isn't currently muted and the shared video
     * volume is on we mute the mike.
     *
     * @returns {void}
     */
    smartAudioMute(): void;
    /**
     * Seeks video to provided time.
     *
     * @param {number} _time - Time to seek to.
     * @returns {void}
     */
    seek(_time: number): void;
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
     * Retrieves current time.
     *
     * @returns {number}
     */
    getTime(): number;
    /**
     * Disposes current video player.
     *
     * @returns {void}
     */
    dispose(): void;
}
export default AbstractVideoManager;
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @returns {IProps}
 */
export declare function _mapStateToProps(state: IReduxState): {
    _conference: IJitsiConference | undefined;
    _isLocalAudioMuted: boolean;
    _isOwner: boolean;
    _muted: boolean | undefined;
    _ownerId: string | undefined;
    _status: string | undefined;
    _time: number | undefined;
    _videoUrl: string | undefined;
};
/**
 * Maps part of the props of this component to Redux actions.
 *
 * @param {Function} dispatch - The Redux dispatch function.
 * @returns {IProps}
 */
export declare function _mapDispatchToProps(dispatch: IStore['dispatch']): {
    _displayWarning: () => void;
    _dockToolbox: (value: boolean) => void;
    _stopSharedVideo: () => void;
    _muteLocal: (value: boolean) => void;
    _setSharedVideoStatus: ({ videoUrl, status, time, ownerId, muted }: any) => void;
};
