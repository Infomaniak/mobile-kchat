"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Abstract component that defines a refreshable page to be rendered by
 * {@code PagedList}.
 */
class AbstractPage extends react_1.Component {
    /**
     * Method to be overridden by the implementing classes to refresh the data
     * content of the component.
     *
     * Note: It is a static method as the {@code Component} may not be
     * initialized yet when the UI invokes refresh (e.g. Tab change).
     *
     * @param {any} _p1 - Param 1.
     * @param {any} _p2 - Param 2.
     * @returns {void}
     */
    static refresh(_p1, _p2) {
        // No implementation in abstract class.
    }
}
exports.default = AbstractPage;
