"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.openURLInBrowser = void 0;
/**
 * Opens URL in the browser.
 *
 * @param {string} url - The URL to be opened.
 * @param {boolean} openInNewTab - If the link should be opened in a new tab.
 * @returns {void}
 */
function openURLInBrowser(url, openInNewTab) {
    const target = openInNewTab ? '_blank' : '';
    window.open(url, target, 'noopener');
}
exports.openURLInBrowser = openURLInBrowser;
