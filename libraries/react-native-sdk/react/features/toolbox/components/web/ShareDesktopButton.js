"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const _1 = __importDefault(require("../../../base/lib-jitsi-meet/_"));
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_web_1 = require("../../../screen-share/actions.web");
const functions_3 = require("../../../screen-share/functions");
const actions_web_2 = require("../../actions.web");
const functions_4 = require("../../functions");
/**
 * Implementation of a button for sharing desktop / windows.
 */
class ShareDesktopButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.shareYourScreen';
        this.toggledAccessibilityLabel = 'toolbar.accessibilityLabel.stopScreenSharing';
        this.label = 'toolbar.startScreenSharing';
        this.icon = svg_1.IconScreenshare;
        this.toggledLabel = 'toolbar.stopScreenSharing';
    }
    /**
     * Retrieves tooltip dynamically.
     *
     * @returns {string}
     */
    _getTooltip() {
        const { _desktopSharingEnabled, _screensharing } = this.props;
        if (_desktopSharingEnabled) {
            if (_screensharing) {
                return 'toolbar.stopScreenSharing';
            }
            return 'toolbar.startScreenSharing';
        }
        return 'dialog.shareYourScreenDisabled';
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
    /**
     * Indicates whether this button is in disabled state or not.
     *
     * @override
     * @protected
     * @returns {boolean}
     */
    _isDisabled() {
        return !this.props._desktopSharingEnabled;
    }
    /**
     * Handles clicking the button, and toggles the chat.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, _screensharing } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.screen.sharing', { enable: !_screensharing }));
        dispatch((0, actions_web_2.closeOverflowMenuIfOpen)());
        dispatch((0, actions_web_1.startScreenShareFlow)(!_screensharing));
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
*
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    // Disable the screenshare button if the video sender limit is reached and there is no video or media share in
    // progress.
    const desktopSharingEnabled = _1.default.isDesktopSharingEnabled() && !(0, functions_4.isDesktopShareButtonDisabled)(state);
    return {
        _desktopSharingEnabled: desktopSharingEnabled,
        _screensharing: (0, functions_3.isScreenVideoShared)(state),
        visible: _1.default.isDesktopSharingEnabled()
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(ShareDesktopButton));
