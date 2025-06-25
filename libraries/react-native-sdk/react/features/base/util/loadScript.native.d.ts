/**
 * Loads a script from a specific URL. React Native cannot load a JS
 * file/resource/URL via a <script> HTML element, so the implementation
 * fetches the specified {@code url} as plain text using {@link fetch()} and
 * then evaluates the fetched string as JavaScript code (using {@link eval()}).
 *
 * @param {string} url - The absolute URL from which the script is to be
 * (down)loaded.
 * @param {number} [timeout] - The timeout in millisecnods after which the
 * loading of the specified {@code url} is to be aborted/rejected (if not
 * settled yet).
 * @param {boolean} skipEval - Whether we want to skip evaluating the loaded content or not.
 * @returns {void}
 */
export declare function loadScript(url: string, timeout?: number, skipEval?: boolean): Promise<any>;
