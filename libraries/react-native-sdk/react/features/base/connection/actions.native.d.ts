import { IStore } from '../../app/types';
export * from './actions.any';
/**
 * Opens new connection.
 *
 * @param {string} [id] - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string} [password] - The XMPP user's password.
 * @returns {Function}
 */
export declare function connect(id?: string, password?: string): (dispatch: IStore['dispatch']) => Promise<unknown>;
/**
 * Hangup.
 *
 * @param {boolean} [_requestFeedback] - Whether to attempt showing a
 * request for call feedback.
 * @returns {Function}
 */
export declare function hangup(_requestFeedback?: boolean): (dispatch: IStore['dispatch']) => Promise<void>;
