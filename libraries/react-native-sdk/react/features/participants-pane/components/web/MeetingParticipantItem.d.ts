import React from 'react';
import { IParticipant } from '../../../base/participants/types';
import { ITrack } from '../../../base/tracks/types';
import { type MediaState } from '../../constants';
export interface IProps {
    /**
     * Media state for audio.
     */
    _audioMediaState: MediaState;
    /**
     * The audio track related to the participant.
     */
    _audioTrack?: ITrack;
    /**
     * Whether or not to disable the moderator indicator.
     */
    _disableModeratorIndicator: boolean;
    /**
     * The display name of the participant.
     */
    _displayName: string;
    /**
     * Whether or not moderation is supported.
     */
    _isModerationSupported: boolean;
    /**
     * True if the participant is the local participant.
     */
    _local: boolean;
    /**
     * Whether or not the local participant is moderator.
     */
    _localModerator: boolean;
    /**
     * Shared video local participant owner.
     */
    _localVideoOwner: boolean;
    /**
     * Whether or not the participant name matches the search string.
     */
    _matchesSearch: boolean;
    /**
     * The participant.
     */
    _participant?: IParticipant;
    /**
     * The participant ID.
     *
     * NOTE: This ID may be different from participantID prop in the case when we pass undefined for the local
     * participant. In this case the local participant ID will be filled through _participantID prop.
     */
    _participantID: string;
    /**
     * The type of button to be rendered for the quick action.
     */
    _quickActionButtonType: string;
    /**
     * True if the participant have raised hand.
     */
    _raisedHand: boolean;
    /**
     * Media state for video.
     */
    _videoMediaState: MediaState;
    /**
     * The translated ask unmute text for the quick action buttons.
     */
    askUnmuteText: string;
    /**
     * Is this item highlighted.
     */
    isHighlighted: boolean;
    /**
     * Whether or not the local participant is in a breakout room.
     */
    isInBreakoutRoom: boolean;
    /**
     * Callback used to open a confirmation dialog for audio muting.
     */
    muteAudio: Function;
    /**
     * The translated text for the mute participant button.
     */
    muteParticipantButtonText: string;
    /**
     * Callback for the activation of this item's context menu.
     */
    onContextMenu: () => void;
    /**
     * Callback for the mouse leaving this item.
     */
    onLeave: (e?: React.MouseEvent) => void;
    /**
     * Callback used to open an actions drawer for a participant.
     */
    openDrawerForParticipant: Function;
    /**
     * True if an overflow drawer should be displayed.
     */
    overflowDrawer: boolean;
    /**
     * The aria-label for the ellipsis action.
     */
    participantActionEllipsisLabel: string;
    /**
     * The ID of the participant.
     */
    participantID?: string;
    /**
     * Callback used to stop a participant's video.
    */
    stopVideo: Function;
    /**
     * The translated "you" text.
     */
    youText: string;
}
/**
 * Implements the MeetingParticipantItem component.
 *
 * @param {IProps} props - The props of the component.
 * @returns {ReactElement}
 */
declare function MeetingParticipantItem({ _audioMediaState, _audioTrack, _disableModeratorIndicator, _displayName, _local, _localVideoOwner, _matchesSearch, _participant, _participantID, _quickActionButtonType, _raisedHand, _videoMediaState, isHighlighted, isInBreakoutRoom, muteAudio, onContextMenu, onLeave, openDrawerForParticipant, overflowDrawer, participantActionEllipsisLabel, stopVideo, youText }: IProps): JSX.Element | null;
declare const _default: import("react-redux").ConnectedComponent<typeof MeetingParticipantItem, any>;
export default _default;
