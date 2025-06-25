"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_1 = require("react-native");
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_native_1 = require("../../../base/tracks/functions.native");
const actions_1 = require("../actions");
/**
 * An implementation of a button for entering Picture-in-Picture mode.
 */
class PictureInPictureButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.pip';
        this.icon = svg_1.IconArrowDown;
        this.label = 'toolbar.pip';
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        this.props.dispatch((0, actions_1.enterPictureInPicture)());
    }
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Node}
     */
    render() {
        return this.props._enabled ? super.render() : null;
    }
}
/**
 * Maps (parts of) the redux state to the associated props for the
 * {@code PictureInPictureButton} component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {{
 *     _enabled: boolean
 * }}
 */
function _mapStateToProps(state) {
    const pipEnabled = Boolean((0, functions_1.getFeatureFlag)(state, constants_1.PIP_ENABLED));
    const pipWhileScreenSharingEnabled = (0, functions_1.getFeatureFlag)(state, constants_1.PIP_WHILE_SCREEN_SHARING_ENABLED, false);
    let enabled = pipEnabled && (!(0, functions_native_1.isLocalVideoTrackDesktop)(state) || pipWhileScreenSharingEnabled);
    // Override flag for Android, since it might be unsupported.
    if (react_native_1.Platform.OS === 'android' && !react_native_1.NativeModules.PictureInPicture.SUPPORTED) {
        enabled = false;
    }
    return {
        _enabled: enabled
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(PictureInPictureButton));
