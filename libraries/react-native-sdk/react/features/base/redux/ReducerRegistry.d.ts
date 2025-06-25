import { Action } from 'redux';
import type { Reducer } from 'redux';
/**
 * The type of the dictionary/map which associates a reducer (function) with the
 * name of he Redux state property managed by the reducer.
 */
type NameReducerMap<S> = {
    [name: string]: Reducer<S, Action<any>>;
};
/**
 * A registry for Redux reducers, allowing features to register themselves
 * without needing to create additional inter-feature dependencies.
 */
declare class ReducerRegistry {
    _elements: NameReducerMap<any>;
    /**
     * Creates a ReducerRegistry instance.
     */
    constructor();
    /**
     * Combines all registered reducers into a single reducing function.
     *
     * @param {Object} [additional={}] - Any additional reducers that need to be
     * included (such as reducers from third-party modules).
     * @returns {Function}
     */
    combineReducers(additional?: NameReducerMap<any>): Reducer<{
        [x: string]: any;
    }, import("redux").AnyAction>;
    /**
     * Adds a reducer to the registry.
     *
     * The method is to be invoked only before {@link #combineReducers()}.
     *
     * @param {string} name - The field in the state object that will be managed
     * by the provided reducer.
     * @param {Reducer} reducer - A Redux reducer.
     * @returns {void}
     */
    register<S>(name: string, reducer: Reducer<S, any>): void;
}
/**
 * The public singleton instance of the ReducerRegistry class.
 */
declare const _default: ReducerRegistry;
export default _default;
