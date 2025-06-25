import React from 'react';
import { WithTranslation } from 'react-i18next';
/**
 * Changes the main translation bundle.
 *
 * @param {string} language - The language e.g. 'en', 'fr'.
 * @param {string} url - The url of the translation bundle.
 * @returns {void}
 */
export declare function changeLanguageBundle(language: string, url: string): Promise<void>;
/**
 * Wraps a specific React Component in order to enable translations in it.
 *
 * @param {Component} component - The React Component to wrap.
 * @returns {Component} The React Component which wraps {@link component} and
 * enables translations in it.
 */
export declare function translate<P extends WithTranslation>(component: React.ComponentType<P>): React.ComponentType<import("react-i18next").Omit<P, keyof WithTranslation>>;
/**
 * Translates a specific key to text containing HTML via a specific translate
 * function.
 *
 * @param {Function} t - The translate function.
 * @param {string} key - The key to translate.
 * @param {Array<*>} options - The options, if any, to pass to {@link t}.
 * @returns {ReactElement} A ReactElement which depicts the translated HTML
 * text.
 */
export declare function translateToHTML(t: Function, key: string, options?: Object): JSX.Element;
