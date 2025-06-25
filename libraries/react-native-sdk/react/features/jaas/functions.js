"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJaasJWT = exports.sendGetJWTRequest = exports.isFeatureDisabled = exports.sendGetDetailsRequest = exports.sendGetCustomerIdRequest = exports.isVpaasMeeting = exports.getVpaasTenant = void 0;
const constants_1 = require("./constants");
const logger_1 = __importDefault(require("./logger"));
/**
 * Returns the full vpaas tenant if available, given a path.
 *
 * @param {string} path - The meeting url path.
 * @returns {string}
 */
function extractVpaasTenantFromPath(path) {
    const [, tenant] = path.split('/');
    if (tenant.startsWith(constants_1.VPAAS_TENANT_PREFIX)) {
        return tenant;
    }
    return '';
}
/**
 * Returns the vpaas tenant.
 *
 * @param {IReduxState} state - The global state.
 * @returns {string}
 */
function getVpaasTenant(state) {
    return extractVpaasTenantFromPath(state['features/base/connection'].locationURL?.pathname ?? '');
}
exports.getVpaasTenant = getVpaasTenant;
/**
 * Returns true if the current meeting is a vpaas one.
 *
 * @param {IReduxState} state - The state of the app.
 * @returns {boolean}
 */
function isVpaasMeeting(state) {
    const connection = state['features/base/connection'];
    if (connection?.locationURL?.pathname) {
        return Boolean(extractVpaasTenantFromPath(connection?.locationURL?.pathname));
    }
    return false;
}
exports.isVpaasMeeting = isVpaasMeeting;
/**
 * Sends a request for retrieving the conference creator's customer id.
 *
 * @param {IJitsiConference} conference - The conference state.
 * @param {IReduxState} state - The state of the app.
 * @returns {Object} - Object containing customerId field.
 */
async function sendGetCustomerIdRequest(conference, state) {
    const { jaasConferenceCreatorUrl } = state['features/base/config'];
    const roomJid = conference?.room?.roomjid;
    if (jaasConferenceCreatorUrl && roomJid) {
        const fullUrl = `${jaasConferenceCreatorUrl}?conference=${encodeURIComponent(roomJid)}`;
        const response = await fetch(fullUrl);
        const responseBody = await response.json();
        if (response.ok) {
            return responseBody;
        }
        logger_1.default.error(`Failed to fetch ${fullUrl}. with: ${JSON.stringify(responseBody)}`);
    }
}
exports.sendGetCustomerIdRequest = sendGetCustomerIdRequest;
/**
 * Sends a request for retrieving jaas customer details.
 *
 * @param {Object} reqData - The request info.
 * @param {string} reqData.appId - The client appId.
 * @param {string} reqData.baseUrl - The base url for the request.
 * @returns {void}
 */
async function sendGetDetailsRequest({ appId, baseUrl }) {
    const fullUrl = `${baseUrl}/v1/public/tenants/${encodeURIComponent(appId)}`;
    try {
        const res = await fetch(fullUrl);
        if (res.ok) {
            return res.json();
        }
        throw new Error('Request not successful');
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.sendGetDetailsRequest = sendGetDetailsRequest;
/**
 * Returns the billing id for vpaas meetings.
 *
 * @param {IReduxState} state - The state of the app.
 * @param {string} feature - Feature to be looked up for disable state.
 * @returns {boolean}
 */
function isFeatureDisabled(state, feature) {
    return state['features/jaas'].disabledFeatures.includes(feature);
}
exports.isFeatureDisabled = isFeatureDisabled;
/**
 * Sends a request for retrieving jaas JWT.
 *
 * @param {Object} reqData - The request info.
 * @param {string} reqData.appId - The client appId.
 * @param {string} reqData.baseUrl - The base url for the request.
 * @returns {void}
 */
async function sendGetJWTRequest({ appId, baseUrl }) {
    const fullUrl = `${baseUrl}/v1/public/token/${encodeURIComponent(appId)}`;
    try {
        const res = await fetch(fullUrl, {
            method: 'GET'
        });
        if (res.ok) {
            return res.json();
        }
        throw new Error('Request not successful');
    }
    catch (err) {
        throw new Error(err);
    }
}
exports.sendGetJWTRequest = sendGetJWTRequest;
/**
 * Gets a jaas JWT.
 *
 * @param {IReduxState} state - Redux state.
 * @returns {string} The JWT.
 */
async function getJaasJWT(state) {
    const baseUrl = state['features/base/config'].jaasTokenUrl;
    const appId = getVpaasTenant(state);
    const shouldSendRequest = Boolean(baseUrl && appId);
    if (shouldSendRequest) {
        try {
            const jwt = await sendGetJWTRequest({
                appId,
                baseUrl: baseUrl ?? ''
            });
            return jwt.token;
        }
        catch (err) {
            logger_1.default.error('Could not send request', err);
        }
    }
}
exports.getJaasJWT = getJaasJWT;
