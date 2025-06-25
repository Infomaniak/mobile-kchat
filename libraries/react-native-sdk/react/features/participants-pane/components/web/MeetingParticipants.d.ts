/// <reference types="react" />
export interface IProps {
    currentRoom?: {
        jid: string;
        name: string;
    };
    overflowDrawer?: boolean;
    participantsCount?: number;
    searchString: string;
    setSearchString: (newValue: string) => void;
    showInviteButton?: boolean;
    sortedParticipantIds?: Array<string>;
}
/**
 * Renders the MeetingParticipantList component.
 * NOTE: This component is not using useSelector on purpose. The child components MeetingParticipantItem
 * and MeetingParticipantContextMenu are using connect. Having those mixed leads to problems.
 * When this one was using useSelector and the other two were not -the other two were re-rendered before this one was
 * re-rendered, so when participant is leaving, we first re-render the item and menu components,
 * throwing errors (closing the page) before removing those components for the participant that left.
 *
 * @returns {ReactNode} - The component.
 */
declare function MeetingParticipants({ currentRoom, overflowDrawer, participantsCount, searchString, setSearchString, showInviteButton, sortedParticipantIds }: IProps): JSX.Element;
declare const _default: import("react-redux").ConnectedComponent<typeof MeetingParticipants, import("react-redux").Omit<IProps, "overflowDrawer" | "currentRoom" | "participantsCount" | "showInviteButton" | "sortedParticipantIds">>;
export default _default;
