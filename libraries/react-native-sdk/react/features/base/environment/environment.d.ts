/**
 * Returns whether or not jitsi is optimized and targeted for the  provided
 * browser name.
 *
 * @param {string} browserName - The name of the browser to check.
 * @returns {boolean}
 */
export declare function isBrowsersOptimal(browserName: string): any;
/**
 * Returns whether or not the current OS is Mac.
 *
 * @returns {boolean}
 */
export declare function isMacOS(): boolean;
/**
 * Returns whether or not the current OS is Windows.
 *
 * @returns {boolean}
 */
export declare function isWindows(): boolean;
/**
 * Returns whether or not the current browser or the list of passed in browsers
 * is considered suboptimal. Suboptimal means it is a supported browser but has
 * not been explicitly listed as being optimal, possibly due to functionality
 * issues.
 *
 * @param {Array<string>} [browsers] - A list of browser names to check. Will
 * default to a whitelist.
 * @returns {boolean}
 */
export declare function isSuboptimalBrowser(): any;
/**
 * Returns whether or not the current browser should allow the app to display.
 * A supported browser is assumed to be able to support WebRtc.
 *
 * @returns {boolean}
 */
export declare function isSupportedBrowser(): any;
/**
 * Returns whether or not the current environment is a supported
 * browser on a mobile device.
 *
 * @returns {boolean}
 */
export declare function isSupportedMobileBrowser(): any;
