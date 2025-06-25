import { IStore } from '../app/types';
import { IWhiteboardAction } from './reducer';
/**
 * Configures the whiteboard collaboration details.
 *
 * @param {Object} payload - The whiteboard settings.
 * @returns {{
 *     type: SETUP_WHITEBOARD,
 *     collabDetails: { roomId: string, roomKey: string },
 *     collabServerUrl: string
 * }}
 */
export declare const setupWhiteboard: ({ collabDetails, collabServerUrl }: {
    collabDetails: {
        roomId: string;
        roomKey: string;
    };
    collabServerUrl?: string | undefined;
}) => IWhiteboardAction;
/**
 * Cleans up the whiteboard collaboration settings.
 * To be used only on native for cleanup in between conferences.
 *
 * @returns {{
 *     type: RESET_WHITEBOARD
 * }}
 */
export declare const resetWhiteboard: () => IWhiteboardAction;
/**
 * Sets the whiteboard visibility status.
 *
 * @param {boolean} isOpen - The whiteboard visibility flag.
 * @returns {{
 *      type: SET_WHITEBOARD_OPEN,
 *      isOpen
 * }}
 */
export declare const setWhiteboardOpen: (isOpen: boolean) => IWhiteboardAction;
/**
 * Shows a warning notification about the whiteboard user limit.
 *
 * @returns {Function}
 */
export declare const notifyWhiteboardLimit: () => (dispatch: IStore['dispatch']) => void;
