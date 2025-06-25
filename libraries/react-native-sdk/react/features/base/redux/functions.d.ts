import { IReduxState } from '../../app/types';
import { IStateful } from '../app/types';
/**
 * Sets specific properties of a specific state to specific values and prevents
 * unnecessary state changes.
 *
 * @param {T} target - The state on which the specified properties are to
 * be set.
 * @param {T} source - The map of properties to values which are to be set
 * on the specified target.
 * @returns {T} The specified target if the values of the specified
 * properties equal the specified values; otherwise, a new state constructed
 * from the specified target by setting the specified properties to the
 * specified values.
 */
export declare function assign<T extends Object>(target: T, source: Partial<T>): T;
/**
 * Determines whether {@code a} equals {@code b} according to deep comparison
 * (which makes sense for Redux and its state definition).
 *
 * @param {*} a - The value to compare to {@code b}.
 * @param {*} b - The value to compare to {@code a}.
 * @returns {boolean} True if {@code a} equals {@code b} (according to deep
 * comparison); false, otherwise.
 */
export declare function equals(a: any, b: any): boolean;
/**
 * Sets a specific property of a specific state to a specific value. Prevents
 * unnecessary state changes (when the specified {@code value} is equal to the
 * value of the specified {@code property} of the specified {@code state}).
 *
 * @param {T} state - The (Redux) state from which a new state is to be
 * constructed by setting the specified {@code property} to the specified
 * {@code value}.
 * @param {string} property - The property of {@code state} which is to be
 * assigned the specified {@code value} (in the new state).
 * @param {*} value - The value to assign to the specified {@code property}.
 * @returns {T} The specified {@code state} if the value of the specified
 * {@code property} equals the specified <tt>value/tt>; otherwise, a new state
 * constructed from the specified {@code state} by setting the specified
 * {@code property} to the specified {@code value}.
 */
export declare function set<T extends Object>(state: T, property: keyof T, value: any): T;
/**
 * Returns redux state from the specified {@code stateful} which is presumed to
 * be related to the redux state (e.g. The redux store, the redux
 * {@code getState} function).
 *
 * @param {Function|IStore} stateful - The entity such as the redux store or the
 * redux {@code getState} function from which the redux state is to be
 * returned.
 * @returns {Object} The redux state.
 */
export declare function toState(stateful: IStateful): IReduxState;
