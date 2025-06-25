import { IStore } from '../app/types';
/**
 * Action to create a breakout room.
 *
 * @param {string} name - Name / subject for the breakout room.
 * @returns {Function}
 */
export declare function createBreakoutRoom(name?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to close a room and send participants to the main room.
 *
 * @param {string} roomId - The id of the room to close.
 * @returns {Function}
 */
export declare function closeBreakoutRoom(roomId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to rename a breakout room.
 *
 * @param {string} breakoutRoomJid - The jid of the breakout room to rename.
 * @param {string} name - New name / subject for the breakout room.
 * @returns {Function}
 */
export declare function renameBreakoutRoom(breakoutRoomJid: string, name?: string): (_dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to remove a breakout room.
 *
 * @param {string} breakoutRoomJid - The jid of the breakout room to remove.
 * @returns {Function}
 */
export declare function removeBreakoutRoom(breakoutRoomJid: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to auto-assign the participants to breakout rooms.
 *
 * @returns {Function}
 */
export declare function autoAssignToBreakoutRooms(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to send a participant to a room.
 *
 * @param {string} participantId - The participant id.
 * @param {string} roomId - The room id.
 * @returns {Function}
 */
export declare function sendParticipantToRoom(participantId: string, roomId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Action to move to a room.
 *
 * @param {string} roomId - The room id to move to. If omitted move to the main room.
 * @returns {Function}
 */
export declare function moveToRoom(roomId?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
