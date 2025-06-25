import { IStateful } from '../base/app/types';
/**
 * Determines whether the {@code WelcomePage} is enabled.
 *
 * @param {IStateful} stateful - The redux state or {@link getState}
 * function.
 * @returns {boolean} If the {@code WelcomePage} is enabled by the app, then
 * {@code true}; otherwise, {@code false}.
 */
export declare function isWelcomePageEnabled(stateful: IStateful): any;
/**
 * Returns the configured custom URL (if any) to redirect to instead of the normal landing page.
 *
 * @param {IStateful} stateful - The redux state or {@link getState}.
 * @returns {string} - The custom URL.
 */
export declare function getCustomLandingPageURL(stateful: IStateful): string | undefined;
