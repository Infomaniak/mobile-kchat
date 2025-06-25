/// <reference types="react" />
import { IRoom } from '../../types';
export interface IProps {
    /**
     * Room to display.
     */
    room: IRoom;
    roomId: string;
}
export declare const CollapsibleRoom: ({ room, roomId }: IProps) => JSX.Element;
