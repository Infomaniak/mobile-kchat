import { IStateful } from '../../app/types';
/**
 *
 * Returns the client width.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}
 */
export declare function getClientWidth(stateful: IStateful): number;
/**
 *
 * Returns the client height.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}
 */
export declare function getClientHeight(stateful: IStateful): number;
