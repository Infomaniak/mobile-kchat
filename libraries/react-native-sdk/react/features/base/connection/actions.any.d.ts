import { IReduxState, IStore } from '../../app/types';
import { IConfigState } from '../config/reducer';
import { ConnectionFailedError, IIceServers } from './types';
/**
 * The options that will be passed to the JitsiConnection instance.
 */
interface IOptions extends IConfigState {
    iceServersOverride?: IIceServers;
    preferVisitor?: boolean;
}
/**
 * Create an action for when the signaling connection has been lost.
 *
 * @param {JitsiConnection} connection - The {@code JitsiConnection} which
 * disconnected.
 * @private
 * @returns {{
 *     type: CONNECTION_DISCONNECTED,
 *     connection: JitsiConnection
 * }}
 */
export declare function connectionDisconnected(connection?: Object): {
    type: string;
    connection: Object | undefined;
};
/**
 * Create an action for when the signaling connection has been established.
 *
 * @param {JitsiConnection} connection - The {@code JitsiConnection} which was
 * established.
 * @param {number} timeEstablished - The time at which the
 * {@code JitsiConnection} which was established.
 * @public
 * @returns {{
 *     type: CONNECTION_ESTABLISHED,
 *     connection: JitsiConnection,
 *     timeEstablished: number
 * }}
 */
export declare function connectionEstablished(connection: Object, timeEstablished: number): {
    type: string;
    connection: Object;
    timeEstablished: number;
};
/**
 * Create an action for when the signaling connection could not be created.
 *
 * @param {JitsiConnection} connection - The {@code JitsiConnection} which
 * failed.
 * @param {ConnectionFailedError} error - Error.
 * @public
 * @returns {{
 *     type: CONNECTION_FAILED,
 *     connection: JitsiConnection,
 *     error: ConnectionFailedError
 * }}
 */
export declare function connectionFailed(connection: Object, error: ConnectionFailedError): {
    type: string;
    connection: Object;
    error: ConnectionFailedError;
};
/**
 * Constructs options to be passed to the constructor of {@code JitsiConnection}
 * based on the redux state.
 *
 * @param {Object} state - The redux state.
 * @returns {Object} The options to be passed to the constructor of
 * {@code JitsiConnection}.
 */
export declare function constructOptions(state: IReduxState): IOptions;
/**
 * Sets the location URL of the application, connection, conference, etc.
 *
 * @param {URL} [locationURL] - The location URL of the application,
 * connection, conference, etc.
 * @returns {{
 *     type: SET_LOCATION_URL,
 *     locationURL: URL
 * }}
 */
export declare function setLocationURL(locationURL?: URL): {
    type: string;
    locationURL: URL | undefined;
};
/**
 * To change prefer visitor in the store. Used later to decide what to request from jicofo on connection.
 *
 * @param {boolean} preferVisitor - The value to set.
 * @returns {{
 *     type: SET_PREFER_VISITOR,
 *     preferVisitor: boolean
 * }}
 */
export declare function setPreferVisitor(preferVisitor: boolean): {
    type: string;
    preferVisitor: boolean;
};
/**
 * Opens new connection.
 *
 * @param {string} [id] - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string} [password] - The XMPP user's password.
 * @returns {Function}
 */
export declare function _connectInternal(id?: string, password?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<unknown>;
/**
 * Closes connection.
 *
 * @param {boolean} isRedirect - Indicates if the action has been dispatched as part of visitor promotion.
 *
 * @returns {Function}
 */
export declare function disconnect(isRedirect?: boolean): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
export {};
