"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_any_1 = require("../../../base/config/functions.any");
const constants_1 = require("../../../base/flags/constants");
const functions_2 = require("../../../base/flags/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
/**
 * Implements an {@link AbstractButton} to open the security dialog/screen.
 */
class AbstractSecurityDialogButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.security';
        this.icon = svg_1.IconSecurityOff;
        this.label = 'toolbar.security';
        this.toggledIcon = svg_1.IconSecurityOn;
        this.tooltip = 'toolbar.security';
    }
    /**
     * Helper function to be implemented by subclasses, which should be used
     * to handle the security button being clicked / pressed.
     *
     * @protected
     * @returns {void}
     */
    _handleClickSecurityButton() {
        // To be implemented by subclass.
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        const { _locked } = this.props;
        (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('toggle.security', { enable: !_locked }));
        this._handleClickSecurityButton();
    }
    /**
     * Indicates whether this button is in toggled state or not.
     *
     * @override
     * @returns {boolean}
     */
    _isToggled() {
        return this.props._locked;
    }
}
exports.default = AbstractSecurityDialogButton;
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The redux store/state.
 * @returns {IProps}
 */
function _mapStateToProps(state) {
    const { conference } = state['features/base/conference'];
    const { hideLobbyButton } = (0, functions_any_1.getSecurityUiConfig)(state);
    const { locked } = state['features/base/conference'];
    const { lobbyEnabled } = state['features/lobby'];
    const lobbySupported = conference?.isLobbySupported();
    const lobby = lobbySupported && (0, functions_3.isLocalParticipantModerator)(state) && !hideLobbyButton;
    const enabledFlag = (0, functions_2.getFeatureFlag)(state, constants_1.SECURITY_OPTIONS_ENABLED, true);
    const enabledLobbyModeFlag = (0, functions_2.getFeatureFlag)(state, constants_1.LOBBY_MODE_ENABLED, true) && lobby;
    const enabledMeetingPassFlag = (0, functions_2.getFeatureFlag)(state, constants_1.MEETING_PASSWORD_ENABLED, true);
    return {
        _locked: Boolean(locked || lobbyEnabled),
        visible: enabledFlag && (enabledLobbyModeFlag || enabledMeetingPassFlag)
    };
}
exports._mapStateToProps = _mapStateToProps;
