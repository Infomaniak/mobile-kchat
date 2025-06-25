/// <reference types="react" />
import { BREAKOUT_CONTEXT_MENU_ACTIONS as ACTIONS } from '../../../participants-pane/types';
import { IRoom } from '../../types';
export interface IProps {
    /**
     * The actions that will be displayed.
     */
    actions: Array<ACTIONS>;
    /**
     * The room for which the menu is open.
     */
    room: IRoom;
}
declare const BreakoutRoomContextMenu: ({ room, actions }: IProps) => JSX.Element;
export default BreakoutRoomContextMenu;
