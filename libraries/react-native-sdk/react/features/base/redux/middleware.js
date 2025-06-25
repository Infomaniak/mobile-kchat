"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const MiddlewareRegistry_1 = __importDefault(require("./MiddlewareRegistry"));
const PersistenceRegistry_1 = __importDefault(require("./PersistenceRegistry"));
const functions_1 = require("./functions");
/**
 * The delay in milliseconds that passes between the last state change and the
 * persisting of that state in the storage.
 */
const PERSIST_STATE_DELAY = 2000;
/**
 * A throttled function to avoid repetitive state persisting.
 */
const throttledPersistState = lodash_1.default.throttle(state => PersistenceRegistry_1.default.persistState(state), PERSIST_STATE_DELAY);
// Web only code.
// We need the <tt>if</tt> because it appears that on mobile the polyfill is not
// executed yet.
if (typeof window.addEventListener === 'function') {
    window.addEventListener('unload', () => {
        throttledPersistState.flush();
    });
}
/**
 * A master MiddleWare to selectively persist state. Please use the
 * {@link persisterconfig.json} to set which subtrees of the redux state should
 * be persisted.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry_1.default.register(store => next => action => {
    const oldState = (0, functions_1.toState)(store);
    const result = next(action);
    const newState = (0, functions_1.toState)(store);
    oldState === newState || throttledPersistState(newState);
    return result;
});
