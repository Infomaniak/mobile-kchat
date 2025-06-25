"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports._connectInternal = exports.setPreferVisitor = exports.setLocationURL = exports.constructOptions = exports.connectionFailed = exports.connectionEstablished = exports.connectionDisconnected = void 0;
const lodash_1 = __importDefault(require("lodash"));
const actions_1 = require("../conference/actions");
const functions_1 = require("../conference/functions");
const lib_jitsi_meet_1 = __importStar(require("../lib-jitsi-meet"));
const parseURLParams_1 = require("../util/parseURLParams");
const uri_1 = require("../util/uri");
const actionTypes_1 = require("./actionTypes");
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
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
function connectionDisconnected(connection) {
    return {
        type: actionTypes_1.CONNECTION_DISCONNECTED,
        connection
    };
}
exports.connectionDisconnected = connectionDisconnected;
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
function connectionEstablished(connection, timeEstablished) {
    return {
        type: actionTypes_1.CONNECTION_ESTABLISHED,
        connection,
        timeEstablished
    };
}
exports.connectionEstablished = connectionEstablished;
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
function connectionFailed(connection, error) {
    const { credentials } = error;
    if (credentials && !Object.keys(credentials).length) {
        error.credentials = undefined;
    }
    return {
        type: actionTypes_1.CONNECTION_FAILED,
        connection,
        error
    };
}
exports.connectionFailed = connectionFailed;
/**
 * Constructs options to be passed to the constructor of {@code JitsiConnection}
 * based on the redux state.
 *
 * @param {Object} state - The redux state.
 * @returns {Object} The options to be passed to the constructor of
 * {@code JitsiConnection}.
 */
function constructOptions(state) {
    // Deep clone the options to make sure we don't modify the object in the
    // redux store.
    const options = lodash_1.default.cloneDeep(state['features/base/config']);
    const { locationURL, preferVisitor } = state['features/base/connection'];
    const params = (0, parseURLParams_1.parseURLParams)(locationURL || '');
    const iceServersOverride = params['iceServers.replace'];
    if (iceServersOverride) {
        options.iceServersOverride = iceServersOverride;
    }
    const { bosh, preferBosh, flags } = options;
    let { websocket } = options;
    // TESTING: Only enable WebSocket for some percentage of users.
    if (websocket && navigator.product === 'ReactNative') {
        if ((Math.random() * 100) >= (options?.testing?.mobileXmppWsThreshold ?? 0)) {
            websocket = undefined;
        }
    }
    if (preferBosh) {
        websocket = undefined;
    }
    // WebSocket is preferred over BOSH.
    const serviceUrl = websocket || bosh;
    logger_1.default.log(`Using service URL ${serviceUrl}`);
    // Append room to the URL's search.
    const { room } = state['features/base/conference'];
    if (serviceUrl && room) {
        const roomName = (0, uri_1.getBackendSafeRoomName)(room);
        options.serviceUrl = (0, uri_1.appendURLParam)(serviceUrl, 'room', roomName ?? '');
        if (options.websocketKeepAliveUrl) {
            options.websocketKeepAliveUrl = (0, uri_1.appendURLParam)(options.websocketKeepAliveUrl, 'room', roomName ?? '');
        }
        if (options.conferenceRequestUrl) {
            options.conferenceRequestUrl = (0, uri_1.appendURLParam)(options.conferenceRequestUrl, 'room', roomName ?? '');
        }
    }
    if (preferVisitor) {
        options.preferVisitor = true;
    }
    // Enable ssrc-rewriting by default.
    if (typeof flags?.ssrcRewritingEnabled === 'undefined') {
        const { ...otherFlags } = flags ?? {};
        options.flags = {
            ...otherFlags,
            ssrcRewritingEnabled: true
        };
    }
    return options;
}
exports.constructOptions = constructOptions;
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
function setLocationURL(locationURL) {
    return {
        type: actionTypes_1.SET_LOCATION_URL,
        locationURL
    };
}
exports.setLocationURL = setLocationURL;
/**
 * To change prefer visitor in the store. Used later to decide what to request from jicofo on connection.
 *
 * @param {boolean} preferVisitor - The value to set.
 * @returns {{
 *     type: SET_PREFER_VISITOR,
 *     preferVisitor: boolean
 * }}
 */
function setPreferVisitor(preferVisitor) {
    return {
        type: actionTypes_1.SET_PREFER_VISITOR,
        preferVisitor
    };
}
exports.setPreferVisitor = setPreferVisitor;
/**
 * Opens new connection.
 *
 * @param {string} [id] - The XMPP user's ID (e.g. {@code user@server.com}).
 * @param {string} [password] - The XMPP user's password.
 * @returns {Function}
 */
