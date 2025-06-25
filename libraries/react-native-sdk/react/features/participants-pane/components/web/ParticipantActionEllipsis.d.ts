/// <reference types="react" />
export interface IProps {
    /**
     * Label used for accessibility.
     */
    accessibilityLabel: string;
    /**
     * Click handler function.
     */
    onClick: () => void;
    participantID?: string;
}
declare const ParticipantActionEllipsis: ({ accessibilityLabel, onClick, participantID }: IProps) => JSX.Element;
export default ParticipantActionEllipsis;
