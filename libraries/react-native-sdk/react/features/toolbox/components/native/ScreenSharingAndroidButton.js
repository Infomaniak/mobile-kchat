"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_native_1 = require("../../../base/tracks/actions.native");
const functions_native_1 = require("../../../base/tracks/functions.native");
/**
 * An implementation of a button for toggling screen sharing.
 */
class ScreenSharingAndroidButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.shareYourScreen';
        this.icon = svg_1.IconScreenshare;
        this.label = 'toolbar.startScreenSharing';
        this.toggledLabel = 'toolbar.stopScreenSharing';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const enable = !this._isToggled();
        this.props.dispatch((0, actions_native_1.toggleScreensharing)(enable));
    }
    /**
     * Returns a boolean value indicating if this button is disabled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return this.props._disabled;
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._screensharing;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code ToggleCameraButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _screensharing: boolean
 * }}
 */
function _mapStateToProps(state) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.ANDROID_SCREENSHARING_ENABLED, true);
    return {
        _screensharing: (0, functions_native_1.isLocalVideoTrackDesktop)(state),
        visible: enabled
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(ScreenSharingAndroidButton));
