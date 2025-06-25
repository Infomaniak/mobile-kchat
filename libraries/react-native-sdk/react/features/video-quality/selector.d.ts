import { IReduxState } from '../app/types';
/**
 * Selects the thumbnail height to the quality level mapping from the config.
 *
 * @param {Object} state - The redux state.
 * @returns {Map<number,number>}
 */
export declare function getMinHeightForQualityLvlMap(state: IReduxState): Map<number, number>;
