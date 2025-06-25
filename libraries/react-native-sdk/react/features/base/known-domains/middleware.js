"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("../../app/functions");
const actionTypes_1 = require("../app/actionTypes");
const actionTypes_2 = require("../conference/actionTypes");
const MiddlewareRegistry_1 = __importDefault(require("../redux/MiddlewareRegistry"));
const uri_1 = require("../util/uri");
const actions_1 = require("./actions");
MiddlewareRegistry_1.default.register(store => next => action => {
    const result = next(action);
    switch (action.type) {
        case actionTypes_1.APP_WILL_MOUNT:
            _appWillMount(store);
            break;
        case actionTypes_2.SET_ROOM:
            _setRoom(store);
            break;
    }
    return result;
});
/**
 * Adds the domain of the app's {@code defaultURL} to the list of domains known
 * to the feature base/known-domains.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {Promise}
 */
function _appWillMount({ dispatch, getState }) {
    const defaultURL = (0, uri_1.parseURIString)((0, functions_1.getDefaultURL)(getState));
    dispatch((0, actions_1.addKnownDomains)(defaultURL?.host));
}
/**
 * Adds the domain of {@code locationURL} to the list of domains known to the
 * feature base/known-domains.
 *
 * @param {Object} store - The redux store.
 * @private
 * @returns {Promise}
 */
function _setRoom({ dispatch, getState }) {
    const { locationURL } = getState()['features/base/connection'];
    let host;
    locationURL
        && (host = locationURL.host)
        && dispatch((0, actions_1.addKnownDomains)(host));
}
