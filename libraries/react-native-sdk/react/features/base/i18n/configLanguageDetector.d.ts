/**
 * Custom language detection, just returns the config property if any.
 */
declare const _default: {
    /**
     * Does not support caching.
     *
     * @returns {void}
     */
    cacheUserLanguage: Function;
    /**
     * Looks the language up in the config.
     *
     * @returns {string} The default language if any.
     */
    lookup(): any;
    /**
     * Name of the language detector.
     */
    name: string;
};
export default _default;
