import { IStore } from './types';
export * from './actions.any';
/**
 * Triggers an in-app navigation to a specific route. Allows navigation to be
 * abstracted between the mobile/React Native and Web/React applications.
 *
 * @param {string|undefined} uri - The URI to which to navigate. It may be a
 * full URL with an HTTP(S) scheme, a full or partial URI with the app-specific
 * scheme, or a mere room name.
 * @returns {Function}
 */
export declare function appNavigate(uri?: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => Promise<void>;
/**
 * Check if the welcome page is enabled and redirects to it.
 * If requested show a thank you dialog before that.
 * If we have a close page enabled, redirect to it without
 * showing any other dialog.
 *
 * @param {Object} options - Used to decide which particular close page to show
 * or if close page is disabled, whether we should show the thankyou dialog.
 * @param {boolean} options.showThankYou - Whether we should
 * show thank you dialog.
 * @param {boolean} options.feedbackSubmitted - Whether feedback was submitted.
 * @returns {Function}
 */
export declare function maybeRedirectToWelcomePage(options?: {
    feedbackSubmitted?: boolean;
    showThankYou?: boolean;
}): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
/**
 * Reloads the page.
 *
 * @protected
 * @returns {Function}
 */
export declare function reloadNow(): (dispatch: IStore['dispatch'], getState: IStore['getState']) => void;
