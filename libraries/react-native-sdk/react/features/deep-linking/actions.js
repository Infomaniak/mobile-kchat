"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openDesktopApp = exports.openWebApp = void 0;
const actions_1 = require("../app/actions");
const actionTypes_1 = require("./actionTypes");
/**
 * Continue to the conference page.
 *
 * @returns {Function}
 */
function openWebApp() {
    return (dispatch) => {
        // In order to go to the web app we need to skip the deep linking
        // interceptor. OPEN_WEB_APP action should set launchInWeb to true in
        // the redux store. After this when appNavigate() is called the
        // deep linking interceptor will be skipped (will return undefined).
        dispatch({ type: actionTypes_1.OPEN_WEB_APP });
        dispatch((0, actions_1.appNavigate)());
    };
}
exports.openWebApp = openWebApp;
/**
 * Opens the desktop app.
 *
 * @returns {{
 *     type: OPEN_DESKTOP_APP
 * }}
 */
function openDesktopApp() {
    return {
        type: actionTypes_1.OPEN_DESKTOP_APP
    };
}
exports.openDesktopApp = openDesktopApp;
