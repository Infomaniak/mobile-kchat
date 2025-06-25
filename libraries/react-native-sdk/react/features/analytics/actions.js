"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setPermanentProperty = void 0;
const lib_jitsi_meet_1 = require("../base/lib-jitsi-meet");
const actionTypes_1 = require("./actionTypes");
/**
 * Updates a permanentProperty.
 *
 * @param {Object} properties - An object with properties to be updated.
 * @returns {Function}
 */
function setPermanentProperty(properties) {
    return (dispatch, getState) => {
        const { isInitialized = false } = getState()['features/analytics'];
        if (isInitialized) {
            lib_jitsi_meet_1.analytics.addPermanentProperties(properties);
        }
        else {
            dispatch({
                type: actionTypes_1.SET_INITIAL_PERMANENT_PROPERTIES,
                properties
            });
        }
    };
}
exports.setPermanentProperty = setPermanentProperty;
