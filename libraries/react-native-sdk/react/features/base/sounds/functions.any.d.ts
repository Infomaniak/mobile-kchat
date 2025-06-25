import { IReduxState } from '../../app/types';
/**
 * Selector for retrieving the disabled sounds array.
 *
 * @param {Object} state - The Redux state.
 * @returns {Array<string>} - The disabled sound id's array.
 */
export declare function getDisabledSounds(state: IReduxState): import("../config/configType").Sounds[];
