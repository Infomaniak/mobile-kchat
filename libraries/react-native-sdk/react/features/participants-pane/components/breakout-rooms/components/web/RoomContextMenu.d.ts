import React from 'react';
import { IRoom } from '../../../../../breakout-rooms/types';
export interface IProps {
    /**
     * Room reference.
     */
    entity?: IRoom;
    /**
     * Target elements against which positioning calculations are made.
     */
    offsetTarget?: HTMLElement | null;
    /**
     * Callback for the mouse entering the component.
     */
    onEnter: (e?: React.MouseEvent) => void;
    /**
     * Callback for the mouse leaving the component.
     */
    onLeave: (e?: React.MouseEvent) => void;
    /**
     * Callback for making a selection in the menu.
     */
    onSelect: (e?: React.MouseEvent | boolean) => void;
}
export declare const RoomContextMenu: ({ entity: room, offsetTarget, onEnter, onLeave, onSelect }: IProps) => JSX.Element;
