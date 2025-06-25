"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const functions_1 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const lib_jitsi_meet_1 = __importDefault(require("../../../base/lib-jitsi-meet"));
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_web_1 = require("../../../toolbox/actions.web");
const actions_web_2 = require("../../actions.web");
const functions_2 = require("../../functions");
/**
 * Component that renders a toolbar button for toggling audio only screen share.
 */
class ShareAudioButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.shareaudio';
        this.icon = svg_1.IconVolumeUp;
        this.label = 'toolbar.shareaudio';
        this.tooltip = 'toolbar.shareaudio';
        this.toggledIcon = svg_1.IconVolumeOff;
        this.toggledLabel = 'toolbar.stopAudioSharing';
    }
    /**
     * Handles clicking / pressing the button, and opens a new dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch } = this.props;
        dispatch((0, actions_web_2.startAudioScreenShareFlow)());
        dispatch((0, actions_web_1.setOverflowMenuVisible)(false));
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._isAudioOnlySharing;
    }
}
/**
 * Maps part of the Redux state to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    return {
        _isAudioOnlySharing: Boolean((0, functions_2.isAudioOnlySharing)(state)),
        visible: lib_jitsi_meet_1.default.isDesktopSharingEnabled() && (0, functions_2.isScreenAudioSupported)()
    };
}
exports.default = (0, functions_1.translate)((0, react_redux_1.connect)(_mapStateToProps)(ShareAudioButton));
