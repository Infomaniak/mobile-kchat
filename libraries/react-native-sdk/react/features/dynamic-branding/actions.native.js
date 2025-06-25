"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unsetDynamicBranding = exports.fetchCustomBrandingData = void 0;
const httpUtils_1 = require("../base/util/httpUtils");
const actionTypes_1 = require("./actionTypes");
const actions_any_1 = require("./actions.any");
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
        const dynamicBrandingUrl = await (0, functions_any_1.getDynamicBrandingUrl)(state);
        if (dynamicBrandingUrl) {
            try {
                return dispatch((0, actions_any_1.setDynamicBrandingData)(await (0, httpUtils_1.doGetJSON)(dynamicBrandingUrl)));
            }
            catch (err) {
                logger_1.default.error('Error fetching branding data', err);
                return dispatch((0, actions_any_1.setDynamicBrandingFailed)());
            }
        }
        else {
            dispatch(unsetDynamicBranding());
        }
        dispatch((0, actions_any_1.setDynamicBrandingReady)());
    };
}
exports.fetchCustomBrandingData = fetchCustomBrandingData;
/**
 * Action used to unset branding elements.
 *
 * @returns {Object}
 */
function unsetDynamicBranding() {
    return {
        type: actionTypes_1.UNSET_DYNAMIC_BRANDING
    };
}
exports.unsetDynamicBranding = unsetDynamicBranding;
