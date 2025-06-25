/**
 * Applies NFKC normalization to the given text.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
export declare function normalizeNFKC(text: string): string;
/**
 * Replaces accent characters with english alphabet characters.
 * NOTE: Here we use the unorm package because the JSC version in React Native for Android crashes.
 *
 * @param {string} text - The text that needs to be normalized.
 * @returns {string} - The normalized text.
 */
export declare function normalizeAccents(text: string): string;
