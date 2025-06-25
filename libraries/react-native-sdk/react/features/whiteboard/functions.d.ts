import { IReduxState } from '../app/types';
import { IWhiteboardConfig } from '../base/config/configType';
export declare const getWhiteboardConfig: (state: IReduxState) => IWhiteboardConfig;
/**
 * Returns the whiteboard collaboration details.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {{ roomId: string, roomKey: string}|undefined}
 */
export declare const getCollabDetails: (state: IReduxState) => {
    roomId: string;
    roomKey: string;
} | undefined;
/**
 * Indicates whether the whiteboard is enabled.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const isWhiteboardEnabled: (state: IReduxState) => boolean;
/**
 * Indicates whether the whiteboard is open.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const isWhiteboardOpen: (state: IReduxState) => boolean;
/**
 * Indicates whether the whiteboard button is visible.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const isWhiteboardButtonVisible: (state: IReduxState) => boolean;
/**
 * Indicates whether the whiteboard is present as a meeting participant.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const isWhiteboardPresent: (state: IReduxState) => boolean;
/**
 * Builds the whiteboard collaboration server url.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string}
 */
export declare const generateCollabServerUrl: (state: IReduxState) => string | undefined;
/**
 * Returns the whiteboard collaboration server url.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {string}
 */
export declare const getCollabServerUrl: (state: IReduxState) => string | undefined;
/**
 * Whether the whiteboard is visible on stage.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const isWhiteboardVisible: (state: IReduxState) => boolean;
/**
* Indicates whether the whiteboard is accessible to a participant that has a moderator role.
*
* @param {IReduxState} state - The state from the Redux store.
* @returns {boolean}
*/
export declare const isWhiteboardAllowed: (state: IReduxState) => boolean;
/**
 * Whether to enforce the whiteboard user limit.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const shouldEnforceUserLimit: (state: IReduxState) => boolean;
/**
 * Whether to show a warning about the whiteboard user limit.
 *
 * @param {IReduxState} state - The state from the Redux store.
 * @returns {boolean}
 */
export declare const shouldNotifyUserLimit: (state: IReduxState) => boolean;
/**
 * Generates the URL for the static whiteboard page.
 *
 * @param {string} locationUrl - The window location href.
 * @param {string} collabServerUrl - The whiteboard collaboration server url.
 * @param {Object} collabDetails - The whiteboard collaboration details.
 * @param {string} localParticipantName - The local participant name.
 * @returns {string}
 */
export declare function getWhiteboardInfoForURIString(locationUrl: any, collabServerUrl: string, collabDetails: {
    roomId: string;
    roomKey: string;
}, localParticipantName: string): string | undefined;
