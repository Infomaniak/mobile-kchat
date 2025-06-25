/// <reference types="react" />
export interface IProps {
    /**
     * The translated ask unmute aria label.
     */
    ariaLabel?: boolean;
    /**
     * The translated "ask unmute" text.
     */
    askUnmuteText?: string;
    /**
     * The type of button to be displayed.
     */
    buttonType: string;
    /**
     * Callback used to open a confirmation dialog for audio muting.
     */
    muteAudio: Function;
    /**
     * Label for mute participant button.
     */
    muteParticipantButtonText?: string;
    /**
     * The ID of the participant.
     */
    participantID: string;
    /**
     * The name of the participant.
     */
    participantName: string;
    /**
     * Callback used to stop a participant's video.
     */
    stopVideo: Function;
}
declare const ParticipantQuickAction: ({ buttonType, muteAudio, participantID, participantName, stopVideo }: IProps) => JSX.Element | null;
export default ParticipantQuickAction;
