/**
 * Calculates avatar dimensions based on window height and position.
 *
 * @param {number} height - The window height.
 * @returns {{
 *   marginTop: string,
 *   size: number
 * }}
 */
export declare function calculateAvatarDimensions(height: number): {
    size: number;
    marginTop: string;
};
/**
 * Selector for determining the connection type & details.
 *
 * @returns {{
 *   connectionType: string,
 *   connectionDetails: string[]
 * }}
 */
export declare function getConnectionData(): {
    connectionType: string;
    connectionDetails: never[];
};
