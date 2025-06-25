import React from 'react';
import { IRoom } from '../../../../../breakout-rooms/types';
export interface IProps {
    /**
     * Type of trigger for the breakout room actions.
     */
    actionsTrigger?: string;
    /**
     * React children.
     */
    children: React.ReactNode;
    /**
     * Is this item highlighted/raised.
     */
    isHighlighted?: boolean;
    /**
     * Callback for when the mouse leaves this component.
     */
    onLeave?: (e?: React.MouseEvent) => void;
    /**
     * Callback to raise menu. Used to raise menu on mobile long press.
     */
    onRaiseMenu: Function;
    /**
     * The raise context for the participant menu.
     */
    participantContextEntity?: {
        jid: string;
        participantName: string;
        room: IRoom;
    };
    /**
     * Callback to raise participant context menu.
     */
    raiseParticipantContextMenu: Function;
    /**
     * Room reference.
     */
    room: {
        id: string;
        name: string;
        participants: {
            [jid: string]: {
                displayName: string;
                jid: string;
            };
        };
    };
    /**
     * Participants search string.
     */
    searchString: string;
    /**
     * Toggles the room participant context menu.
     */
    toggleParticipantMenu: Function;
}
export declare const CollapsibleRoom: ({ actionsTrigger, children, isHighlighted, onRaiseMenu, onLeave, participantContextEntity, raiseParticipantContextMenu, room, searchString, toggleParticipantMenu }: IProps) => JSX.Element;
