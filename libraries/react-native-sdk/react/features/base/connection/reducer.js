"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actionTypes_1 = require("../conference/actionTypes");
const actionTypes_2 = require("../jwt/actionTypes");
const lib_jitsi_meet_1 = require("../lib-jitsi-meet");
const ReducerRegistry_1 = __importDefault(require("../redux/ReducerRegistry"));
const functions_1 = require("../redux/functions");
const actionTypes_3 = require("./actionTypes");
/**
 * Reduces the Redux actions of the feature base/connection.
 */
ReducerRegistry_1.default.register('features/base/connection', (state = {}, action) => {
    switch (action.type) {
        case actionTypes_3.CONNECTION_DISCONNECTED:
            return _connectionDisconnected(state, action);
        case actionTypes_3.CONNECTION_ESTABLISHED:
            return _connectionEstablished(state, action);
        case actionTypes_3.CONNECTION_FAILED:
            return _connectionFailed(state, action);
        case actionTypes_3.CONNECTION_WILL_CONNECT:
            return _connectionWillConnect(state, action);
        case actionTypes_2.SET_JWT:
            return _setJWT(state, action);
        case actionTypes_3.SET_LOCATION_URL:
            return _setLocationURL(state, action);
        case actionTypes_3.SET_PREFER_VISITOR:
            return (0, functions_1.assign)(state, {
                preferVisitor: action.preferVisitor
            });
        case actionTypes_1.SET_ROOM:
            return _setRoom(state);
        case actionTypes_3.SHOW_CONNECTION_INFO:
            return _setShowConnectionInfo(state, action);
    }
    return state;
});
/**
 * Reduces a specific Redux action CONNECTION_DISCONNECTED of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The Redux state of the feature base/connection.
 * @param {Action} action - The Redux action CONNECTION_DISCONNECTED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _connectionDisconnected(state, { connection }) {
    const connection_ = _getCurrentConnection(state);
    if (connection_ !== connection) {
        return state;
    }
    return (0, functions_1.assign)(state, {
        connecting: undefined,
        connection: undefined,
        preferVisitor: undefined,
        timeEstablished: undefined
    });
}
/**
 * Reduces a specific Redux action CONNECTION_ESTABLISHED of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The Redux state of the feature base/connection.
 * @param {Action} action - The Redux action CONNECTION_ESTABLISHED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _connectionEstablished(state, { connection, timeEstablished }) {
    return (0, functions_1.assign)(state, {
        connecting: undefined,
        connection,
        error: undefined,
        passwordRequired: undefined,
        timeEstablished
    });
}
/**
 * Reduces a specific Redux action CONNECTION_FAILED of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The Redux state of the feature base/connection.
 * @param {Action} action - The Redux action CONNECTION_FAILED to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _connectionFailed(state, { connection, error }) {
    const connection_ = _getCurrentConnection(state);
    if (connection_ && connection_ !== connection) {
        return state;
    }
    return (0, functions_1.assign)(state, {
        connecting: undefined,
        connection: undefined,
        error,
        passwordRequired: error.name === lib_jitsi_meet_1.JitsiConnectionErrors.PASSWORD_REQUIRED
            ? connection : undefined,
        preferVisitor: undefined
    });
}
/**
 * Reduces a specific Redux action CONNECTION_WILL_CONNECT of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The Redux state of the feature base/connection.
 * @param {Action} action - The Redux action CONNECTION_WILL_CONNECT to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _connectionWillConnect(state, { connection }) {
    return (0, functions_1.assign)(state, {
        connecting: connection,
        // We don't care if the previous connection has been closed already,
        // because it's an async process and there's no guarantee if it'll be
        // done before the new one is established.
        connection: undefined,
        error: undefined,
        passwordRequired: undefined,
        timeEstablished: undefined
    });
}
/**
 * The current (similar to getCurrentConference in base/conference/functions.any.js)
 * connection which is {@code connection} or {@code connecting}.
 *
 * @param {IConnectionState} baseConnectionState - The current state of the
 * {@code 'base/connection'} feature.
 * @returns {JitsiConnection} - The current {@code JitsiConnection} if any.
 * @private
 */
function _getCurrentConnection(baseConnectionState) {
    return baseConnectionState.connection || baseConnectionState.connecting;
}
/**
 * Reduces a specific redux action {@link SET_JWT} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @param {Action} action - The Redux action SET_JWT to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _setJWT(state, { preferVisitor }) {
    return (0, functions_1.assign)(state, {
        preferVisitor
    });
}
/**
 * Reduces a specific redux action {@link SET_LOCATION_URL} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @param {Action} action - The redux action {@code SET_LOCATION_URL} to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _setLocationURL(state, { locationURL }) {
    return (0, functions_1.set)(state, 'locationURL', locationURL);
}
/**
 * Reduces a specific redux action {@link SET_ROOM} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _setRoom(state) {
    return (0, functions_1.assign)(state, {
        error: undefined,
        passwordRequired: undefined
    });
}
/**
 * Reduces a specific redux action {@link SHOW_CONNECTION_INFO} of the feature
 * base/connection.
 *
 * @param {IConnectionState} state - The redux state of the feature base/connection.
 * @param {Action} action - The redux action {@code SHOW_CONNECTION_INFO} to reduce.
 * @private
 * @returns {Object} The new state of the feature base/connection after the
 * reduction of the specified action.
 */
function _setShowConnectionInfo(state, { showConnectionInfo }) {
    return (0, functions_1.set)(state, 'showConnectionInfo', showConnectionInfo);
}
