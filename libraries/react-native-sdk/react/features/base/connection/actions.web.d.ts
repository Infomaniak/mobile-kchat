import { IStore } from '../../app/types';
export * from './actions.any';
/**
 * Opens new connection.
 *
 * @param {string} [id] - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string} [password] - The XMPP user's password.
 * @returns {Function}
 */
export declare function connect(id?: string, password?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<unknown>;
/**
 * Closes connection.
 *
 * @param {boolean} [requestFeedback] - Whether to attempt showing a
 * request for call feedback.
 * @param {string} [feedbackTitle] - The feedback title.
 * @returns {Function}
 */
export declare function hangup(requestFeedback?: boolean, feedbackTitle?: string): (dispatch: IStore['dispatch']) => Promise<any>;
