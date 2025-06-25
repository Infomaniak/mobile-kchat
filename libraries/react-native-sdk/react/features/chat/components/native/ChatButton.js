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
const functions_any_1 = require("../../../conference/functions.any");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const functions_3 = require("../../../polls/functions");
const functions_4 = require("../../functions");
/**
 * Implements an {@link AbstractButton} to open the chat screen on mobile.
 */
class ChatButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.chat';
        this.icon = svg_1.IconMessage;
        this.label = 'toolbar.chat';
        this.toggledIcon = svg_1.IconChatUnread;
    }
    /**
     * Handles clicking / pressing the button, and opens the appropriate dialog.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        this.props._isPollsDisabled
            ? (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chat)
            : (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chatandpolls.main);
    }
    /**
     * Renders the button toggled when there are unread messages.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return Boolean(this.props._unreadMessageCount);
    }
}
/**
 * Maps part of the redux state to the component's props.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The properties explicitly passed to the component instance.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.CHAT_ENABLED, true);
    const { visible = enabled } = ownProps;
    return {
        _isPollsDisabled: (0, functions_any_1.arePollsDisabled)(state),
        // The toggled icon should also be available for new polls
        _unreadMessageCount: (0, functions_4.getUnreadCount)(state) || (0, functions_3.getUnreadPollCount)(state),
        visible
    };
}
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(ChatButton));
