"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCustomerDetails = void 0;
const actionTypes_1 = require("./actionTypes");
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * Action used to set the jaas customer details in store.
 *
 * @param {Object} details - The customer details object.
 * @returns {Object}
 */
function setCustomerDetails(details) {
    return {
        type: actionTypes_1.SET_DETAILS,
        payload: details
    };
}
/**
 * Sends a request for retrieving jaas customer details.
 *
 * @returns {Function}
 */
function getCustomerDetails() {
    return async function (dispatch, getState) {
        const state = getState();
        const baseUrl = state['features/base/config'].jaasActuatorUrl ?? '';
        const appId = (0, functions_1.getVpaasTenant)(state);
        const shouldSendRequest = Boolean(baseUrl && appId);
        if (shouldSendRequest) {
            try {
                const details = await (0, functions_1.sendGetDetailsRequest)({
                    appId,
                    baseUrl
                });
                dispatch(setCustomerDetails(details));
            }
            catch (err) {
                logger_1.default.error('Could not send request', err);
            }
        }
    };
}
exports.getCustomerDetails = getCustomerDetails;
