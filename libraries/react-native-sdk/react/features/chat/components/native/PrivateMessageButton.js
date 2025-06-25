"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._mapStateToProps = void 0;
const react_redux_1 = require("react-redux");
const constants_1 = require("../../../base/flags/constants");
const functions_1 = require("../../../base/flags/functions");
const functions_2 = require("../../../base/i18n/functions");
const svg_1 = require("../../../base/icons/svg");
const functions_3 = require("../../../base/participants/functions");
const AbstractButton_1 = __importDefault(require("../../../base/toolbox/components/AbstractButton"));
const functions_any_1 = require("../../../conference/functions.any");
const ConferenceNavigationContainerRef_1 = require("../../../mobile/navigation/components/conference/ConferenceNavigationContainerRef");
const routes_1 = require("../../../mobile/navigation/routes");
const actions_native_1 = require("../../actions.native");
/**
 * Class to render a button that initiates the sending of a private message through chat.
 */
class PrivateMessageButton extends AbstractButton_1.default {
    constructor() {
        super(...arguments);
        this.accessibilityLabel = 'toolbar.accessibilityLabel.privateMessage';
        this.icon = svg_1.IconMessage;
        this.label = 'toolbar.privateMessage';
        this.toggledIcon = svg_1.IconReply;
    }
    /**
     * Handles clicking / pressing the button.
     *
     * @private
     * @returns {void}
     */
    _handleClick() {
        if (this.props._isLobbyMessage) {
            this.props.dispatch((0, actions_native_1.handleLobbyChatInitialized)(this.props.participantID));
        }
        this.props.dispatch((0, actions_native_1.openChat)(this.props._participant));
        this.props._isPollsDisabled
            ? (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chat, {
                privateMessageRecipient: this.props._participant
            })
            : (0, ConferenceNavigationContainerRef_1.navigate)(routes_1.screen.conference.chatandpolls.main, {
                screen: routes_1.screen.conference.chatandpolls.tab.chat,
                params: {
                    privateMessageRecipient: this.props._participant
                }
            });
    }
    /**
     * Helper function to be implemented by subclasses, which must return a
     * {@code boolean} value indicating if this button is toggled or not.
     *
     * @protected
     * @returns {boolean}
     */
    _isToggled() {
        return this.props.reply;
    }
}
/**
 * Maps part of the Redux store to the props of this component.
 *
 * @param {Object} state - The Redux state.
 * @param {IProps} ownProps - The own props of the component.
 * @returns {IProps}
 */
function _mapStateToProps(state, ownProps) {
    const enabled = (0, functions_1.getFeatureFlag)(state, constants_1.CHAT_ENABLED, true);
    const { visible = enabled, isLobbyMessage, participantID } = ownProps;
    return {
        _isPollsDisabled: (0, functions_any_1.arePollsDisabled)(state),
        _participant: (0, functions_3.getParticipantById)(state, participantID),
        _isLobbyMessage: isLobbyMessage,
        visible
    };
}
exports._mapStateToProps = _mapStateToProps;
exports.default = (0, functions_2.translate)((0, react_redux_1.connect)(_mapStateToProps)(PrivateMessageButton));
