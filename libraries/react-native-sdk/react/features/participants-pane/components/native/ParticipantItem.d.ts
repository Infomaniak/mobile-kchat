import React from 'react';
import { GestureResponderEvent } from 'react-native';
import { type MediaState } from '../../constants';
export interface IProps {
    /**
     * Media state for audio.
     */
    audioMediaState?: MediaState;
    /**
     * React children.
     */
    children?: React.ReactNode;
    /**
     * Whether or not to disable the moderator indicator.
     */
    disableModeratorIndicator?: boolean;
    /**
     * The name of the participant. Used for showing lobby names.
     */
    displayName: string;
    /**
     * Is the participant waiting?
     */
    isKnockingParticipant?: boolean;
    /**
     * Whether or not the user is a moderator.
     */
    isModerator?: boolean;
    /**
     * True if the participant is local.
     */
    local?: boolean;
    /**
     * Callback to be invoked on pressing the participant item.
     */
    onPress?: (e?: GestureResponderEvent) => void;
    /**
     * The ID of the participant.
     */
    participantID: string;
    /**
     * True if the participant have raised hand.
     */
    raisedHand?: boolean;
    /**
     * Media state for video.
     */
    videoMediaState?: MediaState;
}
/**
 * Participant item.
 *
 * @returns {React$Element<any>}
 */
declare function ParticipantItem({ children, displayName, disableModeratorIndicator, isKnockingParticipant, isModerator, local, onPress, participantID, raisedHand, audioMediaState, videoMediaState }: IProps): JSX.Element;
export default ParticipantItem;
