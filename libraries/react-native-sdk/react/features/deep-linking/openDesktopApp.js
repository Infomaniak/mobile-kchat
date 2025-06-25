"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._openDesktopApp = void 0;
const uri_1 = require("../base/util/uri");
/**
 * Opens the desktop app.
 *
 * @param {Object} _state - Object containing current redux state.
 * @returns {Promise<boolean>} - Resolves with true if the attempt to open the desktop app was successful and resolves
 * with false otherwise.
 */
function _openDesktopApp(_state) {
    const state = _state;
    const deeplinkingDesktop = state['features/base/config'].deeplinking?.desktop;
    if (deeplinkingDesktop?.enabled) {
        const { appScheme } = deeplinkingDesktop;
        const regex = new RegExp(uri_1.URI_PROTOCOL_PATTERN, 'gi');
        window.location.href = window.location.href.replace(regex, `${appScheme}:`);
        return Promise.resolve(true);
    }
    return Promise.resolve(false);
}
exports._openDesktopApp = _openDesktopApp;
