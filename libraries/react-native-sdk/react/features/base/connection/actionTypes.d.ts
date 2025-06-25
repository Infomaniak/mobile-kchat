/**
 * The type of (redux) action which signals that a connection disconnected.
 *
 * {
 *     type: CONNECTION_DISCONNECTED,
 *     connection: JitsiConnection
 * }
 */
export declare const CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED";
/**
 * The type of (redux) action which signals that a connection was successfully
 * established.
 *
 * {
 *     type: CONNECTION_ESTABLISHED,
 *     connection: JitsiConnection,
 *     timeEstablished: number,
 * }
 */
export declare const CONNECTION_ESTABLISHED = "CONNECTION_ESTABLISHED";
/**
 * The type of (redux) action which signals that a connection failed.
 *
 * {
 *     type: CONNECTION_FAILED,
 *     connection: JitsiConnection,
 *     error: Object | string
 * }
 */
export declare const CONNECTION_FAILED = "CONNECTION_FAILED";
/**
 * The type of (redux) action which signals that connection properties were updated.
 *
 * {
 *     type: CONNECTION_PROPERTIES_UPDATED,
 *     properties: Object
 * }
 */
export declare const CONNECTION_PROPERTIES_UPDATED = "CONNECTION_PROPERTIES_UPDATED";
/**
 * The type of (redux) action which signals that a connection will connect.
 *
 * {
 *     type: CONNECTION_WILL_CONNECT,
 *     connection: JitsiConnection
 * }
 */
export declare const CONNECTION_WILL_CONNECT = "CONNECTION_WILL_CONNECT";
/**
 * The type of (redux) action which sets the location URL of the application,
 * connection, conference, etc.
 *
 * {
 *     type: SET_LOCATION_URL,
 *     locationURL: ?URL
 * }
 */
export declare const SET_LOCATION_URL = "SET_LOCATION_URL";
/**
 * The type of (redux) action which sets the preferVisitor in store.
 *
 * {
 *     type: SET_PREFER_VISITOR,
 *     preferVisitor: ?boolean
 * }
 */
export declare const SET_PREFER_VISITOR = "SET_PREFER_VISITOR";
/**
 * The type of (redux) action which tells whether connection info should be displayed
 * on context menu.
 *
 * {
 *     type: SHOW_CONNECTION_INFO,
 *     showConnectionInfo: boolean
 * }
 */
export declare const SHOW_CONNECTION_INFO = "SHOW_CONNECTION_INFO";
