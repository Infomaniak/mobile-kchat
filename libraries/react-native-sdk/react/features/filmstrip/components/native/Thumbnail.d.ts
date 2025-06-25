import { PureComponent } from 'react';
import { IStore } from '../../../app/types';
import { FakeParticipant } from '../../../base/participants/types';
import { ITrack } from '../../../base/tracks/types';
/**
 * Thumbnail component's property types.
 */
export interface IProps {
    /**
     * Whether local audio (microphone) is muted or not.
     */
    _audioMuted: boolean;
    /**
     * The type of participant if the participant is fake.
     */
    _fakeParticipant?: FakeParticipant;
    /**
     * URL of GIF sent by this participant, null if there's none.
     */
    _gifSrc?: string;
    /**
     * Indicates whether the participant is screen sharing.
     */
    _isScreenShare: boolean;
    /**
     * Indicates whether the thumbnail is for a virtual screenshare participant.
     */
    _isVirtualScreenshare: boolean;
    /**
     * Indicates whether the participant is local.
     */
    _local?: boolean;
    /**
     * Shared video local participant owner.
     */
    _localVideoOwner: boolean;
    /**
     * The ID of the participant obtain from the participant object in Redux.
     *
     * NOTE: Generally it should be the same as the participantID prop except the case where the passed
     * participantID doesn't correspond to any of the existing participants.
     */
    _participantId: string;
    /**
     * Indicates whether the participant is pinned or not.
     */
    _pinned?: boolean;
    /**
     * Whether or not the participant has the hand raised.
     */
    _raisedHand: boolean;
    /**
     * Whether to show the dominant speaker indicator or not.
     */
    _renderDominantSpeakerIndicator?: boolean;
    /**
     * Whether to show the moderator indicator or not.
     */
    _renderModeratorIndicator: boolean;
    _shouldDisplayTileView: boolean;
    /**
     * The video track that will be displayed in the thumbnail.
     */
    _videoTrack?: ITrack;
    /**
     * Invoked to trigger state changes in Redux.
     */
    dispatch: IStore['dispatch'];
    /**
     * The height of the thumbnail.
     */
    height?: number;
    /**
     * The ID of the participant related to the thumbnail.
     */
    participantID?: string;
    /**
     * Whether to display or hide the display name of the participant in the thumbnail.
     */
    renderDisplayName?: boolean;
    /**
     * If true, it tells the thumbnail that it needs to behave differently. E.g. React differently to a single tap.
     */
    tileView?: boolean;
}
/**
 * React component for video thumbnail.
 */
declare class Thumbnail extends PureComponent<IProps> {
    /**
     * Creates new Thumbnail component.
     *
     * @param {IProps} props - The props of the component.
     * @returns {Thumbnail}
     */
    constructor(props: IProps);
    /**
     * Thumbnail click handler.
     *
     * @returns {void}
     */
    _onClick(): void;
    /**
     * Thumbnail long press handler.
     *
     * @returns {void}
     */
    _onThumbnailLongPress(): void;
    /**
     * Renders the indicators for the thumbnail.
     *
     * @returns {ReactElement}
     */
    _renderIndicators(): JSX.Element[];
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
declare const _default: import("react-redux").ConnectedComponent<typeof Thumbnail, any>;
export default _default;
