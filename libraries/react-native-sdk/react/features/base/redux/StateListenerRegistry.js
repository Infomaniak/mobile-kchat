"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("./functions");
const logger_1 = __importDefault(require("./logger"));
/**
 * A registry listeners which listen to changes in a redux store/state.
 */
class StateListenerRegistry {
    constructor() {
        /**
         * The {@link Listener}s registered with this {@code StateListenerRegistry}
         * to be notified when the values derived by associated {@link Selector}s
         * from a redux store/state change.
         */
        this._selectorListeners = new Set();
    }
    /**
     * Invoked by a specific redux store any time an action is dispatched, and
     * some part of the state (tree) may potentially have changed.
     *
     * @param {Object} context - The redux store invoking the listener and the
     * private state of this {@code StateListenerRegistry} associated with the
     * redux store.
     * @returns {void}
     */
    _listener({ prevSelections, store }) {
        for (const selectorListener of this._selectorListeners) {
            const prevSelection = prevSelections.get(selectorListener);
            try {
                const selection = selectorListener.selector(store.getState(), prevSelection);
                const useDeepEquals = selectorListener?.options?.deepEquals;
                if ((useDeepEquals && !(0, functions_1.equals)(prevSelection, selection))
                    || (!useDeepEquals && prevSelection !== selection)) {
                    prevSelections.set(selectorListener, selection);
                    selectorListener.listener(selection, store, prevSelection);
                }
            }
            catch (e) {
                // Don't let one faulty listener prevent other listeners from
                // being notified about their associated changes.
                logger_1.default.error(e);
            }
        }
    }
    /**
     * Registers a specific listener to be notified when the value derived by a
     * specific {@code selector} from a redux store/state changes.
     *
     * @param {Function} selector - The pure {@code Function} of the redux
     * store/state (and the previous selection of made by {@code selector})
     * which selects the value listened to by the specified {@code listener}.
     * @param {Function} listener - The listener to register with this
     * {@code StateListenerRegistry} so that it gets invoked when the value
     * returned by the specified {@code selector} changes.
     * @param {RegistrationOptions} [options] - Any options to be applied to the registration.
     * @returns {void}
     */
    register(selector, listener, options) {
        if (typeof selector !== 'function' || typeof listener !== 'function') {
            throw new Error('Invalid selector or listener!');
        }
        this._selectorListeners.add({
            listener,
            selector,
            options
        });
    }
    /**
     * Subscribes to a specific redux store (so that this instance gets notified
     * any time an action is dispatched, and some part of the state (tree) of
     * the specified redux store may potentially have changed).
     *
     * @param {Store} store - The redux store to which this
     * {@code StateListenerRegistry} is to {@code subscribe}.
     * @returns {void}
     */
    subscribe(store) {
        // XXX If StateListenerRegistry is not utilized by the app to listen to
        // state changes, do not bother subscribing to the store at all.
        if (this._selectorListeners.size) {
            store.subscribe(this._listener.bind(this, {
                /**
                 * The previous selections of the {@code Selector}s
                 * registered with this {@code StateListenerRegistry}.
                 *
                 * @type Map<any>
                 */
                prevSelections: new Map(),
                /**
                 * The redux store.
                 *
                 * @type Store
                 */
                store
            }));
        }
    }
}
exports.default = new StateListenerRegistry();
