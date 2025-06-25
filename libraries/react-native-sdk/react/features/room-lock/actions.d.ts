/// <reference types="react" />
import { IStore } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
/**
 * Cancels a prompt for a password to join a specific conference/room.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference} requesting
 * the password to join.
 * @protected
 * @returns {Function}
 */
export declare function _cancelPasswordRequiredPrompt(conference: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Ends a (user) request to lock a specific conference/room.
 *
 * @param {JitsiConference} conference - The JitsiConference to lock.
 * @param {string|undefined} password - The password with which the specified
 * conference is to be locked or undefined to cancel the (user) request to lock
 * the specified conference.
 * @returns {Function}
 */
export declare function endRoomLockRequest(conference: IJitsiConference, password?: string): (dispatch: IStore['dispatch']) => void;
/**
 * Begins a prompt for a password to join a specific conference/room.
 *
 * @param {JitsiConference} conference - The {@code JitsiConference}
 * requesting the password to join.
 * @protected
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: Component,
 *     props: PropTypes
 * }}
 */
export declare function _openPasswordRequiredPrompt(conference: IJitsiConference): {
    type: string;
    component: import("react").ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Unlocks the current jitsi conference.
 *
 * @returns {Function}
 */
export declare function unlockRoom(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => any;
