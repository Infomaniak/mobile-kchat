"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abstractMapStateToProps = void 0;
const react_1 = require("react");
/**
 * Implements a React {@link Component} for overlay with guidance how to proceed
 * with gUM prompt.
 */
class AbstractUserMediaPermissionsOverlay extends react_1.Component {
    /**
     * Determines whether this overlay needs to be rendered (according to a
     * specific redux state). Called by {@link OverlayContainer}.
     *
     * @param {Object} state - The redux state.
     * @returns {boolean} - If this overlay needs to be rendered, {@code true};
     * {@code false}, otherwise.
     */
    static needsRender(state) {
        return state['features/overlay'].isMediaPermissionPromptVisible;
    }
}
exports.default = AbstractUserMediaPermissionsOverlay;
/**
 * Maps (parts of) the redux state to the associated component's props.
 *
 * @param {Object} state - The redux state.
 * @protected
 * @returns {{
 *     browser: string
 * }}
 */
function abstractMapStateToProps(state) {
    const { browser } = state['features/overlay'];
    return {
        browser
    };
}
exports.abstractMapStateToProps = abstractMapStateToProps;
