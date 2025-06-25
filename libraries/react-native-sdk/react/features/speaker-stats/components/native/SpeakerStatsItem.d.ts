/// <reference types="react" />
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
     * True if the participant is no longer in the meeting.
     */
    hasLeft: boolean;
    /**
     * True if the participant is currently the dominant speaker.
     */
    isDominantSpeaker: boolean;
    /**
     * The id of the user.
     */
    participantId: string;
}
declare const SpeakerStatsItem: (props: IProps) => JSX.Element;
export default SpeakerStatsItem;
