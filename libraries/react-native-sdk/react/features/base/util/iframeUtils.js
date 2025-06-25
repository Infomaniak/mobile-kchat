"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inIframe = void 0;
/**
 * Checks whether we are loaded in iframe.
 *
 * @returns {boolean} Whether the current page is loaded in an iframe.
 */
function inIframe() {
    if (navigator.product === 'ReactNative') {
        return false;
    }
    try {
        return window.self !== window.top;
    }
    catch (e) {
        return true;
    }
}
exports.inIframe = inIframe;
