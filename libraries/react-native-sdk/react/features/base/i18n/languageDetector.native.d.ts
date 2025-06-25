/**
 * The singleton language detector for React Native which uses the system-wide
 * locale.
 */
declare const _default: {
    /**
     * Does not support caching.
     *
     * @returns {void}
     */
    cacheUserLanguage: Function;
    detect(): any;
    init: Function;
    type: string;
};
export default _default;
