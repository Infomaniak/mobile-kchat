"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppProp = void 0;
const functions_1 = require("../redux/functions");
/**
 * Gets the value of a specific React {@code Component} prop of the currently
 * mounted {@link App}.
 *
 * @param {IStateful} stateful - The redux store or {@code getState}
 * function.
 * @param {string} propName - The name of the React {@code Component} prop of
 * the currently mounted {@code App} to get.
 * @returns {*} The value of the specified React {@code Component} prop of the
 * currently mounted {@code App}.
 */
function getAppProp(stateful, propName) {
    const state = (0, functions_1.toState)(stateful)['features/base/app'];
    if (state) {
        const { app } = state;
        if (app) {
            return app.props[propName];
        }
    }
    return undefined;
}
exports.getAppProp = getAppProp;
