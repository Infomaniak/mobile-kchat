import { IStateful } from '../base/app/types';
export * from './functions.any';
/**
 * Used on web.
 *
 * @param {(Function|Object)} _stateful -The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @param {boolean} _isDisplayedOnWelcomePage - Indicates whether the shortcuts dialog is displayed on the
 * welcome page or not.
 * @returns {Object} - The properties for the "Shortcuts" tab from settings
 * dialog.
 */
export declare function getShortcutsTabProps(_stateful: any, _isDisplayedOnWelcomePage?: boolean): {
    keyboardShortcutsEnabled: boolean;
};
/**
 * Returns true if moderator tab in settings should be visible/accessible.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state.
 * @returns {boolean} True to indicate that moderator tab should be visible, false otherwise.
 */
export declare function shouldShowModeratorSettings(stateful: IStateful): boolean;
