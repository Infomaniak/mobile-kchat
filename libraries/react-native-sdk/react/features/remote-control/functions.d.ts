import React from 'react';
import { IReduxState, IStore } from '../app/types';
import { IJitsiConference } from '../base/conference/reducer';
/**
 * Checks if the remote control is enabled.
 *
 * @param {*} state - The redux state.
 * @returns {boolean} - True if the remote control is enabled and false otherwise.
 */
export declare function isRemoteControlEnabled(state: IReduxState): any;
/**
 * Sends remote control message to other participant through data channel.
 *
 * @param {JitsiConference} conference - The JitsiConference object.
 * @param {string} to - The participant who will receive the event.
 * @param {RemoteControlEvent} event - The remote control event.
 * @returns {boolean} - True if the message was sent successfully and false otherwise.
 */
export declare function sendRemoteControlEndpointMessage(conference: IJitsiConference | undefined, to: string | undefined, event: Object): boolean;
/**
* Handles remote control events from the external app. Currently only
* events with type EVENTS.supported and EVENTS.stop are
* supported.
*
* @param {RemoteControlEvent} event - The remote control event.
* @param {Store} store - The redux store.
* @returns {void}
*/
export declare function onRemoteControlAPIEvent(event: {
    type: string;
}, { getState, dispatch }: IStore): void;
/**
 * Returns the area used for capturing mouse and key events.
 *
 * @returns {JQuery} - A JQuery selector.
 */
export declare function getRemoteConrolEventCaptureArea(): any;
/**
 * Extract the keyboard key from the keyboard event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {KEYS} The key that is pressed or undefined.
 */
export declare function getKey(event: React.KeyboardEvent): string;
/**
 * Extract the modifiers from the keyboard event.
 *
 * @param {KeyboardEvent} event - The event.
 * @returns {Array} With possible values: "shift", "control", "alt", "command".
 */
export declare function getModifiers(event: React.KeyboardEvent): string[];
