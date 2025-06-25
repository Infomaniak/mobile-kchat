/// <reference types="react" />
/**
 * Renders a specific {@code string} which may contain HTML.
 *
 * @param {string|undefined} html - The {@code string} which may
 * contain HTML to render.
 * @returns {ReactElement[]|string}
 */
export declare function renderHTML(html?: string): (string | JSX.Element)[] | undefined;
