/// <reference types="react" />
export interface IProps {
    /**
     * Room and participant jid reference.
     */
    entity?: {
        jid: string;
        participantName: string;
        room: any;
    };
    /**
     * Target elements against which positioning calculations are made.
     */
    offsetTarget?: HTMLElement | null;
    /**
     * Callback for the mouse entering the component.
     */
    onEnter: () => void;
    /**
     * Callback for the mouse leaving the component.
     */
    onLeave: () => void;
    /**
     * Callback for making a selection in the menu.
     */
    onSelect: (force?: any) => void;
}
export declare const RoomParticipantContextMenu: ({ entity, offsetTarget, onEnter, onLeave, onSelect }: IProps) => JSX.Element | null;
