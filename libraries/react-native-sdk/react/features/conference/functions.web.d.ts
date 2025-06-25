import { IStore } from '../app/types';
export * from './functions.any';
/**
 * Shows the suboptimal experience notification if needed.
 *
 * @param {Function} dispatch - The dispatch method.
 * @param {Function} t - The translation function.
 * @returns {void}
 */
export declare function maybeShowSuboptimalExperienceNotification(dispatch: IStore['dispatch'], t: Function): void;
