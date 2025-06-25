"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBoundSelector = void 0;
const react_redux_1 = require("react-redux");
/**
 * Takes a redux selector and binds it to specific values.
 *
 * @param {Function} selector - The selector function.
 * @param {...any} args - The values to bind to.
 * @returns {any}
 */
function useBoundSelector(selector, ...args) {
    return (0, react_redux_1.useSelector)(state => selector(state, ...args));
}
exports.useBoundSelector = useBoundSelector;
