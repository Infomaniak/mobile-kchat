import React, { PureComponent } from 'react';
import { IStore } from '../../app/types';
import { ITrack } from '../../base/tracks/types';
/**
 * The type of the React {@link Component} props of {@link LargeVideo}.
 */
export interface IProps {
    /**
     * Whether video should be disabled.
     */
    _disableVideo: boolean;
    /**
     * Application's viewport height.
     */
    _height: number;
    /**
     * The ID of the participant (to be) depicted by LargeVideo.
     *
     * @private
     */
    _participantId: string;
    /**
     * The video track that will be displayed in the thumbnail.
     */
    _videoTrack?: ITrack;
    /**
     * Application's viewport height.
     */
    _width: number;
    /**
     * Invoked to trigger state changes in Redux.
     */
    dispatch: IStore['dispatch'];
    /**
     * Callback to invoke when the {@code LargeVideo} is clicked/pressed.
     */
    onClick?: Function;
}
/**
 * The type of the React {@link Component} state of {@link LargeVideo}.
 */
export interface IState {
    /**
     * Size for the Avatar. It will be dynamically adjusted based on the
     * available size.
     */
    avatarSize: number;
    /**
     * Whether the connectivity indicator will be shown or not. It will be true
     * by default, but it may be turned off if there is not enough space.
     */
    useConnectivityInfoLabel: boolean;
}
/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on mobile/React Native.
 *
 * @augments Component
 */
declare class LargeVideo extends PureComponent<IProps, IState> {
    /**
     * Creates new LargeVideo component.
     *
     * @param {IProps} props - The props of the component.
     * @returns {LargeVideo}
     */
    constructor(props: IProps);
    state: {
        avatarSize: number;
        useConnectivityInfoLabel: boolean;
    };
    /**
     * Handles dimension changes. In case we deem it's too
     * small, the connectivity indicator won't be rendered and the avatar
     * will occupy the entirety of the available screen state.
     *
     * @inheritdoc
     */
    static getDerivedStateFromProps(props: IProps): {
        avatarSize: number;
        useConnectivityInfoLabel: boolean;
    };
    /**
     * Starts listening for track streaming status updates after the initial render.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidMount(): void;
    /**
     * Stops listening for track streaming status updates on the old track and starts listening instead on the new
     * track.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps: IProps): void;
    /**
     * Remove listeners for track streaming status update.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount(): void;
    /**
     * Handle track streaming status change event by by dispatching an action to update track streaming status for the
     * given track in app state.
     *
     * @param {JitsiTrack} jitsiTrack - The track with streaming status updated.
     * @param {JitsiTrackStreamingStatus} streamingStatus - The updated track streaming status.
     * @returns {void}
     */
    handleTrackStreamingStatusChanged(jitsiTrack: any, streamingStatus: string): void;
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render(): JSX.Element;
}
declare const _default: import("react-redux").ConnectedComponent<typeof LargeVideo, import("react-redux").Omit<React.ClassAttributes<LargeVideo> & IProps, "dispatch" | "_videoTrack" | "_disableVideo" | "_height" | "_participantId" | "_width">>;
export default _default;
