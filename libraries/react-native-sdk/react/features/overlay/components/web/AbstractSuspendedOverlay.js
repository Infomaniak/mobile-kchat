"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
/**
 * Implements a React {@link Component} for suspended overlay. Shown when a
 * suspend is detected.
 */
class AbstractSuspendedOverlay extends react_1.Component {
    /**
     * Determines whether this overlay needs to be rendered (according to a
     * specific redux state). Called by {@link OverlayContainer}.
     *
     * @param {Object} state - The redux state.
     * @returns {boolean} - If this overlay needs to be rendered, {@code true};
     * {@code false}, otherwise.
     */
    static needsRender(state) {
        return state['features/power-monitor']?.suspendDetected;
    }
}
exports.default = AbstractSuspendedOverlay;
