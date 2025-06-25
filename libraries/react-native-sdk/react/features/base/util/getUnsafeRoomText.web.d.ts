/// <reference types="react" />
/**
 * Gets the unsafe room text for the given context.
 *
 * @param {Function} t - The translation function.
 * @param {'meeting'|'prejoin'|'welcome'} context - The given context of the warining.
 * @returns {string}
 */
export default function getUnsafeRoomText(t: Function, context: 'meeting' | 'prejoin' | 'welcome'): JSX.Element;
