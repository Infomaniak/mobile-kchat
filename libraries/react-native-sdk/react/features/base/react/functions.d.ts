/**
 * Returns the field value in a platform generic way.
 *
 * @param {Object | string} fieldParameter - The parameter passed through the change event function.
 * @returns {string}
 */
export declare function getFieldValue(fieldParameter: {
    target: {
        value: string;
    };
} | string): string;
/**
 * Formats the URL text for react-linkify.
 *
 * @param {string} text - The URL text.
 * @returns {string} - The formatted text.
 */
export declare function formatURLText(text?: string): string;
