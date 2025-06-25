/**
 * Gets a logger for the given id.
 *
 * @param {string} id - Name for the logger.
 * @returns {Object} - The logger object.
 */
export declare function getLogger(id: string): any;
/**
 * Initializes native logging. This operations must be done as early as possible.
 */
export declare const _initLogging: () => void;
