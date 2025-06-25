"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._STORE_NETWORK_INFO_CLEANUP = exports.SET_NETWORK_INFO = void 0;
/**
 * The action dispatched when the {@link NetworkInfo} structure is being updated.
 *
 * @type {string}
 */
exports.SET_NETWORK_INFO = 'SET_NETWORK_INFO';
/**
 * The action dispatched by 'base/net-info' middleware in order to store the cleanup function for later use.
 * @type {string}
 * @private
 */
exports._STORE_NETWORK_INFO_CLEANUP = 'STORE_NETWORK_INFO_CLEANUP';
