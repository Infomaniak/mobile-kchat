import { Middleware } from 'redux';
import { IReduxState, IStore } from '../../app/types';
/**
 * A registry for Redux middleware, allowing features to register their
 * middleware without needing to create additional inter-feature dependencies.
 */
declare class MiddlewareRegistry {
    _elements: Array<Middleware<any, any>>;
    /**
     * Creates a MiddlewareRegistry instance.
     */
    constructor();
    /**
     * Applies all registered middleware into a store enhancer.
     * (@link http://redux.js.org/docs/api/applyMiddleware.html).
     *
     * @param {Middleware[]} additional - Any additional middleware that need to
     * be included (such as middleware from third-party modules).
     * @returns {Middleware}
     */
    applyMiddleware(...additional: Array<Middleware<any, any>>): import("redux").StoreEnhancer<{
        dispatch: unknown;
    }, {}>;
    /**
     * Adds a middleware to the registry.
     *
     * The method is to be invoked only before {@link #applyMiddleware()}.
     *
     * @param {Middleware} middleware - A Redux middleware.
     * @returns {void}
     */
    register(middleware: Middleware<any, IReduxState, IStore['dispatch']>): void;
}
/**
 * The public singleton instance of the MiddlewareRegistry class.
 */
declare const _default: MiddlewareRegistry;
export default _default;
