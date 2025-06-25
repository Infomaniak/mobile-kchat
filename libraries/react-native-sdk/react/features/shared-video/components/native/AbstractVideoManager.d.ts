import { PureComponent } from 'react';
import { IReduxState, IStore } from '../../../app/types';
import { IJitsiConference } from '../../../base/conference/reducer';
/**
 * The type of the React {@link Component} props of {@link AbstractVideoManager}.
 */
export interface IProps {
    /**
     * The current conference.
     */
    _conference?: IJitsiConference;
    /**
     * Is the video shared by the local user.
     *
     * @private
     */
    _isOwner: boolean;
    /**
     * The shared video owner id.
     */
    _ownerId?: string;
    /**
     * The shared video status.
     */
    _status?: string;
    /**
     * Seek time in seconds.
     *
     */
    _time: number;
    /**
     * The video url.
     */
    _videoUrl?: string;
    /**
     * The Redux dispatch function.
     */
    dispatch: IStore['dispatch'];
    /**
      * The player's height.
    */
    height: number;
    /**
      * The video id.
    */
    videoId: string;
    /**
      * The player's width.
    */
    width: number;
}
/**
 * Manager of shared video.
 */
declare abstract class AbstractVideoManager<S = void> extends PureComponent<IProps, S> {
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
    componentDidUpdate(): void;
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
    processUpdatedProps(): Promise<void>;
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
     * Dispatches an update action for the shared video.
     *
     * @returns {void}
     */
    fireUpdateSharedVideoEvent(): Promise<void>;
    /**
     * Seeks video to provided time.
     */
    abstract seek(time: number): void;
    /**
     * Indicates the playback state of the video.
     */
    abstract getPlaybackStatus(): string;
    /**
     * Plays video.
     */
    abstract play(): void;
    /**
     * Pauses video.
     *
     * @returns {void}
     */
    abstract pause(): void;
    /**
     * Retrieves current time.
     */
    abstract getTime(): number;
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
    _isOwner: boolean;
    _ownerId: string | undefined;
    _status: string | undefined;
    _time: number;
    _videoUrl: string | undefined;
};
