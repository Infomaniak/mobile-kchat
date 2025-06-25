/**
 * Tries to preload an image.
 *
 * @param {string | Object} src - Source of the avatar.
 * @param {boolean} useCORS - Whether to use CORS or not.
 * @param {boolean} tryOnce - If true we try to load the image only using the specified CORS mode. Otherwise both modes
 * (CORS and no CORS) will be used to load the image if the first attempt fails.
 * @returns {Promise}
 */
export declare function preloadImage(src: string, useCORS?: boolean, tryOnce?: boolean): Promise<{
    isUsingCORS?: boolean;
    src: string | Object;
}>;
