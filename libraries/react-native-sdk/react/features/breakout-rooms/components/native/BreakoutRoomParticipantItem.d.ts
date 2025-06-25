/// <reference types="react" />
import { IRoom } from '../../types';
export interface IProps {
    /**
     * Participant to be displayed.
     */
    item: any;
    /**
     * The room the participant is in.
     */
    room: IRoom;
}
declare const BreakoutRoomParticipantItem: ({ item, room }: IProps) => JSX.Element;
export default BreakoutRoomParticipantItem;
