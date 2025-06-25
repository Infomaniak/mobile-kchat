import { IStateful } from '../base/app/types';
import { IRoom, IRooms, IRoomsInfo } from './types';
/**
 * Returns the rooms object for breakout rooms.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object} Object of rooms.
 */
export declare const getBreakoutRooms: (stateful: IStateful) => IRooms;
/**
 * Returns the main room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {IRoom|undefined} The main room object, or undefined.
 */
export declare const getMainRoom: (stateful: IStateful) => IRoom | undefined;
/**
 * Returns the rooms info.
 *
 * @param {IStateful} stateful - The redux store, the redux.

* @returns {IRoomsInfo} The rooms info.
 */
export declare const getRoomsInfo: (stateful: IStateful) => IRoomsInfo;
/**
 * Returns the room by Jid.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @param {string} roomJid - The jid of the room.
 * @returns {IRoom|undefined} The main room object, or undefined.
 */
export declare const getRoomByJid: (stateful: IStateful, roomJid: string) => IRoom | undefined;
/**
 * Returns the id of the current room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {string} Room id or undefined.
 */
export declare const getCurrentRoomId: (stateful: IStateful) => any;
/**
 * Determines whether the local participant is in a breakout room.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {boolean}
 */
export declare const isInBreakoutRoom: (stateful: IStateful) => any;
/**
 * Returns the breakout rooms config.
 *
 * @param {IStateful} stateful - The redux store, the redux
 * {@code getState} function, or the redux state itself.
 * @returns {Object}
 */
export declare const getBreakoutRoomsConfig: (stateful: IStateful) => {
    hideAddRoomButton?: boolean | undefined;
    hideAutoAssignButton?: boolean | undefined;
    hideJoinRoomButton?: boolean | undefined;
};
/**
 * Returns whether the add breakout room button is visible.
 *
 * @param {IStateful} stateful - Global state.
 * @returns {boolean}
 */
export declare const isAddBreakoutRoomButtonVisible: (stateful: IStateful) => any;
/**
 * Returns whether the auto assign participants to breakout rooms button is visible.
 *
 * @param {IStateful} stateful - Global state.
 * @returns {boolean}
 */
export declare const isAutoAssignParticipantsVisible: (stateful: IStateful) => boolean;