function _connectInternal(id, password) {
    return (dispatch, getState) => {
        const state = getState();
        const options = constructOptions(state);
        const { locationURL } = state['features/base/connection'];
        const { jwt } = state['features/base/jwt'];
        const connection = new lib_jitsi_meet_1.default.JitsiConnection(options.appId, jwt, options);
        connection[constants_1.JITSI_CONNECTION_URL_KEY] = locationURL;
        dispatch(_connectionWillConnect(connection));
        return new Promise((resolve, reject) => {
            connection.addEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_DISCONNECTED, _onConnectionDisconnected);
            connection.addEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_ESTABLISHED, _onConnectionEstablished);
            connection.addEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_FAILED, _onConnectionFailed);
            connection.addEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_REDIRECTED, _onConnectionRedirected);
            connection.addEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.PROPERTIES_UPDATED, _onPropertiesUpdate);
            /**
             * Unsubscribe the connection instance from
             * {@code CONNECTION_DISCONNECTED} and {@code CONNECTION_FAILED} events.
             *
             * @returns {void}
             */
            function unsubscribe() {
                connection.removeEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_DISCONNECTED, _onConnectionDisconnected);
                connection.removeEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_FAILED, _onConnectionFailed);
                connection.removeEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.PROPERTIES_UPDATED, _onPropertiesUpdate);
            }
            /**
             * Dispatches {@code CONNECTION_DISCONNECTED} action when connection is
             * disconnected.
             *
             * @private
             * @returns {void}
             */
            function _onConnectionDisconnected() {
                unsubscribe();
                dispatch(connectionDisconnected(connection));
                resolve(connection);
            }
            /**
             * Rejects external promise when connection fails.
             *
             * @param {JitsiConnectionErrors} err - Connection error.
             * @param {string} [message] - Error message supplied by lib-jitsi-meet.
             * @param {Object} [credentials] - The invalid credentials that were
             * used to authenticate and the authentication failed.
             * @param {string} [credentials.jid] - The XMPP user's ID.
             * @param {string} [credentials.password] - The XMPP user's password.
             * @param {Object} details - Additional information about the error.
             * @private
             * @returns {void}
             */
            function _onConnectionFailed(// eslint-disable-line max-params
            err, message, credentials, details) {
                unsubscribe();
                dispatch(connectionFailed(connection, {
                    credentials,
                    details,
                    name: err,
                    message
                }));
                reject(err);
            }
            /**
             * Resolves external promise when connection is established.
             *
             * @private
             * @returns {void}
             */
            function _onConnectionEstablished() {
                connection.removeEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_ESTABLISHED, _onConnectionEstablished);
                dispatch(connectionEstablished(connection, Date.now()));
                resolve(connection);
            }
            /**
             * Connection was redirected.
             *
             * @param {string|undefined} vnode - The vnode to connect to.
             * @param {string} focusJid - The focus jid to use.
             * @param {string|undefined} username - The username to use when joining. This is after promotion from
             * visitor to main participant.
             * @private
             * @returns {void}
             */
            function _onConnectionRedirected(vnode, focusJid, username) {
                connection.removeEventListener(lib_jitsi_meet_1.JitsiConnectionEvents.CONNECTION_REDIRECTED, _onConnectionRedirected);
                dispatch((0, actions_1.redirect)(vnode, focusJid, username));
            }
            /**
             * Connection properties were updated.
             *
             * @param {Object} properties - The properties which were updated.
             * @private
             * @returns {void}
             */
            function _onPropertiesUpdate(properties) {
                dispatch(_propertiesUpdate(properties));
            }
            // in case of configured http url for conference request we need the room name
            const name = (0, uri_1.getBackendSafeRoomName)(state['features/base/conference'].room);
            connection.connect({
                id,
                password,
                name
            });
        });
    };
}
exports._connectInternal = _connectInternal;
/**
 * Create an action for when a connection will connect.
 *
 * @param {JitsiConnection} connection - The {@code JitsiConnection} which will
 * connect.
 * @private
 * @returns {{
 *     type: CONNECTION_WILL_CONNECT,
 *     connection: JitsiConnection
 * }}
 */
function _connectionWillConnect(connection) {
    return {
        type: actionTypes_1.CONNECTION_WILL_CONNECT,
        connection
    };
}
/**
 * Create an action for when connection properties are updated.
 *
 * @param {Object} properties - The properties which were updated.
 * @private
 * @returns {{
 *     type: CONNECTION_PROPERTIES_UPDATED,
 *     properties: Object
 * }}
 */
function _propertiesUpdate(properties) {
    return {
        type: actionTypes_1.CONNECTION_PROPERTIES_UPDATED,
        properties
    };
}
/**
 * Closes connection.
 *
 * @param {boolean} isRedirect - Indicates if the action has been dispatched as part of visitor promotion.
 *
 * @returns {Function}
 */
function disconnect(isRedirect) {
    return (dispatch, getState) => {
        const state = getState();
        // The conference we have already joined or are joining.
        const conference_ = (0, functions_1.getCurrentConference)(state);
        // Promise which completes when the conference has been left and the
        // connection has been disconnected.
        let promise;
        // Leave the conference.
        if (conference_) {
            // In a fashion similar to JitsiConference's CONFERENCE_LEFT event
            // (and the respective Redux action) which is fired after the
            // conference has been left, notify the application about the
            // intention to leave the conference.
            dispatch((0, actions_1.conferenceWillLeave)(conference_, isRedirect));
            promise
                = conference_.leave()
                    .catch((error) => {
                    logger_1.default.warn('JitsiConference.leave() rejected with:', error);
                    // The library lib-jitsi-meet failed to make the
                    // JitsiConference leave. Which may be because
                    // JitsiConference thinks it has already left.
                    // Regardless of the failure reason, continue in
                    // jitsi-meet as if the leave has succeeded.
                    dispatch((0, actions_1.conferenceLeft)(conference_));
                });
        }
        else {
            promise = Promise.resolve();
        }
        // Disconnect the connection.
        const { connecting, connection } = state['features/base/connection'];
        // The connection we have already connected or are connecting.
        const connection_ = connection || connecting;
        if (connection_) {
            promise = promise.then(() => connection_.disconnect());
        }
        else {
            logger_1.default.info('No connection found while disconnecting.');
        }
        return promise;
    };
}
exports.disconnect = disconnect;
