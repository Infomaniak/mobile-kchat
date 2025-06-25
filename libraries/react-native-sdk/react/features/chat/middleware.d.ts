import { IStore } from '../app/types';
/**
 * Function to handle an incoming chat message from lobby room.
 *
 * @param {string} message - The message received.
 * @param {string} participantId - The participant id.
 * @returns {Function}
 */
export declare function handleLobbyMessageReceived(message: string, participantId: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
