/// <reference types="react" />
import { IRoom } from '../../../breakout-rooms/types';
import { IButtonProps } from '../../types';
export interface IProps extends IButtonProps {
    /**
     * Click handler.
     */
    onClick?: Function;
    /**
     * The room to send the participant to.
     */
    room: IRoom;
}
declare const SendToRoomButton: ({ notifyClick, notifyMode, onClick, participantID, room }: IProps) => JSX.Element;
export default SendToRoomButton;
