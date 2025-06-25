"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks whether the chrome extensions defined in the config file are installed or not.
 *
 * @param {Object} config - Objects containing info about the configured extensions.
 *
 * @returns {Promise[]}
 */
function checkChromeExtensionsInstalled(config = {}) {
    const isExtensionInstalled = (info) => new Promise(resolve => {
        const img = new Image();
        img.src = `chrome-extension://${info.id}/${info.path}`;
        img.setAttribute('aria-hidden', 'true');
        img.onload = function () {
            resolve(true);
        };
        img.onerror = function () {
            resolve(false);
        };
    });
    const extensionInstalledFunction = (info) => isExtensionInstalled(info);
    return Promise.all((config.chromeExtensionsInfo || []).map((info) => extensionInstalledFunction(info)));
}
exports.default = checkChromeExtensionsInstalled;
