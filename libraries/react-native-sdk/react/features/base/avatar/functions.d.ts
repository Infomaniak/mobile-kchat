/**
 * Generates the background color of an initials based avatar.
 *
 * @param {string?} initials - The initials of the avatar.
 * @param {Array<string>} customAvatarBackgrounds - Custom avatar background values.
 * @returns {string}
 */
export declare function getAvatarColor(initials: string | undefined, customAvatarBackgrounds: Array<string>): string;
/**
 * Generates initials for a simple string.
 *
 * @param {string?} s - The string to generate initials for.
 * @returns {string?}
 */
export declare function getInitials(s?: string): string;
/**
 * Checks if the passed URL should be loaded with CORS.
 *
 * @param {string} url - The URL.
 * @param {Array<string>} corsURLs - The URL pattern that matches a URL that needs to be handled with CORS.
 * @returns {void}
 */
export declare function isCORSAvatarURL(url: string, corsURLs?: Array<string>): boolean;
/**
 * Checks if the passed prop is a loaded icon or not.
 *
 * @param {string? | Object?} iconProp - The prop to check.
 * @returns {boolean}
 */
export declare function isIcon(iconProp?: string | Function): iconProp is Function;
