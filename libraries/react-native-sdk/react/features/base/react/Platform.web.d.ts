/**
 * Provides a minimal equivalent of react-native's Platform abstraction.
 */
declare const _default: {
    /**
     * The operating system on which the application is executing.
     *
     * @type {string}
     */
    OS: string;
    /**
     * The operating system version on which the application is executing.
     * This is intentionally set to undefined so we can tell mobile and mobile web
     * apart easier.
     *
     * @type {number|undefined}
     */
    Version: undefined;
};
export default _default;
