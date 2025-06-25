/// <reference types="react" />
import { FaceLandmarks } from '../../../face-landmarks/types';
/**
 * The type of the React {@code Component} props of {@link SpeakerStatsItem}.
 */
export interface IProps {
    /**
     * The name of the participant.
     */
    displayName: string;
    /**
     * The total milliseconds the participant has been dominant speaker.
     */
    dominantSpeakerTime: number;
    /**
     * The object that has as keys the face expressions of the
     * participant and as values a number that represents the count .
     */
    faceLandmarks?: FaceLandmarks[];
    /**
     * True if the participant is no longer in the meeting.
     */
    hasLeft: boolean;
    /**
     * True if the participant is not shown in speaker stats.
     */
    hidden: boolean;
    /**
     * True if the participant is currently the dominant speaker.
     */
    isDominantSpeaker: boolean;
    /**
     * The id of the user.
     */
    participantId: string;
    /**
     * True if the face expressions detection is not disabled.
     */
    showFaceExpressions: boolean;
    /**
     * Invoked to obtain translated strings.
     */
    t: Function;
}
declare const SpeakerStatsItem: (props: IProps) => JSX.Element;
export default SpeakerStatsItem;
