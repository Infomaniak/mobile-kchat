/**
 * Begins a request to get available DesktopCapturerSources.
 *
 * @param {Object} options - Additional configuration for getting a list of
 * sources.
 * @param {Array} options.types - An array with DesktopCapturerSource type strings.
 * @param {Object} options.thumbnailSize - The desired height and width of the
 * return native image object used for the preview image of the source.
 * @returns {Function}
 */
export declare function obtainDesktopSources(options: {
    thumbnailSize?: Object;
    types: string[];
}): any;
/**
 * Check usage of old jitsi meet electron version.
 *
 * @returns {boolean} True if we use old jitsi meet electron, otherwise false.
 */
export declare function oldJitsiMeetElectronUsage(): boolean;
/**
 * Converts an array of DesktopCapturerSources to an object with types for keys
 * and values being an array with sources of the key's type.
 *
 * @param {Array} sources - DesktopCapturerSources.
 * @private
 * @returns {Object} An object with the sources split into separate arrays based
 * on source type.
 */
export declare function _separateSourcesByType(sources?: Array<{
    id: string;
}>): any;
