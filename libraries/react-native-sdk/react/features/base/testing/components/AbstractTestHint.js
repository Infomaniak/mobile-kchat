"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const functions_1 = require("../functions");
/**
 * Maps (parts of) the redux state to {@link TestHint}'s React {@code Component}
 * props.
 *
 * @param {Object} state - The redux store/state.
 * @private
 * @returns {{
 *     _testModeEnabled: boolean
 * }}
 */
function _mapStateToProps(state) {
    return {
        /**
         * The indicator which determines whether the test mode is enabled.
         *
         * @protected
         * @type {boolean}
         */
        _testModeEnabled: (0, functions_1.isTestModeEnabled)(state)
    };
}
exports._mapStateToProps = _mapStateToProps;
