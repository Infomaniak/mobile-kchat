import React from 'react';
import { IStore } from '../app/types';
/**
 * Signals that the remote control authorization dialog should be displayed.
 *
 * @param {string} participantId - The id of the participant who is requesting
 * the authorization.
 * @returns {{
 *     type: OPEN_DIALOG,
 *     component: {RemoteControlAuthorizationDialog},
 *     componentProps: {
 *         participantId: {string}
 *      }
 * }}
 * @public
 */
export declare function openRemoteControlAuthorizationDialog(participantId: string): {
    type: string;
    component: React.ComponentType<any>;
    componentProps: Object | undefined;
};
/**
 * Sets the remote control active property.
 *
 * @param {boolean} active - The new value for the active property.
 * @returns {Function}
 */
export declare function setRemoteControlActive(active: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Requests permissions from the remote control receiver side.
 *
 * @param {string} userId - The user id of the participant that will be
 * requested.
 * @returns {Function}
 */
export declare function requestRemoteControl(userId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<never> | undefined;
/**
 * Handles permission request replies on the controller side.
 *
 * @param {string} participantId - The participant that sent the request.
 * @param {EndpointMessage} event - The permission request event.
 * @returns {Function}
 */
export declare function processPermissionRequestReply(participantId: string, event: any): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handles remote control stopped.
 *
 * @param {string} participantId - The ID of the participant that has sent the event.
 * @param {EndpointMessage} event - EndpointMessage event from the data channels.
 * @property {string} type - The function process only events with name REMOTE_CONTROL_MESSAGE_NAME.
 * @returns {void}
 */
export declare function handleRemoteControlStoppedEvent(participantId: Object, event: {
    name: string;
    type: string;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Stops processing the mouse and keyboard events. Removes added listeners.
 * Enables the keyboard shortcuts. Displays dialog to notify the user that remote control session has ended.
 *
 * @param {boolean} notifyRemoteParty - If true a endpoint message to the controlled participant will be sent.
 * @returns {void}
 */
export declare function stopController(notifyRemoteParty?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Clears a pending permission request.
 *
 * @returns {Function}
 */
export declare function clearRequest(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sets that transport object that is used by the receiver to communicate with the native part of the remote control
 * implementation.
 *
 * @param {Transport} transport - The transport to be set.
 * @returns {{
 *      type: SET_RECEIVER_TRANSPORT,
 *      transport: Transport
 * }}
 */
export declare function setReceiverTransport(transport?: Object): {
    type: string;
    transport: Object | undefined;
};
/**
 * Enables the receiver functionality.
 *
 * @returns {Function}
 */
export declare function enableReceiver(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Disables the receiver functionality.
 *
 * @returns {Function}
 */
export declare function disableReceiver(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Stops a remote control session on the receiver side.
 *
 * @param {boolean} [dontNotifyLocalParty] - If true - a notification about stopping
 * the remote control won't be displayed.
 * @param {boolean} [dontNotifyRemoteParty] - If true a endpoint message to the controller participant will be sent.
 * @returns {Function}
 */
export declare function stopReceiver(dontNotifyLocalParty?: boolean, dontNotifyRemoteParty?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handles only remote control endpoint messages.
 *
 * @param {string} participantId - The controller participant ID.
 * @param {Object} message - EndpointMessage from the data channels.
 * @param {string} message.name - The function processes only messages with
 * name REMOTE_CONTROL_MESSAGE_NAME.
 * @returns {Function}
 */
export declare function endpointMessageReceived(participantId: string, message: {
    action: string;
    name: string;
    type: string;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Denies remote control access for user associated with the passed user id.
 *
 * @param {string} participantId - The id associated with the user who sent the
 * request for remote control authorization.
 * @returns {Function}
 */
export declare function deny(participantId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Sends start remote control request to the native implementation.
 *
 * @returns {Function}
 */
export declare function sendStartRequest(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => any;
/**
 * Grants remote control access to user associated with the passed user id.
 *
 * @param {string} participantId - The id associated with the user who sent the
 * request for remote control authorization.
 * @returns {Function}
 */
export declare function grant(participantId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handler for mouse click events on the controller side.
 *
 * @param {string} type - The type of event ("mousedown"/"mouseup").
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
export declare function mouseClicked(type: string, event: React.MouseEvent): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handles mouse moved events on the controller side.
 *
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
export declare function mouseMoved(event: React.MouseEvent): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handles mouse scroll events on the controller side.
 *
 * @param {Event} event - The mouse event.
 * @returns {Function}
 */
export declare function mouseScrolled(event: {
    deltaX: number;
    deltaY: number;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Handles key press events on the controller side..
 *
 * @param {string} type - The type of event ("keydown"/"keyup").
 * @param {Event} event - The key event.
 * @returns {Function}
 */
export declare function keyPressed(type: string, event: React.KeyboardEvent): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
* Disables the keyboatd shortcuts. Starts collecting remote control
* events. It can be used to resume an active remote control session which
* was paused with the pause action.
*
* @returns {Function}
*/
export declare function resume(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Pauses the collecting of events and enables the keyboard shortcus. But
 * it doesn't removes any other listeners. Basically the remote control
 * session will be still active after the pause action, but no events from the
 * controller side will be captured and sent. You can resume the collecting
 * of the events with the resume action.
 *
 * @returns {Function}
 */
export declare function pause(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
