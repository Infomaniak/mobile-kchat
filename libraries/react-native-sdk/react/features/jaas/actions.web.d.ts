import { IStore } from '../app/types';
/**
 * Shows a dialog prompting users to upgrade, if requested feature is disabled.
 *
 * @param {string} feature - The feature to check availability for.
 *
 * @returns {Function}
 */
export declare function maybeShowPremiumFeatureDialog(feature: string): (dispatch: IStore['dispatch'], getState: IStore['getState']) => boolean;
