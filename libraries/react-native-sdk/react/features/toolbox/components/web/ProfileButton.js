"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const AnalyticsEvents_1 = require("../../../analytics/AnalyticsEvents");
const functions_1 = require("../../../analytics/functions");
const functions_2 = require("../../../base/i18n/functions");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const actions_1 = require("../../../settings/actions");
const constants_1 = require("../../../settings/constants");
const ProfileButtonAvatar_1 = __importDefault(require("./ProfileButtonAvatar"));
/**
 * Implementation of a button for opening profile dialog.
 */
class ProfileButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.profile';
        this.icon = ProfileButtonAvatar_1.default;
    }
    /**
     * Retrieves the label.
     *
     * @returns {string}
     */
    _getLabel() {
        const { _defaultLocalDisplayName, _localParticipant } = this.props;
        let displayName;
        if (_localParticipant?.name) {
            displayName = _localParticipant.name;
        }
        else {
            displayName = _defaultLocalDisplayName;
        }
        return displayName;
    }
    /**
     * Retrieves the tooltip.
     *
     * @returns {string}
     */
    _getTooltip() {
        return this._getLabel();
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @protected
     * @returns {void}
     */
    _handleClick() {
        const { dispatch, _unclickable } = this.props;
        if (!_unclickable) {
            (0, functions_1.sendAnalytics)((0, AnalyticsEvents_1.createToolbarEvent)('profile'));
            dispatch((0, actions_1.openSettingsDialog)(constants_1.SETTINGS_TABS.PROFILE));
        }
    }
    /**
     * Indicates whether the button should be disabled or not.
     *
     * @protected
     * @returns {void}
     */
    _isDisabled() {
        return this.props._unclickable;
    }
}
/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @returns {Object}
 */
const mapStateToProps = (state) => {
    const { defaultLocalDisplayName } = state['features/base/config'];
    return {
        _defaultLocalDisplayName: defaultLocalDisplayName ?? '',
        _localParticipant: (0, functions_3.getLocalParticipant)(state),
        _unclickable: !interfaceConfig.SETTINGS_SECTIONS.includes('profile'),
        customClass: 'profile-button-avatar'
    };
};
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(mapStateToProps)(ProfileButton));
