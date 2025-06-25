"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDynamicBrandingFailed = exports.setDynamicBrandingReady = exports.setDynamicBrandingData = exports.fetchCustomBrandingData = void 0;
const httpUtils_1 = require("../base/util/httpUtils");
const actionTypes_1 = require("./actionTypes");
const functions_any_1 = require("./functions.any");
const logger_1 = __importDefault(require("./logger"));
/**
 * Fetches custom branding data.
 * If there is no data or the request fails, sets the `customizationReady` flag
 * so the defaults can be displayed.
 *
 * @returns {Function}
 */
function fetchCustomBrandingData() {
    return async function (dispatch, getState) {
        const state = getState();
        const { customizationReady } = state['features/dynamic-branding'];
        if (!customizationReady) {
            const url = await (0, functions_any_1.getDynamicBrandingUrl)(state);
            if (url) {
                try {
                    const res = await (0, httpUtils_1.doGetJSON)(url);
                    return dispatch(setDynamicBrandingData(res));
                }
                catch (err) {
                    logger_1.default.error('Error fetching branding data', err);
                    return dispatch(setDynamicBrandingFailed());
                }
            }
            dispatch(setDynamicBrandingReady());
        }
    };
}
exports.fetchCustomBrandingData = fetchCustomBrandingData;
/**
 * Action used to set the user customizations.
 *
 * @param {Object} value - The custom data to be set.
 * @returns {Object}
 */
function setDynamicBrandingData(value) {
    return {
        type: actionTypes_1.SET_DYNAMIC_BRANDING_DATA,
        value
    };
}
exports.setDynamicBrandingData = setDynamicBrandingData;
/**
 * Action used to signal the branding elements are ready to be displayed.
 *
 * @returns {Object}
 */
function setDynamicBrandingReady() {
    return {
        type: actionTypes_1.SET_DYNAMIC_BRANDING_READY
    };
}
exports.setDynamicBrandingReady = setDynamicBrandingReady;
/**
 * Action used to signal the branding request failed.
 *
 * @returns {Object}
 */
function setDynamicBrandingFailed() {
    return {
        type: actionTypes_1.SET_DYNAMIC_BRANDING_FAILED
    };
}
exports.setDynamicBrandingFailed = setDynamicBrandingFailed;
