/// <reference types="react" />
export interface IProps {
    /**
    * True if the message is a lobby chat message.
    */
    isLobbyMessage: boolean;
    /**
     * The ID of the participant that the message is to be sent.
     */
    participantID: string;
    /**
     * Whether the button should be visible or not.
     */
    visible?: boolean;
}
declare const PrivateMessageButton: ({ participantID, isLobbyMessage, visible }: IProps) => JSX.Element | null;
export default PrivateMessageButton;
